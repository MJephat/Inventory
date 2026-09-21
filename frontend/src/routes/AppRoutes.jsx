import {BrowserRouter, Navigate, Route, Routes,} from "react-router-dom";
import Login from "../pages/auth/login";
import ProtectedRoute from "./ProtectedRoutes";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/dashboard/Dashboard";



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