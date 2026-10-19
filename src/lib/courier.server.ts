import type { CollectionLocker } from "./lockers";

type PickupPoint = {
  provider_id: number;
  pickup_point_id: string;
  pickup_point_provider: string;
  type: string;
  name: string;
  status: string;
  is_hidden: boolean;
  available_compartment_sizes: string[];
  address: { entered_address: string; city: string };
  trading_hours?: string;
};

let cached: { expires: number; lockers: CollectionLocker[] } | undefined;

export async function getCollectionLockers(): Promise<CollectionLocker[]> {
  if (cached && cached.expires > Date.now()) return cached.lockers;
  const key = process.env["COURIER_GUY_API_KEY"];
  if (!key) throw new Error("Locker selection is temporarily unavailable. Please try again soon.");
  const response = await fetch("https://api.portal.thecourierguy.co.za/pickup-points", {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("We couldn't load collection lockers. Please try again.");
  const data = await response.json();
  if (!Array.isArray(data.pickup_points)) throw new Error("Collection lockers are unavailable.");
  const lockers: CollectionLocker[] = data.pickup_points
    .filter(
      (p: PickupPoint) =>
        p.type === "locker" &&
        p.pickup_point_provider === "tcg-locker" &&
        p.status === "online" &&
        !p.is_hidden &&
        p.available_compartment_sizes?.includes("V4-L"),
    )
    .map((p: PickupPoint) => ({
      id: `${p.provider_id}:${p.pickup_point_id}`,
      name: p.name,
      address: p.address.entered_address,
      city: p.address.city,
      hours: p.trading_hours || "Check the locker's opening hours before collecting.",
    }));
  cached = { expires: Date.now() + 300000, lockers };
  return lockers;
}
