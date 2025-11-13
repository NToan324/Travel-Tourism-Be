import type { Request, Response } from "express";

import scheduleService from "@/services/schedule.service";

class ScheduleController {
  async create(req: Request, res: Response) {
    const {
      user_id,
      trip_id,
      location,
      duration_days,
      start_date,
      end_date,
      accommodation_id,
      tips,
      weather_summary,
      itineraries,
    } = req.body;
    res.status(201).send(
      await scheduleService.create({
        user_id,
        trip_id,
        location,
        duration_days,
        start_date,
        end_date,
        accommodation_id,
        tips,
        weather_summary,
        itineraries,
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
      weather_summary,
      itineraries,
    } = req.body;
    res.status(200).send(
      await scheduleService.update(req.params.id, {
        location,
        duration_days,
        start_date,
        end_date,
        tips,
        weather_summary,
        itineraries,
      })
    );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await scheduleService.delete(id));
  }
}

const scheduleController = new ScheduleController();
export default scheduleController;
