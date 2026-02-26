"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { Category } from "@/lib/types";
import { categories as initialCategories } from "@/lib/mockData";

const emptyCategory: Omit<Category, "id"> = {
  name: "",
  slug: "",
  icon: "",
  description: "",
  image: "/placeholder.svg",
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyCategory);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyCategory);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm(category);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => c.id === editing.id ? { ...form, id: editing.id } : c)
      );
    } else {
      setCategories((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Categories</h1>

        <div className="flex gap-2 sm:gap-3">
          {/* 👇 Search shrinks on mobile, grows on sm+ */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-44"
            />
          </div>

          <button
            onClick={openAdd}
            className="bg-primary hover:bg-primary-dark text-primary-foreground text-sm font-medium px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground">Name</th>
              {/* 👇 Slug hidden on mobile, shown sm+ */}
              <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Slug</th>
              {/* 👇 Description hidden on mobile, shown md+ */}
              <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Description</th>
              <th className="px-3 sm:px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                {/* 👇 On mobile, stack slug under name as small muted text */}
                <td className="px-3 sm:px-4 py-3">
                  <span className="font-medium text-foreground">
                    {c.icon} {c.name}
                  </span>
                  {/* 👇 Slug shown inline under name on mobile only */}
                  <p className="text-xs text-muted-foreground mt-0.5 sm:hidden">{c.slug}</p>
                </td>
                <td className="px-3 sm:px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.slug}</td>
                <td className="px-3 sm:px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {/* 👇 Truncate long descriptions */}
                  <span className="line-clamp-1">{c.description}</span>
                </td>
                <td className="px-3 sm:px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 rounded hover:bg-muted text-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="p-1.5 rounded hover:bg-muted text-accent"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal — full screen on mobile, centered card on sm+ */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          {/* 👆 slides up from bottom on mobile (items-end), centered on sm+ */}
          <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>

            {/* 👇 Drag handle hint on mobile */}
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4 sm:hidden" />

            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              {(["name", "slug", "icon", "description"] as const).map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium text-foreground block mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    value={form[field]}
                    onChange={(e) => setField(field, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors mt-1"
              >
                {editing ? "Update" : "Add"} Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;