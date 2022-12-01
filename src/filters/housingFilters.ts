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
}

interface LaundryFilter {
  washerDryerInUnit?: boolean;
  washerDryerHookups?: boolean;
  laundryInBuilding?: boolean;
  laundryOnSite?: boolean;
  noLaundryOnSite?: boolean;
}

interface ParkingFilter {
  carport?: boolean;
  attachedGarage?: boolean;
  detachedGarage?: boolean;
  offStreetParking?: boolean;
  streetParking?: boolean;
  valetParking?: boolean;
  noParking?: boolean;
}

interface OpenHouseDateFilter {
  openHouseDate?: Date;
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
