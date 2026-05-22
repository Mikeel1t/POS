import client from "./api";
import type { TaxConfig } from "../types";

export const getTaxConfigs = async (): Promise<TaxConfig[]> => {
  const { data } = await client.get("/tax-configs");
  return data;
};

export const createTaxConfig = async (payload: Omit<TaxConfig, "id">) => {
  const { data } = await client.post("/tax-configs", payload);
  return data;
};

export const updateTaxConfig = async (id: number, payload: Partial<TaxConfig>) => {
  const { data } = await client.put(`/tax-configs/${id}`, payload);
  return data;
};

export const deleteTaxConfig = async (id: number) => {
  await client.delete(`/tax-configs/${id}`);
};