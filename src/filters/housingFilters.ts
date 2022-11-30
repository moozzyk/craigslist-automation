import { BasicSearchFilter, PriceFilter } from "./commonFilters";

interface BedroomsFilter {
  minBedrooms?: number;
  maxBedrooms?: number;
  // https://seattle.craigslist.org/search/apa?max_bedrooms=3&min_bedrooms=1
}

interface BathroomsFilter {
  minBathrooms?: number;
  maxBathrooms?: number;
  // https://seattle.craigslist.org/search/apa?max_bathrooms=3&min_bathrooms=1#search=1~gallery~0~0
}

interface SquareFeetFilter {
  minSqFt?: number;
  maxSqFt?: number;
  // https://seattle.craigslist.org/search/apa?maxSqft=2000&minSqft=100#search=1~gallery~0~0
}

interface AdditionalHousingCriteriaFilter {
  catsOk?: boolean;
  dogsOk?: boolean;
  furnished?: boolean;
  noSmoking?: boolean;
  wheelchairAccessible?: boolean;
  airConditioning?: boolean;
  evCharging?: boolean;
  noApplicationFee?: boolean;
  noBrokerFee?: boolean;
  // https://seattle.craigslist.org/search/apa?airconditioning=1&application_fee=1&broker_fee=1&ev_charging=1&is_furnished=1&no_smoking=1&pets_cat=1&pets_dog=1&wheelchaccess=1#search=1~gallery~0~0
}

interface RentPeriodFilter {
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
  // https://seattle.craigslist.org/search/apa?rent_period=1&rent_period=2&rent_period=3#search=1~gallery~0~0
}

interface AvailabilityFilter {
  rentAvailability?: "within30days" | "beyond30days";
  // https://seattle.craigslist.org/search/apa?availabilityMode=2#search=1~gallery~0~0
}

interface HousingTypeFilter {
  apartment?: boolean;
  condo?: boolean;
  cottageCabin?: boolean;
  duplex?: boolean;
  flat?: boolean;
  house?: boolean;
  inLaw?: boolean;
  loft?: boolean;
  townhouse?: boolean;
  manufactured?: boolean;
  assistedLiving?: boolean;
  land?: boolean;
  // https://seattle.craigslist.org/search/apa?housing_type=1&housing_type=10&housing_type=11&housing_type=12&housing_type=2&housing_type=3&housing_type=4&housing_type=5&housing_type=6&housing_type=7&housing_type=8&housing_type=9#search=1~gallery~0~0
}

interface LaundryFilter {
  washerDryerInUnit?: boolean;
  washerDryerHookups?: boolean;
  laundryInBuilding?: boolean;
  laundryOnSite?: boolean;
  noLaundryOnSite?: boolean;
  // https://seattle.craigslist.org/search/apa?laundry=1&laundry=2&laundry=3&laundry=4&laundry=5#search=1~gallery~0~0
}

interface ParkingFilter {
  carport?: boolean;
  attachedGarage?: boolean;
  detachedGarage?: boolean;
  offStreetParking?: boolean;
  streetParking?: boolean;
  valetParking?: boolean;
  noParking?: boolean;
  // https://seattle.craigslist.org/search/apa?parking=1&parking=2&parking=3&parking=4&parking=5&parking=6&parking=7#search=1~gallery~0~0
}

interface OpenHouseDateFilter {
  openHouseDate?: Date;
  // https://seattle.craigslist.org/search/apa?sale_date=2022-12-08#search=1~gallery~0~0
}

export interface ApartmentsHousingForRentFilter
  extends BasicSearchFilter,
    PriceFilter,
    BedroomsFilter,
    BathroomsFilter,
    SquareFeetFilter,
    AdditionalHousingCriteriaFilter,
    RentPeriodFilter,
    AvailabilityFilter,
    HousingTypeFilter,
    LaundryFilter,
    ParkingFilter,
    OpenHouseDateFilter {}
