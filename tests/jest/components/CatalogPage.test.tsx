import * as React from "react";
import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils/withProviders";
import CatalogPage from "../../../src/components/catalog/CatalogPage";

// OPDSCatalog is a complex external lib — mock it
jest.mock("@thepalaceproject/web-opds-client", () => {
  const MockCatalog = (props: any) => (
    <div
      data-testid="opds-catalog"
      data-collection-url={props.collectionUrl}
      data-book-url={props.bookUrl}
    />
  );
  MockCatalog.displayName = "MockOPDSCatalog";
  return MockCatalog;
});

jest.mock(
  "@thepalaceproject/web-opds-client/lib/components/context/ActionsContext",
  () => ({
    ActionsProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  })
);

const host = "http://example.com";

describe("CatalogPage", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: new URL(host + "/test"),
      writable: true,
    });
  });

  it("renders OPDSCatalog with expanded URLs when library params given", () => {
    const params = {
      collectionUrl: "library/collectionurl",
      bookUrl: "library/bookurl",
      tab: "tab",
    };
    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params} />
    );
    const catalog = getByTestId("opds-catalog");
    expect(catalog).toBeInTheDocument();
    expect(catalog.getAttribute("data-collection-url")).toContain(
      "/library/collectionurl"
    );
  });

  it("normalizes malformed protocol-like collection params", () => {
    const params = {
      collectionUrl: "http:/groups",
      bookUrl: null,
      tab: null,
    };
    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");
    expect(catalog.getAttribute("data-collection-url")).toBe(
      `${document.location.origin}/groups`
    );
  });

  it("normalizes periodical fulfill book URLs to canonical work URLs", () => {
    const params = {
      collectionUrl: "Lib1/collections/featured",
      bookUrl: "Lib1/works/20832/fulfill/17",
      tab: null,
    };

    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");

    expect(catalog.getAttribute("data-book-url")).toBe(
      `${document.location.origin}/Lib1/works/20832`
    );
  });

  it("normalizes bare fulfill-style IDs using collection library context", () => {
    const params = {
      collectionUrl: "Lib1/collections/featured",
      bookUrl: "20832/fulfill/17",
      tab: null,
    };

    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");

    expect(catalog.getAttribute("data-book-url")).toBe(
      `${document.location.origin}/Lib1/works/20832`
    );
  });

  it("normalizes bare URN IDs to works/URI/URN paths", () => {
    const params = {
      collectionUrl: "Lib1/collections/featured",
      bookUrl: "urn:emagazines:issue:american_scientist:20250812",
      tab: null,
    };

    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");

    expect(catalog.getAttribute("data-book-url")).toBe(
      `${document.location.origin}/Lib1/works/URI/urn:emagazines:issue:american_scientist:20250812`
    );
  });

  it("normalizes works/URI/URN fulfill paths to canonical works/URI/URN", () => {
    const params = {
      collectionUrl: "Lib1/collections/featured",
      bookUrl:
        "Lib1/works/URI/urn:emagazines:issue:american_scientist:20250812/fulfill/17",
      tab: null,
    };

    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");

    expect(catalog.getAttribute("data-book-url")).toBe(
      `${document.location.origin}/Lib1/works/URI/urn:emagazines:issue:american_scientist:20250812`
    );
  });

  it("does not duplicate works segment when bookUrl is already canonical", () => {
    const params = {
      collectionUrl: "Lib1/collections/featured",
      bookUrl: "Lib1/works/20831",
      tab: null,
    };

    const { getByTestId } = renderWithProviders(
      <CatalogPage params={params as any} />
    );
    const catalog = getByTestId("opds-catalog");

    expect(catalog.getAttribute("data-book-url")).toBe(
      `${document.location.origin}/Lib1/works/20831`
    );
  });

  it("renders WelcomePage when no collectionUrl and no bookUrl", () => {
    const params = { collectionUrl: null, bookUrl: null, tab: null };
    renderWithProviders(<CatalogPage params={params} />);
    expect(
      screen.getByRole("heading", { name: /welcome/i })
    ).toBeInTheDocument();
  });

  it("does not render a footer (footer removed)", () => {
    const params = {
      collectionUrl: "library/collectionurl",
      bookUrl: "library/bookurl",
      tab: "tab",
    };
    const { container } = renderWithProviders(<CatalogPage params={params} />);
    expect(container.querySelector("footer")).not.toBeInTheDocument();
  });
});
