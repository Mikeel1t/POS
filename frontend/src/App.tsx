import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Sidebar from "./components/layout/Sidebar";
import Login from "./pages/Login";
import POS from "./pages/Factura";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import Returns from "./pages/Returns";
import TaxConfigPage from "./pages/TaxConfig";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <p>Hello Word!!!</p>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/pos"      element={<Layout><POS /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/returns"  element={<Layout><Returns /></Layout>} />
          <Route path="/tax-config" element={<Layout><TaxConfigPage /></Layout>} />
        </Route>
        <Route path="*" element={<Navigate to="/pos" replace />} />
      </Routes>
    </BrowserRouter>
  );
}