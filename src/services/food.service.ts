import { BadRequestError, NotFoundError } from "@/core/error.response";
import { CreatedResponse, OkResponse } from "@/core/success.response";
import cityModel from "@/models/city.model";
import foodModel from "@/models/food.model";
import { convertObjectId } from "@/utils/convertObjectId";

class FoodService {
  async create(payload: {
    city_id: string;
    name: string;
    description?: string;
    type?: string;
    address?: string;
    price_range?: string;
    image_urls?: string[];
    sections?: Array<{
      title: string;
      content: string;
      images?: string[];
    }>;
  }) {
    const city = await cityModel.findById(convertObjectId(payload.city_id));
    if (!city) throw new BadRequestError("City not found");

    const food = await foodModel.create(payload);
    return new CreatedResponse("Food created successfully", food);
  }

  async getAll({ page, limit }: { page: number; limit: number }) {
    const foods = await foodModel
      .find()
      .populate("city_id", "name country")
      .paginate({ page, limit });

    const data = foods.docs.map((food) => ({
      ...food.toObject(),
      city: food.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: foods.totalDocs,
      limit: foods.limit,
      page: foods.page,
      totalPages: foods.totalPages,
    };

    return new OkResponse("Get all foods successfully", {
      docs: data,
      pagination,
    });
  }

  async getById(id: string) {
    const food = await foodModel
      .findById(convertObjectId(id))
      .populate("city_id", "name country");
    if (!food) throw new NotFoundError("Food not found");
    const data = { ...food.toObject(), city: food.city_id, city_id: undefined };
    return new OkResponse("Get food successfully", data);
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
    const food = await foodModel
      .find({ city_id: convertObjectId(id) })
      .populate("city_id", "name country")
      .paginate({ page, limit });

    if (!food) throw new NotFoundError("Food not found");

    const data = food.docs.map((food) => ({
      ...food.toObject(),
      city: food.city_id,
      city_id: undefined,
    }));

    const pagination = {
      totalDocs: food.totalDocs,
      limit: food.limit,
      page: food.page,
      totalPages: food.totalPages,
    };

    return new OkResponse("Get foods successfully", {
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
      type?: string;
      address?: string;
      price_range?: string;
      image_urls?: string[];
      sections?: Array<{
        title: string;
        content: string;
        images?: string[];
      }>;
    }
  ) {
    if (payload.city_id) {
      const city = await cityModel.findById(convertObjectId(payload.city_id));
      if (!city) throw new BadRequestError("City not found");
    }

    const food = await foodModel
      .findByIdAndUpdate(convertObjectId(id), payload, { new: true })
      .populate("city_id", "name country");

    if (!food) throw new NotFoundError("Food not found");
    return new OkResponse("Food updated successfully", food.toObject());
  }

  async delete(id: string) {
    const food = await foodModel.findByIdAndDelete(convertObjectId(id));
    if (!food) throw new NotFoundError("Food not found");
    return new OkResponse("Food deleted successfully", food);
  }
}

const foodService = new FoodService();
export default foodService;
