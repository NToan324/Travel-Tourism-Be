import { NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import placeModel from "@/models/place.model";
import type {
  CreatePlaceDTO,
  FilterPlace,
  GetAllPlacesDTO,
  GetByCityIdDTO,
  UpdatePlaceDTO,
} from "@/types/place.type";
import { convertObjectId } from "@/utils/convertObjectId";

class PlaceService {
  async create(payload: CreatePlaceDTO) {
    const place = await placeModel.create({
      ...payload,
      city_id: convertObjectId(payload.city_id),
      related_posts:
        payload.related_posts?.map((id) => convertObjectId(id)) || [],
    });

    return new CreatedResponse("Place created successfully", place);
  }

  async getAll(query: GetAllPlacesDTO) {
    const { page, limit, search, cityId, type } = query;

    const filter: FilterPlace = {};

    if (type) filter.type = type;

    if (cityId) filter.cityId = cityId;
    if (search) filter.search = search;

    const results = await placeModel
      .find({
        ...((filter.cityId && { city_id: convertObjectId(filter.cityId) }) ||
          {}),
        ...((filter.type && { type: filter.type }) || {}),
        ...((filter.search && {
          name: { $regex: filter.search, $options: "i" },
        }) ||
          {}),
      })
      .paginate({
        page,
        limit,
        populate: { path: "city_id", select: "name" },
      });

    const docs = results.docs.map((item) => ({
      ...item.toObject(),
      city: item.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: results.totalDocs,
      limit: results.limit,
      page: results.page,
      totalPages: results.totalPages,
    };

    return new OkResponse("Get places successfully", { docs, pagination });
  }

  async getRelevantPlaces(placeIds: string[]) {
    const places = await placeModel.find({
      _id: { $in: placeIds.map((id) => convertObjectId(id)) },
    });

    return new OkResponse("Get relevant places successfully", places);
  }

  async getById(id: string) {
    const place = await placeModel
      .findById(convertObjectId(id))
      .populate("city_id", "name")
      .populate(
        "related_posts",
        "name type image_urls description opening_hours price_range",
      );

    if (!place) throw new NotFoundError("Place not found");

    return new OkResponse("Get place successfully", {
      ...place.toObject(),
      city: place.city_id,
      city_id: undefined,
    });
  }

  async getByCityId(payload: GetByCityIdDTO) {
    const { id, page, limit } = payload;

    const results = await placeModel
      .find({ city_id: convertObjectId(id) })
      .populate("city_id", "name")
      .paginate({ page, limit });

    const docs = results.docs.map((place) => ({
      ...place.toObject(),
      city: place.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: results.totalDocs,
      limit: results.limit,
      page: results.page,
      totalPages: results.totalPages,
    };

    return new OkResponse("Get places successfully", { docs, pagination });
  }

  async update(id: string, payload: UpdatePlaceDTO) {
    const updatePayload: UpdatePlaceDTO = { ...payload };

    if (payload.city_id) updatePayload.city_id = payload.city_id;

    if (payload.related_posts)
      updatePayload.related_posts = payload.related_posts.map((id) => id);

    const place = await placeModel.findByIdAndUpdate(
      convertObjectId(id),
      updatePayload,
      { new: true },
    );

    if (!place) throw new NotFoundError("Place not found");

    return new OkResponse("Place updated successfully", place);
  }

  async delete(id: string) {
    const place = await placeModel.findByIdAndDelete(convertObjectId(id));

    if (!place) throw new NotFoundError("Place not found");

    return new OkResponse("Place deleted successfully", place);
  }
}

const placeService = new PlaceService();
export default placeService;
