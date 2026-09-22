import { useEffect, useState } from "react";
import { X, ClipboardPen } from "lucide-react";

import ProductService from "../../services/productService";
import InventoryService from "../../services/inventoryService";

export default function StockAdjustModal({ onClose, onSuccess }) {
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

    if (
      form.quantity === "" ||
      Number(form.quantity) === 0
    ) {
      setError("Adjustment quantity cannot be zero.");
      return;
    }

    if (!Number.isInteger(Number(form.quantity))) {
      setError("Adjustment quantity must be a whole number.");
      return;
    }

    try {
      setSubmitting(true);

      await InventoryService.adjustStock({
        product_id: form.product_id,
        quantity: Number(form.quantity),
        reference: form.reference.trim() || null,
        reason: form.reason.trim() || null,
      });

      onSuccess();
    } catch (error) {
      console.error("Stock adjustment error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to adjust stock."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="inventory-modal-overlay">

      <div className="inventory-modal">

        <div className="inventory-modal-header">

          <div className="inventory-modal-title">

            <div className="inventory-modal-icon adjust-modal-icon">
              <ClipboardPen size={19} />
            </div>

            <div>
              <h2>Adjust Stock</h2>
              <p>
                Increase or decrease the current stock
              </p>
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

        <form
          className="inventory-modal-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="inventory-modal-error">
              {error}
            </div>
          )}

          <div className="form-group">

            <label htmlFor="adjust-product">
              Product <span>*</span>
            </label>

            <select
              id="adjust-product"
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

          <div className="form-group">

            <label htmlFor="adjust-quantity">
              Adjustment Quantity <span>*</span>
            </label>

            <input
              id="adjust-quantity"
              name="quantity"
              type="number"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 10 or -5"
              disabled={submitting}
              required
            />

            <small className="form-help">
              Positive number increases stock.
              Negative number decreases stock.
            </small>

          </div>

          <div className="form-group">

            <label htmlFor="adjust-reference">
              Reference
            </label>

            <input
              id="adjust-reference"
              name="reference"
              type="text"
              value={form.reference}
              onChange={handleChange}
              placeholder="e.g. ADJ-001"
              disabled={submitting}
            />

          </div>

          <div className="form-group">

            <label htmlFor="adjust-reason">
              Reason
            </label>

            <textarea
              id="adjust-reason"
              name="reason"
              rows="3"
              value={form.reason}
              onChange={handleChange}
              placeholder="e.g. Physical stock count correction"
              disabled={submitting}
            />

          </div>

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
              className="modal-submit-button adjust-submit-button"
              disabled={
                submitting || loadingProducts
              }
            >
              <ClipboardPen size={16} />

              {submitting
                ? "Adjusting Stock..."
                : "Adjust Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}