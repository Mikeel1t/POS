import { NavLink } from "react-router-dom";
import { ShoppingCart, Package, FileText, RotateCcw, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/pos",       label: "Punto de Venta", icon: ShoppingCart },
  { to: "/products",  label: "Productos",       icon: Package },
  { to: "/invoices",  label: "Facturas",         icon: FileText },
  { to: "/returns",   label: "Devoluciones",     icon: RotateCcw },
  { to: "/tax-config", label: "Impuestos",        icon: Settings },  
];

export default function Sidebar() {
  const { logout } = useAuthStore();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">🏪 POS System</div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-indigo-600" : "hover:bg-gray-700"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-8 py-4 hover:bg-gray-700 border-t border-gray-700"
      >
        <LogOut size={18} /> Cerrar sesión
      </button>
    </aside>
  );
}