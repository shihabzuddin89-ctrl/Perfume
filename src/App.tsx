/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, Heart, ShieldCheck, Flame, Star, Award, Sparkles, MessageCircle, Truck, Droplets, RotateCcw } from "lucide-react";

import { Perfume, CartItem, Order, Review } from "./types";
import { INITIAL_PERFUMES } from "./data/perfumes";
import { db, OperationType, handleFirestoreError } from "./lib/firebase";
import { collection, doc, setDoc, onSnapshot, writeBatch, updateDoc } from "firebase/firestore";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import CheckoutModal from "./components/CheckoutModal";
import CartDrawer from "./components/CartDrawer";
import TrackOrder from "./components/TrackOrder";
import AdminPanel from "./components/AdminPanel";

// Initial historic dummy reviews to make the system feel alive on load
const HISTORICAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    perfumeId: "creed-aventus",
    userName: "Adnan Chowdhury",
    rating: 5,
    comment: "Simply magnificent block! The pineapple note at the opening is super crisp and tropical. Lasts about 8-9 hours on my skin in Dhaka humidity. 100% original, verify code on box checked out perfectly! Highly recommended shop.",
    createdAt: "2026-05-20T10:30:00Z"
  },
  {
    id: "rev-2",
    perfumeId: "creed-aventus",
    userName: "Sajid Rahim",
    rating: 4,
    comment: "Awesome projection. Took the 10ml sample first to test, then immediately ordered the full size. Good service and fast delivery.",
    createdAt: "2026-05-28T14:15:00Z"
  },
  {
    id: "rev-3",
    perfumeId: "bleu-de-chanel",
    userName: "Farhana Eva",
    rating: 5,
    comment: "Bought this 5ml decant for my husband. He loves the high-profile woody grapefruit aroma. Truly premium and genuine decanting. Securely packed in fine atomizers with leakproof seal.",
    createdAt: "2026-05-15T08:12:00Z"
  },
  {
    id: "rev-4",
    perfumeId: "club-de-nuit-intense",
    userName: "Kazi Tanjil",
    rating: 5,
    comment: "This is a compliment beast in BD! Super strong projection and very identical to Creed Aventus. Excellent decant bottle structure by Fragrance Vault. Price is very budget friendly.",
    createdAt: "2026-06-01T12:00:00Z"
  }
];

// Initial historic dummy orders
const HISTORICAL_ORDERS: Order[] = [
  {
    id: "FV-928174",
    customerName: "Kazi Sazzad",
    customerPhone: "01728192403",
    shippingAddress: "House 24, Road 4, Sector 7, Uttara, Dhaka",
    district: "Dhaka",
    deliveryCharge: 80,
    items: [
      {
        perfumeId: "creed-aventus",
        brand: "Creed",
        name: "Aventus",
        selectedVolume: "10ml Decant",
        price: 2400,
        quantity: 1
      },
      {
        perfumeId: "club-de-nuit-intense",
        brand: "Armaf",
        name: "Club de Nuit Intense Man EDT",
        selectedVolume: "10ml Decant",
        price: 450,
        quantity: 1
      }
    ],
    totalAmount: 2930,
    paymentMethod: "bKash",
    paymentStatus: "Paid",
    paymentDetails: {
      phoneNumber: "01728192403",
      transactionId: "BKSH9F8X0W12Q",
      completedAt: "2026-06-01T11:45:00Z"
    },
    orderStatus: "Shipped",
    createdAt: "2026-06-01T11:40:00Z"
  },
  {
    id: "FV-482710",
    customerName: "Mahbubur Rahman",
    customerPhone: "01819203847",
    shippingAddress: "Gollamari intersection, Khulna Sadar, Khulna",
    district: "Outside Dhaka",
    deliveryCharge: 150,
    items: [
      {
        perfumeId: "lattafa-khamrah",
        brand: "Lattafa",
        name: "Khamrah EDP",
        selectedVolume: "100ml Full Bottle",
        price: 3950,
        quantity: 1
      }
    ],
    totalAmount: 4100,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    paymentDetails: {},
    orderStatus: "Delivered",
    createdAt: "2026-05-29T16:20:00Z"
  }
];

