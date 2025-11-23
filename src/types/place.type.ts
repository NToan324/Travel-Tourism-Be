export interface SectionDTO {
  title: string;
  content: string;
  images?: string[];
}

export interface MenuItemDTO {
  item: string;
  price: string;
}

export interface CreatePlaceDTO {
  type: string;
  city_id: string;
  name: string;
  description?: string;
  image_urls?: string[];
  opening_hours?: string;

  sections?: SectionDTO[];

  // FOOD
  price_range?: string;
  menu?: MenuItemDTO[];
  specialties?: string[];

  // FESTIVAL
  event_date?: string;
  event_location?: string;

  // RELATED POSTS
  related_posts?: string[];
}

export interface UpdatePlaceDTO {
  type?: string;
  city_id?: string;
  name?: string;
  description?: string;
  image_urls?: string[];
  opening_hours?: string;

  sections?: SectionDTO[];

  price_range?: string;
  menu?: MenuItemDTO[];
  specialties?: string[];

  event_date?: string;
  event_location?: string;

  related_posts?: string[];
}

export interface GetAllPlacesDTO {
  page?: number;
  limit?: number;
  search?: string;
  cityId?: string;
  type?: string;
}

export interface GetByCityIdDTO {
  id: string;
  page?: number;
  limit?: number;
}

export interface FilterPlace {
  cityId?: string;
  type?: string;
  search?: string;
}
