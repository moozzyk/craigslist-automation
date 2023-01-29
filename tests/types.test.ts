import { GalleryPost } from "../src/types";

describe("GelleryPost", () => {
  beforeAll(() =>
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2023-01-28T02:24:00").getTime())
  );

  afterAll(() => jest.useRealTimers());

  it("should parse date correctly", () => {
    expect(
      new GalleryPost(null, null, null, null, "ForSale").datePosted
    ).toBeNull();

    expect(
      new GalleryPost(null, null, "10 mins ago", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-28T02:14:00"));

    expect(
      new GalleryPost(null, null, "204mins ago", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-27T23:00:00"));

    expect(
      new GalleryPost(null, null, "1hr ago", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-28T01:24:00"));

    expect(
      new GalleryPost(null, null, "5hrs ago", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-27T21:24:00"));

    expect(
      new GalleryPost(null, null, "1/27", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-27T00:00"));

    expect(
      new GalleryPost(null, null, "1/28", null, "ForSale").datePosted
    ).toEqual(new Date("2023-01-28T00:00"));

    expect(
      new GalleryPost(null, null, "1/29", null, "ForSale").datePosted
    ).toEqual(new Date("2022-01-29T00:00"));

    expect(
      new GalleryPost(null, null, "12/29", null, "ForSale").datePosted
    ).toEqual(new Date("2022-12-29T00:00"));
  });
});
