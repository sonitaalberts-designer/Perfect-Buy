import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { z } from "zod";

import { StoreHeader } from "@/components/StoreHeader";
import { products } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

const checkoutInput = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(7).max(30),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(120),
        quantity: z.number().int().min(1).max(10),
        size: z.string().max(40).optional(),
        color: z.string().max(40).optional(),
      }),
    )
    .min(1)
    .max(50),
});

type YocoCheckoutResponse = {
  id?: string;
  redirectUrl?: string;
  message?: string;
};

const createYocoCheckout = createServerFn({ method: "POST" })
  .validator(checkoutInput)
  .handler(async ({ data }) => {
    const secretKey = process.env["YOCO_SECRET_KEY"];
    if (!secretKey)
      throw new Error("Secure checkout is still being configured. Please try again soon.");

    const verifiedItems = data.items.map((line) => {
      const product = products.find((entry) => entry.id === line.productId);
      if (!product?.price) throw new Error("One of the selected products is unavailable.");
      if (line.size && product.sizes && !product.sizes.includes(line.size)) {
        throw new Error("One of the selected sizes is unavailable.");
      }
      if (line.color && product.colors && !product.colors.includes(line.color)) {
        throw new Error("One of the selected colours is unavailable.");
      }
      return { product, ...line };
    });

    const amount = verifiedItems.reduce(
      (sum, line) => sum + line.product.price! * 100 * line.quantity,
      0,
    );
    const orderReference = `PB-${Date.now().toString(36).toUpperCase()}`;
    const requestUrl = getRequestUrl();
    const configuredOrigin = process.env["PUBLIC_SITE_URL"]?.replace(/\/$/, "");
    const origin = configuredOrigin || requestUrl.origin;
    const itemSummary = verifiedItems
      .map((line) => `${line.quantity}x ${line.product.name}`)
      .join(", ")
      .slice(0, 500);

    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": orderReference,
      },
      body: JSON.stringify({
        amount,
        currency: "ZAR",
        successUrl: `${origin}/checkout?payment=success&order=${encodeURIComponent(orderReference)}`,
        cancelUrl: `${origin}/checkout?payment=cancelled`,
        failureUrl: `${origin}/checkout?payment=failed`,
        metadata: {
          orderReference,
          customerName: data.customer.name,
          customerEmail: data.customer.email,
          customerPhone: data.customer.phone,
          items: itemSummary,
        },
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as YocoCheckoutResponse;
    if (!response.ok || !payload.redirectUrl) {
      console.error("Yoco checkout creation failed", response.status, payload.message);
      throw new Error("We couldn't start secure payment. Please try again.");
    }

    return { redirectUrl: payload.redirectUrl, checkoutId: payload.id, orderReference };
  });

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): { payment?: string; order?: string } => ({
    ...(typeof search["payment"] === "string" ? { payment: search["payment"] } : {}),
    ...(typeof search["order"] === "string" ? { order: search["order"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Secure Checkout — Perfect Buy" },
      { name: "description", content: "Review your Perfect Buy cart and pay securely with Yoco." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

function money(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function CheckoutPage() {
  const { items, subtotal, setQuantity, clearCart } = useCart();
  const { payment, order } = Route.useSearch();
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (payment === "success") clearCart();
  }, [payment, clearCart]);

  async function pay() {
    setError("");
    setLoading(true);
    try {
      const result = await createYocoCheckout({
        data: {
          customer,
          items: items.map(({ productId, quantity, size, color }) => ({
            productId,
            quantity,
            size,
            color,
          })),
        },
      });
      window.location.assign(result.redirectUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We couldn't start secure payment.");
      setLoading(false);
    }
  }

  if (payment === "success") {
    return (
      <div className="min-h-screen bg-background">
        <StoreHeader />
        <main className="shell py-16">
          <div className="mx-auto max-w-xl rounded-xl border border-border bg-white p-8 text-center shadow-soft">
            <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl">Thank you for your order</h1>
            <p className="mt-3 text-muted-foreground">
              Your payment was submitted securely through Yoco.
            </p>
            {order && <p className="mt-2 text-sm font-semibold">Order reference: {order}</p>}
            <Link to="/shop" className="btn-base btn-pink mt-7">
              Continue shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="shell py-10 md:py-14">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Your cart</h1>
        {payment === "cancelled" && (
          <p className="mt-4 rounded-md bg-blush p-4">
            Payment was cancelled. Your cart is still here.
          </p>
        )}
        {payment === "failed" && (
          <p className="mt-4 rounded-md bg-red-50 p-4 text-red-800">
            Payment was not completed. Please try again.
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-10 rounded-xl border border-border bg-white p-10 text-center shadow-soft">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-2xl">Your cart is empty</h2>
            <Link to="/shop" className="btn-base btn-pink mt-6">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="space-y-4" aria-label="Cart items">
              {items.map((item, index) => (
                <article
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 rounded-xl border border-border bg-white p-4 shadow-soft"
                >
                  {item.image && (
                    <img src={item.image} alt="" className="h-24 w-24 rounded-md object-contain" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold">{item.name}</h2>
                    {(item.size || item.color) && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.size ? `Size: ${item.size}` : ""}
                        {item.size && item.color ? " · " : ""}
                        {item.color ? `Colour: ${item.color}` : ""}
                      </p>
                    )}
                    <p className="mt-2 font-semibold text-primary">
                      {money(item.price * item.quantity)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(index, item.quantity - 1)}
                        className="rounded-md border border-input p-2"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(index, item.quantity + 1)}
                        className="rounded-md border border-input p-2"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => setQuantity(index, 0)}
                        className="ml-auto rounded-md p-2 text-muted-foreground hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="h-fit rounded-xl border border-border bg-white p-6 shadow-soft">
              <h2 className="text-2xl">Checkout details</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-medium">
                  Full name
                  <input
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="mt-1 h-11 w-full rounded-md border border-input px-3"
                    autoComplete="name"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input
                    required
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="mt-1 h-11 w-full rounded-md border border-input px-3"
                    autoComplete="email"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Phone number
                  <input
                    required
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="mt-1 h-11 w-full rounded-md border border-input px-3"
                    autoComplete="tel"
                  />
                </label>
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{money(subtotal)}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Delivery arrangements are confirmed separately. You will now continue to Yoco's
                  secure payment page.
                </p>
              </div>
              {error && (
                <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </p>
              )}
              <button
                type="button"
                disabled={loading || !customer.name || !customer.email || !customer.phone}
                onClick={pay}
                className="btn-base btn-pink mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />{" "}
                {loading ? "Opening secure payment…" : `Pay ${money(subtotal)} securely`}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Payments are securely processed by Yoco.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
