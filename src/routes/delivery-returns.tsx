import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Read Perfect Buy's pre-launch guidance about delivery arrangements, order checks, returns and damaged items in South Africa.";

export const Route = createFileRoute("/delivery-returns")({
  head: () =>
    pageHead("Delivery & Returns | Perfect Buy South Africa", description, "/delivery-returns"),
  component: DeliveryReturnsPage,
});

function DeliveryReturnsPage() {
  return (
    <InformationPage
      eyebrow="Shopping help"
      title="Delivery and returns, explained clearly."
      intro="This page sets out the current pre-launch process. Final delivery fees, service levels and return instructions will be confirmed before the official domain opens for public orders."
    >
      <InformationSection title="Delivery arrangements">
        <p>
          Perfect Buy delivers within South Africa. Where delivery charges or timing depend on the
          destination and parcel, those arrangements are confirmed with the customer using the order
          details supplied at checkout.
        </p>
        <p>
          Customers should provide an accurate name, email address and mobile number so order and
          delivery information can be matched correctly. Delivery estimates begin after payment and
          order availability have been confirmed.
        </p>
      </InformationSection>

      <InformationSection title="Check your order when it arrives">
        <p>
          Inspect the parcel and products as soon as possible. If an item appears incorrect, damaged
          or incomplete, keep the packaging and take clear photographs before using the product.
          Contact Perfect Buy through the order-confirmation channel with the order reference.
        </p>
      </InformationSection>

      <InformationSection title="Return requests">
        <p>
          Return eligibility depends on the product type, its condition, hygiene considerations and
          applicable consumer law. Keep items unused, with their original packaging and included
          accessories, until the return request has been reviewed. Do not send a parcel back before
          receiving return instructions.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
