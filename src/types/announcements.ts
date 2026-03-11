/**
 * Announcement types.
 * These types describe sitewide announcement data as returned by the
 * Circulation Manager announcements API endpoints.
 */

import { SettingData } from "./services";

export interface AnnouncementData {
  id: string;
  content: string;
  start: string;
  finish: string;
}

export interface SitewideAnnouncementsData {
  announcements: AnnouncementData[];
  settings: SettingData[];
}
