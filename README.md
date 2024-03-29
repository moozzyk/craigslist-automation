# craigslist-automation

This node module provides programmatic access to Craigslist posts. 

## Disclaimer

Neither the author nor the library has any affiliation with Craigslist.

## Installation 

```
npm i craigslist-automation
```

## Usage

Each supported Craigslist category has a corresponding function returning posts in this category (e.g. to fetch posts from the _for sale cars+trucks_ category use `forSaleCarsAndTrucks`). The function takes the site, a [filter](https://github.com/moozzyk/craigslist-automation/blob/main/src/index.ts#L3-L7) and, optionally, the area. The filter allows specifying only criteria that are valid for the given category - for example the `CarsAndTrucksForSaleFilter` should only be used to filter posts from the _for sale cars+trucks_ category. The function will return a list of gallery posts containing basic details and the `getPost()` method that allows to fetch all post details.

## Supported Categories/Filters
- For Sale
  - `CarsAndTrucksForSaleFilter`
  - `BoatsForSaleFilter`
- Housing 
  - `HousingAptsHousingFilter`

## Examples
### Apts/Housing 
```ts
import { housingAptsHousing, GalleryPost } from "craigslist-automation";

(async () => {
  for await (let galleryPost of housingAptsHousing("seattle", {
      minBedrooms: 1,
      maxBathrooms: 3,
      minSqFt: 300,
      hasImage: true,
    })) {
    console.log(galleryPost);
    const post = await galleryPost.getPost();
    console.log(post);
  }
})();
```

### For Sale Cars+Truck
```ts
import { forSaleCarsAndTrucks, GalleryPost } from "craigslist-automation";

(async () => {
  for await (let galleryPost of forSaleCarsAndTrucks("seattle", {
    query: "k5 blazer",
    hasImage: true,
    minPrice: 5000,
    maxPrice: 35000,
  })) {
    console.log(galleryPost);
    const post = await galleryPost.getPost();
    console.log(post);
  }
})();
```

## Notes

### Raspberry Pi

I was able to run this on Raspberry Pi (Raspbian GNU/Linux 11 (bullseye)) after taking the following steps:
- installing Chromium: `sudo apt install chromium`
- setting the `PUPPETEER_EXECUTABLE_PATH` environment variable to point to chromium (e.g. `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`)
