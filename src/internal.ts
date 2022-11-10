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

export async function* getAsyncIterator(
  site: string,
  category: string,
  area?: string,
  filter?: object
): AsyncIterableIterator<GalleryPost> {
  const url = createUrl(site, category, area, filter);
  console.debug(url);
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
