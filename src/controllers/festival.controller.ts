import type { Request, Response } from "express";

import festivalService from "@/services/festival.service";

class FestivalController {
  async create(req: Request, res: Response) {
    const { city_id, name, description, start_date, end_date, image_urls } =
      req.body;

    res.status(201).send(
      await festivalService.create({
        city_id,
        name,
        description,
        start_date,
        end_date,
        image_urls,
      })
    );
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    res
      .status(200)
      .send(
        await festivalService.getAll({
          page: Number(page),
          limit: Number(limit),
        })
      );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await festivalService.getById(id));
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { city_id, name, description, start_date, end_date, image_urls } =
      req.body;

    res.status(200).send(
      await festivalService.update(id, {
        city_id,
        name,
        description,
        start_date,
        end_date,
        image_urls,
      })
    );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await festivalService.delete(id));
  }
}

const festivalController = new FestivalController();
export default festivalController;
