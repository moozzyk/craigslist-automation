import { GalleryPost, Post } from "./types";
import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { ElementType } from "domelementtype";
import { Text } from "domhandler";

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
  // Images are not loaded until the post is in the view
  await galleryCard.hover();
  const [url, title, date, imageUrl, price] = await Promise.all([
    extractValue(galleryCard, "a.post-title", "href"),
    extractValue(galleryCard, "span.label"),
    extractValue(galleryCard, "time.post-date", "dateTime"),
    extractValue(galleryCard, "img", "src"),
    extractValue(galleryCard, "span.post-price"),
  ]);

  return new GalleryPost(title, price, date, url);
}

export async function* getAsyncIterator(
  site: string,
  category: string,
  area?: string,
  filter?: object
): AsyncIterableIterator<GalleryPost> {
  const url = createUrl(site, category, area, filter);
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  let galleryCards = await page.$$("div.gallery-card");
  console.log(galleryCards.length);
  try {
    for await (let galleryCard of galleryCards) {
      yield await createGalleryPost(galleryCard);
    }
  } finally {
    browser.close();
  }
}

function getPostData($: cheerio.CheerioAPI): any {
  let postData: any = JSON.parse($("script#ld_posting_data").text());
  return {
    title: postData.name,
    price: postData.offers?.price,
    currency: postData.offers?.priceCurrency,
    city: postData.offers?.availableAtOrFrom?.address?.addressLocality,
    state: postData.offers?.availableAtOrFrom?.address?.addressRegion,
    images: postData.image,
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
    if (e.prev?.type === ElementType.Text) {
      const prevSiblingText = (e.prev as Text).data.trim();
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

export function createPost(postUrl: string, postText: string): Post {
  const $ = cheerio.load(postText);

  let post = <Post>{
    url: postUrl,
    ...getPostData($),
    description: $("#postingbody").html() || "",
    ...getPostDates($),
  };

  return post;
}
