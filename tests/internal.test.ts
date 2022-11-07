import { createPost, createQueryString, createUrl } from "../src/internal";
import { readFile, opendir } from "node:fs/promises";

describe("createQueryString", () => {
  it("should return empty query string for undefined filter", () => {
    expect(createQueryString(undefined)).toEqual("");
    expect(createQueryString({})).toEqual("");
  });

  it("should return empty query string if filter property not set", () => {
    expect(createQueryString({ query: undefined })).toEqual("");
    expect(createQueryString({ query: null })).toEqual("");
    expect(createQueryString({ query: "" })).toEqual("");
  });

  it("should ignore for unknown properties", () => {
    expect(createQueryString({ xc43: undefined })).toEqual("");
  });

  it("should return correct filter for purveyor", () => {
    expect(createQueryString({ purveyor: "owner" })).toEqual("purveyor=owner");
    expect(createQueryString({ purveyor: "dealer" })).toEqual(
      "purveyor=dealer"
    );
  });

  it("should return correct query string for basic search filter", () => {
    expect(createQueryString({ query: "test query" })).toEqual(
      "query=test%20query"
    );

    expect(createQueryString({ searchTitlesOnly: true })).toEqual("srchType=T");
    expect(createQueryString({ searchTitlesOnly: false })).toEqual("");

    expect(createQueryString({ hasImage: true })).toEqual("hasPic=1");
    expect(createQueryString({ hasImage: false })).toEqual("");

    expect(createQueryString({ postedToday: true })).toEqual("postedToday=1");
    expect(createQueryString({ postedToday: false })).toEqual("");

    expect(createQueryString({ hideDuplicates: true })).toEqual(
      "bundleDuplicates=1"
    );
    expect(createQueryString({ hideDuplicates: false })).toEqual("");

    expect(createQueryString({ milesFromLocation: 35 })).toEqual(
      "searchDistance=35"
    );

    expect(createQueryString({ zipCode: "90210" })).toEqual("postal=90210");
    expect(createQueryString({ zipCode: "abc" })).toEqual("");
    expect(createQueryString({ zipCode: "190210" })).toEqual("");
    expect(createQueryString({ zipCode: "9" })).toEqual("");
  });

  it("should return correct query string for price filter", () => {
    expect(createQueryString({ minPrice: 1000 })).toEqual("min_price=1000");
    expect(createQueryString({ maxPrice: 78 })).toEqual("max_price=78");
  });

  it("should return correct query string for make and model filter", () => {
    expect(createQueryString({ makeAndModel: "k5 blazer" })).toEqual(
      "make_and_model=k5%20blazer"
    );
  });

  it("should return correct query string for complex filters", () => {
    expect(
      createQueryString({
        maxPrice: 5000,
        hasImage: true,
        query: "blazer k5",
        purveyor: "owner",
      })
    ).toEqual("max_price=5000&hasPic=1&query=blazer%20k5&purveyor=owner");
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
  it("returns valid post details", async () => {
    const file = await readFile("tests/post.html");
    const post = createPost("post.html", file.toString());
    expect(post).toEqual({
      url: "post.html",
      title: "K5 Blazer (Square Body)",
      description: `
        <div class="print-information print-qrcode-container">
            <p class="print-qrcode-label">QR Code Link to This Post</p>
            <div class="print-qrcode" data-location="https://seattle.craigslist.org/see/cto/d/lake-stevens-k5-blazer-square-body/7552653376.html"></div>
        </div>
K5 Blazer Wheeler:Complete Overhaul<br>
    `,
      price: "$20,000",
      datePosted: new Date("2022-11-02T03:07:31.000Z"),
      dateUpdated: new Date("2022-11-02T03:07:32.000Z"),
      images: [
        "https://images.craigslist.org/00707_4SxHHnZZYVDz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00V0V_eELSOhgQhphz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00C0C_l5JStdo0QbZz_0CI0t2_600x450.jpg",
        "https://images.craigslist.org/00U0U_2dNP3Sbh0Toz_0CI0t2_600x450.jpg",
      ],
    });
  });
});
