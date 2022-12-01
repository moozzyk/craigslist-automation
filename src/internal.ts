import { GalleryPost, Post } from "./types";
import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";

const zipRegex = /^\d{5}$/;

const rewriteMap = new Map<
  string,
  (val: string | number | boolean) => string
>();
rewriteMap.set("purveyor", (val) => `purveyor=${val}`);
rewriteMap.set("query", (val) => `query=${encodeURIComponent(val)}`);
rewriteMap.set("searchTitlesOnly", (val) => (val ? "srchType=T" : ""));
rewriteMap.set("hasImage", (val) => (val ? "hasPic=1" : ""));
rewriteMap.set("postedToday", (val) => (val ? "postedToday=1" : ""));
rewriteMap.set("hideDuplicates", (val) => (val ? "bundleDuplicates=1" : ""));
rewriteMap.set("milesFromLocation", (val) => `searchDistance=${val}`);
rewriteMap.set("zipCode", (val) =>
  `${val}`.match(zipRegex) ? `postal=${val}` : ""
);
rewriteMap.set("minPrice", (val) => `min_price=${val}`);
rewriteMap.set("maxPrice", (val) => `max_price=${val}`);
rewriteMap.set(
  "makeAndModel",
  (val) => `make_and_model=${encodeURIComponent(val)}`
);
// housing filters rewrites
rewriteMap.set("minBedrooms", (val) => `min_bedrooms=${val}`);
rewriteMap.set("maxBedrooms", (val) => `max_bedrooms=${val}`);
rewriteMap.set("minBathrooms", (val) => `min_bathrooms=${val}`);
rewriteMap.set("maxBathrooms", (val) => `max_bathrooms=${val}`);
rewriteMap.set("minSqFt", (val) => `minSqft=${val}`);
rewriteMap.set("maxSqFt", (val) => `maxSqft=${val}`);
rewriteMap.set("catsOk", (val) => (val ? "pets_cat=1" : ""));
rewriteMap.set("dogsOk", (val) => (val ? "pets_dog=1" : ""));
rewriteMap.set("furnished", (val) => (val ? "is_furnished=1" : ""));
rewriteMap.set("noSmoking", (val) => (val ? "no_smoking=1" : ""));
rewriteMap.set("wheelchairAccessible", (val) => (val ? "wheelchaccess=1" : ""));
rewriteMap.set("airConditioning", (val) => (val ? "airconditioning=1" : ""));
rewriteMap.set("evCharging", (val) => (val ? "ev_charging=1" : ""));
rewriteMap.set("noApplicationFee", (val) => (val ? "application_fee=1" : ""));
rewriteMap.set("noBrokerFee", (val) => (val ? "broker_fee=1" : ""));
rewriteMap.set("daily", (val) => (val ? "rent_period=1" : ""));
rewriteMap.set("weekly", (val) => (val ? "rent_period=2" : ""));
rewriteMap.set("monthly", (val) => (val ? "rent_period=3" : ""));
rewriteMap.set("rentAvailability", (val) =>
  val === "within30days"
    ? "availabilityMode=1"
    : val == "beyond30days"
    ? "availabilityMode=2"
    : ""
);
rewriteMap.set("apartment", (val) => (val ? "housing_type=1" : ""));
rewriteMap.set("condo", (val) => (val ? "housing_type=2" : ""));
rewriteMap.set("cottageCabin", (val) => (val ? "housing_type=3" : ""));
rewriteMap.set("duplex", (val) => (val ? "housing_type=4" : ""));
rewriteMap.set("flat", (val) => (val ? "housing_type=5" : ""));
rewriteMap.set("house", (val) => (val ? "housing_type=6" : ""));
rewriteMap.set("inLaw", (val) => (val ? "housing_type=7" : ""));
rewriteMap.set("loft", (val) => (val ? "housing_type=8" : ""));
rewriteMap.set("townhouse", (val) => (val ? "housing_type=9" : ""));
rewriteMap.set("manufactured", (val) => (val ? "housing_type=10" : ""));
rewriteMap.set("assistedLiving", (val) => (val ? "housing_type=11" : ""));
rewriteMap.set("land", (val) => (val ? "housing_type=12" : ""));
rewriteMap.set("washerDryerInUnit", (val) => (val ? "laundry=1" : ""));
rewriteMap.set("washerDryerHookups", (val) => (val ? "laundry=2" : ""));
rewriteMap.set("laundryInBuilding", (val) => (val ? "laundry=3" : ""));
rewriteMap.set("laundryOnSite", (val) => (val ? "laundry=4" : ""));
rewriteMap.set("noLaundryOnSite", (val) => (val ? "laundry=5" : ""));
rewriteMap.set("carport", (val) => (val ? "parking=1" : ""));
rewriteMap.set("attachedGarage", (val) => (val ? "parking=2" : ""));
rewriteMap.set("detachedGarage", (val) => (val ? "parking=3" : ""));
rewriteMap.set("offStreetParking", (val) => (val ? "parking=4" : ""));
rewriteMap.set("streetParking", (val) => (val ? "parking=5" : ""));
rewriteMap.set("valetParking", (val) => (val ? "parking=6" : ""));
rewriteMap.set("noParking", (val) => (val ? "parking=7" : ""));
rewriteMap.set("openHouseDate", (val: any) =>
  val ? `sale_date=${val.toISOString().substr(0, 10)}` : ""
);

