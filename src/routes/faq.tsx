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
    a: "Perfect Buy is a South African online store selling a rotating selection of trending products — from women's fashion and summer dresses to squishy toys, home and lifestyle finds. New items land regularly and favourites can sell out fast.",
  },
  {
    q: "Where do you deliver?",
    a: "Perfect Buy is a South African store and delivers within South Africa. Delivery options and costs are shown at checkout before you pay, so there are no surprises.",
  },
  {
    q: "How do I know if something is in stock?",
    a: "If you can add an item to your cart, it's available. Because our catalogue rotates, popular items can sell out — if something you love is out of stock, check back soon or contact us and we'll let you know if it's coming back.",
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
    a: "All the time! Our range changes regularly as trends come and go. Follow the New Arrivals section or join the newsletter to hear about new drops first.",
  },
  {
    q: "How can I contact you?",
    a: "You can reach us through the contact details in the footer of our shop. We're happy to help with orders, product questions or suggestions for what we should stock next.",
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
          Note: this is a brand preview — full delivery, returns and payment policies will be
          confirmed here once the live store is connected.
        </p>
      </main>
      <StoreFooter />
    </div>
  );
}
