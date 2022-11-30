import {
  BedroomsFilter,
  BathroomsFilter,
  SquareFeetFilter,
  AdditionalHousingCriteriaFilter,
  RentPeriodFilter,
  AvailabilityFilter,
  HousingTypeFilter,
  LaundryFilter,
  ParkingFilter,
  OpenHouseDateFilter,
} from "./filters/housingFilters";

type Purveyor = "dealer" | "owner";

interface PurveyorFilter {
  purveyor?: Purveyor;
}

interface BasicSearchFilter {
  query?: string;
  searchTitlesOnly?: boolean;
  hasImage?: boolean;
  postedToday?: boolean;
  hideDuplicates?: boolean;
  milesFromLocation?: number;
  zipCode?: string;
}

interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
}

interface MakeAndModelFilter {
  makeAndModel?: string;
}

export interface BoatsForSaleFilter
  extends PurveyorFilter,
    BasicSearchFilter,
    PriceFilter,
    MakeAndModelFilter {}

export interface CarsAndTrucksForSaleFilter
  extends PurveyorFilter,
    BasicSearchFilter,
    PriceFilter,
    MakeAndModelFilter {}

export interface ApartmentsHousingForRent
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
