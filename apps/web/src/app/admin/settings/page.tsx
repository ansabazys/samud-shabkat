"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    companyName: "Samud Shabkat FZ-LLC",
    supportEmail: "support@samudshabkat.com",
    contactPhone: "+971 4 123 4567",
    officeAddress: "Dubai Silicon Oasis, HQ Building, Office 402, Dubai, UAE",
    taxRegistrationNumber: "TRN-1004889210003",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          System Settings & Company Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure global store details, TRN tax number, and procurement
          support contacts
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Official Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) =>
                setForm({ ...form, companyName: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) =>
                  setForm({ ...form, supportEmail: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Tax Registration Number (TRN)
            </label>
            <input
              type="text"
              value={form.taxRegistrationNumber}
              onChange={(e) =>
                setForm({ ...form, taxRegistrationNumber: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Headquarters Address
            </label>
            <textarea
              rows={3}
              value={form.officeAddress}
              onChange={(e) =>
                setForm({ ...form, officeAddress: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {saved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Settings updated successfully
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-900/40 transition"
          >
            <Save className="w-4 h-4" /> Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}
