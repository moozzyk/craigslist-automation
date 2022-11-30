import { createQueryString } from "../../src/internal";

describe("createQueryStringWithForSaleFilters", () => {
  it("should return correct filter for purveyor", () => {
    expect(createQueryString({ purveyor: "owner" })).toEqual("purveyor=owner");
    expect(createQueryString({ purveyor: "dealer" })).toEqual(
      "purveyor=dealer"
    );
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
