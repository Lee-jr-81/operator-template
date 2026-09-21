import { describe, expect, it } from "vitest";
import {
  entityEnquiryEmail,
  operatorEnquiryEmail,
} from "@/lib/mail/enquiry-templates";

describe("entityEnquiryEmail", () => {
  it("attributes the lead to the platform and includes Listing context", () => {
    const email = entityEnquiryEmail({
      platformName: "Sample Platform",
      listingTitle: "Sample Listing",
      listingUrl: "http://localhost:3000/listings/sample-listing",
      visitorName: "Sam Taylor",
      visitorEmail: "sam@example.com",
      visitorPhone: "0121 555 0101",
      message: "Do you cover DY8 on weekday mornings?",
    });

    expect(email.subject).toBe("New enquiry from Sample Platform");
    expect(email.text).toContain("New enquiry from Sample Platform");
    expect(email.text).toContain(
      "You've received a new customer enquiry through your listing on Sample Platform.",
    );
    expect(email.text).toContain("Sample Listing");
    expect(email.text).toContain("Sam Taylor");
    expect(email.text).toContain("sam@example.com");
    expect(email.text).toContain("0121 555 0101");
    expect(email.text).toContain("Do you cover DY8 on weekday mornings?");
    expect(email.text).toContain(
      "http://localhost:3000/listings/sample-listing",
    );
    expect(email.text).toContain(
      "Please contact the customer directly to continue the enquiry.",
    );
  });

  it("omits the phone line when the visitor did not supply one", () => {
    const email = entityEnquiryEmail({
      platformName: "Sample Platform",
      listingTitle: "Sample Listing",
      listingUrl: null,
      visitorName: "Sam Taylor",
      visitorEmail: "sam@example.com",
      visitorPhone: null,
      message: "Do you cover DY8 on weekday mornings?",
    });

    expect(email.text).toContain("Sam Taylor\nsam@example.com");
    expect(email.text).not.toContain("Phone");
    expect(email.text).not.toContain("View listing");
  });
});

describe("operatorEnquiryEmail", () => {
  it("links to the dashboard Enquiry and does not dump visitor PII", () => {
    const email = operatorEnquiryEmail({
      platformName: "Sample Platform",
      entityName: "Sample Entity",
      listingTitle: "Sample Listing",
      dashboardUrl:
        "http://localhost:3000/dashboard/enquiries/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    });

    expect(email.subject).toBe("New enquiry received — Sample Listing");
    expect(email.text).toContain("Sample Entity");
    expect(email.text).toContain("Sample Listing");
    expect(email.text).toContain(
      "A new enquiry has been received through Sample Platform.",
    );
    expect(email.text).toContain(
      "http://localhost:3000/dashboard/enquiries/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    );
    expect(email.text).not.toContain("sam@example.com");
    expect(email.text).not.toContain("Do you cover");
  });
});
