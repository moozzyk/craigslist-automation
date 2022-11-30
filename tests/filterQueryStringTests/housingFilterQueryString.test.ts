import { createQueryString } from "../../src/internal";

describe("createQueryStringWithHousingFilters", () => {
  it("should return correct filter for Bedrooms", () => {
    expect(createQueryString({ minBedrooms: 1 })).toEqual("min_bedrooms=1");
    expect(createQueryString({ maxBedrooms: 3 })).toEqual("max_bedrooms=3");
  });

  it("should return correct filter for Bathrooms", () => {
    expect(createQueryString({ minBathrooms: 2 })).toEqual("min_bathrooms=2");
    expect(createQueryString({ maxBathrooms: 4 })).toEqual("max_bathrooms=4");
  });

  it("should return correct filter for Square Feet", () => {
    expect(createQueryString({ minSqFt: 200 })).toEqual("minSqft=200");
    expect(createQueryString({ maxSqFt: 1250 })).toEqual("maxSqft=1250");
  });

  it("should return correct filter for Additional Housing Criteria", () => {
    expect(createQueryString({ catsOk: true })).toEqual("pets_cat=1");
    expect(createQueryString({ catsOk: false })).toEqual("");

    expect(createQueryString({ dogsOk: true })).toEqual("pets_dog=1");
    expect(createQueryString({ dogsOk: false })).toEqual("");

    expect(createQueryString({ furnished: true })).toEqual("is_furnished=1");
    expect(createQueryString({ furnished: false })).toEqual("");

    expect(createQueryString({ noSmoking: true })).toEqual("no_smoking=1");
    expect(createQueryString({ noSmoking: false })).toEqual("");

    expect(createQueryString({ wheelchairAccessible: true })).toEqual(
      "wheelchaccess=1"
    );
    expect(createQueryString({ wheelchairAccessible: false })).toEqual("");

    expect(createQueryString({ airConditioning: true })).toEqual(
      "airconditioning=1"
    );
    expect(createQueryString({ airConditioning: false })).toEqual("");

    expect(createQueryString({ evCharging: true })).toEqual("ev_charging=1");
    expect(createQueryString({ evCharging: false })).toEqual("");

    expect(createQueryString({ noApplicationFee: true })).toEqual(
      "application_fee=1"
    );
    expect(createQueryString({ noApplicationFee: false })).toEqual("");

    expect(createQueryString({ noBrokerFee: true })).toEqual("broker_fee=1");
    expect(createQueryString({ noBrokerFee: false })).toEqual("");

    expect(
      createQueryString({
        catsOk: true,
        dogsOk: true,
        furnished: true,
        noSmoking: true,
        wheelchairAccessible: true,
        airConditioning: true,
        evCharging: true,
        noApplicationFee: true,
        noBrokerFee: true,
      })
    ).toEqual(
      "pets_cat=1&pets_dog=1&is_furnished=1&no_smoking=1&wheelchaccess=1&airconditioning=1&ev_charging=1&application_fee=1&broker_fee=1"
    );
  });

  it("should return correct filter for Rent Period", () => {
    expect(createQueryString({ daily: true })).toEqual("rent_period=1");
    expect(createQueryString({ daily: false })).toEqual("");

    expect(createQueryString({ weekly: true })).toEqual("rent_period=2");
    expect(createQueryString({ weekly: false })).toEqual("");

    expect(createQueryString({ monthly: true })).toEqual("rent_period=3");
    expect(createQueryString({ monthly: false })).toEqual("");

    expect(
      createQueryString({ daily: true, weekly: true, monthly: true })
    ).toEqual("rent_period=1&rent_period=2&rent_period=3");
  });

  it("should return correct filter for Availability", () => {
    expect(createQueryString({ rentAvailability: "within30days" })).toEqual(
      "availabilityMode=1"
    );
    expect(createQueryString({ rentAvailability: "beyond30days" })).toEqual(
      "availabilityMode=2"
    );
    expect(createQueryString({ rentAvailability: "test" })).toEqual("");
    expect(createQueryString({ rentAvailability: null })).toEqual("");
    expect(createQueryString({ rentAvailability: undefined })).toEqual("");
  });
});
