import type { Metadata } from "next";
import { HomepageArticleSection } from "@/components/homepage/article-section";
import { HomepageCategorySection } from "@/components/homepage/category-section";
import { HomepageContextSection } from "@/components/homepage/context";
import { HomepageHero } from "@/components/homepage/hero";
import { HomepageListingCta } from "@/components/homepage/listing-cta";
import { HomepageListingSection } from "@/components/homepage/listing-section";
import { MarketplaceProof } from "@/components/homepage/marketplace-proof";
import { Container } from "@/components/ui/container";
import { BUSINESS } from "@/config/business";
import { TERMINOLOGY } from "@/config/terminology";
import {
  HOMEPAGE_ARTICLE_LIMIT,
  HOMEPAGE_CATEGORY_LIMIT,
  HOMEPAGE_FEATURED_LIMIT,
  HOMEPAGE_RECENT_LIMIT,
} from "@/lib/homepage/limits";
import {
  publicProofSectionClass,
  publicSectionClass,
} from "@/lib/public-layout";
import { listLatestPublicArticles } from "@/server/articles/queries";
import { listPublicHomepageCategories } from "@/server/categories/queries";
import {
  listPublicFeaturedListingCards,
  listPublicRecentListingCards,
} from "@/server/listings/queries";

export const metadata: Metadata = {
  title: "Home",
  description: `Browse ${TERMINOLOGY.listing.plural} and ${TERMINOLOGY.category.plural}, or read published Articles.`,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [categories, featured, recent, articles] = await Promise.all([
    listPublicHomepageCategories(HOMEPAGE_CATEGORY_LIMIT),
    listPublicFeaturedListingCards(HOMEPAGE_FEATURED_LIMIT),
    listPublicRecentListingCards(HOMEPAGE_RECENT_LIMIT),
    listLatestPublicArticles(HOMEPAGE_ARTICLE_LIMIT),
  ]);

  return (
    <>
      <HomepageHero />
      {featured.length > 0 ? (
        <Container className={publicSectionClass}>
          <HomepageListingSection
            title={`Featured ${TERMINOLOGY.listing.plural.toLowerCase()}`}
            listings={featured}
          />
        </Container>
      ) : null}
      {categories.length > 0 ? (
        <Container className={publicSectionClass}>
          <HomepageCategorySection categories={categories} />
        </Container>
      ) : null}
      <div className="bg-(--public-muted)">

      <Container className={publicProofSectionClass}>
        <MarketplaceProof />
      </Container>
      </div>
      {recent.length > 0 ? (
        <Container className={publicSectionClass}>
          <HomepageListingSection
            title={`Latest available ${TERMINOLOGY.listing.plural.toLowerCase()}`}
            listings={recent}
            align="center"
            underlineListings
          />
        </Container>
      ) : null}
      <HomepageContextSection context={BUSINESS.homepage.context} />
      {articles.length > 0 ? (
        <Container className={publicSectionClass}>
          <HomepageArticleSection articles={articles} />
        </Container>
      ) : null}
      <HomepageListingCta />
    </>
  );
}
