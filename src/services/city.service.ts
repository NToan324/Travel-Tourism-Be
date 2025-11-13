import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import cityModel from "@/models/city.model";
import { convertObjectId } from "@/utils/convertObjectId";

class CityService {
  async create(payload: {
    name: string;
    country: string;
    description?: string;
    image_urls?: string[];
  }) {
    const existing = await cityModel.findOne({ name: payload.name });
    if (existing) throw new BadRequestError("City already exists");

    const city = await cityModel.create(payload);
    return new CreatedResponse("City created successfully", city);
  }

  async getAll({ page, limit }: { page: number; limit: number }) {
    const cities = await cityModel.find().paginate({ page, limit });

    const pagination = {
      totalDocs: cities.totalDocs,
      limit: cities.limit,
      page: cities.page,
      totalPages: cities.totalPages,
    };

    return new OkResponse("Get all cities successfully", {
      docs: cities.docs,
      pagination,
    });
  }

  async getById(id: string) {
    const city = await cityModel.findById(convertObjectId(id));
    if (!city) throw new NotFoundError("City not found");
    return new OkResponse("Get city successfully", city);
  }

  async update(
    id: string,
    payload: {
      name?: string;
      country?: string;
      description?: string;
      image_urls?: string[];
    }
  ) {
    const city = await cityModel.findByIdAndUpdate(
      convertObjectId(id),
      payload,
      { new: true }
    );
    if (!city) throw new NotFoundError("City not found");
    return new OkResponse("City updated successfully", city);
  }

  async delete(id: string) {
    const city = await cityModel.findByIdAndDelete(convertObjectId(id));
    if (!city) throw new NotFoundError("City not found");
    return new OkResponse("City deleted successfully", city);
  }
}

const cityService = new CityService();
export default cityService;
