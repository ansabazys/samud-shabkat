"use client";

interface SpecItem {
  key: string;
  value: string;
}

interface ProductSpecsTableProps {
  specifications: SpecItem[];
}

export function ProductSpecsTable({ specifications }: ProductSpecsTableProps) {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs font-sans">
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200/80">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
          Technical Specifications
        </h4>
      </div>

      <div className="divide-y divide-slate-100">
        {specifications.map((spec, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3 text-xs gap-1 sm:gap-4 hover:bg-slate-50/60 transition"
          >
            <span className="font-extrabold text-slate-500 uppercase tracking-wider w-full sm:w-1/3">
              {spec.key}
            </span>
            <span className="font-bold text-slate-900 w-full sm:w-2/3">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
