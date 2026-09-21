"use server";

import { requireOperator } from "@/lib/auth/operator";
import { lookupUkPostcode } from "@/lib/location/postcodes-io";
import type { PostcodeLookupResult } from "@/lib/location/postcodes-io";

export async function findLocationFromPostcode(
  postcode: string,
): Promise<PostcodeLookupResult> {
  await requireOperator();
  return lookupUkPostcode(postcode);
}
