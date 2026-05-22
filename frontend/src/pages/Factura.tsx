import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import { createInvoice } from "../services/invoices";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus } from "lucide-react";

export default function POS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const { items, addItem, removeItem, updateQty, clear, subtotal, taxTotal, total } = useCartStore();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.short_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = async () => {
    if (!items.length) return toast.error("El carrito está vacío");
    try {
      const payload = items.map((i) => ({ product_id: i.product.id, quantity: i.quantity }));
      const res = await createInvoice(payload);
      toast.success(`Factura ${res.invoice_number} creada — Total: $${res.total}`);
      clear();
    } catch {
      toast.error("Error al crear la factura");
    }
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Catálogo */}
      <div className="flex-1 space-y-4">
        <input
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => addItem(p)}
              className="bg-white rounded-xl p-4 shadow hover:shadow-md text-left transition border hover:border-indigo-400"
            >
              <p className="font-semibold text-gray-800">{p.name}</p>
              <p className="text-sm text-gray-500">{p.short_name}</p>
              <p className="text-indigo-600 font-bold mt-1">${p.unit_price.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Stock: {p.stock}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="w-80 bg-white rounded-2xl shadow p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">🛒 Carrito</h2>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-8">Sin productos</p>
          )}
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-2 border-b pb-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.short_name}</p>
                <p className="text-xs text-gray-500">${item.product.unit_price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.product.id, Math.max(1, item.quantity - 1))}>
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <button onClick={() => addItem(item.product)}>
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => removeItem(item.product.id)} className="text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="mt-4 space-y-1 text-sm border-t pt-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>${subtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>IVA</span><span>${taxTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total</span><span>${total().toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Facturar
        </button>
      </div>
    </div>
  );
}