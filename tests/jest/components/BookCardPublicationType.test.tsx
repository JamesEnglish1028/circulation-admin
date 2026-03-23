import * as React from "react";
import { render } from "@testing-library/react";
import Book from "@thepalaceproject/web-opds-client/lib/components/Book";
import { BookData } from "@thepalaceproject/web-opds-client/lib/interfaces";

const updateBook = jest.fn().mockResolvedValue(undefined);

const baseBook: BookData = {
  id: "urn:emagazines:issue:american_scientist:20250619",
  url:
    "http://localhost:6500/Lib1/works/URI/urn:emagazines:issue:american_scientist:20250619",
  title: "July/August 2025",
  language: "en",
  summary: "Issue summary.",
  publisher: "Sigma Xi",
  published: "June 19, 2025",
  imageUrl: "https://cdn.example.com/cover.jpg",
  categories: ["Science"],
  series: {
    name: "American Scientist",
    position: 170,
  },
  raw: {
    $: {
      "schema:additionalType": {
        value: "http://schema.org/PublicationIssue",
      },
    },
  },
};

describe("Book card publicationType badge hook", () => {
  it("renders the publication type as a data attribute for periodical badges", () => {
    const book: BookData = {
      ...baseBook,
      series: {
        ...baseBook.series,
        publicationType: "magazine",
      },
    };

    const { container } = render(<Book book={book} updateBook={updateBook} />);

    const card = container.querySelector(".book");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-publication-type", "magazine");
    expect(card).toHaveAttribute(
      "data-medium",
      "http://schema.org/PublicationIssue"
    );
  });

  it("omits the publication type attribute when no type is available", () => {
    const { container } = render(
      <Book book={baseBook} updateBook={updateBook} />
    );

    const card = container.querySelector(".book");
    expect(card).toBeInTheDocument();
    expect(card).not.toHaveAttribute("data-publication-type");
  });
});
