"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Phone,
  Mail,
  MapPin,
  Package,
} from "lucide-react";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const mockOrderDetails = {
    id: orderId,
    orderNumber: "ORD-20260806-4892",
    customerName: "Mohammed Ansab",
    customerEmail: "ansab@gulfnet.ae",
    companyName: "Gulf Networking Tech FZ-LLC",
    contactPhone: "+971 4 123 4567",
    billingAddress: "Building 4, Dubai Silicon Oasis, Dubai, UAE",
    shippingAddress: "Warehouse 12, Al Quoz Industrial Area 3, Dubai, UAE",
    totalAmount: "43,500.00",
    orderStatus: "PENDING",
    paymentStatus: "PENDING",
    createdAt: "August 6, 2026 at 2:30 PM",
    items: [
      {
        id: "item-1",
        productName: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
        sku: "C9300-48P-A",
        unitPrice: "14,500.00",
        quantity: 3,
        totalPrice: "43,500.00",
        specifications: { Ports: "48 PoE+", Stacking: "480 Gbps" },
      },
    ],
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders List
        </Link>
      </div>

      {/* Header Info */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap gap-6 items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold font-mono text-white">
              {mockOrderDetails.orderNumber}
            </h1>
            <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
              {mockOrderDetails.orderStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Placed on {mockOrderDetails.createdAt}
          </p>
        </div>
      </div>

      {/* Order Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Order Items Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" /> Purchased Hardware
              Items
            </h2>

            <div className="divide-y divide-slate-800/80">
              {mockOrderDetails.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                      SKU: {item.sku}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-0.5">
                      {item.productName}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono mt-1 block">
                      AED {item.unitPrice} × {item.quantity} units
                    </span>
                  </div>
                  <span className="text-base font-bold text-cyan-400">
                    AED {item.totalPrice}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="text-slate-400 font-medium">
                Order Total Amount
              </span>
              <span className="text-xl font-extrabold text-white">
                AED {mockOrderDetails.totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" /> B2B Corporate
              Details
            </h3>

            <div className="space-y-3 text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Company Name
                </span>
                <span className="font-bold text-white text-sm">
                  {mockOrderDetails.companyName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Contact Person
                </span>
                <span className="font-semibold text-slate-200">
                  {mockOrderDetails.customerName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{mockOrderDetails.customerEmail}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{mockOrderDetails.contactPhone}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" /> Delivery Address
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {mockOrderDetails.shippingAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
