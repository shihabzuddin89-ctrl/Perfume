import React, { useState } from "react";
import { motion } from "motion/react";
import { Star, ShoppingCart, HelpCircle, Award } from "lucide-react";
import { Perfume } from "../types";

interface ProductCardProps {
  key?: React.Key;
  perfume: Perfume;
  onAddToCart: (perfume: Perfume, selectedVolume: string, price: number) => void;
  onBuyNow: (perfume: Perfume, selectedVolume: string, price: number) => void;
  onOpenDetail: (perfume: Perfume) => void;
}

export default function ProductCard({
  perfume,
  onAddToCart,
  onBuyNow,
  onOpenDetail,
}: ProductCardProps) {
  // Always default to first volume option (usually 5ml Decant or similar)
  const [selectedVolume, setSelectedVolume] = useState<string>(
    perfume.volumeOptions[0] || "100ml Full Bottle"
  );

  const activePrice = perfume.priceByVolume[selectedVolume] || perfume.discountPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-205 bg-white p-4.5 shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-zinc-950 transition-all duration-300 text-left"
      id={`product-card-${perfume.id}`}
    >
      {/* Dynamic Stock Tag with luxury alignment */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        {perfume.isFeatured && (
          <span className="rounded bg-zinc-950 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-sm font-sans flex items-center gap-1">
            <Award className="h-2.5 w-2.5 text-white" />
            Spotlight
          </span>
        )}
        <span
          className={`rounded px-2.5 py-0.5 text-[8.5px] font-extrabold uppercase tracking-widest shadow-sm font-sans ${
            perfume.stockStatus === "In Stock"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
              : "bg-red-50 text-red-800 border border-red-100"
          }`}
        >
          {perfume.stockStatus}
        </span>
      </div>

      {/* Scent category indicator */}
      <span className="absolute top-4 right-4 z-10 rounded bg-[#0A0A0A] px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white border border-zinc-700">
        {perfume.category}
      </span>

      {/* Product Image Panel with elegant hover glow */}
      <div
        onClick={() => onOpenDetail(perfume)}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 mb-4 cursor-pointer border border-zinc-150 group-hover:border-zinc-400 transition-all"
      >
        <img
          src={perfume.image}
          alt={perfume.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <span className="rounded bg-white px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-zinc-950 flex items-center gap-1 font-sans shadow-md">
            <HelpCircle className="h-3.5 w-3.5 text-zinc-950" />
            Discover Notes Accord
          </span>
        </div>
      </div>

      {/* Product Detail info */}
      <div className="flex-1 flex flex-col text-left">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-400 mb-1 font-sans">
          {perfume.brand}
        </span>
        <button
          onClick={() => onOpenDetail(perfume)}
          className="font-serif text-base font-bold text-zinc-950 group-hover:text-zinc-650 tracking-tight leading-snug line-clamp-1 text-left cursor-pointer outline-none transition-colors"
        >
          {perfume.name}
        </button>

        {/* Notes accords short list */}
        <p className="text-[11px] text-zinc-500 mt-1 leading-tight line-clamp-1 italic font-sans">
          Accords: {perfume.notes.top.slice(0, 3).join(", ")}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-zinc-950">
            <Star className="h-3.5 w-3.5 fill-zinc-950 text-zinc-950" />
            <span className="text-xs font-bold text-zinc-900 ml-1">{perfume.rating}</span>
          </div>
          <span className="text-[10.5px] text-zinc-450 font-sans">({perfume.reviewsCount} verified reviews)</span>
        </div>

        {/* Volume Picker - premium monochrome style */}
        <div className="mt-4">
          <label className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-950 block mb-1.5">
            Select Specimen Size:
          </label>
          <div className="grid grid-cols-2 gap-1.5 font-sans">
            {perfume.volumeOptions.map((vol) => (
              <button
                key={vol}
                onClick={() => setSelectedVolume(vol)}
                className={`py-1.5 px-2 text-[10.5px] rounded-lg border text-center font-bold truncate select-none cursor-pointer transition-all ${
                  selectedVolume === vol
                    ? "border-zinc-950 bg-zinc-950 text-white font-black shadow-md"
                    : "border-zinc-200 hover:bg-zinc-100 text-zinc-650 hover:border-zinc-300"
                }`}
                id={`vol-picker-${perfume.id}-${vol.replace(/\s+/g, "-")}`}
              >
                {vol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing row */}
      <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-[9px] text-zinc-450 block font-bold uppercase tracking-wider font-sans">Pricing</span>
          <span className="font-sans text-xl font-black text-zinc-950">
            ৳ {activePrice.toLocaleString()}
          </span>
        </div>

        <span className="text-[9px] font-extrabold text-zinc-950 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded uppercase tracking-wider font-sans">
          Decanted Import
        </span>
      </div>

      {/* Actions (Buy now & Cart) with premium styling */}
      <div className="mt-4 grid grid-cols-5 gap-1.5 font-sans">
        <button
          onClick={() => onAddToCart(perfume, selectedVolume, activePrice)}
          disabled={perfume.stockStatus === "Out of Stock"}
          className="col-span-2 flex h-10.5 items-center justify-center rounded-xl border border-zinc-250 text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 disabled:hover:bg-transparent hover:border-zinc-400 transition-all cursor-pointer focus:outline-none"
          title="Add to wishlist cart"
          id={`add-to-cart-${perfume.id}`}
        >
          <ShoppingCart className="h-4.5 w-4.5" />
        </button>

        <button
          onClick={() => onBuyNow(perfume, selectedVolume, activePrice)}
          disabled={perfume.stockStatus === "Out of Stock"}
          className="col-span-3 flex h-10.5 items-center justify-center rounded-xl bg-zinc-950 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-zinc-950 transition-all cursor-pointer focus:outline-none shadow-sm"
          id={`buy-now-${perfume.id}`}
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
