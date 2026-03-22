import * as React from "react";
import EntryPointsTabs from "./EntryPointsTabs";
import { CollectionContainerProps } from "@thepalaceproject/web-opds-client/lib/components/Root";
import Collection from "@thepalaceproject/web-opds-client/lib/components/Collection";
import { FacetData } from "@thepalaceproject/web-opds-client/lib/interfaces";

const cachedFormatFacetsByLibrary: Record<string, FacetData[]> = {};

const getLibraryKey = (url: string): string | null => {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url, window.location.origin);
    const part = parsed.pathname.split("/").filter(Boolean)[0];
    return part || null;
  } catch (_error) {
    const part = url.split("?")[0].split("/").filter(Boolean)[0];
    return part || null;
  }
};

/** Wrapper for `EntryPointsTabs`. This component is passed into the
    OPDSCatalog from web-opds-client. */
export default class EntryPointsContainer extends React.Component<
  CollectionContainerProps,
  Record<string, never>
> {
  private lastFormatFacets: FacetData[] = [];

  render(): JSX.Element {
    const child = React.Children.only(
      this.props.children
    ) as React.ReactElement<any>;
    const collectionCopy = JSON.parse(JSON.stringify(child.props.collection));
    const facetGroups =
      collectionCopy && collectionCopy.facetGroups
        ? collectionCopy.facetGroups
        : [];
    const currentCollectionUrl = collectionCopy?.url || "";
    const libraryKey = getLibraryKey(currentCollectionUrl);
    const newProps = Object.assign({}, child.props);

    let facets = [];
    if (facetGroups && facetGroups.length) {
      let remove;
      facetGroups.forEach((facetGroup, i) => {
        if (facetGroup.label === "Formats") {
          remove = i;
          facets = facetGroup.facets.slice();
        }
      });

      // We do not want to display the formats facets in the left sidebar,
      // so remove it from the facetGroups and update it in the new Collection props.
      if (remove !== undefined) {
        facetGroups.splice(remove, 1);
      }
    }

    // Keep the filter row stable while collections refresh by reusing
    // the last known non-empty Formats facets.
    if (facets.length) {
      this.lastFormatFacets = facets;
      if (libraryKey) {
        cachedFormatFacetsByLibrary[libraryKey] = facets;
      }
    } else if (this.lastFormatFacets.length) {
      facets = this.lastFormatFacets;
    } else if (libraryKey && cachedFormatFacetsByLibrary[libraryKey]?.length) {
      facets = cachedFormatFacetsByLibrary[libraryKey];
    }

    collectionCopy.facetGroups = facetGroups;
    newProps.collection = collectionCopy;
    newProps.showCirculationLinks = false;
    const collection = React.createElement(Collection, newProps);

    return (
      <div className="entry-points-tab-container">
        <EntryPointsTabs
          facets={facets}
          currentCollectionUrl={currentCollectionUrl}
        />
        {collection}
      </div>
    );
  }
}
