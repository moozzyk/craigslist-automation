import { createQueryString } from "../../src/internal";

describe("createQueryStringWithCommonFilters", () => {
  it("should return empty query string if filter property not set", () => {
    expect(createQueryString({ query: undefined })).toEqual("");
    expect(createQueryString({ query: null })).toEqual("");
    expect(createQueryString({ query: "" })).toEqual("");
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
});
