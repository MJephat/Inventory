import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductService from "../../services/productService";
import CategoryService from "../../services/categoryService";

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    category_id: "",
    cost_price: "",
    selling_price: "",
    reorder_level: 0,
    status: "ACTIVE",
  });

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(isEditMode);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    loadCategories();

    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  async function loadCategories() {
    try {
      setCategoriesLoading(true);

      const data = await CategoryService.getCategories();

      setCategories(data.data ?? data);
    } catch (error) {
      console.error("Categories error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load categories."
      );
    } finally {
      setCategoriesLoading(false);
    }
  }

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const data = await ProductService.getProduct(id);

      const product = data.data ?? data;

      setFormData({
        sku: product.sku ?? "",
        name: product.name ?? "",
        description: product.description ?? "",
        category_id: product.category_id ?? "",
        cost_price: product.cost_price ?? "",
        selling_price: product.selling_price ?? "",
        reorder_level: product.reorder_level ?? 0,
        status: product.status ?? "ACTIVE",
      });
    } catch (error) {
      console.error("Product error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validateForm() {
    const errors = {};

    if (!formData.sku.trim()) {
      errors.sku = "SKU is required.";
    }

    if (!formData.name.trim()) {
      errors.name = "Product name is required.";
    }

    if (!formData.category_id) {
      errors.category_id = "Category is required.";
    }

    if (
      formData.cost_price === "" ||
      Number(formData.cost_price) < 0
    ) {
      errors.cost_price = "Enter a valid cost price.";
    }

    if (
      formData.selling_price === "" ||
      Number(formData.selling_price) < 0
    ) {
      errors.selling_price = "Enter a valid selling price.";
    }

    if (
      formData.reorder_level === "" ||
      Number(formData.reorder_level) < 0
    ) {
      errors.reorder_level = "Enter a valid reorder level.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }

    const payload = {
      sku: formData.sku.trim(),
      name: formData.name.trim(),
      description:
        formData.description.trim() || null,
      category_id: formData.category_id,
      cost_price: Number(formData.cost_price),
      selling_price: Number(formData.selling_price),
      reorder_level: Number(formData.reorder_level),
      status: formData.status,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await ProductService.updateProduct(id, payload);
      } else {
        await ProductService.createProduct(payload);
      }

      navigate("/products");
    } catch (error) {
      console.error("Save product error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="products-loading">
        Loading product...
      </div>
    );
  }

  return (
    <div className="product-form-page">

      <div className="product-form-header">

        <button
          className="back-button"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft size={17} />
          Back to Products
        </button>

        <h1>
          {isEditMode
            ? "Edit Product"
            : "Add Product"}
        </h1>

        <p>
          {isEditMode
            ? "Update the product information."
            : "Add a new product to your inventory."}
        </p>

      </div>

      {error && (
        <div className="product-form-error">
          {error}
        </div>
      )}

      <form
        className="product-form-card"
        onSubmit={handleSubmit}
      >

        <div className="form-section">

          <div className="form-section-header">
            <h2>Product Information</h2>
            <p>Basic information about the product.</p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                SKU <span>*</span>
              </label>

              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. LAP-001"
              />

              {fieldErrors.sku && (
                <span className="field-error">
                  {fieldErrors.sku}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>
                Product Name <span>*</span>
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />

              {fieldErrors.name && (
                <span className="field-error">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            <div className="form-group full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product description"
              />
            </div>

            <div className="form-group">
              <label>
                Category <span>*</span>
              </label>

              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {fieldErrors.category_id && (
                <span className="field-error">
                  {fieldErrors.category_id}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>
              </select>
            </div>

          </div>

        </div>

        <div className="form-section">

          <div className="form-section-header">
            <h2>Pricing & Stock Settings</h2>
            <p>
              Configure product pricing and reorder level.
            </p>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>
                Cost Price <span>*</span>
              </label>

              <div className="input-with-prefix">
                <span>KES</span>

                <input
                  type="number"
                  name="cost_price"
                  value={formData.cost_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              {fieldErrors.cost_price && (
                <span className="field-error">
                  {fieldErrors.cost_price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>
                Selling Price <span>*</span>
              </label>

              <div className="input-with-prefix">
                <span>KES</span>

                <input
                  type="number"
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              {fieldErrors.selling_price && (
                <span className="field-error">
                  {fieldErrors.selling_price}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>
                Reorder Level <span>*</span>
              </label>

              <input
                type="number"
                name="reorder_level"
                value={formData.reorder_level}
                onChange={handleChange}
                min="0"
                step="1"
              />

              <span className="field-help">
                Alert when stock reaches this quantity.
              </span>

              {fieldErrors.reorder_level && (
                <span className="field-error">
                  {fieldErrors.reorder_level}
                </span>
              )}
            </div>

          </div>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/products")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
}