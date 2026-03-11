/**
 * Patron data types.
 * These types describe patron records as returned by the Circulation Manager
 * patron lookup and management API endpoints.
 */

export interface PatronData {
  authorization_expires: string | number;
  authorization_identifier: string | number;
  authorization_identifiers: string[];
  block_reason: string;
  email_address?: string;
  external_type: string;
  fines: string;
  permanent_id: string;
  personal_name?: string;
  username?: string;
}
