import axios from "axios";
import bycrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type StringValue } from "ms";

import { oauth2Client, scopes } from "@/configs/googleCalendar.config";
import { mailTemplate, sendGoogleSuccessEmail } from "@/configs/mailer.config";
import redisClient from "@/configs/redis.config";
import { AUTH_PROVIDER, ROLE } from "@/constants";
import { BadRequestError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import userModel from "@/models/user.model";
import { generateCode } from "@/utils/generateCode";

const generateJwt = (
  payload: {
    email: string;
    id: string;
    fullName: string;
    role: string;
  },
  expiration?: StringValue | number
) => {
  return jwt.sign(
    {
      ...payload,
    },
    process.env.DEV_JWT_SECRET_KEY as string,
    {
      expiresIn: expiration || "1d",
    }
  );
};

class AuthService {
  async getMe(userId: string) {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }
    return new OkResponse("Lấy thông tin người dùng thành công", user);
  }

  async googleLogin(token: string) {
    if (!token) {
      throw new BadRequestError("Token truy cập Google là bắt buộc");
    }
    let email, name, picture, sub;

    try {
      const googleResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const payload = googleResponse.data;

      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      sub = payload.sub;
    } catch (error) {
      throw new BadRequestError("Token truy cập Google không hợp lệ");
    }

    if (!email) {
      throw new BadRequestError("Tài khoản Google không có email hợp lệ");
    }

    let foundUser = await userModel.findOne({
      $or: [{ email: email }, { googleId: sub }],
    });

    if (!foundUser) {
      const newUser = await userModel.create({
        fullName: name || "Traveler",
        email: email,
        address: "",
        avatar: picture || "",
        role: ROLE.USER,
        authProvider: AUTH_PROVIDER.GOOGLE,
        googleId: sub,
      });

      foundUser = newUser;

      await sendGoogleSuccessEmail({
        to: email,
        name: name || "Traveler",
        loginLink: "http://localhost:3000/signin",
      });
    }

    if (foundUser.avatar === "" && picture) {
      foundUser.avatar = picture;
      await foundUser.save();
    }

    // Tạo Access Token
    const accessToken = generateJwt(
      {
        email: foundUser.email,
        id: foundUser._id.toString(),
        fullName: foundUser.fullName,
        role: foundUser.role,
      },
      "2h"
    );

    const refreshToken = generateJwt(
      {
        email: foundUser.email,
        id: foundUser._id.toString(),
        fullName: foundUser.fullName,
        role: foundUser.role,
      },
      "7d"
    );

    const { password, ...userData } = foundUser.toObject();
    return new OkResponse("Login successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        ...userData,
      },
    });
  }

  async signUp(payload: { fullName: string; email: string; password: string }) {
    const existingUser = await userModel.findOne({
      email: payload.email,
    });
    if (existingUser) {
      throw new BadRequestError("Email đã được đăng ký");
    }
    const username = payload.email.split("@")[0];
    const response = await userModel.create({
      ...payload,
      username: username,
      fullName: payload.fullName,
    });

    const { password, ...userData } = response.toObject();

    if (!response) {
      throw new BadRequestError("Tạo người dùng thất bại");
    }
    await sendGoogleSuccessEmail({
      to: payload.email,
      name: payload.fullName || "Traveler",
      loginLink: "http://localhost:3000/signin",
    });

    return new CreatedResponse("Create user successfully", { ...userData });
  }

  async login(payload: { email: string; password: string }) {
    const user = await userModel.findOne({
      email: payload.email,
    });

    if (!user) {
      throw new BadRequestError("Email chưa được đăng ký");
    }

    const isPasswordValid = await bycrypt.compare(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Mật khẩu không chính xác");
    }

    const accessToken = generateJwt(
      {
        email: user.email,
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
      },
      "2h"
    );

    const refreshToken = generateJwt(
      {
        email: user.email,
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
      },
      "7d"
    );
    const { password, ...userData } = user.toObject();
    return new OkResponse("Login successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        ...userData,
      },
    });
  }

  async refreshToken(payload: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  }) {
    const user = await userModel.findOne({
      _id: payload.id,
    });
    if (!user) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }
    const accessToken = generateJwt(
      {
        email: user.email,
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
      },
      "2h"
    );

    const refreshToken = generateJwt(
      {
        email: user.email,
        id: user._id.toString(),
        fullName: user.fullName,
        role: user.role,
      },
      "7d"
    );

    return new OkResponse("Token refreshed successfully", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async forgotPassword(payload: { email: string }) {
    const user = await userModel.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new BadRequestError("Email is not found in system");
    }

    const expireIn = 120;
    const code = generateCode(6);

    const hashOtp = await bycrypt.hash(code, 10);
    await redisClient.set(`OTP-${user.id}`, hashOtp, "EX", expireIn);
    await mailTemplate({
      code: code,
      from: "Triply Support",
      to: payload.email,
      subject: "Đặt lại mật khẩu của bạn",
      text: `<p>Vui lòng sử dụng mã OTP dưới đây để đặt lại mật khẩu của bạn:</p>
        <a href="http://example.com/reset-password?email=${payload.email}">Thay đổi mật khẩu</a>`,
    });
    return new OkResponse("OTP sent to your email", {
      userId: user.id,
      expireIn,
    });
  }

  async resendOtp(payload: { userId: string }) {
    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }

    const existingUser = await redisClient.get(`OTP-${user.id}`);

    if (existingUser) {
      throw new BadRequestError(
        "OTP vẫn còn hiệu lực. Vui lòng kiểm tra email của bạn"
      );
    }

    const expireIn = 120;
    const code = generateCode(6);

    const hashOtp = await bycrypt.hash(code, 10);
    await redisClient.set(`OTP-${user.id}`, hashOtp, "EX", expireIn);

    await mailTemplate({
      code: code,
      from: "Triply Support",
      to: user.email,
      subject: "Gửi lại OTP để đặt lại mật khẩu",
      text: `<p>Vui lòng sử dụng mã OTP dưới đây để đặt lại mật khẩu của bạn:</p>
        <a href="http://example.com/reset-password?email=${user.email}">Thay đổi mật khẩu</a>`,
    });

    return new OkResponse("OTP resent to your email", {
      userId: user.id,
      expireIn,
    });
  }

  async verifyOtp(payload: { userId: string; otp: string }) {
    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }

    const storedOtpHash = await redisClient.get(`OTP-${user.id}`);
    if (!storedOtpHash) {
      throw new BadRequestError("OTP đã hết hạn hoặc không hợp lệ");
    }

    const isOtpValid = await bycrypt.compare(payload.otp, storedOtpHash);
    if (!isOtpValid) {
      throw new BadRequestError("OTP không hợp lệ");
    }

    const resetToken = jwt.sign(
      {
        userId: payload.userId,
      },
      process.env.DEV_JWT_SECRET_KEY as string,
      {
        expiresIn: "10m",
      }
    );

    await redisClient.del(`OTP-${user.id}`);

    return new OkResponse("OTP verified successfully", { resetToken });
  }

  async resetPassword(payload: { resetToken: string; password: string }) {
    const decodeToken = jwt.verify(
      payload.resetToken,
      process.env.DEV_JWT_SECRET_KEY as string
    );
    const user = decodeToken as JwtPayload;
    const foundUser = await userModel.findById(user.userId);

    if (!foundUser) {
      throw new BadRequestError("Không tìm thấy người dùng");
    }

    const isExistingPassword = await bycrypt.compare(
      payload.password,
      foundUser.password
    );

    if (isExistingPassword) {
      throw new BadRequestError("Mật khẩu mới phải khác mật khẩu cũ");
    }

    foundUser.password = payload.password;
    await foundUser.save();

    return new OkResponse("Password reset successfully");
  }

  async googleCalendarSaveToken(
    userId: string,
    tokens: {
      access_token?: string | null;
      refresh_token?: string | null;
      expiry_date?: number | null;
      scope?: string;
      token_type?: string | null;
    }
  ) {
    const user = await userModel.findById(userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    await userModel.findByIdAndUpdate(
      userId,
      {
        googleCalendar: {
          email: user.email,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          scope: tokens.scope,
          tokenType: tokens.token_type,
          expiryDate: tokens.expiry_date,
        },
      },
      { new: true, runValidators: true }
    );

    return new OkResponse("Google Calendar tokens saved successfully", {
      userId,
    });
  }

  async changePassword(payload: {
    oldPassword: string;
    newPassword: string;
    userId: string;
  }) {
    const { oldPassword, newPassword, userId } = payload;
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isOldPasswordValid = await bycrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordValid) {
      throw new BadRequestError("Mật khẩu cũ không đúng");
    }

    const isSamePassword = await bycrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestError("Mật khẩu mới phải khác mật khẩu cũ");
    }

    user.password = newPassword;
    await user.save();

    return new OkResponse("Password changed successfully");
  }

  async googleCalendarAuthenticate(userId: string) {
    const foundUser = await userModel.findById(userId);

    if (!foundUser) {
      throw new BadRequestError("User not found");
    }

    if (
      foundUser.googleCalendar?.accessToken &&
      foundUser.googleCalendar.expiryDate
    ) {
      const now = Date.now();
      if (foundUser.googleCalendar.expiryDate > now) {
        return new OkResponse("Google Calendar is already authenticated");
      }
    }

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: userId,
    });

    return new OkResponse("Google Calendar authentication URL", { url });
  }
}
const authService = new AuthService();
export default authService;
