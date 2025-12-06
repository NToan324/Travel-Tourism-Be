import mongoose from "mongoose";

import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import planModel from "@/models/plan.model";
import userModel from "@/models/user.model";
import { convertObjectId } from "@/utils/convertObjectId";

class PlanService {
  async create(payload: {
    title: string;
    plan_type?: string;
    created_by: string;
  }) {
    const user = await userModel.findById(convertObjectId(payload.created_by));
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const newPlan = await planModel.create({
      title: payload.title,
      plan_type: payload.plan_type || "yearly",
      created_by: convertObjectId(payload.created_by),
    });

    return new CreatedResponse("Plan created successfully", newPlan);
  }

  async getAllByUser({ userId }: { userId: string }) {
    const plans = await planModel
      .find({ created_by: convertObjectId(userId) })
      .sort({ createdAt: -1 });

    if (!plans) {
      throw new NotFoundError("No plans found for this user");
    }

    return new OkResponse("Get user plans successfully", plans);
  }

  async getById(id: string) {
    const plan = await planModel.findById(convertObjectId(id));
    if (!plan) throw new NotFoundError("Plan not found");

    return new OkResponse("Get plan successfully", plan.toObject());
  }

  async update(
    id: string,
    payload: {
      title?: string;
      plan_type?: string;
      is_completed?: boolean;
    }
  ) {
    const updated = await planModel.findByIdAndUpdate(
      convertObjectId(id),
      payload,
      { new: true }
    );

    if (!updated) throw new NotFoundError("Plan not found");

    return new OkResponse("Plan updated successfully", updated.toObject());
  }


  async toggleStatus(id: string) {
    const plan = await planModel.findById(convertObjectId(id));

    if (!plan) throw new NotFoundError("Plan not found");

    plan.is_completed = !plan.is_completed;
    await plan.save();

    return new OkResponse("Plan status updated successfully", plan.toObject());
  }


  async delete(id: string) {
    const deleted = await planModel.findByIdAndDelete(convertObjectId(id));

    if (!deleted) throw new NotFoundError("Plan not found");

    return new OkResponse("Plan deleted successfully", deleted);
  }
}

const planService = new PlanService();
export default planService;
