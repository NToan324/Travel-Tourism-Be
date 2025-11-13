import type { Request, Response } from "express";

import authService from "@/services/auth.service";

class AuthController {
  async signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    res.status(201).send(await authService.signUp({ email, password }));
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    res.status(200).send(await authService.login({ email, password }));
  }

  async refreshToken(req: Request, res: Response) {
    const { id, email, fullName, role } = req.user!;
    res
      .status(200)
      .send(await authService.refreshToken({ id, email, fullName, role }));
  }
}

const authController = new AuthController();
export default authController;
