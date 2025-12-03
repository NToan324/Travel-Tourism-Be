import { BadRequestError } from "@/core/error.response";
import { OkResponse } from "@/core/success.response";
import userModel from "@/models/user.model";

class UserService {
  async updateProfile({
    userId,
    fullName,
    address,
    avatar,
  }: {
    userId: string;
    fullName?: string;
    address?: string;
    avatar?: string;
  }) {
    console.log("Updating profile for userId:", avatar);
    const updateProfile = await userModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        fullName: fullName,
        address: address,
        avatar: avatar,
      },
      { new: true }
    );
    if (!updateProfile) {
      throw new BadRequestError("Failed to update profile");
    }
    return new OkResponse("Profile updated successfully", updateProfile);
  }
}
const userService = new UserService();
export default userService;
