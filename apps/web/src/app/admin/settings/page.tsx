"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Store,
  RefreshCw,
} from "lucide-react";
import { settingsApi, type SystemSettings } from "@/lib/api/settings-api";

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState("Samud Shabkat Solutions");
  const [supportEmail, setSupportEmail] = useState("ansabazys@gmail.com");
  const [contactPhone, setContactPhone] = useState("+91 98466 32003");
  const [officeAddress, setOfficeAddress] = useState(
    "Technology Market, Main Store Branch, City Center",
  );
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.getSettings();
      if (data) {
        if (data.companyName) setCompanyName(data.companyName);
        if (data.supportEmail) setSupportEmail(data.supportEmail);
        if (data.contactPhone) setContactPhone(data.contactPhone);
        if (data.officeAddress) setOfficeAddress(data.officeAddress);
        if (data.defaultCurrency) setDefaultCurrency(data.defaultCurrency);
        if (typeof data.isMaintenanceMode === "boolean") {
          setIsMaintenanceMode(data.isMaintenanceMode);
        }
      }
    } catch (err: any) {
      console.error("Failed to load settings:", err);
      // Keep defaults if error occurs
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload: SystemSettings = {
        companyName,
        supportEmail,
        contactPhone,
        officeAddress,
        defaultCurrency,
        isMaintenanceMode,
      };

      await settingsApi.updateSettings(payload);
      setSuccessMessage("System & company settings updated successfully.");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to update system settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <Settings className="w-7 h-7 text-emerald-700" />
            Content & System Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage company profile, customer contact channels, store pickup addresses, and platform preferences.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading}
          className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Global Success Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{successMessage}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading platform settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Card 1: Company Profile & Maintenance */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              Company Profile & Currency
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Company / Platform Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Default Platform Currency</label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="SAR">SAR (SR - Saudi Riyal)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                </select>
              </div>
            </div>

            {/* Maintenance Mode Switch */}
            <div className="pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-950 text-xs block">
                    Platform Maintenance Mode
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Temporarily pause storefront checkouts for system updates.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                  className="p-1 cursor-pointer"
                >
                  {isMaintenanceMode ? (
                    <ToggleRight className="w-8 h-8 text-amber-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Contact & Support Channels */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              Customer Contact Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Primary Support Email</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Customer Support Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Store Pickup Address */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xs">
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-700" />
              Store Takeaway & Counter Pickup Location
            </h2>

            <div className="text-xs font-bold space-y-4">
              <div>
                <label className="text-slate-700 block mb-1">Main Store Pickup Address</label>
                <textarea
                  rows={3}
                  required
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
