import type { Request, Response } from "express";

import cityService from "@/services/city.service";

class CityController {
  async create(req: Request, res: Response) {
    const { name, country, description, image_urls } = req.body;

    res.status(201).send(
      await cityService.create({
        name: name,
        country: country,
        description: description,
        image_urls: image_urls,
      })
    );
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    res.status(200).send(
      await cityService.getAll({
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await cityService.getById(id));
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, country, description, image_urls } = req.body;
    res.status(200).send(
      await cityService.update(id, {
        name,
        country,
        description,
        image_urls,
      })
    );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await cityService.delete(id));
  }
}

const cityController = new CityController();
export default cityController;