/** @internal */
export function createQueryString(filter?: object): string {
  if (!filter) {
    return "";
  }
  let queryStringParts: string[] = [];
  for (let [name, value] of Object.entries(filter)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    const rewriter = rewriteMap.get(name);
    if (rewriter) {
      queryStringParts.push(rewriter(value));
    }
  }
  return queryStringParts.join("&");
}

/** @internal */
export function createUrl(
  site: string,
  category: string,
  area?: string,
  filter?: object
) {
  const areaPart = area ? `/${area}` : "";
  let queryString = createQueryString(filter);
  queryString = queryString ? `?${queryString}` : "";
  return `https://${site}.craigslist.org/search${areaPart}/${category}${queryString}`;
}

async function extractValue(
  element: puppeteer.ElementHandle,
  elementName: string,
  propertyName?: string
): Promise<string | null> {
  let e = await element.$(elementName);
  if (!e) {
    console.debug(`Element '${elementName}' not found.`);
    return null;
  }
  if (!propertyName) {
    return await (await e.getProperty("textContent")).jsonValue();
  }

  let p = await e.getProperty(propertyName);
  if (!p) {
    console.debug(`Property '${propertyName}' not found.`);
    return null;
  }

  return await p.jsonValue();
}

async function createGalleryPost(
  galleryCard: puppeteer.ElementHandle
): Promise<GalleryPost> {
  const [url, title, date, price] = await Promise.all([
    extractValue(galleryCard, "a.titlestring", "href"),
    extractValue(galleryCard, "a.titlestring"),
    galleryCard
      .$("span.when")
      .then((e) => (e ? extractValue(e, "span", "title") : null)),
    extractValue(galleryCard, "span.priceinfo"),
  ]);

  return new GalleryPost(title, price, date, url);
}

/** @internal */
export async function* getGalleryPosts(
  site: string,
  category: string,
  area?: string,
  filter?: object
): AsyncIterableIterator<GalleryPost> {
  const url = createUrl(site, category, area, filter);
  console.debug(`Gallery url: ${url}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  let galleryCards = await page.$$("div.gallery-card");
  try {
    for await (let galleryCard of galleryCards) {
      yield await createGalleryPost(galleryCard);
    }
  } finally {
    browser.close();
  }
}

function getPostData($: cheerio.CheerioAPI): any {
  let postDataText = $("script#ld_posting_data").text();
  if (postDataText.length === 0) {
    return {
      title: $("#titletextonly").text(),
    };
  }
  let postData: any = JSON.parse(postDataText);
  return {
    title: postData.name,
    price: postData.offers?.price,
    currency: postData.offers?.priceCurrency,
    city: postData.offers?.availableAtOrFrom?.address?.addressLocality,
    state: postData.offers?.availableAtOrFrom?.address?.addressRegion,
    images: postData.image || [],
  };
}

function getPostDates($: cheerio.CheerioAPI): {
  datePosted?: Date;
  dateUpdated?: Date;
} {
  let datePosted = undefined;
  let dateUpdated = undefined;
  let dates = $("time");
  for (let e of dates) {
    if (e.prev) {
      const prevSiblingText = $(e.prev).text().trim();
      const datetime = new Date(e.attribs["datetime"]);
      if (prevSiblingText === "posted:") {
        datePosted = datetime;
      } else if (prevSiblingText === "updated:") {
        dateUpdated = datetime;
      }
    }
  }
  return {
    ...(datePosted && { datePosted }),
    ...(dateUpdated && { dateUpdated }),
  };
}

function getAttributes($: cheerio.CheerioAPI): Record<string, string> {
  let attrGroups = $("p.attrgroup");
  let attributes = $("span", attrGroups);
  return Object.fromEntries(
    attributes
      .map((_, e) => $(e).text())
      .toArray()
      .filter((s) => s.includes(":"))
      .map((s) => s.split(":").map((s) => s.trim()))
  );
}

function getItemDescription($: cheerio.CheerioAPI): string {
  let postBody = $("#postingbody").clone();
  postBody.find("div.print-qrcode-container").remove();
  return postBody.text()?.trim() || "";
}

/** @internal */
export function createPost(postUrl: string, postText: string): Post {
  const $ = cheerio.load(postText);
  let attributes = getAttributes($);
  let post = <Post>{
    url: postUrl,
    ...getPostData($),
    description: getItemDescription($),
    ...getPostDates($),
    ...(Object.entries(attributes).length > 0 && { attributes: attributes }),
  };

  return post;
}
