import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import attractionModel from "@/models/attraction.model";
import { convertObjectId } from "@/utils/convertObjectId";

class AttractionService {
  async create(payload: {
    city_id: string;
    name: string;
    description?: string;
    image_urls?: string[];
    opening_hours?: string;
    sections?: Array<{
      title: string;
      content: string;
      images?: string[];
    }>;
  }) {
    const existing = await attractionModel.findOne({
      name: payload.name,
      city_id: convertObjectId(payload.city_id),
    });
    if (existing)
      throw new BadRequestError("Attraction already exists in this city");

    const attraction = await attractionModel.create({
      ...payload,
      city_id: convertObjectId(payload.city_id),
    });

    return new CreatedResponse("Attraction created successfully", attraction);
  }

  async getAll({
    page,
    limit,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const attractions = await attractionModel
      .find(
        search ?
          {
            name: { $regex: search, $options: "i" },
          }
        : {}
      )
      .populate("city_id", "name")
      .paginate({ page, limit });

    const data = attractions.docs.map((attraction) => ({
      ...attraction.toObject(),
      city: attraction.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: attractions.totalDocs,
      limit: attractions.limit,
      page: attractions.page,
      totalPages: attractions.totalPages,
    };

    return new OkResponse("Get all attractions successfully", {
      docs: data,
      pagination,
    });
  }

  async getById(id: string) {
    const attraction = await attractionModel
      .findById(convertObjectId(id))
      .populate("city_id", "name");

    if (!attraction) throw new NotFoundError("Attraction not found");

    const data = {
      ...attraction.toObject(),
      city: attraction.city_id,
      city_id: undefined,
    };
    return new OkResponse("Get attraction successfully", data);
  }

  async getByCityId({
    id,
    page,
    limit,
  }: {
    id: string;
    page?: number;
    limit?: number;
  }) {
    const attraction = await attractionModel
      .find({ city_id: convertObjectId(id) })
      .populate("city_id", "name")
      .paginate({ page, limit });

    if (!attraction) throw new NotFoundError("Attraction not found");

    const data = attraction.docs.map((attraction) => ({
      ...attraction.toObject(),
      city: attraction.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: attraction.totalDocs,
      limit: attraction.limit,
      page: attraction.page,
      totalPages: attraction.totalPages,
    };

    return new OkResponse("Get attractions successfully", {
      docs: data,
      pagination,
    });
  }

  async update(
    id: string,
    payload: {
      city_id?: string;
      name?: string;
      description?: string;
      image_urls?: string[];
      opening_hours?: string;
      sections?: Array<{
        title: string;
        content: string;
        images?: string[];
      }>;
    }
  ) {
    const attraction = await attractionModel.findByIdAndUpdate(
      convertObjectId(id),
      {
        ...payload,
        ...(payload.city_id && { city_id: convertObjectId(payload.city_id) }),
      },
      { new: true }
    );

    if (!attraction) throw new NotFoundError("Attraction not found");

    return new OkResponse("Attraction updated successfully", attraction);
  }

  async delete(id: string) {
    const attraction = await attractionModel.findByIdAndDelete(
      convertObjectId(id)
    );
    if (!attraction) throw new NotFoundError("Attraction not found");

    return new OkResponse("Attraction deleted successfully", attraction);
  }
}

const attractionService = new AttractionService();
export default attractionService;