export default function App() {
  // --- Persistent Local Database State ---
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("fv_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Sync with Firestore (Realtime database listeners) ---
  useEffect(() => {
    // 1. Listen to perfumes & seed if empty
    const unsubPerfumes = onSnapshot(collection(db, "perfumes"), async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log("Seeding perfumes database...");
          const batch = writeBatch(db);
          INITIAL_PERFUMES.forEach((perfume) => {
            const docRef = doc(db, "perfumes", perfume.id);
            batch.set(docRef, perfume);
          });
          await batch.commit();
        } else {
          const list: Perfume[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Perfume);
          });
          setPerfumes(list);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "perfumes");
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "perfumes");
    });

    // 2. Listen to orders & seed if empty
    const unsubOrders = onSnapshot(collection(db, "orders"), async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log("Seeding orders...");
          const batch = writeBatch(db);
          HISTORICAL_ORDERS.forEach((order) => {
            const docRef = doc(db, "orders", order.id);
            batch.set(docRef, order);
          });
          await batch.commit();
        } else {
          const list: Order[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Order);
          });
          // Sort by creation date descending
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "orders");
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "orders");
    });

    // 3. Listen to reviews & seed if empty
    const unsubReviews = onSnapshot(collection(db, "reviews"), async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log("Seeding reviews...");
          const batch = writeBatch(db);
          HISTORICAL_REVIEWS.forEach((rev) => {
            const docRef = doc(db, "reviews", rev.id);
            batch.set(docRef, rev);
          });
          await batch.commit();
        } else {
          const list: Review[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Review);
          });
          setReviews(list);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "reviews");
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "reviews");
    });

    return () => {
      unsubPerfumes();
      unsubOrders();
      unsubReviews();
    };
  }, []);

  // --- Sync cart with localStorage (local only preference) ---
  useEffect(() => {
    localStorage.setItem("fv_cart", JSON.stringify(cart));
  }, [cart]);

  // --- Routing & UI States ---
  const [currentView, setCurrentView] = useState<"shop" | "admin" | "track">("shop");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Modal controllers
  const [selectedDetailPerfume, setSelectedDetailPerfume] = useState<Perfume | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  // Track if check out is for standard cart, or immediate single-item checkout (Buy Now)
  const [immediateCheckoutItem, setImmediateCheckoutItem] = useState<CartItem | null>(null);

  // Filter products list depending on category & Search terms
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes.top.some((n) => n.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCat = activeCategory === "all" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [perfumes, searchTerm, activeCategory]);

  // --- Cart Actions ---
  const handleAddToCart = (perfume: Perfume, selectedVolume: string, price: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.perfume.id === perfume.id && item.selectedVolume === selectedVolume
      );

      if (existingIdx > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIdx].quantity += 1;
        return nextCart;
      } else {
        return [...prevCart, { perfume, selectedVolume, price, quantity: 1 }];
      }
    });

    // Notify micro-animation/pop
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Buy Now Single Item express checkout controller ---
  const handleBuyNow = (perfume: Perfume, selectedVolume: string, price: number) => {
    const singleItem: CartItem = {
      perfume,
      selectedVolume,
      price,
      quantity: 1,
    };
    setImmediateCheckoutItem(singleItem);
    setIsCheckoutOpen(true);
  };

  // --- Order Processing Actions ---
  const handleOrderCompleted = async (newOrder: Order) => {
    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `orders/${newOrder.id}`);
    }
  };

  // --- Reviews adding pipeline ---
  const handleAddReview = async (perfumeId: string, userName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: "rev-" + Date.now(),
      perfumeId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    
    try {
      await setDoc(doc(db, "reviews", newRev.id), newRev);

      // Recalculate average perfume rating and reviews count for high realism!
      const matchedRevs = [...reviews.filter((r) => r.perfumeId === perfumeId), newRev];
      const averageRating = parseFloat(
        (matchedRevs.reduce((acc, r) => acc + r.rating, 0) / (matchedRevs.length || 1)).toFixed(1)
      );

      await updateDoc(doc(db, "perfumes", perfumeId), {
        rating: averageRating,
        reviewsCount: matchedRevs.length,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `reviews/${newRev.id}`);
    }
  };

  // --- Administration modifiers ---
  const handleUpdateOrderStatus = async (orderId: string, status: Order["orderStatus"]) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: Order["paymentStatus"]) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        paymentStatus: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleAddPerfumeToInventory = async (newPerfume: Perfume) => {
    try {
      await setDoc(doc(db, "perfumes", newPerfume.id), newPerfume);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `perfumes/${newPerfume.id}`);
    }
  };

  const handleToggleStockStatus = async (perfumeId: string, status: Perfume["stockStatus"]) => {
    try {
      await updateDoc(doc(db, "perfumes", perfumeId), {
        stockStatus: status,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `perfumes/${perfumeId}`);
    }
  };

  const handleOpenDetailModal = (perfume: Perfume) => {
    setSelectedDetailPerfume(perfume);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans antialiased text-zinc-900 flex flex-col justify-between selection:bg-zinc-950/10 selection:text-zinc-950">
      
      {/* HEADER SECTION */}
      <Header
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* CORE FRAMEWORK BODY LAYOUT */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: E-COMMERCE SHOP CATALOG */}
          {currentView === "shop" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
              <Hero />

              {/* Showcase items section */}
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-5 mb-8 text-left">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight text-zinc-950 font-serif">Popular Fragrances in Bangladesh</h3>
                    <p className="text-xs text-zinc-500">Fresh batches decanted in laboratory grade environment.</p>
                  </div>
                  
                  {/* Results indicator */}
                  <span className="text-xs font-mono font-bold text-zinc-400 mt-2 sm:mt-0 uppercase tracking-widest">
                    Showing {filteredPerfumes.length} Fragrances
                  </span>
                </div>

                {/* Grid of perfume card boards */}
                {filteredPerfumes.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <span className="text-sm font-bold text-[#8C7A62] block">No fragrances found matching your filters.</span>
                    <button
                      onClick={() => {
                        setActiveCategory("all");
                        setSearchTerm("");
                      }}
                      className="text-xs font-bold text-zinc-950 hover:underline cursor-pointer"
                    >
                      Reset active filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {filteredPerfumes.map((perfume) => (
                      <ProductCard
                        key={perfume.id}
                        perfume={perfume}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onOpenDetail={handleOpenDetailModal}
                      />
                    ))}
                  </div>
                )}

              </div>

              {/* Informative banners about BD delivery and bKash setup */}
              <div className="bg-zinc-950 py-20 text-white border-t border-zinc-900 font-sans">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
                  
                  {/* Manifesto Header */}
                  <div className="max-w-2xl text-left space-y-3">
                    <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 uppercase">
                      THE INTEGRITY OF DECANTING
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                      Sovereign Scent Authenticity & sterile Lab Standards
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Fragrance Vault is Bangladesh’s premier laboratory-grade decanting atelier. We maintain strict chemical isolation protocols to preserve molecular sillage and longevity of parents retail bottles.
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-850 pt-12">
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-inner">
                        <Truck className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-zinc-100 uppercase tracking-widest text-[11px]">Lightning Fast Courier</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Deliveries are handled by Steadfast and Pathao Cargo. Inside Dhaka takes 1 day, outside Dhaka divisional cities takes 2-3 business days. Sealed premium courier protection.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-inner">
                        <RotateCcw className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-zinc-100 uppercase tracking-widest text-[11px]">Doorstep Inspection Safety</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Pay safe with absolute confidence. Inspect the luxury atomizer package first at your doorstep, verify the holographic seal, then clear payment to the courier rider.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-inner">
                        <Droplets className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-zinc-100 uppercase tracking-widest text-[11px]">Decant Sterile Standards</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Each order is extracted with sterile precision medical-grade syringes directly from official retail bottles to preventing oxygenation or scent decay.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Reassurance footer bar inside the dark section */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-850 pt-10 text-xs text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span>Atelier Status: <strong className="text-zinc-200">Dispensing Sterile Batches</strong> (Updated live)</span>
                    </div>
                    <div className="flex gap-4 font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                      <span>• Authenticated Imports</span>
                      <span>• Premium Thick Glass Vials</span>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 2: TRACK ORDER COMPONENT */}
          {currentView === "track" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <TrackOrder orders={orders} />
            </motion.div>
          )}

          {/* VIEW 3: STORE ADMIN BACKOFFICE */}
          {currentView === "admin" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPanel
                orders={orders}
                perfumes={perfumes}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onAddPerfume={handleAddPerfumeToInventory}
                onToggleStock={handleToggleStockStatus}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER GENERAL GALA */}
      <footer className="bg-zinc-950 text-zinc-500 py-12 border-t border-zinc-900 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-white tracking-tight font-serif uppercase">FRAGRANCE<span className="text-zinc-400 font-sans tracking-wide">VAULT</span></h4>
            <p className="text-zinc-400">Authentic perfume decanting boutique. Dhaka, Bangladesh.</p>
            <p className="text-[10px] text-zinc-650">© 2026 Fragrance Vault BD. All rights reserved.</p>
          </div>

          <div className="flex gap-8">
            <div className="space-y-1.5 text-left">
              <h5 className="font-bold uppercase text-[10px] tracking-widest text-zinc-400">Support Direct</h5>
              <p className="text-[11px] text-zinc-250 font-bold">Hotline: +880 1970 829 411</p>
              <p>Email: shihabzuddin89@gmail.com</p>
            </div>
            
            <div className="space-y-1.5 text-left hidden sm:block">
              <h5 className="font-bold uppercase text-[10px] tracking-widest text-zinc-400">Payment Partners</h5>
              <div className="flex gap-2 text-[10px] font-bold">
                <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">bKash</span>
                <span className="text-orange-400 bg-orange-550/10 px-1.5 py-0.5 rounded">Nagad</span>
                <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">COD</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* OVERLAYS & MODAL DRAWERS */}
      
      {/* 1. Detail Popup */}
      <AnimatePresence>
        {selectedDetailPerfume && (
          <ProductDetailModal
            perfume={selectedDetailPerfume}
            onClose={() => setSelectedDetailPerfume(null)}
            onAddToCart={(perfume, vol, price) => {
              handleAddToCart(perfume, vol, price);
              setSelectedDetailPerfume(null);
            }}
            onBuyNow={(perfume, vol, price) => {
              handleBuyNow(perfume, vol, price);
              setSelectedDetailPerfume(null);
            }}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        )}
      </AnimatePresence>

      {/* 2. Slide-out cart drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemoveItem={handleRemoveCartItem}
            onUpdateQuantity={handleUpdateCartQuantity}
            onClearCart={handleClearCart}
            onCheckout={() => {
              setIsCartOpen(false);
              setImmediateCheckoutItem(null); // Clear immediate, checkout raw cart
              setIsCheckoutOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. Address form & Payment gateway overlay */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            cart={cart}
            onClose={() => {
              setIsCheckoutOpen(false);
              setImmediateCheckoutItem(null);
            }}
            onOrderCompleted={handleOrderCompleted}
            clearCart={handleClearCart}
            immediateCheckoutItem={immediateCheckoutItem}
          />
        )}
      </AnimatePresence>

      {/* WhatsApp Fixed Sticky Bubble for Quick trust (very standard in BD perfume shops!) */}
      <a
        href="tel:+8801970829411"
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
        title="Call Hotline"
        id="whatsapp-widget-bubble"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

    </div>
  );
}
