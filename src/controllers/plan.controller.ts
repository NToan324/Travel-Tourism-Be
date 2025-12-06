import type { Request, Response } from "express";

import planService from "@/services/plan.service";

class PlanController {
  async create(req: Request, res: Response) {
    const { title, plan_type } = req.body;
    const { id: userId } = req.user!;

    const newPlan = await planService.create({
      title,
      plan_type,
      created_by: userId,
    });

    return res.status(201).send(newPlan);
  }

  async getAllByUser(req: Request, res: Response) {
    const { id: userId } = req.user!;

    const plans = await planService.getAllByUser({
      userId,
    });

    return res.status(200).send(plans);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const plan = await planService.getById(id);

    return res.status(200).send(plan);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, plan_type, is_completed } = req.body;

    const updated = await planService.update(id, {
      title,
      plan_type,
      is_completed,
    });

    return res.status(200).send(updated);
  }

  async toggleStatus(req: Request, res: Response) {
    const { id } = req.params;

    const result = await planService.toggleStatus(id);

    return res.status(200).send(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const deleted = await planService.delete(id);

    return res.status(200).send(deleted);
  }
}

const planController = new PlanController();
export default planController;
