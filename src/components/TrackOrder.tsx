import React, { useState } from "react";
import { Search, Loader2, Package, Truck, Compass, CheckCircle2 } from "lucide-react";
import { Order } from "../types";

interface TrackOrderProps {
  orders: Order[];
}

export default function TrackOrder({ orders }: TrackOrderProps) {
  const [query, setQuery] = useState("");
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(false);

    // Simulate search delay for premium feeling
    setTimeout(() => {
      const normalizedQuery = query.trim().toUpperCase();
      const match = orders.find(
        (o) => o.id.toUpperCase() === normalizedQuery || o.customerPhone.replace(/\s+/g, "") === query.replace(/\s+/g, "")
      );

      setMatchedOrder(match || null);
      setIsLoading(false);
      setHasSearched(true);
    }, 800);
  };

  const getStepStatus = (currentStatus: string, step: "Pending" | "Processing" | "Shipped" | "Delivered") => {
    const statusPriority = {
      Pending: 1,
      Processing: 2,
      Shipped: 3,
      Delivered: 4,
      Cancelled: 0,
    };

    const currentPriority = statusPriority[currentStatus as keyof typeof statusPriority] || 1;
    const stepPriority = statusPriority[step];

    if (currentStatus === "Cancelled") return "cancelled";
    if (currentPriority >= stepPriority) return "completed";
    if (currentPriority + 1 === stepPriority) return "active";
    return "upcoming";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16 text-left" id="track-order-container">
      <div className="text-center space-y-3 mb-8">
        <span className="rounded-full bg-zinc-100 border border-zinc-200/60 px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-widest font-sans">
          Courier Operations
        </span>
        <h2 className="text-3xl font-black text-zinc-950 tracking-tight font-serif">Track Your Fragrance Parcel</h2>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed font-sans">
          Enter your **Order Reference ID (e.g. FV-XXXXXX)** or your **11-digit mobile phone number** to verify real-time shipping status and Steadfast courier dispatches.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleTrack} className="flex gap-2.5 items-center mb-8 font-sans">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order Number or Mobile (e.g. FV-381924 / 017...)"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-zinc-200 outline-none text-sm font-medium focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20 transition-all bg-white"
            required
            id="tracking-query-input"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="h-12 px-6 rounded-xl bg-zinc-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-850 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md cursor-pointer"
          id="tracking-submit-btn"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Track Parcel"
          )}
        </button>
      </form>

      {/* Matching Order Display */}
      {hasSearched && matchedOrder && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xl space-y-6 text-left font-sans" id="tracking-result-box">
          
          {/* Header invoice details */}
          <div className="border-b border-zinc-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Tracking Reference</p>
              <h3 className="text-lg font-black text-gray-900 font-mono">{matchedOrder.id}</h3>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Estimated Delivery</p>
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-0.5 border border-emerald-100">
                {matchedOrder.district === "Dhaka" ? "Within 24 Hours (Express)" : "2 - 3 Days via Courier"}
              </p>
            </div>
          </div>

          {/* Stepper roadmap visualization */}
          <div className="space-y-6 pt-2">
            
            {/* Step 1: Pending */}
            <div className="flex gap-4 items-start relative pb-6 border-l-2 border-dashed border-zinc-200 ml-4 pl-6">
              <div className="absolute -left-[11px] top-0">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  getStepStatus(matchedOrder.orderStatus, "Pending") === "completed" ? "bg-zinc-950" : "bg-gray-300"
                }`}>
                  1
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold leading-none text-gray-900">Order Placed</h4>
                <p className="text-[11px] text-gray-400 mt-1">Receipt logged and scheduled for verified packaging.</p>
              </div>
            </div>

            {/* Step 2: Processing */}
            <div className="flex gap-4 items-start relative pb-6 border-l-2 border-dashed border-zinc-200 ml-4 pl-6">
              <div className="absolute -left-[11px] top-0">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  getStepStatus(matchedOrder.orderStatus, "Processing") === "completed" ? "bg-zinc-950" :
                  getStepStatus(matchedOrder.orderStatus, "Processing") === "active" ? "bg-zinc-900 animate-pulse" : "bg-gray-200"
                }`}>
                  2
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none text-gray-900 flex items-center gap-1.5 font-sans">
                  Packaging / Quality Assurance
                  {getStepStatus(matchedOrder.orderStatus, "Processing") === "active" && (
                    <span className="text-[9px] bg-zinc-150 text-zinc-900 border border-zinc-200 px-1.5 py-0.5 rounded font-bold animate-pulse">
                      In Progress
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">Decanting original perfume from parent batch inside sterile glass atomizers.</p>
              </div>
            </div>

            {/* Step 3: Shipped */}
            <div className="flex gap-4 items-start relative pb-6 border-l-2 border-dashed border-zinc-200 ml-4 pl-6">
              <div className="absolute -left-[11px] top-0">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  getStepStatus(matchedOrder.orderStatus, "Shipped") === "completed" ? "bg-zinc-950" :
                  getStepStatus(matchedOrder.orderStatus, "Shipped") === "active" ? "bg-zinc-900 animate-pulse" : "bg-gray-200"
                }`}>
                  3
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none text-gray-900 flex items-center gap-1.5 font-sans">
                  Dispatched via Steadfast Cargo
                  {getStepStatus(matchedOrder.orderStatus, "Shipped") === "active" && (
                    <span className="text-[9px] bg-zinc-150 text-zinc-900 border border-zinc-200 px-1.5 py-0.5 rounded font-bold animate-pulse">
                      On The Way
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">Parcel transferred to Steadfast Courier node. Tracking is ongoing.</p>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="flex gap-4 items-start ml-4 pl-6">
              <div className="absolute left-[5px]">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                  getStepStatus(matchedOrder.orderStatus, "Delivered") === "completed" ? "bg-emerald-600" : "bg-gray-200"
                }`}>
                  ✓
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none text-gray-900">Delivered & Verified</h4>
                <p className="text-[11px] text-gray-400 mt-1">Package arrived securely. Happy smelling!</p>
              </div>
            </div>

          </div>

          {/* Core order details list */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 text-xs font-sans">
            <h4 className="font-bold uppercase text-[10px] text-zinc-400 tracking-wider">Item details</h4>
            <div className="space-y-2">
              {matchedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-medium">
                  <span className="text-zinc-950">{it.brand} {it.name} ({it.selectedVolume}) × {it.quantity}</span>
                  <span className="font-bold text-gray-950 font-mono">৳ {it.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold text-xs">
              <span className="text-zinc-900">Payment Status</span>
              <span className={matchedOrder.paymentStatus === "Paid" ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                {matchedOrder.paymentStatus === "Paid" ? "Paid via Mobile Banking" : "Cash on Delivery (Pending)"}
              </span>
            </div>
          </div>

        </div>
      )}

      {hasSearched && !matchedOrder && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-2.5 text-left" id="tracking-no-match">
          <p className="text-sm font-bold text-red-800">No active parcel found matching "{query}"</p>
          <p className="text-xs text-red-600">
            Please double-check your Order Reference ID code or the exact 11-digit phone number you provided during checkout. Direct courier logs are generated immediately upon database submission.
          </p>
        </div>
      )}

    </div>
  );
}
