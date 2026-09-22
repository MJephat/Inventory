import { useEffect, useState } from "react";
import {Plus,Search, Pencil, Trash2, Package, RefreshCw,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProductService from "../../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await ProductService.getProducts({
        search: search || undefined,
      });

      /*
       * Adjust this if your backend returns:
       * { data: [...] }
       */
      setProducts(data.data ?? data);
    } catch (error) {
      console.error("Products error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    await loadProducts();
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await ProductService.deleteProduct(product.id);

      await loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);

      setError(
        error.response?.data?.detail ||
          "Failed to delete product."
      );
    }
  }

  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="products-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage products in your inventory.
          </p>
        </div>

       <button
            className="primary-button"
            onClick={() => navigate("/products/new")}
                >
            <Plus size={18} />
            Add Product
            </button>

      </div>


      {/* TOOLBAR */}
      <div className="products-toolbar">

        <form
          className="product-search"
          onSubmit={handleSearch}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>


        <button
          className="secondary-button"
          onClick={loadProducts}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* ERROR */}
      {error && (
        <div className="products-error">
          {error}
        </div>
      )}


      {/* TABLE */}
      <div className="products-card">

        {loading ? (
          <div className="products-loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (

          <div className="products-empty">

            <Package size={40} />

            <h3>No products found</h3>

            <p>
              There are no products matching your search.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table className="products-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {products.map((product) => (

                  <tr key={product.id}>

                    <td>
                      <div className="product-name">

                        <div className="product-icon">
                          <Package size={17} />
                        </div>

                        <div>
                          <strong>
                            {product.name}
                          </strong>

                          {product.description && (
                            <span>
                              {product.description}
                            </span>
                          )}
                        </div>

                      </div>
                    </td>


                    <td>
                      {product.sku}
                    </td>


                    <td>
                      {product.category?.name || "-"}
                    </td>


                    <td>
                      {product.selling_price !== undefined
                        ? `KES ${Number(
                            product.selling_price
                          ).toLocaleString()}`
                        : "-"}
                    </td>


                    <td>
                      <strong>
                        {product.quantity ?? 0}
                      </strong>
                    </td>


                    <td>
                      <span
                        className={
                          product.quantity <=
                          product.reorder_level
                            ? "status-badge status-low"
                            : "status-badge status-good"
                        }
                      >
                        {product.quantity <=
                        product.reorder_level
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </td>


                    <td>

                      <div className="product-actions">

                        <button
                            className="icon-button edit-button"
                            title="Edit product"
                            onClick={() =>
                                navigate(`/products/${product.id}/edit`)
                            }
                            >
                            <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button delete-button"
                          title="Delete product"
                          onClick={() =>
                            handleDelete(product)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}