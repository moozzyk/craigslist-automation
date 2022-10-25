import { getAsyncIterator, createQueryString } from "./internal";
import { BoatsForSaleFilter, CarsAndTrucksForSaleFilter } from "./filters";

// export async function* forSaleBoats(site: string, filter: BoatsForSaleFilter?) {
//   throw "Not Implemented";
//   // return getAsyncIterator(site, "cta", );
// }

export async function* forSaleCarAndTrucks(
  site: string,
  filter: CarsAndTrucksForSaleFilter,
  area?: string
) {
  yield* getAsyncIterator(site, "cta", area, filter);
}

(async () => {
  let value = 0;
  for await (let i of forSaleCarAndTrucks("seattle", {
    query: "blazer k5",
  })) {
    console.log("number: " + i);
    if (value++ > 4) {
      break;
    }
  }
})();
