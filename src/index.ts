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
  yield* getAsyncIterator(site, "pts", area, filter);
}

(async () => {
  let value = 0;
  for await (let galleryPost of forSaleCarAndTrucks("seattle", {
    query: "blazer k5",
  })) {
    console.log(galleryPost);
    const post = await galleryPost.getPost();
    console.log(post);
    if (value++ > 13) {
      break;
    }
  }
})();
