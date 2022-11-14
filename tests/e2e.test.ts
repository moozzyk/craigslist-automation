import { forSaleCarAndTrucks } from "../src";

describe("forSaleCarAndTrucks", () =>
  it("returns gallery posts and allows showing details", async () => {
    for await (let galleryPost of forSaleCarAndTrucks("seattle", {
      query: "Ford",
      hasImage: true,
      purveyor: "owner",
    })) {
      expect(galleryPost.title).toBeTruthy();
      expect(galleryPost.price).toBeTruthy();
      expect(galleryPost.url).toBeTruthy();
      expect(galleryPost.datePosted).toBeTruthy();

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
  }));
