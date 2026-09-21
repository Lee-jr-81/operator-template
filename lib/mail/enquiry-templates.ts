function joinSections(sections: Array<string | null>) {
  return sections
    .filter((section): section is string => Boolean(section && section.trim()))
    .join("\n\n");
}

export type EntityEnquiryEmailData = {
  platformName: string;
  listingTitle: string;
  listingUrl: string | null;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string | null;
  message: string;
};

export type OperatorEnquiryEmailData = {
  platformName: string;
  entityName: string;
  listingTitle: string;
  dashboardUrl: string | null;
};

export function entityEnquiryEmail(data: EntityEnquiryEmailData) {
  const customerLines = [
    data.visitorName,
    data.visitorEmail,
    data.visitorPhone,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");

  return {
    subject: `New enquiry from ${data.platformName}`,
    text: joinSections([
      `New enquiry from ${data.platformName}`,
      `You've received a new customer enquiry through your listing on ${data.platformName}.`,
      `Listing\n${data.listingTitle}`,
      `Customer\n${customerLines}`,
      `Message\n${data.message}`,
      data.listingUrl ? `View listing\n${data.listingUrl}` : null,
      "Please contact the customer directly to continue the enquiry.",
    ]),
  };
}

export function operatorEnquiryEmail(data: OperatorEnquiryEmailData) {
  return {
    subject: `New enquiry received — ${data.listingTitle}`,
    text: joinSections([
      "New enquiry received",
      `Entity\n${data.entityName}`,
      `Listing\n${data.listingTitle}`,
      `A new enquiry has been received through ${data.platformName}.`,
      data.dashboardUrl ? `View enquiry\n${data.dashboardUrl}` : null,
    ]),
  };
}
