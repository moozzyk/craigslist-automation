import { GalleryPost } from "./types";
import { getAsyncIterator } from "./internal";
import { BoatsForSaleFilter, CarsAndTrucksForSaleFilter } from "./filters";

// export async function* forSaleBoats(site: string, filter: BoatsForSaleFilter?) {
//   throw "Not Implemented";
//   // return getAsyncIterator(site, "cta", );
// }

export async function* forSaleCarAndTrucks(
  site: string,
  filter: CarsAndTrucksForSaleFilter,
  area?: string
): AsyncIterableIterator<GalleryPost> {
  yield* getAsyncIterator(site, "cta", area, filter);
}

export type { CarsAndTrucksForSaleFilter } from "./filters";
