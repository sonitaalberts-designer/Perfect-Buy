import type { ReactNode } from "react";
import { StoreFooter } from "@/components/StoreFooter";
import { StoreHeader } from "@/components/StoreHeader";

export function InformationPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main>
        <section className="border-b border-primary/10 bg-blush">
          <div className="shell py-12 md:py-20">
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl tracking-tight md:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-foreground/70 md:text-lg">
              {intro}
            </p>
          </div>
        </section>
        <article className="shell py-12 md:py-16">
          <div className="max-w-3xl space-y-10 text-base leading-7 text-foreground/80 md:text-lg">
            {children}
          </div>
        </article>
      </main>
      <StoreFooter />
    </div>
  );
}

export function InformationSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
