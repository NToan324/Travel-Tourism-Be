import { addDays } from "date-fns";

import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import scheduleModel from "@/models/schedule.model";
import userModel from "@/models/user.model";
import { convertObjectId } from "@/utils/convertObjectId";

class ScheduleService {
  async create(payload: {
    user_id: string;
    trip_id: string;
    location: string;
    duration_days: number;
    start_date: Date;
    end_date: Date;
    trip_cover_image?: string;
    accommodation: {
      name: string;
      address: string;
      price_range: string;
      notes?: string;
    };
    tips?: string[];
    weather_summary: {
      avg_temp?: number;
      condition?: string;
      notes?: string;
    };
    itinerary: {
      day: number;
      title: string;
      activities: {
        time_start: string;
        time_end: string;
        description: string;
        type: string;
      }[];
    }[];
  }) {
    const user = await userModel.findById(convertObjectId(payload.user_id));
    if (!user) throw new BadRequestError("User not found");

    const schedule = await scheduleModel.create({
      user_id: convertObjectId(payload.user_id),
      trip_id: payload.trip_id,
      location: payload.location,
      duration_days: payload.duration_days,
      start_date: payload.start_date,
      end_date: payload.end_date,
      trip_cover_image: payload.trip_cover_image || null,
      accommodation: payload.accommodation || null,
      weather_summary: payload.weather_summary || null,
      itinerary: payload.itinerary || [],
      tips: payload.tips || [],
    });

    return new CreatedResponse("Schedule created successfully", schedule);
  }

  async getAll({ page = 1, limit = 10 }: { page?: number; limit?: number }) {
    const schedules = await scheduleModel
      .find()
      .populate("user_id", "email fullName")
      .paginate({ page, limit, sort: { created_at: -1 } });

    return new OkResponse("Get all schedules successfully", {
      docs: schedules.docs,
      pagination: {
        totalDocs: schedules.totalDocs,
        limit: schedules.limit,
        page: schedules.page,
        totalPages: schedules.totalPages,
      },
    });
  }

  async getByUserId({
    user_id,
    page = 1,
    limit = 10,
    search,
    from_date,
    to_date,
  }: {
    user_id: string;
    page?: number;
    limit?: number;
    search?: string;
    from_date?: Date;
    to_date?: Date;
  }) {
    const schedules = await scheduleModel
      .find({
        user_id: user_id,
        itinerary: {
          $elemMatch: { title: { $regex: search || "", $options: "i" } },
        },
        ...(from_date && to_date
          ? {
              created_at: {
                $gte: new Date(from_date),
                $lte: addDays(new Date(to_date), 1),
              },
            }
          : {}),
      })
      .paginate({
        page,
        limit,
        sort: { created_at: -1 },
        populate: { path: "user_id", select: "email fullName" },
      });

    return new OkResponse("Get all schedules by user successfully", {
      docs: schedules.docs,
      pagination: {
        totalDocs: schedules.totalDocs,
        limit: schedules.limit,
        page: schedules.page,
        totalPages: schedules.totalPages,
      },
    });
  }

  async getById(id: string) {
    const schedule = await scheduleModel
      .findById(convertObjectId(id))
      .populate("user_id", "email fullName");

    if (!schedule) throw new NotFoundError("Schedule not found");

    return new OkResponse("Get schedule successfully", schedule);
  }

  async update(
    id: string,
    payload: Partial<{
      location: string;
      duration_days: number;
      start_date: Date;
      end_date: Date;
      trip_cover_image?: string;
      tips: string[];
      accommodation: {
        name: string;
        address: string;
        price_range: string;
        notes?: string;
      };
      weather_summary: {
        avg_temp?: number;
        condition?: string;
        notes?: string;
      };
      itinerary: {
        day: number;
        title: string;
        activities: {
          time_start: string;
          time_end: string;
          description: string;
          type: string;
        }[];
      }[];
    }>,
  ) {
    const schedule = await scheduleModel.findById(convertObjectId(id));
    if (!schedule) throw new NotFoundError("Schedule not found");

    await scheduleModel.findByIdAndUpdate(id, payload, { new: true });

    return new OkResponse("Schedule updated successfully");
  }

  async delete(id: string) {
    const schedule = await scheduleModel.findByIdAndDelete(convertObjectId(id));
    if (!schedule) throw new NotFoundError("Schedule not found");

    return new OkResponse("Schedule deleted successfully");
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
