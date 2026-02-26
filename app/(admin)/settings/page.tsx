"use client";

import { useState } from "react";
import { BusinessInfo } from "@/lib/types";
import { BUSINESS_INFO as businessInfoData } from "@/lib/mockData";

export default function SettingsPage() {
  const [form, setForm] = useState<BusinessInfo>(businessInfoData);
  const [saved, setSaved] = useState(false);

  const setField = (key: keyof BusinessInfo, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you could also save to localStorage or call an API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields: { key: keyof BusinessInfo; label: string }[] = [
    { key: "name", label: "Business Name" },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "email", label: "Email" },
    { key: "location", label: "Location" },
    { key: "tagline", label: "Tagline" },
    { key: "workingHours", label: "Working Hours" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Business Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm font-medium text-foreground block mb-1">
                {label}
              </label>
              <input
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Save Changes
          </button>

          {saved && (
            <p className="text-primary text-sm font-medium mt-2">
              ✓ Settings saved successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
