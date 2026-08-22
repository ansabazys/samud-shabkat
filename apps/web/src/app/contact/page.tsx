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
  HelpCircle,
  Store,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const STORE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Samud Shabkat - Main Technology & Hardware Hub",
    address: "Technology Market, Main Store Branch, City Center",
    phone: "+91 98466 32003",
    email: "ansabazys@gmail.com",
    hours: "Monday - Saturday: 9:00 AM - 9:00 PM (Closed Sundays)",
  },
  {
    id: "loc-2",
    name: "Samud Shabkat - Distribution & Service Counter",
    address: "Industrial Hardware Zone, Secondary Branch Counter",
    phone: "+91 98460 00000",
    email: "orders@samudshabkat.com",
    hours: "Monday - Saturday: 9:30 AM - 8:30 PM",
  },
];

const FAQS = [
  {
    question: "How does Store Takeaway / Pay at Shop ordering work?",
    answer:
      "You can browse products on our digital platform, select your items, and choose 'Store Pickup / Takeaway' at checkout. Your order will be placed without online payment. When you arrive at our store counter, you can verify your order number and pay directly via Cash, Mada, or Credit Card upon collecting your products.",
  },
  {
    question: "Can I request a formal corporate invoice or bulk price quote?",
    answer:
      "Yes! We specialize in B2B corporate IT procurement. Check the 'Corporate Order' box during checkout or use the inquiry form on this page with the subject 'Corporate Bulk RFQ' to receive an official proforma invoice.",
  },
  {
    question: "How will I know when my takeaway order is ready for pickup?",
    answer:
      "You will receive an automated email notification as soon as your order status is updated to 'Ready for Collection'. You can also track live status updates under your account at /my-orders.",
  },
  {
    question: "What is your warranty and support policy for hardware items?",
    answer:
      "All IT hardware products sold through Samud Shabkat include manufacturer warranty coverage and technical assistance. Contact our support counter for warranty claims or technical questions.",
  },
];

export default function ContactPage() {
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
      alert("Please fill in your name, email, and message.");
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
            Customer Support & Takeaway Counter
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
            Contact Samud<span className="text-[#15803d]">Shabkat</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-2xl mx-auto">
            Have questions about IT hardware specifications, takeaway store pickups, or corporate bulk quotations? Our dedicated sales and support team is here to assist you.
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
              Phone & WhatsApp
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Call or message for instant product availability & takeaway assistance.
            </p>
            <a
              href="tel:+919846632003"
              className="text-xs font-extrabold text-emerald-700 hover:underline block pt-1"
            >
              +91 98466 32003
            </a>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              Email & Corporate RFQ
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Send bulk inquiries or corporate quotation requests directly to our sales team.
            </p>
            <a
              href="mailto:ansabazys@gmail.com"
              className="text-xs font-extrabold text-emerald-700 hover:underline block pt-1"
            >
              ansabazys@gmail.com
            </a>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              Store Pickup Counter
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pay cash or card at counter upon collecting your takeaway products.
            </p>
            <span className="text-xs font-extrabold text-slate-900 block pt-1">
              Mon - Sat: 9:00 AM - 9:00 PM
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-950">
              Corporate B2B Orders
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Formal proforma invoices, bulk IT hardware supply, and tax receipts.
            </p>
            <Link
              href="/checkout"
              className="text-xs font-extrabold text-emerald-700 hover:underline block pt-1"
            >
              Place Corporate Order &rarr;
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
                Send Us an Inquiry or RFQ
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                    Inquiry Received!
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Thank you, <strong className="text-slate-950">{fullName}</strong>. Your message reference ID is{" "}
                    <strong className="text-emerald-700">{ticketRef}</strong>. Our customer assistance team will contact you shortly.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Mohammed Ansab"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="ansab@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 98466 32003"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">Company / Business Name (Optional)</label>
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
                  <label className="text-slate-700 block mb-1">Inquiry Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Takeaway Order Verification">Takeaway Order Verification</option>
                    <option value="Corporate Bulk RFQ">Corporate Bulk RFQ / Quotation Request</option>
                    <option value="Technical Support">Technical & Warranty Support</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please specify hardware model numbers, quantities required, or order questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending Message..." : "Submit Inquiry"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Store Pickup Branches & Map Card (5 cols) */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-2xs">
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Store Pickup Locations
              </h2>

              <div className="space-y-4">
                {STORE_LOCATIONS.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs"
                  >
                    <span className="font-extrabold text-slate-950 block">
                      {loc.name}
                    </span>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {loc.address}
                    </p>
                    <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px] font-bold text-slate-700">
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{loc.hours}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{loc.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Location Map View */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-950">
                  Store Counter Location Map
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Main Store
                </span>
              </div>

              <div className="w-full h-48 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center space-y-2 relative overflow-hidden">
                <MapPin className="w-8 h-8 text-emerald-600 animate-bounce" />
                <span className="text-xs font-black text-slate-950">
                  Samud Shabkat Technology Market
                </span>
                <p className="text-[11px] text-slate-500 font-medium max-w-xs">
                  Main Store & Takeaway Pickup Hub &bull; Technology Zone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="border-b border-slate-100 pb-4 text-center max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Quick Assistance
            </span>
            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight mt-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-5 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 text-xs"
              >
                <h3 className="font-extrabold text-slate-950 text-xs">
                  {faq.question}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
