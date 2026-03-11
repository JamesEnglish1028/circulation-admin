/**
 * Custom list and lane types.
 * These types describe the custom list and lane data structures used
 * by the Circulation Manager list and lane management features.
 */

import { CollectionData, SettingData } from "./services";

export interface CustomListData {
  id?: string | number;
  is_owner: boolean;
  is_shared: boolean;
  name: string;
  entry_count?: number;
  collections?: CollectionData[];
}

export interface CustomListsData {
  custom_lists: CustomListData[];
}

export interface CustomListsSetting extends SettingData {
  custom_lists?: CustomListData[];
  menuOptions?: JSX.Element[];
  menuTitle?: string;
}

export interface LaneData {
  id: string | number;
  display_name: string;
  visible: boolean;
  count: number;
  sublanes: LaneData[];
  custom_list_ids: number[];
  inherit_parent_restrictions: boolean;
}

export interface LanesData {
  lanes: LaneData[];
}
