/**
 * @file interfaces.ts — backward-compatibility barrel
 *
 * All types have been moved to focused modules under `src/types/`.
 * This file re-exports everything from those modules so that existing
 * imports (`from "../interfaces"`) continue to work without modification.
 *
 * Prefer importing directly from the specific type module in new code:
 *   import type { BookData } from "../types/book";
 */

export type {
  AdminRole,
  AdminRoleData,
  ConfigurationSettings,
  DashboardCollectionsBarChart,
  FeatureFlags,
  Navigate,
  PathFor,
  TestingFlags,
} from "./types/config";

export type {
  Audience,
  BookData,
  BookLink,
  CategoryData,
  ClassificationData,
  ComplaintsData,
  ContributorData,
  Fiction,
  GenreData,
  GenreTree,
  LanguagesData,
  LinkData,
  MediaData,
  PostComplaint,
  RightsStatusData,
  RolesData,
} from "./types/book";

export type {
  CollectionInventory,
  InventoryByMedium,
  InventoryStatistics,
  LibraryStatistics,
  PatronStatistics,
  StatisticsData,
} from "./types/stats";

export type {
  DiagnosticsCollectionData,
  DiagnosticsData,
  DiagnosticsServiceData,
  TimestampData,
} from "./types/diagnostics";

export type {
  LibrariesData,
  LibraryData,
  LibraryDataWithStatus,
  LibrarySettingField,
  LibraryWithSettingsData,
} from "./types/library";

export type {
  CatalogServiceData,
  CatalogServicesData,
  CollectionData,
  CollectionsData,
  DiscoveryServiceData,
  DiscoveryServicesData,
  LibraryRegistrationData,
  LibraryRegistrationsData,
  MetadataServiceData,
  MetadataServicesData,
  PatronAuthServiceData,
  PatronAuthServicesData,
  ProblemDetail,
  ProtocolData,
  SelfTestsData,
  SelfTestsException,
  SelfTestsResult,
  ServiceData,
  ServicesData,
  ServicesWithRegistrationsData,
  SettingData,
  SpecificSettingType,
} from "./types/services";

export type { IndividualAdminData, IndividualAdminsData } from "./types/admin";

export type { PatronData } from "./types/patron";

export type {
  CustomListData,
  CustomListsData,
  CustomListsSetting,
  LaneData,
  LanesData,
} from "./types/lists";

export type {
  AnnouncementData,
  SitewideAnnouncementsData,
} from "./types/announcements";

export type {
  AdvancedSearchData,
  AdvancedSearchQuery,
  QuickSightEmbeddedURLData,
} from "./types/search";
