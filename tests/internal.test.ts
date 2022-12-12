import { createQueryString, createUrl } from "../src/internal";
import { createPost } from "../src/types";
import { readFile } from "node:fs/promises";

describe("createQueryString", () => {
  it("should return empty query string for undefined filter", () => {
    expect(createQueryString(undefined)).toEqual("");
    expect(createQueryString({})).toEqual("");
  });

  it("should ignore for unknown properties", () => {
    expect(createQueryString({ xc43: undefined })).toEqual("");
  });
});

describe("createUrl", () => {
  it("should create correct url", () => {
    expect(createUrl("seattle", "cta")).toEqual(
      "https://seattle.craigslist.org/search/cta"
    );
    expect(createUrl("seattle", "cta", undefined)).toEqual(
      "https://seattle.craigslist.org/search/cta"
    );
    expect(createUrl("seattle", "cta", "")).toEqual(
      "https://seattle.craigslist.org/search/cta"
    );
    expect(createUrl("seattle", "cta", "est")).toEqual(
      "https://seattle.craigslist.org/search/est/cta"
    );
    expect(createUrl("seattle", "cta", "est", { purveyor: "dealer" })).toEqual(
      "https://seattle.craigslist.org/search/est/cta?purveyor=dealer"
    );
    expect(
      createUrl("seattle", "cta", undefined, { purveyor: "dealer" })
    ).toEqual("https://seattle.craigslist.org/search/cta?purveyor=dealer");
  });
});

describe("createPost", () => {
  it("returns valid post for full post", async () => {
    const file = await readFile("tests/forSalePost.html");
    const post = createPost("forSalePost.html", file.toString(), "ForSale");
    expect(post).toEqual({
      url: "forSalePost.html",
      title: "K5 Blazer (Square Body)",
      description:
        "K5 Blazer Wheeler:Complete Overhaul\n\nRebuilt 350/350/205\n14bolt full float\nDana 44",
      price: "20000.00",
      currency: "USD",
      city: "Lake Stevens",
      state: "WA",
      datePosted: new Date("2022-11-02T03:07:31.000Z"),
      dateUpdated: new Date("2022-11-02T03:07:32.000Z"),
      images: [
        "https://images.craigslist.org/00707_4SxHHnZZYVDz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00V0V_eELSOhgQhphz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00C0C_l5JStdo0QbZz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00U0U_2dNP3Sbh0Toz_0CI0t2_600x450.jpg",
      ],
      attributes: {
        condition: "good",
        cylinders: "8 cylinders",
        drive: "4wd",
        fuel: "gas",
        odometer: "123456",
        "paint color": "black",
        "title status": "clean",
        transmission: "automatic",
      },
    });
  });

  it("returns valid post for bare post", async () => {
    const file = await readFile("tests/barepost.html");
    const post = createPost("barepost.html", file.toString(), "ForSale");
    expect(post).toEqual({
      url: "barepost.html",
      title: "K5 Blazer",
      datePosted: new Date("2022-10-21T13:58:19.000Z"),
      dateUpdated: new Date("2022-11-05T23:27:05.000Z"),
      description: "Looking for a frame for a 75-78 K5 Blazer",
    });
  });
});
