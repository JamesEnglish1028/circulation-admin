import { entryToBook } from "@thepalaceproject/web-opds-client/lib/OPDSDataAdapter";

type MockEntryOverrides = {
  unparsed?: any;
  series?: { name: string; position?: number } | null;
};

const makeEntry = ({
  unparsed = {},
  series = { name: "American Scientist", position: 170 },
}: MockEntryOverrides = {}) =>
  ({
    id: "urn:emagazines:issue:american_scientist:20250619",
    title: "July/August 2025",
    authors: [],
    contributors: [],
    subtitle: undefined,
    series,
    links: [],
    categories: [],
    summary: { content: "Issue summary." },
    publisher: "Sigma Xi",
    issued: "2025-06-19T00:00:00Z",
    language: "en",
    unparsed,
  } as any);

describe("OPDSDataAdapter publicationType extraction", () => {
  it("normalizes OPDS1 publicationType values to lowercase", () => {
    const entry = makeEntry({
      unparsed: {
        "schema:Series": [
          {
            $: {
              "simplified:publicationType": {
                value: "MAGAZINE",
              },
            },
          },
        ],
      },
    });

    const book = entryToBook(entry, "http://localhost/feed");

    expect(book.series).toEqual({
      name: "American Scientist",
      position: 170,
      publicationType: "magazine",
    });
  });

  it("extracts publicationType from schema:series object form", () => {
    const entry = makeEntry({
      unparsed: {
        "schema:series": {
          $: {
            "simplified:publicationType": "magazine",
          },
        },
      },
    });

    const book = entryToBook(entry, "http://localhost/feed");

    expect(book.series).toEqual({
      name: "American Scientist",
      position: 170,
      publicationType: "magazine",
    });
  });

  it("builds series from raw schema:series when parser series is null", () => {
    const entry = makeEntry({
      series: null,
      unparsed: {
        "schema:series": {
          name: "American Scientist",
          "simplified:publicationType": "magazine",
          position: "224",
        },
      },
    });

    const book = entryToBook(entry, "http://localhost/feed");

    expect(book.series).toEqual({
      name: "American Scientist",
      position: 224,
      publicationType: "magazine",
    });
  });

  it("extracts publicationType from OPDS1 schema:Series simplified:publicationType", () => {
    const entry = makeEntry({
      unparsed: {
        "schema:Series": [
          {
            $: {
              "simplified:publicationType": {
                value: "magazine",
              },
            },
          },
        ],
      },
    });

    const book = entryToBook(entry, "http://localhost/feed");

    expect(book.series).toEqual({
      name: "American Scientist",
      position: 170,
      publicationType: "magazine",
    });
  });

  it("falls back to OPDS2 metadata.belongsTo.magazine when OPDS1 attribute is absent", () => {
    const entry = makeEntry({
      unparsed: {
        metadata: {
          belongsTo: {
            magazine: {
              name: "American Scientist",
              identifier: "urn:issn:american_scientist",
              position: 170,
            },
          },
        },
      },
    });

    const book = entryToBook(entry, "http://localhost/feed");

    expect(book.series).toEqual({
      name: "American Scientist",
      position: 170,
      publicationType: "magazine",
    });
  });
});
