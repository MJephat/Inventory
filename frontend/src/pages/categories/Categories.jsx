import { useEffect, useState } from "react";
import {Tags,Plus, Pencil, Trash2, RefreshCw, Search,} from "lucide-react";

import CategoryService from "../../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const response =
        await CategoryService.getCategories();

      const categoryData =
        response.data ?? response;

      setCategories(categoryData);
    } catch (error) {
      console.error("Categories error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAdd() {
    setEditingCategory(null);
    setShowModal(true);
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingCategory(null);
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await CategoryService.deleteCategory(
        category.id
      );

      await loadCategories();
    } catch (error) {
      console.error("Delete category error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to delete category."
      );
    }
  }

  const filteredCategories = categories.filter(
    (category) => {
      const searchTerm =
        search.toLowerCase().trim();

      if (!searchTerm) {
        return true;
      }

      return (
        category.name
          ?.toLowerCase()
          .includes(searchTerm) ||
        category.description
          ?.toLowerCase()
          .includes(searchTerm)
      );
    }
  );

  return (
    <div className="categories-page">

      {/* Header */}
      <div className="categories-header">

        <div>
          <h1>Categories</h1>

          <p>
            Organize your products into categories.
          </p>
        </div>

        <button
          className="category-add-button"
          onClick={handleAdd}
        >
          <Plus size={17} />
          Add Category
        </button>

      </div>

      {/* Toolbar */}
      <div className="categories-toolbar">

        <div className="category-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="category-toolbar-right">

          <span>
            {filteredCategories.length} categories
          </span>

          <button
            className="secondary-button"
            onClick={loadCategories}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={
                loading ? "spin" : ""
              }
            />
            Refresh
          </button>

        </div>

      </div>

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="categories-card">

        {loading ? (
          <div className="products-loading">
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="categories-empty">

            <Tags size={40} />

            <h3>
              {search
                ? "No categories found"
                : "No categories yet"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Create your first product category."}
            </p>

            {!search && (
              <button
                className="category-add-button"
                onClick={handleAdd}
              >
                <Plus size={16} />
                Add Category
              </button>
            )}

          </div>
        ) : (
          <div className="table-wrapper">

            <table className="categories-table">

              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredCategories.map(
                  (category) => (
                    <tr key={category.id}>

                      <td>
                        <div className="category-name">

                          <div className="category-icon">
                            <Tags size={16} />
                          </div>

                          <strong>
                            {category.name}
                          </strong>

                        </div>
                      </td>

                      <td>
                        <span className="category-description">
                          {category.description ||
                            "No description"}
                        </span>
                      </td>

                      <td>
                        {category.created_at
                          ? new Date(
                              category.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>

                        <div className="category-actions">

                          <button
                            className="icon-button edit-button"
                            title="Edit category"
                            onClick={() =>
                              handleEdit(category)
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-button delete-button"
                            title="Delete category"
                            onClick={() =>
                              handleDelete(category)
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={handleCloseModal}
          onSuccess={async () => {
            handleCloseModal();
            await loadCategories();
          }}
        />
      )}

    </div>
  );
}


/* ----------------------------------------
   Category Modal
---------------------------------------- */

function CategoryModal({
  category,
  onClose,
  onSuccess,
}) {
  const isEditing = !!category;

  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

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

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        name: form.name.trim(),
        description:
          form.description.trim() || null,
      };

      if (isEditing) {
        await CategoryService.updateCategory(
          category.id,
          data
        );
      } else {
        await CategoryService.createCategory(data);
      }

      await onSuccess();
    } catch (error) {
      console.error(
        "Category save error:",
        error
      );

      setError(
        error.response?.data?.detail ||
          `Failed to ${
            isEditing
              ? "update"
              : "create"
          } category.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="category-modal-overlay">

      <div className="category-modal">

        <div className="category-modal-header">

          <div>
            <h2>
              {isEditing
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p>
              {isEditing
                ? "Update category information."
                : "Create a new product category."}
            </p>
          </div>

          <button
            className="category-modal-close"
            onClick={onClose}
            disabled={submitting}
          >
            ×
          </button>

        </div>

        <form
          className="category-modal-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="inventory-modal-error">
              {error}
            </div>
          )}

          <div className="form-group">

            <label htmlFor="category-name">
              Name <span>*</span>
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Laptops"
              disabled={submitting}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="category-description">
              Description
            </label>

            <textarea
              id="category-description"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this category..."
              disabled={submitting}
            />

          </div>

          <div className="category-modal-actions">

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
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Update Category"
                : "Create Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}