import { useEffect, useState } from "react";
import { getInvoices } from "../services/invoices";
import type { Invoice } from "../types";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => { getInvoices().then(setInvoices); }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Facturas</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              {["#", "Número", "Subtotal", "IVA", "Total", "Estado", "Fecha"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-mono">{inv.invoice_number}</td>
                <td className="px-4 py-3">${inv.subtotal.toLocaleString()}</td>
                <td className="px-4 py-3">${inv.tax_amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold">${inv.total.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    inv.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {inv.status === "active" ? "Activa" : "Anulada"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(inv.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}