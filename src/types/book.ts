/**
 * Book, catalog, and classification types.
 * These types describe book data as returned by the Circulation Manager API.
 */

export interface LinkData {
  href: string;
  rel: string;
  role?: string;
  title?: string;
  type?: string;
}

export interface CategoryData {
  label: string;
}

export interface ContributorData {
  name: string;
  uri?: string;
  role?: string;
}

export interface BookData {
  id: string;
  title: string;
  authors?: ContributorData[];
  contributors?: ContributorData[];
  subtitle?: string;
  fiction?: boolean;
  audience?: string;
  targetAgeRange?: string[];
  medium?: string;
  language?: string;
  publisher?: string;
  imprint?: string;
  summary?: string;
  hideLink?: LinkData;
  restoreLink?: LinkData;
  refreshLink?: LinkData;
  suppressPerLibraryLink?: LinkData;
  unsuppressPerLibraryLink?: LinkData;
  visibilityStatus?: "manually-suppressed" | "policy-filtered";
  editLink?: LinkData;
  issuesLink?: LinkData;
  changeCoverLink?: LinkData;
  categories?: string[];
  series?: string;
  seriesPosition?: number;
  issued?: string;
  rating?: number;
  coverUrl?: string;
}

export interface RolesData {
  [key: string]: string;
}

export interface MediaData {
  [key: string]: string;
}

export interface LanguagesData {
  [key: string]: string[];
}

export interface RightsStatusData {
  [key: string]: {
    name: string;
    open_access: boolean;
    allows_derivatives: boolean;
  };
}

export interface BookLink {
  text: string;
  url: (book: BookData) => string;
}

export interface ComplaintsData {
  book: {
    id: string;
  };
  complaints: { [key: string]: number };
}

export interface PostComplaint {
  (url: string, data: { type: string }): Promise<any>;
}

export type Audience = "Children" | "Young Adult" | "Adult" | "Adults Only";

export type Fiction = "Fiction" | "Nonfiction";

export interface GenreTree {
  Fiction: {
    [index: string]: GenreData;
  };
  Nonfiction: {
    [index: string]: GenreData;
  };
}

export interface GenreData {
  name: string;
  parents: string[];
  subgenres: string[];
}

export interface ClassificationData {
  type: string;
  name: string;
  source: string;
  weight: number;
}
