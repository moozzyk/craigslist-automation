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
    this.datePosted = datePosted ? new Date(datePosted) : null;
    this.url = url;
    this.section = section;
  }

  async getPost(): Promise<Post> {
    if (!this.url) {
      throw new Error("Url not set.");
    }

    const resp = await fetch(this.url);
    // TODO: handle errors
    return createPost(this.url, await resp.text());
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
