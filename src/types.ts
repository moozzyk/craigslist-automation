import fetch from "node-fetch";
import { createPost } from "./internal";

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
    // TODO: handle errors
    return createPost(this.url, await resp.text());
  }
}
