import React, { useState, useMemo } from "react";
import { X, Star, Calendar, MessageSquarePlus, ShoppingCart, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Perfume, Review } from "../types";

interface ProductDetailModalProps {
  perfume: Perfume;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, selectedVolume: string, price: number) => void;
  onBuyNow: (perfume: Perfume, selectedVolume: string, price: number) => void;
  reviews: Review[];
  onAddReview: (perfumeId: string, userName: string, rating: number, comment: string) => void;
}

export default function ProductDetailModal({
  perfume,
  onClose,
  onAddToCart,
  onBuyNow,
  reviews,
  onAddReview,
}: ProductDetailModalProps) {
  const [selectedVolume, setSelectedVolume] = useState<string>(perfume.volumeOptions[0]);
  const activePrice = perfume.priceByVolume[selectedVolume] || perfume.discountPrice;

  // Review Form state
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => r.perfumeId === perfume.id);
  }, [reviews, perfume.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    onAddReview(perfume.id, userName, rating, comment);
    setUserName("");
    setComment("");
    setRating(5);
    setSuccessMsg("Thank you! Your verified review is published instantly.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" id="product-detail-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 flex flex-col md:flex-row max-h-[90vh]"
        id="product-detail-modal-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-700 bg-white/80 hover:bg-white rounded-full border border-zinc-200 shadow-sm cursor-pointer transition-all"
          id="close-detail-modal-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Visual Showcase */}
        <div className="w-full md:w-1/2 bg-zinc-950 text-white p-6 md:p-8 flex flex-col justify-between overflow-y-auto md:max-h-[90vh]">
          <div className="space-y-4">
            <span className="rounded-full bg-zinc-800 text-zinc-350 px-3 py-1 text-[9px] font-bold uppercase tracking-wider">
              100% Authentic Sample
            </span>
            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 relative group">
              <img
                src={perfume.image}
                alt={perfume.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="text-left">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">{perfume.brand}</span>
              <h2 className="text-2xl font-bold tracking-tight font-serif mt-1">{perfume.name}</h2>
              <p className="text-sm font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> Import Status: Officially Declared Legal Batch
              </p>
            </div>
          </div>

          {/* Scent Pyramids - Premium designer addition */}
          <div className="mt-8 border-t border-white/10 pt-6 space-y-4 text-left">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-200">
              Fragrance Anatomy (Notes Profile)
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Top Accord (Immediate)</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {perfume.notes.top.map((note) => (
                    <span key={note} className="bg-white/10 text-white rounded px-2.5 py-0.5 text-[11px] font-medium border border-white/5">
                      🍋 {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Middle Accord (Heart)</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {perfume.notes.middle.map((note) => (
                    <span key={note} className="bg-zinc-800 text-zinc-150 rounded px-2.5 py-0.5 text-[11px] font-medium border border-zinc-700">
                      🌸 {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Base Accord (Lingering)</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {perfume.notes.base.map((note) => (
                    <span key={note} className="bg-white/5 text-gray-300 rounded px-2.5 py-0.5 text-[11px] font-medium border border-white/5">
                      🪵 {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: E-Commerce Controls, Story, & Reviews */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto md:max-h-[90vh]">
          
          <div className="space-y-6 text-left">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Fragrance Character</p>
              <p className="text-sm text-zinc-650 leading-relaxed mt-1.5">{perfume.description}</p>
            </div>

            {/* Price Selection Panel */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-505 block mb-2 font-sans">
                Choose decant/bottle size:
              </span>
              <div className="grid grid-cols-2 gap-2 font-sans">
                {perfume.volumeOptions.map((vol) => (
                  <button
                    key={vol}
                    onClick={() => setSelectedVolume(vol)}
                    className={`py-2 px-3 rounded-lg border text-left font-bold cursor-pointer transition-all ${
                      selectedVolume === vol
                        ? "border-zinc-950 bg-zinc-950 text-white font-black shadow-md"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100"
                    }`}
                    id={`modal-vol-${vol.replace(/\s+/g, "-")}`}
                  >
                    <div className="text-[10px] uppercase tracking-wider font-bold">{vol}</div>
                    <div className="text-xs font-bold mt-0.5">৳ {perfume.priceByVolume[vol]?.toLocaleString()}</div>
                  </button>
                ))}
              </div>

              {/* Price Tag Summary */}
              <div className="mt-4 pt-3.5 border-t border-zinc-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-450 uppercase font-black tracking-wider font-sans">Selected Specimen ({selectedVolume})</span>
                  <div className="text-2xl font-black text-zinc-950 mt-0.5 font-sans">
                    ৳ {activePrice.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-white bg-zinc-950 px-3.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  Original Guaranteed
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-5 gap-2.5">
              <button
                onClick={() => onAddToCart(perfume, selectedVolume, activePrice)}
                disabled={perfume.stockStatus === "Out of Stock"}
                className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-250 text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 transition-all font-bold cursor-pointer shadow-sm focus:outline-none"
                id="modal-add-to-cart"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                Add to Cart
              </button>

              <button
                onClick={() => onBuyNow(perfume, selectedVolume, activePrice)}
                disabled={perfume.stockStatus === "Out of Stock"}
                className="col-span-3 flex h-12 items-center justify-center rounded-xl bg-zinc-950 text-xs font-black uppercase tracking-[0.12em] text-white hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-sm active:scale-[0.98] cursor-pointer focus:outline-none"
                id="modal-buy-now"
              >
                Order Express Now
              </button>
            </div>

            {/* Verified Reviews Section */}
            <div className="border-t border-zinc-200 pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950">
                Customer Experiences ({filteredReviews.length})
              </h3>

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                  {successMsg}
                </div>
              )}

              {/* Add feedback write module */}
              <form onSubmit={handleSubmitReview} className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-950 flex items-center gap-1.5 font-sans">
                  <MessageSquarePlus className="h-4 w-4 text-zinc-700" /> Have you tried this scent? Leave a review!
                </span>
                
                <div className="grid grid-cols-2 gap-2 font-sans">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your Name (e.g. Adnan)"
                    className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white outline-none focus:border-zinc-900"
                    required
                  />
                  
                  <div className="flex items-center gap-1 bg-white px-2 rounded-md border border-zinc-200 justify-center">
                    <span className="text-[10px] font-bold text-zinc-500">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-0.5 outline-none cursor-pointer"
                      >
                        <Star className={`h-3 w-3 ${rating >= star ? "fill-amber-500 text-amber-500" : "text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share detail experience (e.g. sillage, longevity, projection in BD weather)"
                  className="w-full p-2 text-xs rounded-md border border-zinc-200 bg-white outline-none h-14 resize-none font-sans focus:border-zinc-900"
                  required
                />

                <div className="text-right font-sans">
                  <button
                    type="submit"
                    className="bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-md hover:bg-zinc-850 transition-all cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                {filteredReviews.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No reviews yet for this bottle. Be the first to review!</p>
                ) : (
                  filteredReviews.map((r) => (
                    <div key={r.id} className="border-b border-zinc-150 pb-3 h-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-950">{r.userName}</span>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-sans">
                          <Calendar className="h-3 w-3" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-2.5 w-2.5 ${r.rating >= star ? "fill-amber-500 text-amber-500" : "text-gray-200"}`} />
                        ))}
                      </div>

                      <p className="text-xs text-zinc-650 mt-1.5 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="mt-8 text-center text-[10px] text-zinc-400">
            Secure checkout powered by Fragrance Vault Pay.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
