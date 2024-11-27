import { z } from "zod";

// Define the schema for a single purchase order
export const ExtractPurchaseOrdersApiResponseSchema = z.object({
  Quantity: z.string().nullable().optional(), // string or null or undefined
  "Unit Price": z.string().nullable().optional(),
  TOTAL: z.string().nullable().optional(),
  "Product Description": z.string().nullable().optional(),
  "Item Number": z.string().nullable().optional(),
  "Vendor Number": z.string().nullable().optional(),
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
