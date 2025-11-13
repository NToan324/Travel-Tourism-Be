import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import cityModel from "@/models/city.model";
import itineraryModel from "@/models/itinerary.model";
import scheduleItem from "@/models/schedule.model";
import weatherSummaryModel from "@/models/weatherSummary.model";
import { convertObjectId } from "@/utils/convertObjectId";

class ScheduleService {
  async create(payload: {
    user_id: string;
    trip_id: string;
    location: string;
    duration_days: number;
    start_date: Date;
    end_date: Date;
    accommodation_id?: string;
    tips?: string[];
    weather_summary: {
      city_id: string;
      avg_temp?: number;
      condition?: string;
      notes?: string;
    };
    itineraries: {
      day: number;
      title: string;
    }[];
  }) {
    const user = await cityModel.findById(convertObjectId(payload.user_id));
    if (!user) throw new BadRequestError("User not found");

    const city = await cityModel.findById(
      convertObjectId(payload.weather_summary.city_id)
    );
    if (!city) throw new BadRequestError("City not found");

    const weather = await weatherSummaryModel.create({
      city_id: payload.weather_summary.city_id,
      avg_temp: payload.weather_summary.avg_temp ?? null,
      condition: payload.weather_summary.condition ?? "",
      notes: payload.weather_summary.notes ?? "",
    });

    const schedule = await scheduleItem.create({
      user_id: convertObjectId(payload.user_id),
      trip_id: payload.trip_id,
      location: payload.location,
      duration_days: payload.duration_days,
      start_date: payload.start_date,
      end_date: payload.end_date,
      accommodation_id: payload.accommodation_id || null,
      weather_summary_id: weather._id,
      tips: payload.tips || [],
    });

    const itineraries = payload.itineraries.map((it) => ({
      schedule_id: schedule._id,
      day: it.day,
      title: it.title,
    }));
    await itineraryModel.insertMany(itineraries);

    return new CreatedResponse("Schedule created successfully", {
      schedule,
      weather,
      itineraries,
    });
  }

  async getAll({ page, limit }: { page?: number; limit?: number }) {
    const schedules = await scheduleItem
      .find()
      .populate("user_id", "email fullName")
      .populate("accommodation_id", "name address")
      .populate("weather_summary_id", "avg_temp condition notes")
      .paginate({ page: page, limit: limit });

    const itineraries = await itineraryModel.find({
      schedule_id: { $in: schedules.docs.map((s) => s._id) },
    });

    const data = schedules.docs.map((schedule) => ({
      ...schedule.toObject(),
      user: schedule.user_id,
      accommodation: schedule.accommodation_id,
      weather_summary: schedule.weather_summary_id,
      itineraries: itineraries.filter(
        (it) => it.schedule_id.toString() === schedule._id.toString()
      ),

      user_id: undefined,
      accommodation_id: undefined,
      weather_summary_id: undefined,
    }));

    const pagination = {
      totalDocs: schedules.totalDocs,
      limit: schedules.limit,
      page: schedules.page,
      totalPages: schedules.totalPages,
    };

    return new OkResponse("Get all schedules successfully", {
      docs: data,
      pagination,
    });
  }

  async getById(id: string) {
    const schedule = await scheduleItem
      .findById(convertObjectId(id))
      .populate("user_id", "email fullName")
      .populate("accommodation_id", "name address")
      .populate("weather_summary_id", "avg_temp condition notes");

    if (!schedule) throw new NotFoundError("Schedule not found");

    const itineraries = await itineraryModel.find({
      schedule_id: schedule._id,
    });

    const scheduleData = {
      ...schedule.toObject(),
      user: schedule.user_id,
      accommodation: schedule.accommodation_id,
      weather_summary: schedule.weather_summary_id,
      itineraries,
      user_id: undefined,
      accommodation_id: undefined,
      weather_summary_id: undefined,
    };

    return new OkResponse("Get schedule successfully", scheduleData);
  }

  async update(
    id: string,
    payload: Partial<{
      location: string;
      duration_days: number;
      start_date: Date;
      end_date: Date;
      tips: string[];
      itineraries: { day: number; title: string }[];
      weather_summary: {
        avg_temp?: number;
        condition?: string;
        notes?: string;
      };
    }>
  ) {
    const schedule = await scheduleItem.findById(convertObjectId(id));
    if (!schedule) throw new NotFoundError("Schedule not found");

    await scheduleItem.findByIdAndUpdate(id, payload, { new: true });

    if (payload.weather_summary) {
      await weatherSummaryModel.findByIdAndUpdate(
        schedule.weather_summary_id,
        payload.weather_summary
      );
    }

    if (payload.itineraries && payload.itineraries.length > 0) {
      await itineraryModel.deleteMany({ schedule_id: schedule._id });
      const newItineraries = payload.itineraries.map((it) => ({
        schedule_id: schedule._id,
        day: it.day,
        title: it.title,
      }));
      await itineraryModel.insertMany(newItineraries);
    }

    return new OkResponse("Schedule updated successfully");
  }

  async delete(id: string) {
    const schedule = await scheduleItem.findByIdAndDelete(convertObjectId(id));
    if (!schedule) throw new NotFoundError("Schedule not found");

    await weatherSummaryModel.findByIdAndDelete(schedule.weather_summary_id);
    await itineraryModel.deleteMany({ schedule_id: schedule._id });

    return new OkResponse("Schedule deleted successfully");
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
