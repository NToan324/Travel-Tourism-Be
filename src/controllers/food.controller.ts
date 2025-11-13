import type { Request, Response } from "express";

import foodService from "@/services/food.service";

class FoodController {
  async create(req: Request, res: Response) {
    const {
      city_id,
      name,
      description,
      type,
      address,
      price_range,
      image_urls,
      sections, 
    } = req.body;

    res.status(201).send(
      await foodService.create({
        city_id,
        name,
        description,
        type,
        address,
        price_range,
        image_urls,
        sections, 
      })
    );
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
      image_urls,
      sections, 
    } = req.body;

    res.status(200).send(
      await foodService.update(id, {
        city_id,
        name,
        description,
        type,
        address,
        price_range,
        image_urls,
        sections,
      })
    );
  }
  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    res.status(200).send(
      await foodService.getAll({
        page: Number(page),
        limit: Number(limit),
      })
    );
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await foodService.getById(id));
  }


  async delete(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await foodService.delete(id));
  }
}

const foodController = new FoodController();
export default foodController;
