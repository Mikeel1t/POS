import { useState } from "react";
import { registerReturn } from "../services/returns";
import toast from "react-hot-toast";

export default function Returns() {
  const [form, setForm] = useState({
    invoice_id: "",
    product_id: "",
    quantity_returned: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerReturn({
        invoice_id: Number(form.invoice_id),
        product_id: Number(form.product_id),
        quantity_returned: Number(form.quantity_returned),
        reason: form.reason,
      });
      toast.success("Devolución registrada correctamente");
      setForm({ invoice_id: "", product_id: "", quantity_returned: "", reason: "" });
    } catch {
      toast.error("Error al registrar devolución");
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Registrar Devolución</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
        {field("invoice_id", "ID Factura", "number")}
        {field("product_id", "ID Producto", "number")}
        {field("quantity_returned", "Cantidad a devolver", "number")}
        {field("reason", "Motivo (opcional)")}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}