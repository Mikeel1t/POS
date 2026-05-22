import client from "./api";
import type { Product, ProductCreate, ProductUpdate } from "../types";

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await client.get("/products");
  return data;
};

/**
 * Crea el producto omitiendo los identificadores o id que estan en la interfaces que se encuentra en types
 * @param product 
 * @returns 
 */
export const createProduct = async (product: ProductCreate) => {
  const { data } = await client.post("/products", product);
  return data as Product;
};

export const updateProduct = async (id: number, product: ProductUpdate) => {
  const { data } = await client.put(`/products/${id}`, product);
  return data as Product;
};

export const deleteProduct = async (id: number) => {
  await client.delete(`/products/${id}`);
};
