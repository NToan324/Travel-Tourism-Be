import { z } from "zod";

class UserValidation {
  static updateUserInfo() {
    return {
      body: z.object({
        fullName: z.string().optional(),
        address: z.string().optional(),
        avatar: z.string().url().optional(),
      }),
    };
  }
}

export { UserValidation };
