import { useEffect, useState } from "react";
import DashboardService from "../../services/dashboardService";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await DashboardService.getDashboardData();

      setSummary(data.summary);
      setRecentActivity(data.recentActivity);
      setLowStockProducts(data.lowStockProducts);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  }

  function getTransactionClass(type) {
    switch (type) {
      case "STOCK_IN":
        return "transaction-in";

      case "STOCK_OUT":
        return "transaction-out";

      case "ADJUSTMENT":
        return "transaction-adjustment";

      default:
        return "";
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>

        <button onClick={loadDashboard}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Overview of your inventory and stock activity.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={loadDashboard}
        >
          ↻ Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-grid">

        <div className="summary-card">
          <div className="summary-icon products-icon">
            ▦
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {summary?.total_products ?? 0}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon stock-icon">
            ◫
          </div>

          <div>
            <span>Total Stock</span>
            <strong>
              {summary?.total_stock ?? 0}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon warning-icon">
            !
          </div>

          <div>
            <span>Low Stock</span>
            <strong>
              {summary?.low_stock_products ?? 0}
            </strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon danger-icon">
            ×
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>
              {summary?.out_of_stock_products ?? 0}
            </strong>
          </div>
        </div>

      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <div className="dashboard-grid">

        {/* LOW STOCK */}
        <section className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Low Stock Products</h2>
              <p>Products that need restocking</p>
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="empty-state">
              <span>✓</span>
              <p>No low-stock products.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Reorder Level</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id}>

                      <td>
                        <strong>
                          {product.name}
                        </strong>
                      </td>

                      <td>
                        {product.sku}
                      </td>

                      <td>
                        <span className="stock-warning">
                          {product.quantity}
                        </span>
                      </td>

                      <td>
                        {product.reorder_level}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* RECENT ACTIVITY */}
        <section className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest inventory transactions</p>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <span>◷</span>
              <p>No recent activity.</p>
            </div>
          ) : (
            <div className="activity-list">

              {recentActivity.map((activity) => (
                <div
                  className="activity-item"
                  key={activity.transaction_id}
                >

                  <div
                    className={`activity-icon ${getTransactionClass(
                      activity.transaction_type
                    )}`}
                  >
                    {activity.transaction_type === "STOCK_IN"
                      ? "+"
                      : activity.transaction_type === "STOCK_OUT"
                      ? "-"
                      : "↕"}
                  </div>

                  <div className="activity-details">

                    <div className="activity-main">
                      <strong>
                        {activity.product_name}
                      </strong>

                      <span
                        className={`transaction-badge ${getTransactionClass(
                          activity.transaction_type
                        )}`}
                      >
                        {activity.transaction_type.replace(
                          "_",
                          " "
                        )}
                      </span>
                    </div>

                    <p>
                      SKU: {activity.sku}
                    </p>

                    <span className="activity-date">
                      {formatDate(activity.created_at)}
                    </span>

                  </div>

                  <div className="activity-quantity">
                    {activity.transaction_type === "STOCK_OUT"
                      ? "-"
                      : "+"}
                    {activity.quantity}
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}