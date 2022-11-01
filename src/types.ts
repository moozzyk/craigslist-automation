import fetch from "node-fetch";

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

  async getPost(): Promise<string> {
    if (!this.url) {
      throw new Error("Url not set.");
    }

    const resp = await fetch(this.url);
    return resp.text();
  }
}
