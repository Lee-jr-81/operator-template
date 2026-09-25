import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BUSINESS } from "@/config/business";
import { HomepageArticleSection } from "@/components/homepage/article-section";
import { ArticleCard } from "@/components/articles/article-card";
import { HomepageCategorySection } from "@/components/homepage/category-section";
import { HomepageContextSection } from "@/components/homepage/context";
import { HomepageHero } from "@/components/homepage/hero";
import { HomepageListingSection } from "@/components/homepage/listing-section";
import { ListingCard } from "@/components/listings/listing-card";
import { MarketplaceProof } from "@/components/homepage/marketplace-proof";
import type { PublicArticleCard } from "@/server/articles/types";
import type { PublicListingCard } from "@/server/listings/types";

const listing: PublicListingCard = {
  id: "listing-1",
  title: "Sample Listing",
  slug: "sample-listing",
  summary: "A short public summary of this listing.",
  category_name: "Sample Category",
  category_slug: "sample-category",
  entity_name: "Sample Entity",
  details: {
    service_format: "Standard",
    price_text: "From 12",
    duration_text: "60 minutes",
  },
  image: null,
  entity_location: "Example Town",
  created_at: "2026-08-26T12:00:00.000Z",
  current_deal: {
    id: "deal-1",
    headline: "Introductory offer",
  },
};

const article: PublicArticleCard = {
  id: "article-1",
  title: "How to choose a provider",
  slug: "how-to-choose-a-provider",
  excerpt: "What to look for before you book.",
  published_at: "2026-08-01T12:00:00.000Z",
  hero_image_url: null,
  hero_focal_x: null,
  hero_focal_y: null,
};

describe("homepage sections", () => {
  it("renders a photography hero with one browse action and no search", () => {
    render(<HomepageHero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      BUSINESS.tagline,
    );
    expect(
      screen.getByRole("link", { name: "Browse Listings" }),
    ).toHaveAttribute("href", "/listings");
    expect(
      screen.queryByRole("link", { name: "Submit a listing" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Browse Categories" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Start exploring")).not.toBeInTheDocument();
    expect(screen.queryByRole("search")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("renders homepage context copy from config", () => {
    render(<HomepageContextSection context={BUSINESS.homepage.context} />);

    expect(
      screen.getByRole("heading", {
        name: BUSINESS.homepage.context.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(BUSINESS.homepage.context.paragraphs[0]),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /browse listings/i }),
    ).toHaveAttribute("href", "/listings");
    expect(
      screen.getByRole("link", { name: /read articles/i }),
    ).toHaveAttribute("href", "/articles");
  });

  it("omits homepage context when the clone leaves it blank", () => {
    expect(
      render(
        <HomepageContextSection
          context={{
            heading: "",
            underline: "",
            paragraphs: [],
            actions: [],
          }}
        />,
      ).container,
    ).toBeEmptyDOMElement();
  });

  it("renders four marketplace proof cards from config", () => {
    render(<MarketplaceProof />);

    expect(screen.getByText("One operator")).toBeInTheDocument();
    expect(screen.getByText("One niche")).toBeInTheDocument();
    expect(screen.getByText("One marketplace")).toBeInTheDocument();
    expect(screen.getByText("Direct to business")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 2 }),
    ).not.toBeInTheDocument();
  });

  it("omits empty Category, Listing, and Article sections", () => {
    expect(
      render(<HomepageCategorySection categories={[]} />).container,
    ).toBeEmptyDOMElement();
    expect(
      render(<HomepageListingSection title="Featured Listings" listings={[]} />)
        .container,
    ).toBeEmptyDOMElement();
    expect(
      render(<HomepageArticleSection articles={[]} />).container,
    ).toBeEmptyDOMElement();
  });

  it("renders Categories, Listings, and Articles when data exists", () => {
    render(
      <HomepageCategorySection
        categories={[
          {
            id: "cat-1",
            name: "Sample Category",
            slug: "sample-category",
            description: "A starter category.",
          },
        ]}
      />,
    );
    expect(
      screen.queryByRole("heading", { name: "Explore categories" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view all categories/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sample Category" })).toHaveAttribute(
      "href",
      "/categories/sample-category",
    );

    render(
      <HomepageListingSection title="Featured listings" listings={[listing]} />,
    );
    expect(
      screen.getByRole("heading", { name: "Featured listings" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view all listings/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sample Listing" }),
    ).toHaveAttribute("href", "/listings/sample-listing");
    expect(screen.getByText("Introductory offer")).toBeInTheDocument();
    expect(screen.getByText("From 12")).toBeInTheDocument();
    expect(screen.getByText("60 minutes")).toBeInTheDocument();
    expect(screen.getByText("Added on 26/08/2026")).toBeInTheDocument();
    expect(screen.getByText("Sample Entity")).toBeInTheDocument();

    render(
      <HomepageListingSection
        title="Latest listings"
        listings={[listing]}
        align="center"
        underlineListings
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Latest listings" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view all listings/i }),
    ).not.toBeInTheDocument();

    render(<HomepageArticleSection articles={[article]} />);
    expect(
      screen.getByRole("heading", { name: "Latest articles" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view all articles/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "How to choose a provider" }),
    ).toHaveAttribute("href", "/articles/how-to-choose-a-provider");
    expect(screen.queryByText("Read article →")).not.toBeInTheDocument();
  });

  it("does not render a Current Deals homepage section", () => {
    render(
      <HomepageListingSection title="Featured listings" listings={[listing]} />,
    );
    expect(
      screen.queryByRole("heading", { name: "Current Deals" }),
    ).not.toBeInTheDocument();
  });

  it("shows every category and offers desktop arrows after five", () => {
    render(
      <HomepageCategorySection
        categories={Array.from({ length: 6 }, (_, index) => ({
          id: `cat-${index}`,
          name: `Category ${index + 1}`,
          slug: `category-${index + 1}`,
          description: "A category.",
        }))}
      />,
    );

    expect(screen.getByRole("link", { name: "Category 6" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Next categories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous categories" }),
    ).toBeDisabled();
  });

  it("does not show arrows when five categories fit one row", () => {
    render(
      <HomepageCategorySection
        categories={Array.from({ length: 5 }, (_, index) => ({
          id: `cat-${index}`,
          name: `Category ${index + 1}`,
          slug: `category-${index + 1}`,
          description: "A category.",
        }))}
      />,
    );

    expect(screen.queryByRole("button", { name: "Next categories" })).not.toBeInTheDocument();
  });

  it("browse listing cards stay one full-width link", () => {
    render(<ListingCard listing={listing} layout="browse" />);

    const card = screen.getByRole("link", { name: "Sample Listing" });
    expect(card).toHaveAttribute("href", "/listings/sample-listing");
    expect(card).toHaveClass("md:flex-row");
    expect(card).toHaveClass("md:h-95");
  });

  it("browse article cards stay one full-width link", () => {
    render(<ArticleCard article={article} layout="browse" />);

    const card = screen.getByRole("link", { name: "How to choose a provider" });
    expect(card).toHaveAttribute("href", "/articles/how-to-choose-a-provider");
    expect(card).toHaveClass("md:flex-row");
    expect(card).toHaveClass("md:h-95");
  });
});
