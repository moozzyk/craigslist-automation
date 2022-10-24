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

interface MakeAndModel {
  makeAndModel?: string;
}

export interface BoatsForSaleFilter
  extends PurveyorFilter,
    BasicSearchFilter,
    PriceFilter,
    MakeAndModel {}

export interface CarsAndTrucksForSaleFilter
  extends PurveyorFilter,
    BasicSearchFilter,
    PriceFilter,
    MakeAndModel {}
