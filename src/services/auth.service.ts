import axios from "axios";
import bycrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { type StringValue } from "ms";

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
      throw new BadRequestError("User not found");
    }
    return new OkResponse("Get user successfully", user);
  }

  async googleLogin(token: string) {
    if (!token) {
      throw new BadRequestError("Google Access Token is required");
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
      throw new BadRequestError("Invalid Google Access Token");
    }

    if (!email) {
      throw new BadRequestError("Google token does not contain email");
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
      throw new BadRequestError("Email is already registered");
    }
    const username = payload.email.split("@")[0];
    const response = await userModel.create({
      ...payload,
      username: username,
      fullName: payload.fullName,
    });

    const { password, ...userData } = response.toObject();

    if (!response) {
      throw new BadRequestError("Failed to create user");
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
      throw new BadRequestError("Email is not registered");
    }

    const isPasswordValid = await bycrypt.compare(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Password is incorrect");
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
      throw new BadRequestError("User not found");
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
      subject: "Reset your password",
      text: `<p>Click the link below to reset your password:</p>
        <a href="http://example.com/reset-password?email=${payload.email}">Reset Password</a>`,
    });
    return new OkResponse("OTP sent to your email", {
      userId: user.id,
      expireIn,
    });
  }

  async resendOtp(payload: { userId: string }) {
    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const existingUser = await redisClient.get(`OTP-${user.id}`);

    if (existingUser) {
      throw new BadRequestError("OTP is still valid. Please check your email");
    }

    const expireIn = 120;
    const code = generateCode(6);

    const hashOtp = await bycrypt.hash(code, 10);
    await redisClient.set(`OTP-${user.id}`, hashOtp, "EX", expireIn);

    await mailTemplate({
      code: code,
      from: "Triply Support",
      to: user.email,
      subject: "Resend OTP for Password Reset",
      text: `<p>Click the link below to reset your password:</p>
        <a href="http://example.com/reset-password?email=${user.email}">Reset Password</a>`,
    });

    return new OkResponse("OTP resent to your email", {
      userId: user.id,
      expireIn,
    });
  }

  async verifyOtp(payload: { userId: string; otp: string }) {
    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const storedOtpHash = await redisClient.get(`OTP-${user.id}`);
    if (!storedOtpHash) {
      throw new BadRequestError("OTP has expired or is invalid");
    }

    const isOtpValid = await bycrypt.compare(payload.otp, storedOtpHash);
    if (!isOtpValid) {
      throw new BadRequestError("Invalid OTP");
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
      throw new BadRequestError("User not found");
    }

    const isExistingPassword = await bycrypt.compare(
      payload.password,
      foundUser.password
    );

    if (isExistingPassword) {
      throw new BadRequestError(
        "New password must be different from old password"
      );
    }

    foundUser.password = payload.password;
    await foundUser.save();

    return new OkResponse("Password reset successfully");
  }
}
const authService = new AuthService();
export default authService;
