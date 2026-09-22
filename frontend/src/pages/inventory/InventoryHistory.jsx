import { useEffect, useState } from "react";
import { ArrowLeft, History, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import InventoryService from "../../services/inventoryService";

export default function InventoryHistory() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, [productId]);

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      const response =
        await InventoryService.getProductHistory(productId);

      const historyData =
        response.data ?? response;

      setHistory(historyData);
    } catch (error) {
      console.error("Inventory history error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load inventory history."
      );
    } finally {
      setLoading(false);
    }
  }

  const latestTransaction = history[0];

  return (
    <div className="inventory-history-page">

      {/* Header */}
      <div className="inventory-history-header">

        <div>
          <button
            className="inventory-back-button"
            onClick={() => navigate("/inventory")}
          >
            <ArrowLeft size={16} />
            Back to Inventory
          </button>

          <div className="inventory-history-title">
            <div className="inventory-history-icon">
              <History size={22} />
            </div>

            <div>
              <h1>Stock History</h1>

              <p>
                View all stock movements for this product.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Product summary */}
      {latestTransaction && (
        <div className="inventory-history-summary">

          <div className="history-summary-item">
            <span>Product</span>
            <strong>
              {latestTransaction.product?.name ||
                `Product ${productId}`}
            </strong>
          </div>

          <div className="history-summary-item">
            <span>Current Stock</span>
            <strong>
              {latestTransaction.balance_after}
            </strong>
          </div>

          <div className="history-summary-item">
            <span>Transactions</span>
            <strong>
              {history.length}
            </strong>
          </div>

        </div>
      )}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* History card */}
      <div className="inventory-history-card">

        {loading ? (
          <div className="products-loading">
            Loading stock history...
          </div>
        ) : history.length === 0 ? (
          <div className="products-empty">

            <Package size={40} />

            <h3>No stock history</h3>

            <p>
              No stock transactions have been recorded
              for this product.
            </p>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="inventory-history-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction</th>
                  <th>Quantity</th>
                  <th>Balance After</th>
                  <th>Reference</th>
                  <th>Reason</th>
                  <th>Created By</th>
                </tr>
              </thead>

              <tbody>

                {history.map((transaction) => {

                  const quantity =
                    Number(transaction.quantity ?? 0);

                  const isStockIn =
                    transaction.transaction_type ===
                    "STOCK_IN";

                  const isAdjustment =
                    transaction.transaction_type ===
                    "ADJUSTMENT";

                  return (
                    <tr key={transaction.id}>

                      <td>
                        {transaction.created_at
                          ? new Date(
                              transaction.created_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`history-transaction-badge ${
                            isStockIn
                              ? "history-stock-in"
                              : isAdjustment
                              ? "history-adjustment"
                              : "history-stock-out"
                          }`}
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>

                      <td>
                        <strong
                          className={
                            quantity > 0
                              ? "history-quantity-positive"
                              : quantity < 0
                              ? "history-quantity-negative"
                              : ""
                          }
                        >
                          {quantity > 0
                            ? `+${quantity}`
                            : quantity}
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {transaction.balance_after}
                        </strong>
                      </td>

                      <td>
                        {transaction.reference || "-"}
                      </td>

                      <td>
                        {transaction.reason || "-"}
                      </td>

                      <td>
                        {transaction.user
                          ? transaction.user.full_name ||
                            transaction.user.username
                          : "System"}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}