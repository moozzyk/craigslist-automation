import { GalleryPost } from "./types";
import { getGalleryPosts } from "./internal";
import {
  BoatsForSaleFilter,
  CarsAndTrucksForSaleFilter,
  HousingAptsHousingFilter,
} from "./filters";

export async function* forSaleBoats(
  site: string,
  filter: BoatsForSaleFilter,
  area?: string
): AsyncIterableIterator<GalleryPost> {
  yield* getGalleryPosts(site, "boo", area, filter);
}

export async function* forSaleCarsAndTrucks(
  site: string,
  filter: CarsAndTrucksForSaleFilter,
  area?: string
): AsyncIterableIterator<GalleryPost> {
  yield* getGalleryPosts(site, "cta", area, filter);
}

export async function* housingAptsHousing(
  site: string,
  filter: HousingAptsHousingFilter,
  area?: string
): AsyncIterableIterator<GalleryPost> {
  yield* getGalleryPosts(site, "apa", area, filter);
}

export type {
  CarsAndTrucksForSaleFilter,
  BoatsForSaleFilter,
  HousingAptsHousingFilter,
} from "./filters";
export type { GalleryPost, Post } from "./types";
