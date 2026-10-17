import { Link, createFileRoute } from "@tanstack/react-router";
import { InformationPage, InformationSection } from "@/components/InformationPage";
import { pageHead } from "@/lib/site";

const description =
  "Perfect Buy sneaker sizes use SA/UK sizing. Check listed sneaker and pajama sizes, compare fit and ask for product-specific guidance before ordering.";

export const Route = createFileRoute("/size-guide")({
  head: () =>
    pageHead("SA/UK Sneaker & Pajama Size Guide | Perfect Buy", description, "/size-guide"),
  component: SizeGuidePage,
});

function SizeGuidePage() {
  return (
    <InformationPage
      eyebrow="Fit guidance"
      title="Choose your size with a little more confidence."
      intro="Available sizes are shown on each product page. Because fit can vary by style, compare those options with an item you already wear comfortably."
    >
      <InformationSection title="Sneakers: SA/UK sizes">
        <p>
          All Perfect Buy sneaker sizes use SA/UK sizing. EU and US size numbers use different
          systems, so check the SA/UK label inside a pair you already wear comfortably rather than
          choosing the same number from another system. Compare a similar shoe style as well as the
          number. If you are between sizes or need a specific measurement, request product-specific
          guidance before ordering.
        </p>
      </InformationSection>

      <InformationSection title="Pajama sets">
        <p>
          Pajama sizes are shown as XS, S, M, L or XL where available. For the most comfortable fit,
          compare the available option with a relaxed shirt and shorts set you already wear rather
          than relying only on a usual fitted-clothing size.
        </p>
      </InformationSection>

      <InformationSection title="Between sizes or unsure?">
        <p>
          Tell us the exact product name and the size system on your current shoes. If you need a
          measurement, ask before ordering; we do not use one conversion chart for every style.
        </p>
        <p>
          <Link to="/contact" className="font-semibold text-primary hover:underline">
            Ask Perfect Buy for sizing help
          </Link>
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
