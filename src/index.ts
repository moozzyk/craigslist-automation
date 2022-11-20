import { GalleryPost } from "./types";
import { getGalleryPosts } from "./internal";
import { BoatsForSaleFilter, CarsAndTrucksForSaleFilter } from "./filters";

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

export type { CarsAndTrucksForSaleFilter, BoatsForSaleFilter } from "./filters";
export type { GalleryPost, Post } from "./types";
