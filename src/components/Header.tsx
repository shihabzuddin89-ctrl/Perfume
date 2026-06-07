import { useState } from "react";
import { Search, ShoppingBag, Truck, Award, Menu, X, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface HeaderProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  currentView: "shop" | "admin" | "track";
  setCurrentView: (view: "shop" | "admin" | "track") => void;
}

export default function Header({
  cart,
  setIsCartOpen,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  currentView,
  setCurrentView,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories = [
    { id: "all", label: "All Fragrances" },
    { id: "men", label: "For Men" },
    { id: "women", label: "For Women" },
    { id: "unisex", label: "Unisex Exclusive" },
    { id: "decants", label: "Luxury Decants" },
    { id: "attar", label: "Pure Attar & Oud" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white text-zinc-950">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Brand in luxury typography with strict monochrome fashion mark */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setCurrentView("shop");
                setActiveCategory("all");
              }}
              className="group text-left cursor-pointer focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded bg-zinc-950 text-white font-serif font-black text-sm tracking-widest shadow-md">
                  F
                </div>
                <div>
                  <h1 className="font-serif text-lg font-black tracking-[0.1em] text-zinc-950 sm:text-xl uppercase leading-none">
                    FRAGRANCE<span className="font-sans font-light text-zinc-500 tracking-[0.2em] ml-1">VAULT</span>
                  </h1>
                  <p className="text-[8.5px] uppercase tracking-[0.3em] text-zinc-500 font-bold mt-1 group-hover:text-zinc-950 transition-colors font-sans">
                    Royal Scent Atelier BD
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar beautifully styled in white and black with crisp ring feedback */}
          {currentView === "shop" && (
            <div className="hidden md:flex flex-1 max-w-md relative font-sans">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-950 transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search premium scents: Creed, Sauvage, Tom Ford..."
                className="w-full h-11 rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all"
                id="search-input-desktop"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-zinc-400 hover:text-zinc-950 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Action Links & Icons in black/white palette */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* View selectors with black underline animations - Hiding track courier and admin per instruction */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-widest font-sans uppercase">
              <button
                onClick={() => setCurrentView("shop")}
                className={`relative py-3 transition-colors cursor-pointer focus:outline-none ${
                  currentView === "shop"
                    ? "text-zinc-950 font-black"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
                id="nav-shop"
              >
                Atelier Shop
                {currentView === "shop" && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-zinc-950"
                  />
                )}
              </button>
            </nav>

            {/* Shopping Bag Button with bouncing animation */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-zinc-800 hover:text-zinc-950 hover:bg-zinc-100 rounded-full cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-zinc-950"
              aria-label="Shopping Cart"
              id="cart-icon-btn"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.8]" />
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 text-[9.5px] font-bold text-white shadow-md ring-2 ring-white"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-zinc-805 hover:text-zinc-950 hover:bg-zinc-100 rounded-full lg:hidden cursor-pointer transition-all"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 stroke-[1.8]" />
              ) : (
                <Menu className="h-6 w-6 stroke-[1.8]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Categories Toolbar with crisp high-contrast monochrome design capsules */}
      {currentView === "shop" && (
        <div className="border-t border-zinc-200 bg-zinc-50 py-3 overflow-x-auto scrollbar-none">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2.5 whitespace-nowrap min-w-max py-0.5 justify-start md:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchTerm("");
                  }}
                  className="relative px-5 py-1.5 text-xs font-semibold tracking-wider rounded-full cursor-pointer transition-all duration-200 select-none text-zinc-505 hover:text-zinc-950 focus:outline-none"
                  id={`cat-filter-${cat.id}`}
                >
                  <span className={`relative z-10 transition-colors duration-150 ${activeCategory === cat.id ? "text-white font-extrabold" : ""}`}>
                    {cat.label}
                  </span>
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="activeCategory"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className="absolute inset-0 bg-zinc-950 rounded-full shadow-md"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-zinc-200 bg-white overflow-hidden"
          >
            <div className="space-y-2 px-4 pt-4 pb-6 font-sans">
              {/* Search in mobile screen with classy styling */}
              {currentView === "shop" && (
                <div className="relative mb-4">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Search className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search model, designer scent..."
                    className="w-full h-11 rounded-full border border-zinc-200 bg-[#FAFAFA] pl-11 pr-5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-950"
                    id="search-input-mobile"
                  />
                </div>
              )}

              <button
                onClick={() => {
                  setCurrentView("shop");
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all ${
                  currentView === "shop" ? "bg-zinc-950 text-white" : "text-zinc-650 hover:bg-zinc-55"
                }`}
                id="mobile-nav-buy"
              >
                Atelier Shop
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
