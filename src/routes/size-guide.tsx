import { createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Use Perfect Buy's size guidance when comparing women's sneakers, footwear and pajama sets online in South Africa.";

export const Route = createFileRoute("/size-guide")({
  head: () =>
    pageHead("Size Guide for Footwear & Pajamas | Perfect Buy", description, "/size-guide"),
  component: SizeGuidePage,
});

function SizeGuidePage() {
  return (
    <InformationPage
      eyebrow="Fit guidance"
      title="Choose your size with a little more confidence."
      intro="Available sizes are shown on each product page. Because fit can vary by style, compare those options with an item you already wear comfortably."
    >
      <InformationSection title="Footwear">
        <p>
          Use the numbered size shown on the individual sneaker page. Compare it with the size of a
          similar shoe you already own, and consider the shape of the style as well as the number.
          If you are between sizes or need a specific measurement, request product-specific guidance
          before ordering.
        </p>
      </InformationSection>

      <InformationSection title="Pajama sets">
        <p>
          Pajama sizes are shown as XS, S, M, L or XL where available. For the most comfortable fit,
          compare the available option with a relaxed shirt and shorts set you already wear rather
          than relying only on a usual fitted-clothing size.
        </p>
      </InformationSection>

      <InformationSection title="Product-specific fit comes first">
        <p>
          This page is general guidance, not a universal brand chart. Always use the options and
          notes on the exact product page, because measurements and fit can differ between products.
        </p>
      </InformationSection>
    </InformationPage>
  );
}
