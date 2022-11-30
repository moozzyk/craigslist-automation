import { BasicSearchFilter, PriceFilter } from "./commonFilters";

type Purveyor = "dealer" | "owner";

interface PurveyorFilter {
  purveyor?: Purveyor;
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
