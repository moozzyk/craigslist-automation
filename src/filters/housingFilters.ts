import { BasicSearchFilter, PriceFilter } from "./commonFilters";

interface BedroomsFilter {
  minBedrooms?: number;
  maxBedrooms?: number;
}

interface BathroomsFilter {
  minBathrooms?: number;
  maxBathrooms?: number;
}

interface SquareFeetFilter {
  minSqFt?: number;
  maxSqFt?: number;
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
}

interface RentPeriodFilter {
  daily?: boolean;
  weekly?: boolean;
  monthly?: boolean;
}

interface AvailabilityFilter {
  rentAvailability?: "within30days" | "beyond30days";
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
