import { useEffect, useState } from "react";
import { getProducts, createProduct } from "../services/products";
import { getTaxConfigs } from "../services/tax_config";
import type { Product, TaxConfig } from "../types";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

interface ProductForm {
  name: string;
  short_name: string;
  unit_price: string;
  stock: string;
  tax_config_id: string;
  tax_config: string;
}

const emptyForm: ProductForm = {
  name: "",
  short_name: "",
  unit_price: "",
  stock: "",
  tax_config_id: "",
  tax_config: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
    getTaxConfigs().then(setTaxConfigs);
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.short_name.toLowerCase().includes(search.toLowerCase()) 
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct({
        name: form.name,
        short_name: form.short_name,
        unit_price: Number(form.unit_price),
        stock: Number(form.stock),
        tax_config_id: Number(form.tax_config_id), 
      });
      toast.success("Producto creado correctamente");
      const updated = await getProducts();
      setProducts(updated);
      setForm(emptyForm);
      setShowModal(false);
    } catch {
      toast.error("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof ProductForm,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        required
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Nuevo producto
        </button>
      </div>

      {/* Buscador */}
      <input
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        placeholder="Buscar por nombre o nombre corto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {["#", "Nombre", "Nombre corto", "Precio unitario", "Stock", "IVA", "Año config"].map(
                (h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay productos
                </td>
              </tr>
            )}
            {filtered.map((p, i) => {
              const tax = taxConfigs.find(t => t.id === p.tax_config_id);

              return (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>

                  <td className="px-4 py-3 font-medium">{p.name}</td>

                  <td className="px-4 py-3 text-gray-500">
                    {p.short_name}
                  </td>

                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    ${p.unit_price.toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.stock > 10
                          ? "bg-green-100 text-green-700"
                          : p.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.stock} uds
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {tax ? `${(tax.rate * 100).toFixed(0)}%` : "Sin IVA"}
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {tax?.year ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Nuevo producto</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {field("name", "Nombre completo", "text", "Ej: Arroz blanco 500g")}
              {field("short_name", "Nombre corto", "text", "Ej: Arroz 500g")}
              {field("unit_price", "Precio unitario", "number", "0")}
              {field("stock", "Cantidad en stock", "number", "0")}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impuesto aplicable
                </label>
                <select
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={form.tax_config_id}
                  onChange={(e) => setForm({ ...form, tax_config_id: e.target.value })}
                  required
                >
                  <option value="">Selecciona un impuesto</option>
                  {taxConfigs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {(t.rate * 100).toFixed(0)}% ({t.year})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}