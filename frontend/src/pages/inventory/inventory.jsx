import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, ClipboardPen,History,Package, RefreshCw,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import InventoryService from "../../services/inventoryService";
import StockInModal from "./StockInModal";
import StockOutModal from "./StockOutModal";
import StockAdjustModal from "./StockAdjustModal";

export default function Inventory() {
  const navigate = useNavigate();

    const [inventory, setInventory] = useState([]);
    const [showStockInModal, setShowStockInModal] = useState(false);
    const [showStockOutModal, setShowStockOutModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const response =
        await InventoryService.getInventory();

      const inventoryData =
        response.data ?? response;

      setInventory(inventoryData);
    } catch (error) {
      console.error("Inventory error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load inventory."
      );
    } finally {
      setLoading(false);
    }
  }

  function getStockStatus(quantity, reorderLevel) {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        className: "inventory-status-out",
      };
    }

    if (quantity <= reorderLevel) {
      return {
        label: "Low Stock",
        className: "inventory-status-low",
      };
    }

    return {
      label: "In Stock",
      className: "inventory-status-good",
    };
  }

  return (
    <div className="inventory-page">

      <div className="inventory-header">

        <div>
          <h1>Inventory</h1>

          <p>
            Monitor and manage your product stock.
          </p>
        </div>

        <div className="inventory-actions">

          <button
            className="inventory-action-button stock-in-button"
           onClick={() => setShowStockInModal(true)}
          >
            <ArrowDownToLine size={17} />
            Stock In
          </button>

          <button
            className="inventory-action-button stock-out-button"
            onClick={() => setShowStockOutModal(true)}
            >
            <ArrowUpFromLine size={17} />
            Stock Out
            </button>

          <button
            className="inventory-action-button adjust-button"
            onClick={() => setShowAdjustModal(true)}
          >
            <ClipboardPen size={17} />
            Adjust
          </button>

        </div>

      </div>

      <div className="inventory-toolbar">

        <div className="inventory-summary">
          <span>
            {inventory.length} inventory records
          </span>
        </div>

        <button
          className="secondary-button"
          onClick={loadInventory}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>

      </div>

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      <div className="inventory-card">

        {loading ? (
          <div className="products-loading">
            Loading inventory...
          </div>
        ) : inventory.length === 0 ? (
          <div className="products-empty">

            <Package size={40} />

            <h3>No inventory found</h3>

            <p>
              There are currently no inventory records.
            </p>

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="inventory-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {inventory.map((item) => {

                  const product = item.product;

                  const quantity =
                    Number(item.quantity ?? 0);

                  const reorderLevel =
                    Number(
                      product?.reorder_level ?? 0
                    );

                  const status =
                    getStockStatus(
                      quantity,
                      reorderLevel
                    );

                  return (
                    <tr key={item.id}>

                      <td>
                        <div className="inventory-product">

                          <div className="inventory-product-icon">
                            <Package size={17} />
                          </div>

                          <div>
                            <strong>
                              {product?.name ||
                                "Unknown Product"}
                            </strong>
                          </div>

                        </div>
                      </td>

                      <td>
                        {product?.sku || "-"}
                      </td>

                      <td>
                        {product?.category?.name || "-"}
                      </td>

                      <td>
                        <strong className="stock-quantity">
                          {quantity}
                        </strong>
                      </td>

                      <td>
                        {reorderLevel}
                      </td>

                      <td>
                        <span
                          className={`inventory-status ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      <td>
                        {item.updated_at
                          ? new Date(
                              item.updated_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>

                        <button
                          className="inventory-history-button"
                          title="View stock history"
                          onClick={() =>
                            navigate(
                              `/inventory/${item.product_id}/history`
                            )
                          }
                        >
                          <History size={15} />
                          History
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

{/* stock in modal */}
    {showStockInModal && (
    <StockInModal
        onClose={() => setShowStockInModal(false)}
        onSuccess={async () => {
        setShowStockInModal(false);
        await loadInventory();
        }}
    />
    )}

  {/* stock out modal */}
    {showStockOutModal && (
      <StockOutModal
        onClose={() => setShowStockOutModal(false)}
        onSuccess={async () => {
          setShowStockOutModal(false);
          await loadInventory();
        }}
      />
      )}
    
  {/* adjust modal */}
    {showAdjustModal && (
    <StockAdjustModal
      onClose={() => setShowAdjustModal(false)}
      onSuccess={async () => {
        setShowAdjustModal(false);
        await loadInventory();
      }}
    />
  )}
    </div>
    
  );
}