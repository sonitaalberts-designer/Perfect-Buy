import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Read how Perfect Buy handles customer information used for shopping, checkout, payment and order fulfilment.";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy Policy | Perfect Buy", description, "/privacy"),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <InformationPage
      eyebrow="Your information"
      title="Privacy at Perfect Buy."
      intro="This pre-launch privacy notice explains the information used to operate the store and complete a customer-requested purchase."
    >
      <InformationSection title="Information used for orders">
        <p>
          Checkout collects the customer name, email address and phone number needed to identify the
          order, communicate about fulfilment and create a secure payment request. Cart contents and
          selected product options are also included with the order.
        </p>
      </InformationSection>

      <InformationSection title="Payments and service providers">
        <p>
          Online payments are completed through Yoco. Perfect Buy does not ask customers to enter
          complete card details directly into the store interface. Service providers may process
          information according to their own privacy and security terms when they provide checkout,
          hosting or delivery services.
        </p>
      </InformationSection>

      <InformationSection title="Storage, security and customer choices">
        <p>
          The shopping cart may be stored in the customer’s browser so it remains available while
          browsing. Personal information should only be kept for as long as needed for the order,
          support, legal or accounting requirements. Customers should never send card PINs,
          passwords or complete banking credentials in a support message.
        </p>
        <p>
          The final business contact and privacy-request channel will be added when the official
          domain is connected.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
