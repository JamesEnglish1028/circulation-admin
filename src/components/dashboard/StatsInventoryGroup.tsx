import React = require("react");
import { Button } from "../ui";
import StatsGroup from "./StatsGroup";
import SingleStatListItem from "./SingleStatListItem";
import { InventoryByMedium, InventoryStatistics } from "../../interfaces";
import InventoryReportRequestModal from "./InventoryReportRequestModal";
import {
  getInventoryStatLabel,
  getMediumLabel,
  getOrderedInventoryKeys,
} from "./LibraryStats";
import { useState } from "react";

type Props = {
  heading?: string;
  description?: string;
  inventory: InventoryStatistics;
  inventoryByMedium?: InventoryByMedium;
  inventoryReportsEnabled: boolean;
  library?: string;
};

const tooltipByInventoryKey = {
  titles: "Total number of books.",
  availableTitles: "Number of books available for lending.",
  meteredLicenseTitles: "Number of books with a metered (counted) license.",
  unlimitedLicenseTitles:
    "Number of books for which there is no limit on the number of loans.",
  openAccessTitles: "Number of books for which there are no limits on use.",
};

const renderInventoryList = (inventory: InventoryStatistics) => {
  return getOrderedInventoryKeys(inventory).map((key) => (
    <SingleStatListItem
      key={key}
      label={getInventoryStatLabel(key)}
      value={inventory[key]}
      tooltip={tooltipByInventoryKey[key]}
    />
  ));
};

const sortMediumEntries = (
  [left]: [string, InventoryStatistics],
  [right]: [string, InventoryStatistics]
) => getMediumLabel(left).localeCompare(getMediumLabel(right));

const StatsInventoryGroup = ({
  heading = "Inventory",
  description = "Real-time item inventory.",
  inventory,
  inventoryByMedium,
  inventoryReportsEnabled,
  library = undefined,
}: Props) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const mediumEntries = Object.entries(inventoryByMedium || {})
    .filter(([, mediumInventory]) => !!mediumInventory)
    .sort(sortMediumEntries);

  return (
    <>
      {inventoryReportsEnabled && library && (
        <InventoryReportRequestModal
          show={showReportForm}
          onHide={() => setShowReportForm(false)}
          library={library}
        />
      )}
      <StatsGroup
        heading={heading}
        description={description}
        headingAdditionalContent={
          inventoryReportsEnabled &&
          library && (
            <Button
              callback={(() => setShowReportForm(true)) as any}
              content="⬇︎"
              title="Request an inventory report"
              style={{
                borderRadius: "50%",
                marginLeft: "10px",
                marginBottom: "0",
                marginTop: "-0.7rem",
              }}
              className="inline small"
              disabled={showReportForm}
            />
          )
        }
      >
        <ul>{renderInventoryList(inventory)}</ul>
        {!!mediumEntries.length && (
          <div className="inventory-by-medium">
            {mediumEntries.map(([medium, mediumInventory]) => (
              <div className="inventory-medium-section" key={medium}>
                <h4 className="inventory-medium-heading">
                  {getMediumLabel(medium)}
                </h4>
                <ul>{renderInventoryList(mediumInventory)}</ul>
              </div>
            ))}
          </div>
        )}
      </StatsGroup>
    </>
  );
};

export default StatsInventoryGroup;
