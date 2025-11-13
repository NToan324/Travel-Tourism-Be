import type { Request, Response } from "express";

import attractionService from "@/services/attraction.service";

class AttractionController {
  async create(req: Request, res: Response) {
    const { city_id, name, description, image_urls, opening_hours } = req.body;

    res.status(201).send(
      await attractionService.create({
        city_id,
        name,
        description,
        image_urls,
        opening_hours,
      })
    );
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    res.status(200).send(
      await attractionService.getAll({
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await attractionService.getById(id));
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { city_id, name, description, image_urls, opening_hours } = req.body;

    res.status(200).send(
      await attractionService.update(id, {
        city_id,
        name,
        description,
        image_urls,
        opening_hours,
      })
    );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await attractionService.delete(id));
  }
}

const attractionController = new AttractionController();
export default attractionController;
