import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { ElementType } from "domelementtype";
import { Text } from "domhandler";

export interface Post {
  url: string;
  title: string;
  description: string;
  price?: string;
  datePosted: Date;
  dateUpdated?: Date;
  images: string[];
  // TODO: location, attributes
}

export class GalleryPost {
  readonly title: string | null;
  readonly price: string | null;
  readonly datePosted: Date | null;
  readonly url: string | null;

  constructor(
    title: string | null,
    price: string | null,
    datePosted: string | null,
    url: string | null
  ) {
    this.title = title;
    this.price = price;
    this.datePosted = datePosted ? new Date(datePosted) : null;
    this.url = url;
  }

  async getPost(): Promise<Post> {
    if (!this.url) {
      throw new Error("Url not set.");
    }

    const resp = await fetch(this.url);
    // console.log(await resp.text());
    const $ = cheerio.load(await resp.text());

    var datePosted = undefined;
    var dateUpdated = undefined;
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

    let images = $(".thumb")
      .map((_, e) => e.attribs["href"])
      .toArray();

    let post = <Post>{
      url: this.url,
      title: $("#titletextonly").text(),
      description: $("#postingbody").html(),
      price: $("span .price").text(),
      datePosted: datePosted,
      dateUpdated: dateUpdated,
      images: images,
    };
    return post;
  }
}
