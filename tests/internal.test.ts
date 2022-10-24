import { createQueryString } from "../src/internal";

describe("createQueryString", () => {
  it("should return empty query string for undefined filter", () => {
    expect(createQueryString(undefined)).toEqual("");
    expect(createQueryString({})).toEqual("");
  });

  it("should return correct query string for basic search filter", () => {
    expect(createQueryString({ query: "test query" })).toEqual(
      "query=test%20query"
    );
  });
});
