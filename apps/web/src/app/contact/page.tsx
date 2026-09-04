"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  CheckCircle2,
  Store,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/language-store";

const STORE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Samud Shabkat - Main Technology & Hardware Hub",
    address: "Olaya Street, Computer Market, Riyadh, Saudi Arabia",
    phone: "+966 11 000 0000",
    email: "info@samudshabkat.com",
    hours: "Saturday - Thursday: 9:00 AM - 10:00 PM",
  },
  {
    id: "loc-2",
    name: "Samud Shabkat - Distribution & Service Counter",
    address: "King Fahd Road, Technology Complex, Riyadh, Saudi Arabia",
    phone: "+966 11 000 0001",
    email: "sales@samudshabkat.com",
    hours: "Saturday - Thursday: 9:30 AM - 9:00 PM",
  },
];

export default function ContactPage() {
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !message) {
      alert(
        isRtl
          ? "يرجى تعبئة الاسم والبريد الإلكتروني والرسالة."
          : "Please fill in your name, email, and message.",
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const ref = "INQ-" + Math.floor(100000 + Math.random() * 900000);
      setTicketRef(ref);
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 py-10 sm:py-14">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            {tContact("supportBadge")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
            {tContact("pageTitle")}{" "}
            <span className="text-[#15803d]">Shabkat</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl mx-auto">
            {tContact("pageSubtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-8 space-y-12">
        {/* Quick Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              {tContact("phoneWhatsApp")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {tContact("phoneSubtitle")}
            </p>
            <a
              href="tel:+966110000000"
              className="text-xs font-extrabold text-emerald-700 hover:underline block pt-1 dir-ltr inline-block"
            >
              +966 11 000 0000
            </a>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              {tContact("emailRFQ")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {tContact("emailSubtitle")}
            </p>
            <a
              href="mailto:info@samudshabkat.com"
              className="text-xs font-extrabold text-emerald-700 hover:underline block pt-1"
            >
              info@samudshabkat.com
            </a>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              {tContact("storePickup")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {tContact("storePickupSubtitle")}
            </p>
            <span className="text-xs font-extrabold text-slate-900 block pt-1">
              Sat - Thu: 9:00 AM - 10:00 PM
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              {tContact("corporateB2B")}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {tContact("corporateB2BSubtitle")}
            </p>
            <Link
              href="/checkout"
              className="text-xs font-extrabold text-emerald-700 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>
                {isRtl ? "طلب تجاري للشركات" : "Place Corporate Order"}
              </span>
              {isRtl ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </Link>
          </div>
        </div>

        {/* Interactive Form & Store Locations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form (7 cols) */}
          <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                {tContact("sendInquiryTitle")}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {tContact("sendInquirySubtitle")}
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                    {tContact("inquiryReceivedTitle")}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {tContact("inquiryReceivedDesc", {
                      name: fullName,
                      ref: ticketRef,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  {tContact("sendAnother")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 text-xs font-bold"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tContact("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed Al-Ghamdi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tContact("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ahmed@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tContact("phone")}
                    </label>
                    <input
                      type="tel"
                      placeholder="+966 50 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tContact("companyName")}
                    </label>
                    <input
                      type="text"
                      placeholder="Samud Technology Solutions Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">
                    {tContact("subject")} *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="General Inquiry">
                      General Product Inquiry
                    </option>
                    <option value="Takeaway Order Verification">
                      Takeaway Order Verification
                    </option>
                    <option value="Corporate Bulk RFQ">
                      Corporate Bulk RFQ / Quotation Request
                    </option>
                    <option value="Technical Support">
                      Technical & Warranty Support
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">
                    {tContact("message")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your inquiry, specifications needed, or RFQ details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting ? tContact("sending") : tContact("submit")}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Store Pickup Hubs (5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-2xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-700" />
                {tContact("storeBranchesTitle")}
              </h3>

              <div className="space-y-4">
                {STORE_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <h4 className="text-xs font-black text-slate-950 uppercase">
                      {loc.name}
                    </h4>
                    <div className="space-y-1 text-xs text-slate-600 font-medium">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-emerald-700 font-extrabold">
                          {loc.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{tCommon("zatcaVatBadge")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
