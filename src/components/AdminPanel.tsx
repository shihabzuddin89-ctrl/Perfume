import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, ListTodo, Layers, ShoppingBag, Landmark, PlusCircle, Check, Sparkles, TrendingUp, NotebookTabs, LockKeyhole, ShieldAlert, KeyRound, ArrowRight } from "lucide-react";
import { Order, Perfume } from "../types";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

interface AdminPanelProps {
  orders: Order[];
  perfumes: Perfume[];
  onUpdateOrderStatus: (orderId: string, status: Order["orderStatus"]) => void;
  onUpdatePaymentStatus: (orderId: string, status: Order["paymentStatus"]) => void;
  onAddPerfume: (newPerfume: Perfume) => void;
  onToggleStock: (perfumeId: string, status: Perfume["stockStatus"]) => void;
}

export default function AdminPanel({
  orders,
  perfumes,
  onUpdateOrderStatus,
  onUpdatePaymentStatus,
  onAddPerfume,
  onToggleStock,
}: AdminPanelProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "add">("orders");

  // Summary Widgets calculation
  const totalSalesFromPaid = useMemo(() => {
    return orders
      .filter((o) => o.paymentStatus === "Paid" || o.orderStatus === "Delivered")
      .reduce((acc, o) => acc + o.totalAmount, 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.orderStatus === "Pending").reduce((acc) => acc + 1, 0);
  }, [orders]);

  // Scent Add Form state
  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<"men" | "women" | "unisex" | "decants" | "attar">("men");
  const [price100ml, setPrice100ml] = useState(12000);
  const [price5ml, setPrice5ml] = useState(650);
  const [price10ml, setPrice10ml] = useState(1200);
  const [topNotesStr, setTopNotesStr] = useState("Pineapple, Apple, Bergamot");
  const [midNotesStr, setMidNotesStr] = useState("Birch, Jasmine, Rose");
  const [baseNotesStr, setBaseNotesStr] = useState("Amber, Oud, Vanilla, Oakmoss");
  
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !name.trim() || !desc.trim()) {
      alert("Please fill in basic description fields.");
      return;
    }

    const uniqueId = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);
    
    const newPerfume: Perfume = {
      id: uniqueId,
      name,
      brand,
      originalPrice: Math.round(price100ml * 1.15),
      discountPrice: price100ml,
      rating: 4.8,
      reviewsCount: 1,
      description: desc,
      // Pick a luxury high-resolution placeholder perfume image representing elegance
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
      category,
      volumeOptions: ["5ml Decant", "10ml Decant", "100ml Full Bottle"],
      priceByVolume: {
        "5ml Decant": price5ml,
        "10ml Decant": price10ml,
        "100ml Full Bottle": price100ml,
      },
      stockStatus: "In Stock",
      isFeatured: false,
      notes: {
        top: topNotesStr.split(",").map((n) => n.trim()),
        middle: midNotesStr.split(",").map((n) => n.trim()),
        base: baseNotesStr.split(",").map((n) => n.trim()),
      },
    };

    onAddPerfume(newPerfume);
    
    // Reset Form
    setName("");
    setBrand("");
    setDesc("");
    setSuccessMsg("Success! Scent successfully added and loaded dynamically into consumer view.");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user?.email || "";
      if (email.toLowerCase() === "shihabzuddin89@gmail.com") {
        setIsUnlocked(true);
      } else {
        setErrorMsg(`Unauthorized: "${email}" is not registered as a store manager. Please log in with the admin Google account or use the management passkey.`);
      }
    } catch (error: any) {
      console.error("Google Auth error:", error);
      setErrorMsg("Google login was blocked or closed by the browser. Try using the secure passkey entering method.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (passkeyInput.trim() === "Vault2026" || passkeyInput.trim() === "admin123") {
      setIsUnlocked(true);
    } else {
      setErrorMsg("Access Denied: Invalid store management passkey.");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 md:py-24 text-center select-none" id="admin-security-gate">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-zinc-200 p-8 md:p-10 shadow-xl space-y-8 text-center"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="p-4 bg-zinc-950 text-white rounded-2xl shadow-lg ring-4 ring-zinc-100">
              <LockKeyhole className="h-8 w-8 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-900 mt-2">
              Boutique Portal Locked
            </h2>
            <p className="text-xs text-zinc-500 max-w-sm">
              This backoffice panel is restricted to authorized store managers. Verify your identity or enter your key credentials.
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Authentication */}
            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 font-bold text-zinc-800 text-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 active:scale-[0.98] disabled:opacity-50"
              id="google-signin-btn"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.18 18.28 22.56 15.34 22.56 12.25z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              {authLoading ? "Synchronizing Auth..." : "Secure Sign in with Google"}
            </button>

            <div className="relative flex py-2 items-center text-xs text-zinc-400">
              <div className="flex-grow border-t border-zinc-200"></div>
              <span className="flex-shrink mx-4 uppercase tracking-widest font-mono text-[9px] font-bold">OR USE DELEGATE OVERRIDE</span>
              <div className="flex-grow border-t border-zinc-200"></div>
            </div>

            {/* Passkey Entry Form */}
            <form onSubmit={handlePasskeySubmit} className="space-y-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter Store Management Passkey"
                  className="w-full h-12 bg-white rounded-xl border border-zinc-200 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 outline-none focus:ring-1 focus:ring-zinc-900 transition-all font-mono tracking-widest text-center"
                  id="passkey-input"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-black text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-1.5"
                id="submit-passkey-btn"
              >
                Validate Passkey <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-950 text-xs font-semibold text-left flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}


        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 space-y-8 text-left" id="admin-panel-container">
      
      {/* Header and statistics panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="rounded bg-zinc-900/5 text-zinc-950 font-bold text-xs uppercase tracking-wider px-2.5 py-1">
            Store Management Backoffice
          </span>
          <h2 className="text-3xl font-bold font-serif text-zinc-950 mt-2 tracking-tight">Fragrance Control Dashboard</h2>
          <p className="text-xs text-zinc-500">Analyze orders, checkout payments, and update scent catalogs dynamically.</p>
        </div>

        {/* Dynamic tabs navigation */}
        <div className="flex space-x-1 border border-zinc-200 p-1 rounded-xl bg-zinc-50 self-start md:self-center font-sans">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "orders" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-200/40"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === "inventory" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-200/40"
            }`}
          >
            Volume/Stock ({perfumes.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "add" ? "bg-zinc-950 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-200/40"
            }`}
          >
            <Plus className="h-3.5 w-3.5" /> Launch Scent
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/85 space-y-1.5 font-sans">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Sales Invoiced</span>
            <Landmark className="h-4 w-4 text-zinc-950" />
          </div>
          <p className="text-2xl font-black text-zinc-950">৳ {totalSalesFromPaid.toLocaleString()}</p>
          <p className="text-[9px] text-zinc-500 flex items-center gap-0.5 font-bold">
            <TrendingUp className="h-3 w-3 text-zinc-950" /> Calculated from Paid / Delivered
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/85 space-y-1.5 font-sans">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Orders Logged</span>
            <ShoppingBag className="h-4 w-4 text-zinc-950" />
          </div>
          <p className="text-2xl font-black text-zinc-950">{orders.length}</p>
          <p className="text-[9px] font-semibold text-zinc-400">Merchant sandbox sessions total</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/85 space-y-1.5 font-sans">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Pending Delivery</span>
            <ListTodo className="h-4 w-4 text-zinc-950" />
          </div>
          <p className="text-2xl font-black text-[#B45309]">{pendingCount}</p>
          <p className="text-[9px] font-bold text-[#B45309]/80">Requires packaging & courier transfer</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/85 space-y-1.5 font-sans">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Active Flavors</span>
            <Layers className="h-4 w-4 text-zinc-950" />
          </div>
          <p className="text-2xl font-black text-emerald-600">{perfumes.length}</p>
          <p className="text-[9px] font-semibold text-zinc-450">Available decant profiles</p>
        </div>

      </div>

      {/* Main Tab views */}
      <div className="bg-white rounded-2xl border border-zinc-250 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.035)]">
        
        {/* PANEL A: Orders List Table */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs italic">
                No orders are registered in active database. Place an order on the checkout screen first!
              </div>
            ) : (
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-4">Ref # & Date</th>
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Ordered Items Summary</th>
                    <th className="px-6 py-4">Location Charge</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4 text-center">Fulfillment Courier Status</th>
                    <th className="px-6 py-4 text-center">Payment Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50/50 transition-all font-sans">
                      
                      {/* Ref No */}
                      <td className="px-6 py-4 align-top font-sans">
                        <span className="font-mono font-bold text-zinc-950 text-xs block">{o.id}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-sans">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="px-6 py-4 align-top font-sans">
                        <p className="font-semibold text-zinc-950">{o.customerName}</p>
                        <p className="text-xs text-zinc-500 font-mono select-all mt-0.5">{o.customerPhone}</p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs mt-1" title={o.shippingAddress}>
                          📍 {o.shippingAddress}
                        </p>
                        {o.notes && (
                          <div className="mt-1 flex items-start gap-1 p-1 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-yellow-800 font-medium">
                            <NotebookTabs className="h-3 w-3 mt-0.5 flex-none" />
                            <span>Guide: {o.notes}</span>
                          </div>
                        )}
                      </td>

                      {/* Items Ordered */}
                      <td className="px-6 py-4 align-top text-xs space-y-1 font-medium">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="text-gray-700 bg-gray-50 p-1 rounded font-semibold text-[11px]">
                            {it.brand} {it.name} - <span className="text-[#8C7A62]">{it.selectedVolume}</span> × {it.quantity}
                          </div>
                        ))}
                      </td>

                      {/* Area */}
                      <td className="px-6 py-4 align-top">
                        <span className="text-xs font-bold text-gray-900">{o.district}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">৳{o.deliveryCharge}</span>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 align-top font-sans">
                        <span className="font-extrabold text-zinc-950 font-sans">৳ {o.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block mt-0.5">{o.paymentMethod}</span>
                      </td>

                      {/* Order status dropdown */}
                      <td className="px-6 py-4 align-top text-center">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order["orderStatus"])}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg border outline-none select-none ${
                            o.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            o.orderStatus === "Shipped" ? "bg-blue-50 text-blue-800 border-blue-200" :
                            o.orderStatus === "Processing" ? "bg-purple-50 text-purple-800 border-purple-200" :
                            o.orderStatus === "Cancelled" ? "bg-red-50 text-red-800 border-red-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                          id={`admin-order-status-${o.id}`}
                        >
                          <option value="Pending">🕒 Pending</option>
                          <option value="Processing">📦 Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✓ Delivered</option>
                          <option value="Cancelled">✕ Cancelled</option>
                        </select>
                      </td>

                      {/* Payment verification */}
                      <td className="px-6 py-4 align-top text-center space-y-1.5">
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => onUpdatePaymentStatus(o.id, e.target.value as Order["paymentStatus"])}
                          className={`text-xs font-bold py-1.5 px-3 rounded-lg border outline-none select-none block mx-auto ${
                            o.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            o.paymentStatus === "Failed" ? "bg-red-50 text-red-800 border-red-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                          id={`admin-payment-status-${o.id}`}
                        >
                          <option value="Pending">🕒 Unpaid</option>
                          <option value="Paid">✓ Verified Paid</option>
                          <option value="Failed">✕ Failed</option>
                        </select>
                        {o.paymentDetails?.transactionId && (
                          <div className="text-[10px] font-mono text-gray-500 bg-gray-100 rounded px-1.5 py-0.5 inline-block">
                            TX: {o.paymentDetails.transactionId}
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PANEL B: Inventory List Table */}
        {activeTab === "inventory" && (
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-4">Product details</th>
                  <th className="px-6 py-4 text-center">Category Type</th>
                  <th className="px-6 py-4">Sample decant / Retail Volume Pricing</th>
                  <th className="px-6 py-4 text-center">Active Stock Gate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perfumes.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-all">
                    
                    <td className="px-6 py-4 align-top flex gap-3 items-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-md object-cover border border-zinc-200 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-zinc-950 leading-tight font-serif text-sm">{p.name}</p>
                        <p className="text-[9px] text-zinc-400 font-semibold font-sans uppercase tracking-widest mt-0.5">{p.brand}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top text-center">
                      <span className="rounded bg-sky-50 text-sky-800 border border-sky-100 font-bold uppercase text-[9px] px-2 py-0.5">
                        {p.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top space-y-1">
                      {p.volumeOptions.map((vol) => (
                        <div key={vol} className="text-xs flex gap-2 font-semibold">
                          <span className="text-gray-400 uppercase tracking-wide text-[10px]">{vol}:</span>
                          <span className="text-gray-900 font-mono">৳ {p.priceByVolume[vol]?.toLocaleString()}</span>
                        </div>
                      ))}
                    </td>

                    <td className="px-6 py-4 align-top text-center">
                      <select
                        value={p.stockStatus}
                        onChange={(e) => onToggleStock(p.id, e.target.value as Perfume["stockStatus"])}
                        className={`text-xs font-bold py-1.5 px-3 rounded-lg border outline-none select-none ${
                          p.stockStatus === "In Stock" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          p.stockStatus === "Low Stock" ? "bg-amber-50 text-amber-800 border-amber-200" :
                          "bg-red-50 text-red-00 border-red-200"
                        }`}
                        id={`admin-stock-status-${p.id}`}
                      >
                        <option value="In Stock">✓ In Stock</option>
                        <option value="Low Stock">⚠️ Low Stock</option>
                        <option value="Out of Stock">✕ Out of Stock</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PANEL C: Add New Scent */}
        {activeTab === "add" && (
          <div className="p-6 md:p-8">
            <h3 className="text-base font-bold uppercase tracking-wider text-zinc-950 mb-4 flex items-center gap-1.5 font-sans">
              <PlusCircle className="h-5 w-5 text-zinc-950" /> Put a New Scent into Production
            </h3>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs uppercase mb-6 flex items-center gap-2">
                <Check className="h-4 w-4 bg-emerald-600 rounded-full text-white p-0.5 whitespace-nowrap" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Fragrance Brand Name *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Tom Ford, Creed, Dior"
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 outline-none text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                    required
                    id="add-brand-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Scent Model Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lost Cherry EDP"
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 outline-none text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                    required
                    id="add-name-input"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Scent Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3 bg-white border border-zinc-200 rounded-lg outline-none text-sm focus:border-zinc-950"
                    id="add-category-select"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                    <option value="decants">Premium Decants</option>
                    <option value="attar">Pure Attar / Oud</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Retail Price of Full 100ml Bottle (BDT) *
                  </label>
                  <input
                    type="number"
                    value={price100ml}
                    onChange={(e) => setPrice100ml(Number(e.target.value))}
                    className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 outline-none text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                    required
                    id="add-price100ml-input"
                    min={1}
                  />
                </div>

              </div>

              {/* Sample prices mapping */}
              <div className="grid grid-cols-2 gap-4 bg-zinc-55 p-4 rounded-xl border border-zinc-200 font-sans">
                
                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase block mb-1">
                    5ml Decant price (BDT) *
                  </label>
                  <input
                    type="number"
                    value={price5ml}
                    onChange={(e) => setPrice5ml(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 outline-none text-xs focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20 bg-white"
                    required
                    id="add-price5ml-input"
                    min={1}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 uppercase block mb-1">
                    10ml Decant price (BDT) *
                  </label>
                  <input
                    type="number"
                    value={price10ml}
                    onChange={(e) => setPrice10ml(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 outline-none text-xs focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20 bg-white"
                    required
                    id="add-price10ml-input"
                    min={1}
                  />
                </div>

              </div>

              <div className="space-y-4 font-sans">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest block border-b pb-1">Notes Breakdown (Comma separated)</h4>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-zinc-700 uppercase block mb-1">🍋 Top accords</label>
                    <input
                      type="text"
                      value={topNotesStr}
                      onChange={(e) => setTopNotesStr(e.target.value)}
                      className="w-full h-10 px-2.5 rounded border border-zinc-200 bg-white outline-none text-xs focus:border-zinc-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 uppercase block mb-1">🌸 Heart accords</label>
                    <input
                      type="text"
                      value={midNotesStr}
                      onChange={(e) => setMidNotesStr(e.target.value)}
                      className="w-full h-10 px-2.5 rounded border border-zinc-200 bg-white outline-none text-xs focus:border-zinc-950"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 uppercase block mb-1">🪵 Base accords</label>
                    <input
                      type="text"
                      value={baseNotesStr}
                      onChange={(e) => setBaseNotesStr(e.target.value)}
                      className="w-full h-10 px-2.5 rounded border border-zinc-200 bg-white outline-none text-xs focus:border-zinc-950"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                  Story & Description of olfactory feels *
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Elaborate on projection, durability, sillage, suitable occasions, and dry down profile..."
                  className="w-full p-3.5 h-24 text-sm rounded-lg border border-zinc-200 outline-none resize-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                  required
                  id="add-desc-input"
                />
              </div>

              <div className="pt-2 font-sans">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-855 text-white font-bold uppercase tracking-widest text-[11px] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  id="add-new-perfume-btn"
                >
                  <Sparkles className="h-4 w-4 text-zinc-100" /> Put Scent Live Now
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </div>
  );
}
