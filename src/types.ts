export class GalleryPost {
  readonly title: string | null;
  readonly price: string | null;
  readonly datePosted: Date | null;
  readonly url: string | null;
  readonly imageUrl: string | null;

  constructor(
    title: string | null,
    price: string | null,
    datePosted: string | null,
    url: string | null,
    imageUrl: string | null
  ) {
    this.title = title;
    this.price = price;
    this.datePosted = datePosted ? new Date(datePosted) : null;
    this.url = url;
    this.imageUrl = imageUrl;
  }
}
