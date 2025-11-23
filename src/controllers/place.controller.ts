import type { Request, Response } from "express";

import placeService from "@/services/place.service";

class PlaceController {
  async create(req: Request, res: Response) {
    const {
      type,
      city_id,
      name,
      description,
      image_urls,
      opening_hours,
      sections,
      price_range,
      menu,
      specialties,
      event_date,
      event_location,
      related_posts,
    } = req.body;

    const newPlace = await placeService.create({
      type,
      city_id,
      name,
      description,
      image_urls,
      opening_hours,
      sections,
      price_range,
      menu,
      specialties,
      event_date,
      event_location,
      related_posts,
    });

    return res.status(201).send(newPlace);
  }

  async getRelevantPlaces(req: Request, res: Response) {
    const { placeIds } = req.query;
    return res
      .status(200)
      .send(await placeService.getRelevantPlaces(placeIds as string[]));
  }

  async getAll(req: Request, res: Response) {
    const { page = 1, limit = 10, search, cityId, type } = req.query;

    const places = await placeService.getAll({
      page: Number(page),
      limit: Number(limit),
      search: typeof search === "string" ? search : undefined,
      cityId: typeof cityId === "string" ? cityId : undefined,
      type: typeof type === "string" ? type : undefined,
    });

    return res.status(200).send(places);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const place = await placeService.getById(id);
    return res.status(200).send(place);
  }

  async getByCityId(req: Request, res: Response) {
    const { id } = req.params;
    const { page = "1", limit = "10" } = req.query;

    const result = await placeService.getByCityId({
      id,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).send(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      type,
      city_id,
      name,
      description,
      image_urls,
      opening_hours,
      sections,
      price_range,
      menu,
      specialties,
      event_date,
      event_location,
      related_posts,
    } = req.body;

    const updated = await placeService.update(id, {
      type,
      city_id,
      name,
      description,
      image_urls,
      opening_hours,
      sections,
      price_range,
      menu,
      specialties,
      event_date,
      event_location,
      related_posts,
    });

    return res.status(200).send(updated);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = await placeService.delete(id);
    return res.status(200).send(deleted);
  }
}

const placeController = new PlaceController();
export default placeController;
