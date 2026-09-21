export const BUSINESS = {
  name: "OperatorTemplate",
  shortName: "OperatorTemplate",
  tagline: "Reusable starting point for an operator-led niche marketplace.",
  locale: {
    language: "en-GB",
    // Shown in front of listing_details.price_text when that text has no prefix.
    // Leave empty so price text is displayed as entered. Set to "£" or "$" in a clone.
    currencyPrefix: "",
  },
  homepage: {
    context: {
      heading: "Your trusted niche platform",
      underline: "niche",
      paragraphs: [
        "An independent marketplace for one specialist market. Find listings and contact businesses directly.",
        "This is more than a directory. It is organised supply for people who already know what they are looking for — and for people who need a clearer view of the niche before they get in touch.",
        "Start exploring today.",
      ],
      actions: [
        {
          title: "Browse listings",
          copy: "See what is currently available in this specialist market.",
          href: "/listings",
        },
        {
          title: "Read articles",
          copy: "Guides to help you understand the market before you make contact.",
          href: "/articles",
        },
      ],
    },
    proof: [
      {
        value: "1",
        title: "One operator",
        copy: "Replace BUSINESS.homepage.proof with stats that are true for this platform.",
      },
      {
        value: "1",
        title: "One niche",
        copy: "Built around a single specialist market.",
      },
      {
        value: "1",
        title: "One marketplace",
        copy: "One place focused entirely on this niche.",
      },
      {
        value: "Direct",
        title: "Direct to business",
        copy: "Visitors connect with the business behind each listing.",
      },
    ],
  },
} as const;
