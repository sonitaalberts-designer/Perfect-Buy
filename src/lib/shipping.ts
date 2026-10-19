// One shipping fee per order, regardless of the products or quantities.
export const SHIPPING_FEE_CENTS = 10_000;
export const SHIPPING_FEE = SHIPPING_FEE_CENTS / 100;

// Merchant-selected booking values shared by all products; not individual product measurements.
export const PARCEL_PRESET = {
  class: "V4-L",
  name: "Large",
  lengthCm: 60,
  widthCm: 41,
  heightCm: 41,
  weightKg: 15,
} as const;
