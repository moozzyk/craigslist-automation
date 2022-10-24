import { createQueryString } from "../src/internal";

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

  it("should return correct filter for conveyor", () => {
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
});
