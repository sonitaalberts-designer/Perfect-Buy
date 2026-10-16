import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Read the terms covering product information, pricing, availability, checkout and responsible use of Perfect Buy.";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("Terms of Service | Perfect Buy", description, "/terms"),
  component: TermsPage,
});

function TermsPage() {
  return (
    <InformationPage
      eyebrow="Store terms"
      title="Clear expectations for using Perfect Buy."
      intro="These terms explain how product information, pricing and checkout work. Contact Perfect Buy on 071 463 2853 with a question before placing an order."
    >
      <InformationSection title="Products, prices and availability">
        <p>
          Prices are displayed in South African rand. Product availability, images, descriptions and
          options may change as the catalogue is updated. Perfect Buy may correct an obvious pricing
          or product-information error before an order is fulfilled.
        </p>
      </InformationSection>

      <InformationSection title="Checkout and payment">
        <p>
          Customers are responsible for supplying accurate order and contact information. Payment is
          processed through Yoco’s secure checkout. An order is subject to payment confirmation,
          product availability and any delivery arrangements communicated for that order.
        </p>
      </InformationSection>

      <InformationSection title="Product use and information">
        <p>
          Follow the instructions, labels, age guidance and safety information supplied with each
          product. Wellness products are not presented as a substitute for medical advice. If a
          supplement may affect a health condition or medication, obtain advice from an appropriate
          healthcare professional before use.
        </p>
      </InformationSection>

      <InformationSection title="Intellectual property and acceptable use">
        <p>
          The Perfect Buy name, store design, original writing and original promotional material may
          not be copied or republished without permission. Do not misuse the website, interfere with
          checkout or attempt to access systems or information that are not intended for you.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
