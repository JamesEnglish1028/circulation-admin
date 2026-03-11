/**
 * Advanced search and QuickSight types.
 * These types describe the data structures used for advanced catalog search
 * queries and embedded QuickSight dashboard URLs.
 */

export interface AdvancedSearchQuery {
  id?: string;
  key?: string;
  op?: string;
  value?: string;
  and?: AdvancedSearchQuery[];
  or?: AdvancedSearchQuery[];
  not?: AdvancedSearchQuery[];
}

export interface AdvancedSearchData {
  query: AdvancedSearchQuery;
}

export interface QuickSightEmbeddedURLData {
  embedUrl: string;
}
