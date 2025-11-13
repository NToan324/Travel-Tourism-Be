import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import cityModel from "@/models/city.model";
import festivalModel from "@/models/festival.model";
import { convertObjectId } from "@/utils/convertObjectId";

class FestivalService {
  async create(payload: {
    city_id: string;
    name: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    image_urls?: string[];
  }) {
    const city = await cityModel.findById(convertObjectId(payload.city_id));
    if (!city) throw new BadRequestError("City not found");

    const existing = await festivalModel.findOne({
      name: payload.name,
      city_id: convertObjectId(payload.city_id),
    });
    if (existing)
      throw new BadRequestError("Festival already exists in this city");

    const festival = await festivalModel.create(payload);
    return new CreatedResponse("Festival created successfully", festival);
  }

  async getAll({ page, limit }: { page?: number; limit?: number }) {
    const festivals = await festivalModel
      .find()
      .populate("city_id", "name country")
      .paginate({ page, limit });

    const data = festivals.docs.map((festival) => ({
      ...festival.toObject(),
      city: festival.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: festivals.totalDocs,
      limit: festivals.limit,
      page: festivals.page,
      totalPages: festivals.totalPages,
    };

    return new OkResponse("Get all festivals successfully", {
      docs: data,
      pagination,
    });
  }

  async getById(id: string) {
    const festival = await festivalModel
      .findById(convertObjectId(id))
      .populate("city_id", "name country");
    if (!festival) throw new NotFoundError("Festival not found");
    const data = {
      ...festival.toObject(),
      city: festival.city_id,
      city_id: undefined,
    };
    return new OkResponse("Get festival successfully", data);
  }

  async update(
    id: string,
    payload: {
      city_id?: string;
      name?: string;
      description?: string;
      start_date?: Date;
      end_date?: Date;
      image_urls?: string[];
    }
  ) {
    if (payload.city_id) {
      const city = await cityModel.findById(convertObjectId(payload.city_id));
      if (!city) throw new BadRequestError("City not found");
    }

    const festival = await festivalModel
      .findByIdAndUpdate(convertObjectId(id), payload, { new: true })
      .populate("city_id", "name country");

    if (!festival) throw new NotFoundError("Festival not found");
    const data = {
      ...festival.toObject(),
      city: festival.city_id,
      city_id: undefined,
    };
    return new OkResponse("Festival updated successfully", data);
  }

  async delete(id: string) {
    const festival = await festivalModel.findByIdAndDelete(convertObjectId(id));
    if (!festival) throw new NotFoundError("Festival not found");
    return new OkResponse("Festival deleted successfully", festival);
  }
}

const festivalService = new FestivalService();
export default festivalService;
