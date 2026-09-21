export type DealPromotionData = {
  headline: string;
  description: string;
  listingTitle: string;
  entityName: string;
  promoCode: string | null;
  expiresLabel: string;
  listingUrl: string;
};

function joinSections(sections: Array<string | null>) {
  return sections.filter((section): section is string => Boolean(section)).join("\n\n");
}

export function generalPromotionCopy(data: DealPromotionData) {
  const promoLine = data.promoCode
    ? `Use code ${data.promoCode} when booking.`
    : null;

  return joinSections([
    `Special offer: ${data.headline}`,
    `${data.entityName} is currently offering this on ${data.listingTitle}.`,
    data.description,
    promoLine,
    `Offer ends ${data.expiresLabel}.`,
    `View the details:\n${data.listingUrl}`,
  ]);
}

export function shortPromotionCopy(data: DealPromotionData) {
  const promoLine = data.promoCode
    ? `Use code ${data.promoCode}. Ends ${data.expiresLabel}.`
    : `Ends ${data.expiresLabel}.`;

  return joinSections([
    `${data.headline} — ${data.listingTitle} from ${data.entityName}.`,
    promoLine,
    data.listingUrl,
  ]);
}
