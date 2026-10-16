import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Find out how to contact Perfect Buy about orders, products, delivery, returns and general shopping questions.";

export const Route = createFileRoute("/contact")({
  head: () => pageHead("Contact Perfect Buy | Order & Product Help", description, "/contact"),
  component: ContactPage,
});

function ContactPage() {
  return (
    <InformationPage
      eyebrow="Customer help"
      title="We’re here to help you shop with confidence."
      intro="Use your order confirmation as the starting point for order-specific help, and keep the product name or order reference ready."
    >
      <InformationSection title="Order enquiries">
        <p>
          For help with an existing order, reply through the contact channel provided with your
          checkout or payment confirmation. Include the customer name, order reference and a short
          description of what you need help with. Never include complete card or banking details.
        </p>
      </InformationSection>

      <InformationSection title="Product questions">
        <p>
          Check the product page first for available sizes, colours, pricing and product-specific
          information. If something important is missing, note the exact product name so the team
          can respond accurately.
        </p>
      </InformationSection>

      <InformationSection title="Before the official launch">
        <p>
          Perfect Buy’s primary support email and final business contact details will be published
          here when the official domain is connected. This pre-launch page is already in place so
          search engines and shoppers have a stable contact URL from day one.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
