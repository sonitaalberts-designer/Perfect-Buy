import { useCallback, useEffect, useMemo, useState } from "react";
import { getProduct } from "./catalog";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
};

const CART_KEY = "perfect-buy-cart-v1";
const CART_EVENT = "perfect-buy-cart-change";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.flatMap((item): CartItem[] => {
      if (!item || typeof item.productId !== "string") return [];
      const product = getProduct(item.productId);
      if (product?.price === undefined || product.price <= 0) return [];
      if (!Number.isInteger(item.quantity) || item.quantity < 1) return [];
      return [
        {
          ...item,
          name: product.name,
          price: product.price,
          image: product.images[0],
        },
      ];
    });
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

function itemKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return [item.productId, item.size ?? "", item.color ?? ""].join("::");
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    const next = readCart();
    const key = itemKey(item);
    const existing = next.find((entry) => itemKey(entry) === key);
    if (existing) existing.quantity += 1;
    else next.push({ ...item, quantity: 1 });
    writeCart(next);
  }, []);

  const setQuantity = useCallback((index: number, quantity: number) => {
    const next = readCart();
    if (!next[index]) return;
    if (quantity <= 0) next.splice(index, 1);
    else next[index].quantity = Math.min(10, Math.max(1, quantity));
    writeCart(next);
  }, []);

  const clearCart = useCallback(() => writeCart([]), []);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return { items, count, subtotal, addItem, setQuantity, clearCart };
}
