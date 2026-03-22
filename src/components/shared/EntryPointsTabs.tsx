import * as React from "react";
import CatalogLink from "@thepalaceproject/web-opds-client/lib/components/CatalogLink";
import { FacetData } from "@thepalaceproject/web-opds-client/lib/interfaces";
export interface EntryPointsTabsProps {
  facets?: FacetData[];
  currentCollectionUrl?: string;
}

const getEntryPointValue = (url?: string): string | null => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.searchParams.get("entrypoint");
  } catch (_error) {
    return null;
  }
};

/** This component renders a library's entrypoints as linked filters. */
export class EntryPointsTabs extends React.Component<
  EntryPointsTabsProps,
  Record<string, never>
> {
  constructor(props) {
    super(props);
  }

  render(): JSX.Element {
    const entryPoints = this.props.facets ? this.props.facets : [];
    if (!entryPoints.length) {
      return null;
    }
    const currentEntryPoint = getEntryPointValue(
      this.props.currentCollectionUrl
    );

    return (
      <div
        className="entry-points-filter-group"
        role="group"
        aria-label="Format filters"
      >
        {entryPoints.map((entryPoint) => {
          const label = entryPoint.label;
          const url = entryPoint.href;
          const facetEntryPoint = getEntryPointValue(url);
          const isActive =
            currentEntryPoint !== null
              ? facetEntryPoint === currentEntryPoint
              : entryPoint.active || label.toLowerCase() === "all";
          const activeClass = isActive ? "entry-points-filter--active" : "";
          return (
            <CatalogLink
              key={label}
              collectionUrl={url}
              bookUrl={null}
              className={`entry-points-filter ${activeClass}`.trim()}
            >
              <span>{label}</span>
            </CatalogLink>
          );
        })}
      </div>
    );
  }
}

export default EntryPointsTabs;
