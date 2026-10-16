import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead, supportPhone, supportPhoneInternational, supportWhatsApp } from "@/lib/site";

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
      intro="Contact Perfect Buy for help with sneaker sizes, pajama sets, product availability, delivery and existing orders. Keep the product name or order reference ready so we can help."
    >
      <InformationSection title="Call or WhatsApp Perfect Buy">
        <p>
          Speak to our team on{" "}
          <a
            className="font-semibold text-primary underline"
            href={`tel:${supportPhoneInternational}`}
          >
            {supportPhone}
          </a>{" "}
          or{" "}
          <a className="font-semibold text-primary underline" href={supportWhatsApp}>
            send us a WhatsApp message
          </a>
          .
        </p>
        <p>
          Please include the exact product name, your size or colour question, and your delivery
          area when relevant. For existing orders, include your order reference. Never send card
          details, passwords or banking PINs.
        </p>
      </InformationSection>
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
    </InformationPage>
  );
}
