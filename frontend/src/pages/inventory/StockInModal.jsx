import { useEffect, useState } from "react";
import { X, ArrowDownToLine } from "lucide-react";

import ProductService from "../../services/productService";
import InventoryService from "../../services/inventoryService";

export default function StockInModal({ onClose, onSuccess }) {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    reference: "",
    reason: "",
  });

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      setError("");

      const response =
        await ProductService.getProducts();

      const productData =
        response.data ?? response;

      setProducts(productData);
    } catch (error) {
      console.error("Products error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load products."
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.product_id) {
      setError("Please select a product.");
      return;
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }

    try {
      setSubmitting(true);

      await InventoryService.stockIn({
        product_id: form.product_id,
        quantity: Number(form.quantity),
        reference: form.reference.trim() || null,
        reason: form.reason.trim() || null,
      });

      onSuccess();
    } catch (error) {
      console.error("Stock in error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to add stock."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="inventory-modal-overlay">

      <div className="inventory-modal">

        {/* Header */}
        <div className="inventory-modal-header">

          <div className="inventory-modal-title">

            <div className="inventory-modal-icon">
              <ArrowDownToLine size={19} />
            </div>

            <div>
              <h2>Stock In</h2>
              <p>Add stock to inventory</p>
            </div>

          </div>

          <button
            type="button"
            className="inventory-modal-close"
            onClick={onClose}
            disabled={submitting}
          >
            <X size={19} />
          </button>

        </div>

        {/* Form */}
        <form
          className="inventory-modal-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="inventory-modal-error">
              {error}
            </div>
          )}

          {/* Product */}
          <div className="form-group">

            <label htmlFor="product_id">
              Product <span>*</span>
            </label>

            <select
              id="product_id"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              disabled={
                loadingProducts || submitting
              }
              required
            >
              <option value="">
                {loadingProducts
                  ? "Loading products..."
                  : "Select product"}
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} — {product.sku}
                </option>
              ))}
            </select>

          </div>

          {/* Quantity */}
          <div className="form-group">

            <label htmlFor="quantity">
              Quantity <span>*</span>
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              disabled={submitting}
              required
            />

          </div>

          {/* Reference */}
          <div className="form-group">

            <label htmlFor="reference">
              Reference
            </label>

            <input
              id="reference"
              name="reference"
              type="text"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. PO-001"
              disabled={submitting}
            />

          </div>

          {/* Reason */}
          <div className="form-group">

            <label htmlFor="reason">
              Reason
            </label>

            <textarea
              id="reason"
              name="reason"
              rows="3"
              value={form.reason}
              onChange={handleChange}
              placeholder="e.g. Opening stock, supplier delivery..."
              disabled={submitting}
            />

          </div>

          {/* Actions */}
          <div className="inventory-modal-actions">

            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-submit-button"
              disabled={
                submitting || loadingProducts
              }
            >
              <ArrowDownToLine size={16} />

              {submitting
                ? "Adding Stock..."
                : "Add Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}