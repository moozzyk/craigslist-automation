import { BasicSearchFilter, PriceFilter } from "./commonFilters";

interface PurveyorFilter {
  purveyor?: "dealer" | "owner";
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
