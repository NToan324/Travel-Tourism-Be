import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import accommodationModel from "@/models/accommodation.model";
import cityModel from "@/models/city.model";
import { convertObjectId } from "@/utils/convertObjectId";

class AccommodationService {
  async create(payload: {
    city_id: string;
    name: string;
    description?: string;
    type?: string;
    address?: string;
    price_range?: string;
    ratings?: number;
    image_urls?: string[];
  }) {
    const city = await cityModel.findById(convertObjectId(payload.city_id));
    if (!city) throw new BadRequestError("City not found");

    const existing = await accommodationModel.findOne({
      name: payload.name,
      city_id: convertObjectId(payload.city_id),
    });

    if (existing)
      throw new BadRequestError("Accommodation already exists in this city");

    const accommodation = await accommodationModel.create(payload);
    return new CreatedResponse(
      "Accommodation created successfully",
      accommodation
    );
  }

  async getAll({ page, limit }: { page: number; limit: number }) {
    const accommodations = await accommodationModel
      .find()
      .populate("city_id", "name country")
      .paginate({ page, limit });

    const data = accommodations.docs.map((accommodation) => ({
      ...accommodation.toObject(),
      city: accommodation.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: accommodations.totalDocs,
      limit: accommodations.limit,
      page: accommodations.page,
      totalPages: accommodations.totalPages,
    };

    return new OkResponse("Get all accommodations successfully", {
      docs: data,
      pagination,
    });
  }

  async getById(id: string) {
    const accommodation = await accommodationModel
      .findById(convertObjectId(id))
      .populate("city_id", "name country");
    if (!accommodation) throw new NotFoundError("Accommodation not found");
    const data = {
      ...accommodation.toObject(),
      city: accommodation.city_id,
      city_id: undefined,
    };
    return new OkResponse("Get accommodation successfully", data);
  }

  async update(
    id: string,
    payload: {
      city_id?: string;
      name?: string;
      description?: string;
      type?: string;
      address?: string;
      price_range?: string;
      ratings?: number;
      image_urls?: string[];
    }
  ) {
    if (payload.city_id) {
      const city = await cityModel.findById(convertObjectId(payload.city_id));
      if (!city) throw new BadRequestError("City not found");
    }

    const accommodation = await accommodationModel
      .findByIdAndUpdate(convertObjectId(id), payload, { new: true })
      .populate("city_id", "name country");

    if (!accommodation) throw new NotFoundError("Accommodation not found");
    const data = {
      ...accommodation.toObject(),
      city: accommodation.city_id,
      city_id: undefined,
    };
    return new OkResponse("Accommodation updated successfully", data);
  }

  async delete(id: string) {
    const accommodation = await accommodationModel.findByIdAndDelete(
      convertObjectId(id)
    );
    if (!accommodation) throw new NotFoundError("Accommodation not found");
    return new OkResponse("Accommodation deleted successfully", accommodation);
  }
}

const accommodationService = new AccommodationService();
export default accommodationService;
