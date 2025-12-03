import type { Request, Response } from "express";

import userService from "@/services/user.service";

class UserController {
  async updateProfile(req: Request, res: Response) {
    const { id } = req.user!;
    const { fullName, address, avatar } = req.body;
    res.status(200).json(
      await userService.updateProfile({
        userId: id,
        fullName,
        address,
        avatar,
      })
    );
  }
}
const userController = new UserController();
export default userController;
