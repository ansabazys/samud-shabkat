"use client";

import { ShieldCheck, Truck, Clock, Headphones } from "lucide-react";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Guarantee",
    description:
      "Factory-sealed authentic hardware directly from authorized manufacturer channels.",
  },
  {
    icon: Truck,
    title: "Expedited GCC Logistics",
    description:
      "Same-day dispatch in Dubai and rapid door-to-door delivery across UAE and Saudi Arabia.",
  },
  {
    icon: Clock,
    title: "Streamlined B2B Orders",
    description:
      "Instant VAT invoices, flexible procurement terms, and dedicated quotation support.",
  },
  {
    icon: Headphones,
    title: "Dedicated Technical Support",
    description:
      "Our certified network engineers assist with BOM design, specs, and post-sale setup.",
  },
];

export function HomepageTrust() {
  return (
    <section className="py-14 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200/80 text-slate-800 shrink-0">
                  <Icon className="w-5 h-5 text-cyan-700" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
