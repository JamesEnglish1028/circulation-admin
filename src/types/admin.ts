/**
 * Admin user and role types.
 * These types describe individual admin users, their roles, and the
 * data returned by the individual admins API endpoints.
 */

import { LibraryData } from "./library";
import type { AdminRoleData } from "./config";

export interface IndividualAdminData {
  email: string;
  password?: string;
  roles?: AdminRoleData[];
}

export interface IndividualAdminsData {
  individualAdmins?: IndividualAdminData[];
  allLibraries?: LibraryData[];
}
