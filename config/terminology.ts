export const TERMINOLOGY = {
  category: {
    singular: "Category",
    plural: "Categories",
  },
  entity: {
    singular: "Entity",
    plural: "Entities",
  },
  listing: {
    singular: "Listing",
    plural: "Listings",
  },
} as const;

export type TermName = keyof typeof TERMINOLOGY;

export function term(name: TermName, form: "singular" | "plural") {
  return TERMINOLOGY[name][form];
}
