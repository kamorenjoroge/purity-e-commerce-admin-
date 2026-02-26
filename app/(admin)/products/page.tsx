"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { Product } from "@/lib/types";
import {
  products as initialProducts,
  categories,
} from "@/lib/mockData";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  slug: "",
  categoryId: "",
  price: 0,
  originalPrice: undefined,
  description: "",
  features: [],
  image: "/placeholder.svg",
  badge: undefined,
  inStock: true,
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm(product);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...form, id: editing.id } : p
        )
      );
    } else {
      const newProduct: Product = {
        ...form,
        id: Date.now().toString(),
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setModalOpen(false);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const setField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name || id;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-48"
            />
          </div>

          <button
            onClick={openAdd}
            className="bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 hidden lg:table-cell">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3 hidden md:table-cell">Original</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 hidden sm:table-cell">Badge</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-8 w-8 rounded object-cover bg-muted"
                  />
                </td>

                <td className="px-4 py-3 font-medium text-foreground">
                  {p.name}
                </td>

                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                  {getCategoryName(p.categoryId)}
                </td>

                <td className="px-4 py-3 font-semibold">
                  ${p.price.toFixed(2)}
                </td>

                <td className="px-4 py-3 hidden md:table-cell line-through text-muted-foreground">
                  {p.originalPrice
                    ? `$${p.originalPrice.toFixed(2)}`
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.inStock
                        ? "bg-primary/10 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    {p.inStock ? "In Stock" : "Out"}
                  </span>
                </td>

                <td className="px-4 py-3 hidden sm:table-cell">
                  {p.badge ? (
                    <span className="bg-secondary/10 text-secondary text-xs px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-3 text-right space-x-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded hover:bg-muted text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 rounded hover:bg-muted text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card w-full max-w-lg rounded-xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Product Name"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                required
              />

              {/* Slug */}
              <input
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="Slug"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                required
              />

              {/* Category */}
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setField("categoryId", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Price */}
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setField("price", Number(e.target.value))
                }
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                required
              />

              {/* In Stock */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) =>
                    setField("inStock", e.target.checked)
                  }
                  className="accent-primary"
                />
                In Stock
              </label>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-2 rounded-lg text-sm"
              >
                {editing ? "Update" : "Add"} Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
