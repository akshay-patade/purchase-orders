import { z } from "zod";

// Define the schema for a single purchase order
export const ExtractPurchaseOrdersApiResponseSchema = z.object({
  product_description: z.string().nullable().optional(),
  item_number: z.string().nullable().optional(),
  vendor_number: z.string().nullable().optional(),
  quantity: z.string().nullable().optional(), // string or null or undefined
  unit_price: z.string().nullable().optional(),
  total: z.string().nullable().optional(),
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
