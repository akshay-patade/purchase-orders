import { z } from "zod";

// Define the schema for a single purchase order
export const ExtractPurchaseOrdersApiResponseSchema = z.object({
  "QUANTITY COL": z.string().nullable().optional(), // string or null or undefined
  PRICE: z.string().nullable().optional(),
  "UNIT COL": z.string().nullable().optional(),
  TOTAL: z.string().nullable().optional(),
  "REQUEST ITEM": z.string().nullable().optional(),
});

// Define the schema for the array of purchase orders
export const ExtractPurchaseOrdersApiResponseArraySchema = z.array(
  ExtractPurchaseOrdersApiResponseSchema
);

// TypeScript type for a single purchase order
export type ExtractPurchaseOrders = z.infer<
  typeof ExtractPurchaseOrdersApiResponseSchema
>;

// TypeScript type for the array of purchase orders
export type ExtractPurchaseOrdersApiResponse = z.infer<
  typeof ExtractPurchaseOrdersApiResponseArraySchema
>;
