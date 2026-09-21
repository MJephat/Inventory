import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { LayoutDashboard, Package, Tags, Boxes, Users, ClipboardList, LogOut,} from "lucide-react";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-icon">
            IS
          </div>

          <div>
            <strong>Inventory</strong>
            <span>Management System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-label">MAIN</p>

          <NavLink
            to="/dashboard"
            className="nav-link"
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/products"
            className="nav-link"
          >
            <Package size={19} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/categories"
            className="nav-link"
          >
            <Tags size={19} />
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/inventory"
            className="nav-link"
          >
            <Boxes size={19} />
            <span>Inventory</span>
          </NavLink>


          <p className="nav-label">MANAGEMENT</p>

          <NavLink
            to="/users"
            className="nav-link"
          >
            <Users size={19} />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/audit-logs"
            className="nav-link"
          >
            <ClipboardList size={19} />
            <span>Audit Logs</span>
          </NavLink>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="sidebar-bottom">

          <div className="sidebar-user">

            <div className="user-avatar">
              {user?.full_name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="user-info">

              <strong>
                {user?.full_name}
              </strong>

              <span>
                {user?.roles
                  ?.map((role) => role.name)
                  .join(", ")}
              </span>

            </div>

          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* MAIN AREA */}
      <div className="main-area">

        <header className="topbar">

          <div>
            <h2>Inventory Management</h2>

            <p>
              Manage your products and stock
            </p>
          </div>


          <div className="topbar-user">

            <div className="user-avatar">
              {user?.full_name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>

              <strong>
                {user?.full_name}
              </strong>

              <span>
                {user?.email}
              </span>

            </div>

          </div>

        </header>


        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}