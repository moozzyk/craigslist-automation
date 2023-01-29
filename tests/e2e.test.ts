import { forSaleCarsAndTrucks, housingAptsHousing } from "../src";

describe("forSaleCarAndTrucks", () => {
  it("returns gallery posts and allows showing details", async () => {
    let galleryPostReceived = false;
    for await (let galleryPost of forSaleCarsAndTrucks("seattle", {
      query: "Ford",
      hasImage: true,
      purveyor: "owner",
    })) {
      galleryPostReceived = true;
      console.log(galleryPost);
      expect(galleryPost.title).toBeTruthy();
      expect(galleryPost.price).toBeTruthy();
      expect(galleryPost.url).toBeTruthy();
      expect(galleryPost.datePosted).toBeTruthy();

      const post = await galleryPost.getPost();
      console.log(post);
      expect(post.url).toEqual(galleryPost.url);
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.price).toBeTruthy();
      expect(post.currency).toBeTruthy();
      expect(post.datePosted).toBeTruthy();
      expect(post.attributes).toBeTruthy();
      expect(post.miscDetails).toBeTruthy();
      expect((post.images ?? []).length).toBeGreaterThan(0);
      break;
    }
    expect(galleryPostReceived).toBe(true);
  }, 90000);
});

describe("housingAptsHousing", () => {
  it("returns gallery posts and allows showing details", async () => {
    let galleryPostReceived = false;
    for await (let galleryPost of housingAptsHousing("seattle", {
      minBedrooms: 1,
      maxBathrooms: 3,
      minSqFt: 300,
      hasImage: true,
    })) {
      galleryPostReceived = true;
      console.log(galleryPost);
      expect(galleryPost.title).toBeTruthy();
      expect(galleryPost.price).toBeTruthy();
      expect(galleryPost.url).toBeTruthy();
      expect(galleryPost.datePosted).toBeTruthy();

      const post = await galleryPost.getPost();
      console.log(post);
      expect(post.url).toEqual(galleryPost.url);
      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.price).toBeTruthy();
      expect(post.currency).toBeTruthy();
      expect(post.datePosted).toBeTruthy();
      expect(post.attributes).toBeTruthy();
      expect(post.miscDetails).toBeTruthy();
      expect((post.images ?? []).length).toBeGreaterThan(0);
      expect(post.numberOfBedrooms).toBeGreaterThan(0);
      expect(post.numberOfBathrooms).toBeGreaterThan(0);
      break;
    }
    expect(galleryPostReceived).toBe(true);
  }, 90000);
});
