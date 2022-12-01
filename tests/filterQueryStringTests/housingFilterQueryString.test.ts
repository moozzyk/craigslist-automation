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

  it("should return correct filter for Housing Type", () => {
    expect(createQueryString({ apartment: true })).toEqual("housing_type=1");
    expect(createQueryString({ apartment: false })).toEqual("");

    expect(createQueryString({ condo: true })).toEqual("housing_type=2");
    expect(createQueryString({ condo: false })).toEqual("");

    expect(createQueryString({ cottageCabin: true })).toEqual("housing_type=3");
    expect(createQueryString({ cottageCabin: false })).toEqual("");

    expect(createQueryString({ duplex: true })).toEqual("housing_type=4");
    expect(createQueryString({ duplex: false })).toEqual("");

    expect(createQueryString({ flat: true })).toEqual("housing_type=5");
    expect(createQueryString({ flat: false })).toEqual("");

    expect(createQueryString({ house: true })).toEqual("housing_type=6");
    expect(createQueryString({ house: false })).toEqual("");

    expect(createQueryString({ inLaw: true })).toEqual("housing_type=7");
    expect(createQueryString({ inLaw: false })).toEqual("");

    expect(createQueryString({ loft: true })).toEqual("housing_type=8");
    expect(createQueryString({ loft: false })).toEqual("");

    expect(createQueryString({ townhouse: true })).toEqual("housing_type=9");
    expect(createQueryString({ townhouse: false })).toEqual("");

    expect(createQueryString({ manufactured: true })).toEqual(
      "housing_type=10"
    );
    expect(createQueryString({ manufactured: false })).toEqual("");

    expect(createQueryString({ assistedLiving: true })).toEqual(
      "housing_type=11"
    );
    expect(createQueryString({ assistedLiving: false })).toEqual("");

    expect(createQueryString({ land: true })).toEqual("housing_type=12");
    expect(createQueryString({ land: false })).toEqual("");

    expect(
      createQueryString({
        apartment: true,
        condo: true,
        cottageCabin: true,
        duplex: true,
        flat: true,
        house: true,
        inLaw: true,
        loft: true,
        townhouse: true,
        manufactured: true,
        assistedLiving: true,
        land: true,
      })
    ).toEqual(
      "housing_type=1&housing_type=2&housing_type=3&housing_type=4&housing_type=5&housing_type=6&housing_type=7&housing_type=8&housing_type=9&housing_type=10&housing_type=11&housing_type=12"
    );
  });

  it("should return correct filter for Laundry", () => {
    expect(createQueryString({ washerDryerInUnit: true })).toEqual("laundry=1");
    expect(createQueryString({ washerDryerInUnit: false })).toEqual("");

    expect(createQueryString({ washerDryerHookups: true })).toEqual(
      "laundry=2"
    );
    expect(createQueryString({ washerDryerHookups: false })).toEqual("");

    expect(createQueryString({ laundryInBuilding: true })).toEqual("laundry=3");
    expect(createQueryString({ laundryInBuilding: false })).toEqual("");

    expect(createQueryString({ laundryOnSite: true })).toEqual("laundry=4");
    expect(createQueryString({ laundryOnSite: false })).toEqual("");

    expect(createQueryString({ noLaundryOnSite: true })).toEqual("laundry=5");
    expect(createQueryString({ noLaundryOnSite: false })).toEqual("");
    expect(
      createQueryString({
        washerDryerInUnit: true,
        washerDryerHookups: true,
        laundryInBuilding: true,
        laundryOnSite: true,
        noLaundryOnSite: true,
      })
    ).toEqual("laundry=1&laundry=2&laundry=3&laundry=4&laundry=5");
  });

  it("should return correct filter for Parking ", () => {
    expect(createQueryString({ carport: true })).toEqual("parking=1");
    expect(createQueryString({ carport: false })).toEqual("");

    expect(createQueryString({ attachedGarage: true })).toEqual("parking=2");
    expect(createQueryString({ attachedGarage: false })).toEqual("");

    expect(createQueryString({ detachedGarage: true })).toEqual("parking=3");
    expect(createQueryString({ detachedGarage: false })).toEqual("");

    expect(createQueryString({ offStreetParking: true })).toEqual("parking=4");
    expect(createQueryString({ offStreetParking: false })).toEqual("");

    expect(createQueryString({ streetParking: true })).toEqual("parking=5");
    expect(createQueryString({ streetParking: false })).toEqual("");

    expect(createQueryString({ valetParking: true })).toEqual("parking=6");
    expect(createQueryString({ valetParking: false })).toEqual("");

    expect(createQueryString({ noParking: true })).toEqual("parking=7");
    expect(createQueryString({ noParking: false })).toEqual("");

    expect(
      createQueryString({
        carport: true,
        attachedGarage: true,
        detachedGarage: true,
        offStreetParking: true,
        streetParking: true,
        valetParking: true,
        noParking: true,
      })
    ).toEqual(
      "parking=1&parking=2&parking=3&parking=4&parking=5&parking=6&parking=7"
    );
  });
  it("should return correct filter for Open House", () => {
    expect(
      createQueryString({ openHouseDate: new Date(1669166628291) })
    ).toEqual("sale_date=2022-11-23");
    expect(createQueryString({ openHouseDate: null })).toEqual("");
    expect(createQueryString({ openHouseDate: undefined })).toEqual("");
  });
});
