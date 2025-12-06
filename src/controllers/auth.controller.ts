import type { Request, Response } from "express";

import { oauth2Client, scopes } from "@/configs/googleCalendar.config";
import { OkResponse } from "@/core/success.response";
import authService from "@/services/auth.service";

class AuthController {
  async getMe(req: Request, res: Response) {
    const { id } = req.user!;
    res.status(200).send(await authService.getMe(id));
  }

  async googleCalendarAuthenticate(req: Request, res: Response) {
    const { id: userId } = req.user!;
    res.status(200).send(await authService.googleCalendarAuthenticate(userId));
  }

  async googleCalendarRedirect(req: Request, res: Response) {
    const userId = req.query.state as string;
    const { tokens } = await oauth2Client.getToken(req.query.code as string);
    await authService.googleCalendarSaveToken(userId, tokens);
    res.redirect(`http://localhost:3000/plan`);
  }

  async googleLogin(req: Request, res: Response) {
    const { token } = req.body;
    res.send(await authService.googleLogin(token as string));
  }

  async signUp(req: Request, res: Response) {
    const { fullName, email, password } = req.body;
    res
      .status(201)
      .send(await authService.signUp({ fullName, email, password }));
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

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    res.status(200).send(await authService.forgotPassword({ email }));
  }

  async resendOtp(req: Request, res: Response) {
    const { userId } = req.body;
    res.status(200).send(await authService.resendOtp({ userId }));
  }

  async verifyOtp(req: Request, res: Response) {
    const { userId, otp } = req.body;
    res.status(200).send(await authService.verifyOtp({ userId, otp }));
  }

  async resetPassword(req: Request, res: Response) {
    const { resetToken, password } = req.body;
    res
      .status(200)
      .send(await authService.resetPassword({ resetToken, password }));
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user!;
    res
      .status(200)
      .send(
        await authService.changePassword({
          oldPassword,
          newPassword,
          userId: id,
        })
      );
  }
}

const authController = new AuthController();
export default authController;
