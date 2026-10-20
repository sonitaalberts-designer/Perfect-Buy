import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Perfect Buy charges R110 flat-rate shipping per order within South Africa. Find delivery guidance and contact us for timing or return instructions.";

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
      intro="Shipping costs R110 per order within South Africa, regardless of the items or quantity. The shipping fee is shown separately at checkout and included in your total. Keep your order details for delivery or return enquiries."
    >
      <InformationSection title="Delivery arrangements">
        <p>
          Perfect Buy delivers within South Africa for a flat R110 shipping fee per order. Contact
          us on 071 463 2853 to confirm delivery availability and estimated timing for your address.
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
