export interface User {
  id: number;
  username: string;
  email: string;
}

export interface TaxConfig {
  id: number;
  year: number;
  name: string;
  rate: number;
  description: string;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  short_name: string;
  unit_price: number;
  stock: number;
  tax_config_id:number;
  tax_config: TaxConfig;
}

export interface ProductCreate {
  name: string;
  short_name: string;
  unit_price: number;
  stock: number;
  tax_config_id: number;  // lo que el backend recibe
}

export type ProductUpdate = Partial<ProductCreate>

export interface InvoiceItem {
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  subtotal: number;
  tax_amount: number;
  total: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  subtotal: number;
  tax_amount: number;
  total: number;
  status: "active" | "cancelled";
  created_at: string;
  items: InvoiceItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ReturnMovement {
  invoice_id: number;
  product_id: number;
  quantity_returned: number;
  reason?: string;
}