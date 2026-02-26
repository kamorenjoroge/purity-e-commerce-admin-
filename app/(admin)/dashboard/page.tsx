"use client";

import { Package, FolderTree, CheckCircle, XCircle } from "lucide-react";
import { products, categories } from "@/lib/mockData";

const DashboardPage = () => {
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.filter((p) => !p.inStock).length;

  const cards = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-primary",
    },
    {
      label: "Total Categories",
      value: categories.length,
      icon: FolderTree,
      color: "bg-secondary",
    },
    {
      label: "In Stock",
      value: inStock,
      icon: CheckCircle,
      color: "bg-primary-light",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: XCircle,
      color: "bg-accent",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
            >
              <div
                className={`${card.color} h-12 w-12 rounded-lg flex items-center justify-center`}
              >
                <Icon className="h-6 w-6 text-primary-foreground" />
              </div>

              <div>
                <p className="text-2xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {card.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
