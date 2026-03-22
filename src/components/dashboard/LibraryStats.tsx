import * as React from "react";
import { LibraryStatistics } from "../../interfaces";
import {
  useMayRequestInventoryReports,
  useMaySeeQuickSightLink,
  useMayViewCollectionBarChart,
} from "../../businessRules/roleBasedAccess";
import StatsTotalCirculationsGroup from "./StatsTotalCirculationsGroup";
import StatsPatronGroup from "./StatsPatronGroup";
import StatsInventoryGroup from "./StatsInventoryGroup";
import StatsCollectionsGroup from "./StatsCollectionsGroup";
import StatsUsageReportsGroup from "./StatsUsageReportsGroup";
import { useAppContext } from "../../context/appContext";

export interface LibraryStatsProps {
  stats: LibraryStatistics;
  library?: string;
}

export const inventoryKeyToLabelMap = {
  titles: "Titles",
  availableTitles: "Available Titles",
  openAccessTitles: "Open Access Titles",
  licensedTitles: "Licensed Titles",
  unlimitedLicenseTitles: "Unlimited License Titles",
  meteredLicenseTitles: "Metered License Titles",
  meteredLicensesOwned: "Metered Licenses Owned",
  meteredLicensesAvailable: "Metered Licenses Available",
  selfHostedTitles: "Self-Hosted Titles",
};

export const mediumLabelMap = {
  "http://schema.org/PublicationIssue": "Periodicals",
  "http://bib.schema.org/Audiobook": "Audiobooks",
  "http://schema.org/EBook": "eBooks",
  "http://schema.org/Book": "Books",
};

const preferredInventoryKeyOrder = [
  "titles",
  "availableTitles",
  "licensedTitles",
  "meteredLicenseTitles",
  "unlimitedLicenseTitles",
  "openAccessTitles",
  "meteredLicensesOwned",
  "meteredLicensesAvailable",
  "selfHostedTitles",
];

const titleCaseWord = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const getInventoryStatLabel = (key: string) => {
  if (inventoryKeyToLabelMap[key]) {
    return inventoryKeyToLabelMap[key];
  }

  const label = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(titleCaseWord)
    .join(" ");

  return label || key;
};

export const getOrderedInventoryKeys = (inventory: Record<string, number>) => {
  if (!inventory) {
    return [];
  }

  const presentKeys = Object.keys(inventory).filter(
    (key) => typeof inventory[key] === "number"
  );
  const preferredKeys = preferredInventoryKeyOrder.filter((key) =>
    presentKeys.includes(key)
  );
  const remainingKeys = presentKeys
    .filter((key) => !preferredKeys.includes(key))
    .sort((left, right) => left.localeCompare(right));

  return [...preferredKeys, ...remainingKeys];
};

export const getMediumLabel = (medium: string) => {
  if (mediumLabelMap[medium]) {
    return mediumLabelMap[medium];
  }

  const tail = medium.split("/").pop() || medium;
  return tail.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
};

export const ALL_LIBRARIES_HEADING = "Dashboard for All Authorized Libraries";

/** Displays statistics about patrons, licenses, and collections from the server,
 for a single library or all libraries to which the admin has access. */
const LibraryStats = ({ stats, library }: LibraryStatsProps) => {
  const {
    name: libraryName,
    key: libraryKey,
    collections,
    inventorySummary: inventory,
    inventoryByMedium,
    patronStatistics: patrons,
  } = stats || {};

  const showBarChart = useMayViewCollectionBarChart({ library });
  const inventoryReportRequestEnabled = useMayRequestInventoryReports({
    library,
  });
  const quicksightLinkEnabled = useMaySeeQuickSightLink({ library });
  const quicksightPageUrl = useAppContext().quicksightPagePath;

  let statsLayoutClass: string, dashboardTitle: string, implementation: string;
  if (library) {
    dashboardTitle = `${libraryName || libraryKey} Dashboard`;
    statsLayoutClass = "stats-with-library";
    implementation = "library's implementation";
  } else {
    dashboardTitle = ALL_LIBRARIES_HEADING;
    statsLayoutClass = "stats-without-library";
    implementation = "libraries' implementations";
  }
  return (
    <div className="library-stats">
      <h2 className="config-section-title">{dashboardTitle}</h2>
      <ul className={`stats ${statsLayoutClass}`}>
        <li className="stat-group stat-patrons-group">
          <StatsPatronGroup
            withActiveLoan={patrons.withActiveLoan}
            withActiveLoanOrHold={patrons.withActiveLoanOrHold}
            heading="Current Circulation Activity"
            description="Real-time patron circulation information of the Palace System."
          />
        </li>
        {!!library && (
          <li className="stat-group stat-usage-reports-group">
            <StatsUsageReportsGroup
              library={library}
              inventoryReportsEnabled={inventoryReportRequestEnabled}
              quicksightLinkEnabled={quicksightLinkEnabled}
              usageDataTarget="_blank" // open in new tab or window
              usageDataHref={quicksightPageUrl}
            />
          </li>
        )}
        {!library && (
          <>
            <li className="stat-group stat-circulation-reports-group">
              <StatsTotalCirculationsGroup
                {...patrons}
                heading="Circulation Totals"
              />
            </li>
            <li className="stat-group stat-inventory-reports-group">
              <StatsInventoryGroup
                library={library}
                inventory={inventory}
                inventoryByMedium={inventoryByMedium}
                inventoryReportsEnabled={inventoryReportRequestEnabled}
              />
            </li>
          </>
        )}
        <li className="stat-group stat-collections-group">
          <StatsCollectionsGroup
            heading={"Configured Collections"}
            description={`
              The following collections are configured in your ${implementation} of
              the Palace system and are available to your users through the Palace app.
            `}
            collections={collections}
            showBarChart={showBarChart}
          />
        </li>
      </ul>
    </div>
  );
};

export default LibraryStats;
