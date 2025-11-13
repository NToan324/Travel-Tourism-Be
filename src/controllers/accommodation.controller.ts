import type { Request, Response } from "express";

import accommodationService from "@/services/accommodation.service";

class AccommodationController {
  async create(req: Request, res: Response) {
    const {
      city_id,
      name,
      description,
      type,
      address,
      price_range,
      ratings,
      image_urls,
    } = req.body;

    res.status(201).send(
      await accommodationService.create({
        city_id,
        name,
        description,
        type,
        address,
        price_range,
        ratings,
        image_urls,
      })
    );
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;

    res.status(200).send(
      await accommodationService.getAll({
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await accommodationService.getById(id));
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      city_id,
      name,
      description,
      type,
      address,
      price_range,
      ratings,
      image_urls,
    } = req.body;

    res.status(200).send(
      await accommodationService.update(id, {
        city_id,
        name,
        description,
        type,
        address,
        price_range,
        ratings,
        image_urls,
      })
    );
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await accommodationService.delete(id));
  }
}

const accommodationController = new AccommodationController();
export default accommodationController;
