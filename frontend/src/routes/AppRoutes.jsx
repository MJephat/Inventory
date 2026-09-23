import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import Login from "../pages/auth/login";
import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Products from "../pages/products/products";
import ProductForm from "../pages/products/ProductForm";
import Inventory from "../pages/inventory/inventory";
import InventoryHistory from "../pages/inventory/InventoryHistory";
import Categories from "../pages/categories/Categories";
import AuditLogs from "../pages/auditLog/AuditLogs";
import Users from "../pages/user/Users";



export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            <Route
                path="/dashboard"
                element={<Dashboard />}
                />
            <Route
                path="/products"
                element={<Products />}
                />
            <Route
                path="/products/new"
                element={<ProductForm />}
                />
            
            <Route
                path="/products/:id/edit"
                element={<ProductForm />}
                />

            <Route
                path="/inventory"
                element={<Inventory />}
                />

            <Route
                path="/inventory/:productId/history"
                element={<InventoryHistory />}
                />

            <Route
                path="/categories"
                element={<Categories />}
              />

            <Route
                path="/audit-logs"
                element={<AuditLogs />}
              />
            
            <Route
              path="/users"
              element={<Users />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}