import React from "react";
import { X, Trash2, ShieldCheck, ChevronRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm" id="cart-drawer-dimmed-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative h-full w-full max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-zinc-200"
        id="cart-drawer-panel"
      >
        {/* Header Drawer */}
        <div className="p-6 border-b border-zinc-200/80 flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-zinc-950" />
            <h3 className="text-lg font-bold font-serif text-zinc-950 tracking-tight">Your Perfume Cart</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 cursor-pointer transition-colors"
            id="close-cart-drawer-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 select-none">
              <div className="rounded-full bg-zinc-50 border border-zinc-200 p-6 text-zinc-500">
                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
              </div>
              <div>
                <p className="font-bold text-zinc-950">Your shopping cart is empty</p>
                <p className="text-xs text-zinc-500 max-w-xs mt-1 leading-relaxed">
                  Browse our designer and niche catalog, pick a premium decant volume to try, and experience luxurious essences!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 relative group text-left items-center font-sans"
                >
                  <img
                    src={item.perfume.image}
                    alt={item.perfume.name}
                    className="h-14 w-14 rounded-xl object-cover border border-zinc-200 bg-white"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      {item.perfume.brand}
                    </span>
                    <h4 className="font-sans text-xs font-bold text-zinc-950 truncate -mt-0.5 animate-none" title={item.perfume.name}>
                      {item.perfume.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-zinc-650 mt-0.5">{item.selectedVolume}</p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-extrabold text-zinc-950 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50 font-bold text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex flex-col justify-between items-end h-14">
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-gray-400 hover:text-[#DC2626] p-1 rounded-md transition-colors"
                      title="Delete item"
                      id={`remove-cart-item-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-black text-gray-950 font-sans">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-4 text-left font-sans animate-none">
            <div className="flex items-center justify-between text-zinc-950 font-bold text-sm">
              <span>Items Total Price</span>
              <span className="text-lg font-black text-zinc-950 font-sans">
                ৳ {subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              * Delivery charges (Inside Dhaka 80 BDT / Outside Dhaka 150 BDT) will be calculated during checkout address selection.
            </p>

            <div className="grid grid-cols-5 gap-2 pt-2">
              <button
                onClick={onClearCart}
                className="col-span-1 flex h-12 items-center justify-center border border-zinc-200 bg-white rounded-xl text-zinc-400 hover:text-red-650 hover:bg-zinc-50 transition-colors cursor-pointer focus:outline-none"
                title="Empty shopping cart"
                id="clear-drawer-btn"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>

              <button
                onClick={onCheckout}
                className="col-span-4 flex h-12 items-center justify-center gap-1.5 bg-zinc-950 text-white hover:bg-zinc-800 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer focus:outline-none"
                id="checkout-drawer-btn"
              >
                Confirm Addresses & Pay <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-bold justify-center pt-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
              100% Secure & Original Guarantee
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
