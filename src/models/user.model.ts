import bcrypt from "bcryptjs";
import mongoose, { type InferSchemaType, model } from "mongoose";

import { ROLE } from "@/constants";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ROLE,
    default: ROLE.USER,
  },
});

export type User = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

userSchema.pre<User>("save", async function (next) {
  if (!this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userModel = model<User>("User", userSchema);
export default userModel;
