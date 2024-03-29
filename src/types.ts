import fetch from "node-fetch";
import * as cheerio from "cheerio";

export type Section = "ForSale" | "Housing";

export interface Post {
  url: string;
  title: string;
  description: string;
  price?: string;
  currency?: string;
  city?: string;
  state?: string;
  datePosted?: Date;
  dateUpdated?: Date;
  images?: string[];
  attributes?: Record<string, string>;
  miscDetails?: string[];

  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  petsAllowed?: Boolean;
  smokingAllowed?: Boolean;
}

export class GalleryPost {
  readonly title: string | null;
  readonly price: string | null;
  readonly datePosted: Date | null;
  readonly url: string | null;
  readonly section: Section;

  constructor(
    title: string | null,
    price: string | null,
    datePosted: string | null,
    url: string | null,
    section: Section
  ) {
    this.title = title;
    this.price = price;
    this.datePosted = this.parseClDateString(datePosted);
    this.url = url;
    this.section = section;
  }

  async getPost(): Promise<Post> {
    if (!this.url) {
      throw new Error("Url not set.");
    }

    const resp = await fetch(this.url);
    // TODO: handle errors
    return createPost(this.url, await resp.text(), this.section);
  }

  private parseClDateString(clDateString: string | null): Date | null {
    if (clDateString === null) {
      return null;
    }
    let matches = clDateString.match(/(\d+) ?(min|hr)/);
    if (matches !== null) {
      let ms = 1000 * 60 * (matches[2] === "min" ? 1 : 60);
      return new Date(Date.now() - parseInt(matches[1]) * ms);
    }

    matches = clDateString.match(/(\d+)\/(\d+)/);
    if (matches !== null) {
      let month = parseInt(matches[1]);
      let day = parseInt(matches[2]);
      let now = new Date();
      let year =
        month > now.getMonth() + 1 ||
        (month == now.getMonth() + 1 && day > now.getDate())
          ? now.getFullYear() - 1
          : now.getFullYear();
      return new Date(year, month - 1, day);
    }

    return null;
  }
}

interface PostData {
  title: string;
  price?: number;
  currency?: string;
  city?: string;
  state?: string;
  images?: string[];
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  petsAllowed?: Boolean;
  smokingAllowed?: Boolean;
}

function getPostData($: cheerio.CheerioAPI, section: Section): PostData {
  let postDataText = $("script#ld_posting_data").text();
  if (!postDataText || postDataText.length === 0) {
    return {
      title: $("#titletextonly").text(),
    };
  }
  switch (section) {
    case "ForSale":
      return getForSalePostData($);
    case "Housing":
      return getHousingPostData($);
    default:
      throw new Error("Unsupported section: " + section);
  }
}

function getForSalePostData($: cheerio.CheerioAPI): PostData {
  let postData: any = JSON.parse($("script#ld_posting_data").text());
  return {
    title: postData.name,
    price: postData.offers?.price,
    currency: postData.offers?.priceCurrency,
    city: postData.offers?.availableAtOrFrom?.address?.addressLocality,
    state: postData.offers?.availableAtOrFrom?.address?.addressRegion,
    images: postData.image || [],
  };
}

function getHousingPostData($: cheerio.CheerioAPI): PostData {
  let postData: any = JSON.parse($("script#ld_posting_data").text());
  let priceStr = $("span.price").text();
  let currency = priceStr[0] === "$" ? "USD" : null;
  let price = Number(priceStr.replace(/[^.\d]/g, ""));
  let images = $("a.thumb")
    .map((_i, x) => $(x).attr("href"))
    .toArray();
  return {
    title: postData.name,
    ...(price && { price }),
    ...(currency && { currency }),
    city: postData.address?.addressLocality,
    state: postData.address?.addressRegion,
    images,
    ...(!isNaN(parseInt(postData.numberOfBedrooms)) && {
      numberOfBedrooms: parseInt(postData.numberOfBedrooms),
    }),
    ...(!isNaN(parseInt(postData.numberOfBathroomsTotal)) && {
      numberOfBathrooms: parseInt(postData.numberOfBathroomsTotal),
    }),
    ...(postData.petsAllowed && { petsAllowed: postData.petsAllowed }),
    ...(postData.smokingAllowed && { smokingAllowed: postData.smokingAllowed }),
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

function getMiscDetails($: cheerio.CheerioAPI): string[] {
  let attrGroups = $("p.attrgroup");
  let attributes = $("span:not(.otherpostings)", attrGroups);
  return attributes
    .map((_, e) => $(e).text())
    .toArray()
    .filter((s) => !s.includes(":"))
    .map((s) => s.trim());
}

function getItemDescription($: cheerio.CheerioAPI): string {
  let postBody = $("#postingbody").clone();
  postBody.find("div.print-qrcode-container").remove();
  return postBody.text()?.trim() || "";
}

/** @internal */
export function createPost(
  postUrl: string,
  postText: string,
  section: Section
): Post {
  const $ = cheerio.load(postText);
  let attributes = getAttributes($);
  let miscDetails = getMiscDetails($);
  let post = <Post>{
    url: postUrl,
    ...getPostData($, section),
    description: getItemDescription($),
    ...getPostDates($),
    ...(Object.entries(attributes).length > 0 && { attributes: attributes }),
    ...(miscDetails.length > 0 && { miscDetails }),
  };

  return post;
}
