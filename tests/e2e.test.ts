import { forSaleCarsAndTrucks, housingAptsHousing } from "../src";

describe("forSaleCarAndTrucks", () => {
  it("returns gallery posts and allows showing details", async () => {
    for await (let galleryPost of forSaleCarsAndTrucks("seattle", {
      query: "Ford",
      hasImage: true,
      purveyor: "owner",
    })) {
      expect(galleryPost.title).toBeTruthy();
      expect(galleryPost.price).toBeTruthy();
      expect(galleryPost.url).toBeTruthy();
      // TODO: stopped working
      // expect(galleryPost.datePosted).toBeTruthy();

      const post = await galleryPost.getPost();
      expect(post.url).toEqual(galleryPost.url);
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.price).toBeTruthy();
      expect(post.currency).toBeTruthy();
      expect(post.datePosted).toBeTruthy();
      expect((post.images ?? []).length).toBeGreaterThan(0);
      break;
    }
  }, 30000);
});

describe("housingAptsHousing", () => {
  it("returns gallery posts and allows showing details", async () => {
    for await (let galleryPost of housingAptsHousing("seattle", {
      minBedrooms: 1,
      maxBathrooms: 3,
      minSqFt: 300,
      hasImage: true,
    })) {
      console.log(galleryPost);
      expect(galleryPost.title).toBeTruthy();
      expect(galleryPost.price).toBeTruthy();
      expect(galleryPost.url).toBeTruthy();
      // TODO: stopped working
      // expect(galleryPost.datePosted).toBeTruthy();

      const post = await galleryPost.getPost();
      console.log(post);
      expect(post.url).toEqual(galleryPost.url);
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.price).toBeTruthy();
      expect(post.currency).toBeTruthy();
      expect(post.datePosted).toBeTruthy();
      expect((post.images ?? []).length).toBeGreaterThan(0);
      break;
    }
  }, 30000);
});
