import { createFileRoute, Link } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Learn about Perfect Buy, a South African online store curating fashion, gifts, wellness products and useful everyday finds.";

export const Route = createFileRoute("/about")({
  head: () => pageHead("About Perfect Buy | South African Online Store", description, "/about"),
  component: AboutPage,
});

function AboutPage() {
  return (
    <InformationPage
      eyebrow="About Perfect Buy"
      title="A smaller, smarter way to discover something special."
      intro="Perfect Buy is a South African online store built around a curated selection of useful, playful and statement-making finds."
    >
      <InformationSection title="What we choose">
        <p>
          Our collection brings together standout footwear, relaxed clothing, giftable toys,
          wellness products and useful accessories. We focus on products that are easy to
          understand, enjoyable to browse and suited to everyday South African shoppers.
        </p>
        <p>
          The range changes as new finds arrive and popular products sell through. Clear product
          pages show the available options, price and information supplied for each item.
        </p>
      </InformationSection>

      <InformationSection title="How we make shopping simpler">
        <p>
          Categories keep related products together, detailed product pages provide the information
          needed before checkout, and prices are displayed in South African rand. Our blog adds
          practical shopping guides for some of the products and trends in the store.
        </p>
        <p>
          Ready to browse? Visit{" "}
          <Link to="/shop" className="font-semibold text-primary hover:underline">
            the complete shop
          </Link>{" "}
          or start with{" "}
          <Link
            to="/shop/$category"
            params={{ category: "new-arrivals" }}
            className="font-semibold text-primary hover:underline"
          >
            new arrivals
          </Link>
          .
        </p>
      </InformationSection>
    </InformationPage>
  );
}
