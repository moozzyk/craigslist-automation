export interface BasicSearchFilter {
  query?: string;
  searchTitlesOnly?: boolean;
  hasImage?: boolean;
  postedToday?: boolean;
  hideDuplicates?: boolean;
  milesFromLocation?: number;
  zipCode?: string;
}

export interface PriceFilter {
  minPrice?: number;
  maxPrice?: number;
}
