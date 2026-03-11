/**
 * Diagnostics and timestamped service run types.
 * These types describe the data returned by the Circulation Manager
 * diagnostics/troubleshooting API endpoints.
 */

export interface TimestampData {
  achievements?: string;
  collection_name: string;
  duration: string;
  exception?: string;
  id: string;
  service: string;
  start: string;
}

export interface DiagnosticsCollectionData {
  [key: string]: TimestampData[];
}

export interface DiagnosticsServiceData {
  [key: string]: DiagnosticsCollectionData[];
}

export interface DiagnosticsData {
  monitor?: DiagnosticsServiceData[];
  script?: DiagnosticsServiceData[];
  coverage_provider?: DiagnosticsServiceData[];
  other?: DiagnosticsServiceData[];
}
