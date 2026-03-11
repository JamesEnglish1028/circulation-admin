/**
 * Library and collection statistics types.
 * These types describe the statistics data returned by the Circulation Manager
 * statistics API endpoints.
 */

export interface InventoryStatistics {
  titles: number;
  availableTitles: number;
  selfHostedTitles: number;
  openAccessTitles: number;
  licensedTitles: number;
  unlimitedLicenseTitles: number;
  meteredLicenseTitles: number;
  meteredLicensesOwned: number;
  meteredLicensesAvailable: number;
}

export interface InventoryByMedium {
  [medium: string]: InventoryStatistics;
}

export interface PatronStatistics {
  total: number;
  withActiveLoan: number;
  withActiveLoanOrHold: number;
  loans: number;
  holds: number;
}

export interface CollectionInventory {
  id: number;
  name: string;
  inventory: InventoryStatistics;
  inventoryByMedium?: InventoryByMedium;
}

export interface LibraryStatistics {
  key: string;
  name: string;
  patronStatistics: PatronStatistics;
  inventorySummary: InventoryStatistics;
  inventoryByMedium?: InventoryByMedium;
  collectionIds: number[];
  collections?: CollectionInventory[];
}

export interface StatisticsData {
  collections: CollectionInventory[];
  collectionIds?: number[];
  collectionIdMap?: {
    [id: number]: CollectionInventory;
  };
  libraries: LibraryStatistics[];
  libraryKeyMap?: {
    [key: string]: LibraryStatistics;
  };
  inventorySummary: InventoryStatistics;
  inventoryByMedium?: InventoryByMedium;
  patronSummary: PatronStatistics;
  summaryStatistics?: LibraryStatistics;
}
