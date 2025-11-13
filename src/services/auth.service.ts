import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { BadRequestError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import userModel from "@/models/user.model";

const generateJwt = (
  payload: {
    email: string;
    id: string;
    fullName: string;
    role: string;
  },
  expiration?: string
) => {
  return jwt.sign(
    {
      ...payload,
    },
    process.env.DEV_JWT_SECRET_KEY as string,
    {
      expiresIn: expiration || "2h",
    }
  );
};

class AuthService {
  async signUp(payload: { email: string; password: string }) {
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
      fullName: username,
    });

    const { password, ...userData } = response.toObject();

    if (response) {
      return new CreatedResponse("Create user successfully", { ...userData });
    }

    throw new BadRequestError("Failed to create user");
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

    const accessToken = generateJwt({
      email: user.email,
      id: user._id.toString(),
      fullName: user.fullName,
      role: user.role,
    });

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
    const accessToken = generateJwt({
      email: user.email,
      id: user._id.toString(),
      fullName: user.fullName,
      role: user.role,
    });

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
}
const authService = new AuthService();
export default authService;
