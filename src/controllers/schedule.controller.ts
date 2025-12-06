import type { Request, Response } from "express";

import { type IGoogleCalendarEvent } from "@/models/schedule.model";
import scheduleService from "@/services/schedule.service";

class ScheduleController {
  async create(req: Request, res: Response) {
    const { id: user_id } = req.user!;
    const {
      trip_id,
      location,
      duration_days,
      start_date,
      end_date,
      accommodation,
      tips,
      weather_summary,
      itinerary,
      trip_cover_image,
    } = req.body;

    res.status(201).send(
      await scheduleService.create({
        user_id,
        trip_id,
        location,
        duration_days,
        start_date,
        end_date,
        accommodation,
        tips,
        trip_cover_image,
        weather_summary,
        itinerary,
      })
    );
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;

    res.status(200).send(
      await scheduleService.getAll({
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getByUserId(req: Request, res: Response) {
    const { id: user_id } = req.user!;
    const { page = 1, limit = 10, search, from_date, to_date } = req.query;

    res.status(200).send(
      await scheduleService.getByUserId({
        user_id,
        page: Number(page),
        limit: Number(limit),
        search: typeof search === "string" ? search : undefined,
        from_date:
          typeof from_date === "string" ? new Date(from_date) : undefined,
        to_date: typeof to_date === "string" ? new Date(to_date) : undefined,
      })
    );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await scheduleService.getById(id));
  }

  async update(req: Request, res: Response) {
    const {
      location,
      duration_days,
      start_date,
      end_date,
      tips,
      trip_cover_image,
      weather_summary,
      accommodation,
      itinerary,
    } = req.body;

    res.status(200).send(
      await scheduleService.update(req.params.id, {
        location,
        duration_days,
        start_date,
        end_date,
        tips,
        weather_summary,
        trip_cover_image,
        accommodation,
        itinerary,
      })
    );
  }

  async createEventGoogleCalendar(req: Request, res: Response) {
    const { id: userId } = req.user!;
    const { id } = req.params;
    const events: IGoogleCalendarEvent[] = req.body;
    res
      .status(201)
      .send(
        await scheduleService.createEventGoogleCalendar(id, userId, events)
      );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await scheduleService.delete(id));
  }
}

const scheduleController = new ScheduleController();
export default scheduleController;
