import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { StoreFooter } from "@/components/StoreFooter";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () =>
    pageHead(
      "Frequently Asked Questions | Perfect Buy",
      "Answers to common questions about shopping with Perfect Buy, including orders, delivery, returns and payment.",
      "/faq",
    ),
  component: FaqPage,
});

const faqs = [
  {
    q: "What is Perfect Buy?",
    a: "Perfect Buy is a South African online store with women's sneakers, White Timeless pajama sets, gifts, toys, wellness products and everyday accessories. Browse individual product pages for photos, prices and available options.",
  },
  {
    q: "Where do you deliver?",
    a: "We arrange delivery within South Africa. Shipping is R110 per order, regardless of the items or quantity, and is shown separately at checkout. Contact Perfect Buy on 071 463 2853 to confirm delivery availability and estimated timing for your address.",
  },
  {
    q: "How do I know if something is in stock?",
    a: "Product pages show the options currently listed in our catalog. Contact us to confirm availability for the exact item, size and colour before ordering.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All payment is handled through our secure checkout. The available payment methods are shown at checkout before you confirm your order.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "If something isn't right with your order, contact us as soon as possible with your order details and we'll help you sort it out. Items should be unused and in their original condition.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order is on its way, you'll receive a confirmation with the details you need to follow your delivery.",
  },
  {
    q: "How often do you add new products?",
    a: "Browse the New Arrivals collection for the current range, or contact us on WhatsApp if you are looking for a particular style or size.",
  },
  {
    q: "How can I contact you?",
    a: "Call or WhatsApp Perfect Buy on 071 463 2853 for help with products, sizes, availability, delivery or existing orders. Include the product name or order reference in your message.",
  },
];

function FaqPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="border-b border-border">
        <div className="shell flex items-center justify-between py-6">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Perfect <span className="text-primary">Buy</span>
          </Link>
          <Link to="/" className="font-display text-sm font-semibold text-primary hover:underline">
            ← Back to shop
          </Link>
        </div>
      </header>

      <main className="shell max-w-3xl py-14 md:py-20">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Help Centre
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-muted-foreground">
          Quick answers about shopping with Perfect Buy. Can't find what you're looking for? Get in
          touch and we'll help.
        </p>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((item) => (
            <details key={item.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          For questions about your specific order, contact Perfect Buy before making payment or
          returning a parcel.
        </p>
      </main>
      <StoreFooter />
    </div>
  );
}
