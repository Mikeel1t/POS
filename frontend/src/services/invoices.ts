import client from "./api";
import type { Invoice } from "../types";

/**
 * Crea la factura
 * @param items 
 * @returns 
 */
export const createInvoice = async (items: { product_id: number; quantity: number }[]) => {
  const { data } = await client.post("/invoices", { items });
  return data as { invoice_id: number; invoice_number: string; total: number };
};

/**
 * Obtiene todas las facturas para listar
 * @returns 
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  const { data } = await client.get("/invoices");
  return data;
};

/**
 * Obtiene la factura con el identificador
 * @param id 
 * @returns 
 */
export const getInvoice = async (id: number): Promise<Invoice> => {
  const { data } = await client.get(`/invoices/${id}`);
  return data;
};