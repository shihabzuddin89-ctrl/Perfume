import React, { useState, useMemo } from "react";
import { X, ShieldCheck, Wallet, Truck, CreditCard, ChevronRight, CheckCircle, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Order } from "../types";
import { SHIPPINGS } from "../data/perfumes";

interface CheckoutModalProps {
  cart: CartItem[];
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
  clearCart: () => void;
  immediateCheckoutItem?: CartItem | null;
}

export default function CheckoutModal({
  cart,
  onClose,
  onOrderCompleted,
  clearCart,
  immediateCheckoutItem,
}: CheckoutModalProps) {
  // Use either the full cart, or the immediate checkout item (if Buy Now was clicked)
  const orderItems = useMemo(() => {
    if (immediateCheckoutItem) return [immediateCheckoutItem];
    return cart;
  }, [cart, immediateCheckoutItem]);

  // Pricing calculations
  const itemsSubtotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [orderItems]);

  // Delivery state
  const [district, setDistrict] = useState<"Dhaka" | "Outside Dhaka">("Dhaka");
  const deliveryCost = useMemo(() => {
    return district === "Dhaka" ? SHIPPINGS.dhaka.cost : SHIPPINGS.outside.cost;
  }, [district]);

  const grandTotal = itemsSubtotal + deliveryCost;

  // Form Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "bKash" | "Nagad">("COD");

  // Phone validation error helper
  const [phoneError, setPhoneError] = useState("");

  // Simulated Payment Gate States (bKash / Nagad OTP system)
  const [gatewayStep, setGatewayStep] = useState<"none" | "number" | "otp" | "pin" | "processing">("none");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [paymentOtp, setPaymentOtp] = useState("");
  const [paymentPin, setPaymentPin] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [gatewayError, setGatewayError] = useState("");

  // Post Order Placement view
  const [orderReceipt, setOrderReceipt] = useState<Order | null>(null);

  const validatePhone = (number: string) => {
    const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return regex.test(number.replace(/\s+/g, ""));
  };

  const handleCreateOrder = (pStatus: "Pending" | "Paid" = "Pending", txDetails: any = {}) => {
    const generatedId = "FV-" + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: generatedId,
      customerName,
      customerPhone,
      shippingAddress,
      district,
      deliveryCharge: deliveryCost,
      items: orderItems.map((item) => ({
        perfumeId: item.perfume.id,
        brand: item.perfume.brand,
        name: item.perfume.name,
        selectedVolume: item.selectedVolume,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: pStatus,
      paymentDetails: txDetails,
      orderStatus: "Pending",
      createdAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    // Save in main state
    onOrderCompleted(newOrder);
    setOrderReceipt(newOrder);

    // If it was standard cart, clear it
    if (!immediateCheckoutItem) {
      clearCart();
    }
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");

    if (!customerName.trim() || !shippingAddress.trim()) {
      return;
    }

    if (!validatePhone(customerPhone)) {
      setPhoneError("Please enter a valid Bangladeshi mobile number (e.g. 017XXXXXXYY)");
      return;
    }

    if (paymentMethod === "COD") {
      handleCreateOrder("Pending");
    } else {
      // Trigger Mobile gateway UI overlay!
      setPaymentPhone(customerPhone);
      setGatewayStep("number");
    }
  };

  // Simulated gateway flows
  const handleGatewayNumberSubmit = () => {
    setGatewayError("");
    if (!paymentPhone.match(/^\d{11}$/)) {
      setGatewayError("Please enter a valid 11-digit wallet number.");
      return;
    }
    // Generate a random 6 digit OTP for realistic simulation
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGenerated(randomOtp);
    setGatewayStep("otp");
  };

  const handleGatewayOtpSubmit = () => {
    setGatewayError("");
    // Let any 6-digit number pass for easy testing, but we can display the correct one to be friendly!
    if (paymentOtp.length < 4) {
      setGatewayError("Invalid verification code structure.");
      return;
    }
    setGatewayStep("pin");
  };

  const handleGatewayPinSubmit = () => {
    setGatewayError("");
    if (paymentPin.length < 4) {
      setGatewayError("PIN must be at least 4 digits.");
      return;
    }
    setGatewayStep("processing");

    setTimeout(() => {
      // Generate a mock Transaction ID
      const txId = (paymentMethod === "bKash" ? "BKSH" : "NGD") + Math.random().toString(36).substring(2, 10).toUpperCase();
      handleCreateOrder("Paid", {
        phoneNumber: paymentPhone,
        transactionId: txId,
        completedAt: new Date().toISOString(),
      });
      setGatewayStep("none");
    }, 2800);
  };

  if (orderReceipt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-zinc-200 shadow-2xl text-center"
          id="receipt-modal-bg"
        >
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-50 p-3 border border-emerald-100">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-zinc-950 tracking-tight font-serif">Order Received!</h2>
          <p className="text-xs text-zinc-500 mt-2 font-sans md:px-4">
            Thank you, <span className="font-bold text-zinc-900">{orderReceipt.customerName}</span>. Your order <span className="font-bold text-zinc-900 underline font-mono select-all decoration-zinc-400">{orderReceipt.id}</span> is successfully logged. A representative will call you shortly to verify delivery details.
          </p>

          {/* Delivery Note */}
          <div className="my-5 p-4 bg-zinc-55 bg-zinc-50/80 rounded-2xl border border-zinc-200 text-xs text-left space-y-2 font-sans">
            <div className="flex justify-between border-b pb-2 border-zinc-150">
              <span className="font-semibold text-zinc-400">Delivery Location</span>
              <span className="font-bold text-zinc-900">{orderReceipt.district} District</span>
            </div>
            <div className="flex justify-between border-b pb-2 border-zinc-150">
              <span className="font-semibold text-zinc-400">Shipping Mode</span>
              <span className="font-bold text-zinc-900">
                {orderReceipt.district === "Dhaka" ? "Next-day Express" : "Standard Nationwide Courier"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2 border-zinc-150">
              <span className="font-semibold text-zinc-400">Payment Channel</span>
              <span className="font-bold text-zinc-900 uppercase">{orderReceipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b pb-2 border-zinc-150">
              <span className="font-semibold text-zinc-400">Payment Status</span>
              <span className={`font-bold ${orderReceipt.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"}`}>
                {orderReceipt.paymentStatus === "Paid" ? "Paid (Sandbox)" : "Pending (Cash on Delivery)"}
              </span>
            </div>
            {orderReceipt.paymentDetails?.transactionId && (
              <div className="flex justify-between pt-1 font-mono text-[11px]">
                <span className="text-zinc-450 font-bold">Transaction ID:</span>
                <span className="text-zinc-800 font-bold bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                  {orderReceipt.paymentDetails.transactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2.5 text-sm font-black border-t border-dashed border-zinc-200">
              <span className="text-zinc-950 font-serif">Grand Total</span>
              <span className="text-zinc-950 font-mono font-extrabold text-base">৳ {orderReceipt.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2.5 font-sans">
            <button
              onClick={onClose}
              className="w-full h-11 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md cursor-pointer"
              id="receipt-done-btn"
            >
              Continue Shopping
            </button>
            <p className="text-[10px] text-zinc-400">Please note down your Order ID to track status in Real-Time</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" id="checkout-modal-backdrop">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-250 flex flex-col md:flex-row max-h-[90vh]"
        id="checkout-modal-container"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-700 bg-white hover:bg-zinc-50 rounded-full border border-gray-100 shadow-sm transition-all"
          id="close-checkout-modal-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left pane: Checkout Form */}
        <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto text-left max-h-[90vh]">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Express Delivery</span>
          <h2 className="text-2xl font-black text-[#1A1A1A] mt-1 tracking-tight">Checkout Details</h2>
          <p className="text-xs text-[#8C7A62] mt-0.5 mb-6">Complete address for cash-handling or mobile banking validation.</p>

          <form onSubmit={handleSubmitCheckout} className="space-y-4">
            
            {/* Input Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Recipient Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Shakib Al Hasan"
                className="w-full h-11 px-3.5 rounded-lg border border-zinc-200 outline-none text-sm focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                required
                id="checkout-name-input"
              />
            </div>

            {/* Input Phone */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Bangladeshi Mobile Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 01712345678"
                className={`w-full h-11 px-3.5 rounded-lg border outline-none text-sm focus:ring-1 focus:ring-zinc-950/25 ${
                  phoneError ? "border-red-500 focus:border-red-500" : "border-zinc-200 focus:border-zinc-950"
                }`}
                required
                id="checkout-phone-input"
              />
              {phoneError ? (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{phoneError}</p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-1">
                  Ensure the number is active for courier confirmation calls.
                </p>
              )}
            </div>

            {/* District Area Selection (Dhaka / Outside) */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Delivery Destination Region *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDistrict("Dhaka")}
                  className={`p-3 rounded-lg border text-left flex items-start justify-between transition-all cursor-pointer ${
                    district === "Dhaka"
                      ? "border-zinc-950 bg-zinc-950/5 shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                  id="district-dhaka-btn"
                >
                  <div>
                    <p className="text-xs font-bold">Inside Dhaka</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Express Home Delivery</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-zinc-950">৳ 80</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDistrict("Outside Dhaka")}
                  className={`p-3 rounded-lg border text-left flex items-start justify-between transition-all cursor-pointer ${
                    district === "Outside Dhaka"
                      ? "border-zinc-950 bg-zinc-950/5 shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                  id="district-outside-btn"
                >
                  <div>
                    <p className="text-xs font-bold">Outside Dhaka</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Steadfast Courier / Home</p>
                  </div>
                  <span className="text-xs font-sans font-bold text-zinc-950">৳ 150</span>
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Full Shipping Address *
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House No, Road Name, Area/Thana, Landmark inside city..."
                className="w-full p-3 h-20 text-sm rounded-lg border border-zinc-200 outline-none resize-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                required
                id="checkout-address-input"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please deliver after 2:00 PM if possible"
                className="w-full h-10 px-3.5 rounded-lg border border-zinc-200 outline-none text-xs focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950/20"
                id="checkout-notes-input"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="border-t border-zinc-200/80 pt-4 font-sans">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
                Select Your Payment Gateway Mode *
              </label>
              <div className="grid grid-cols-3 gap-2">
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3 rounded-lg border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-amber-600 bg-amber-50/50"
                      : "border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"
                  }`}
                  id="pay-method-cod"
                >
                  <Truck className="h-4.5 w-4.5 text-amber-700" />
                  <div>
                    <p className="text-[11px] font-bold">COD</p>
                    <p className="text-[9px] text-gray-450">Cash on Delivery</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bKash")}
                  className={`p-3 rounded-lg border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
                    paymentMethod === "bKash"
                      ? "border-[#E2125D] bg-[#E2125D]/5"
                      : "border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"
                  }`}
                  id="pay-method-bkash"
                >
                  <Smartphone className="h-4.5 w-4.5 text-[#E2125D]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#E2125D]">bKash</p>
                    <p className="text-[9px] text-gray-450">Merchant Pay</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Nagad")}
                  className={`p-3 rounded-lg border flex flex-col justify-between h-20 text-left transition-all cursor-pointer ${
                    paymentMethod === "Nagad"
                      ? "border-[#F15A22] bg-[#F15A22]/5"
                      : "border-zinc-200 bg-white text-gray-600 hover:bg-zinc-50"
                  }`}
                  id="pay-method-nagad"
                >
                  <Smartphone className="h-4.5 w-4.5 text-[#F15A22]" />
                  <div>
                    <p className="text-[11px] font-bold text-[#F15A22]">Nagad</p>
                    <p className="text-[9px] text-gray-450">Direct Pay</p>
                  </div>
                </button>

              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest text-[11px] transition-colors shadow-lg active:scale-[0.98] cursor-pointer"
                id="checkout-submit-btn"
              >
                {paymentMethod === "COD"
                  ? "Confirm Cash on Delivery Order"
                  : `Initiate Secure ${paymentMethod} Payment Gateway`}
              </button>
            </div>

          </form>
        </div>

        {/* Right pane: Product summary details */}
        <div className="w-full md:w-2/5 bg-zinc-50/70 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-200 max-h-[90vh] overflow-y-auto font-sans">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950">Ordered items</h3>
            
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center border-b border-zinc-150 pb-3 h-auto text-left">
                  <img
                    src={item.perfume.image}
                    alt={item.perfume.name}
                    className="h-11 w-11 rounded-md object-cover border border-zinc-200 bg-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-950 truncate">{item.perfume.name}</p>
                    <p className="text-[10px] text-zinc-500 font-semibold">{item.selectedVolume} × {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 leading-none">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="border-t border-zinc-200 pt-4 space-y-2.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cart Subtotal</span>
                <span className="font-bold text-gray-900">৳ {itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery Charge ({district})</span>
                <span className="font-bold text-gray-900">৳ {deliveryCost}</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-zinc-200 text-sm font-black">
                <span className="text-zinc-950">Grand Total</span>
                <span className="text-zinc-950 text-base font-extrabold font-sans">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 mt-6 text-left space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Secure Shopping Certification
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              We encrypt address details in local caches to respect user privacy boundaries. All products are authentic imported fragrance decants.
            </p>
          </div>
        </div>
      </div>

      {/* ULTRA-REALISTIC SIMULATED PAYMENT GATEWAY OVERLAY (bkash / nagad) */}
      <AnimatePresence>
        {gatewayStep !== "none" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative border ${
                paymentMethod === "bKash" ? "bg-[#E2125D] border-[#E2125D]" : "bg-[#F15A22] border-[#F15A22]"
              } text-white`}
              id="simulated-gateway-container"
            >
              {/* Top logo header */}
              <div className="p-5 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center font-black text-xl text-black select-none">
                    {paymentMethod === "bKash" ? (
                      <span className="text-[#E2125D] font-sans">b</span>
                    ) : (
                      <span className="text-[#F15A22] font-sans">N</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide uppercase">{paymentMethod} Sandbox Gateway</h4>
                    <p className="text-[10px] opacity-75">Secure Merchant checkout</p>
                  </div>
                </div>

                <button
                  onClick={() => setGatewayStep("none")}
                  className="text-white hover:text-black/30 text-xs bg-white/10 rounded px-2 py-1"
                >
                  Cancel
                </button>
              </div>

              {/* Gateway Body depending on step */}
              <div className="p-6 text-center space-y-4 text-left">
                
                {/* Information Header */}
                <div className="bg-black/20 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Merchant Name</span>
                    <span className="font-bold">FRAGRANCE VAULT BD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Invoice Ref</span>
                    <span className="font-bold">#FV-{Math.floor(2891+Math.random()*9124)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-yellow-300">
                    <span>Payable Amount</span>
                    <span>৳ {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {gatewayError && (
                  <div className="bg-black/20 p-3 rounded-lg text-[11px] font-bold text-yellow-200 border border-yellow-300/30 text-center leading-normal">
                    ⚠️ {gatewayError}
                  </div>
                )}

                {/* Step 1: Wallet Input */}
                {gatewayStep === "number" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold block opacity-90 uppercase tracking-wider text-left">
                      Enter Your Mobile Wallet Account Number (11 digit)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="e.g. 01700000000"
                        className="w-full h-11 px-4 bg-white text-black font-semibold text-center text-lg rounded-md outline-none border-none tracking-widest placeholder:tracking-normal"
                        maxLength={11}
                        id="gateway-wallet-number"
                      />
                    </div>
                    <p className="text-[10px] opacity-60 text-center">
                      By clicking Next, you agree to terms & conditions of {paymentMethod}.
                    </p>
                    <button
                      onClick={handleGatewayNumberSubmit}
                      className="w-full h-11 rounded-md bg-black hover:bg-[#1A1A1A] font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                      id="gateway-step1-btn"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Step 2: Simulated OTP */}
                {gatewayStep === "otp" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold block opacity-90 uppercase tracking-wider text-left">
                      Enter Verification Code (OTP)
                    </label>
                    <input
                      type="text"
                      value={paymentOtp}
                      onChange={(e) => setPaymentOtp(e.target.value)}
                      placeholder="Enter verification code"
                      className="w-full h-11 px-4 bg-white text-black font-semibold text-center text-lg rounded-md outline-none tracking-widest"
                      maxLength={6}
                      id="gateway-otp-input"
                    />
                    
                    {/* SIMULATED SMS BANNER HELP */}
                    <div className="p-2 bg-yellow-400 text-black rounded text-[10px] font-bold text-center border-1 border-dashed border-yellow-600 animate-pulse">
                      📱 SIM SMS Received: Verification Code is [{otpGenerated}]
                    </div>

                    <button
                      onClick={() => setPaymentOtp(otpGenerated)}
                      type="button"
                      className="text-[10px] font-bold text-yellow-200 underline block mx-auto hover:text-white"
                    >
                      Click to Auto-fill Code
                    </button>

                    <button
                      onClick={handleGatewayOtpSubmit}
                      className="w-full h-11 rounded-md bg-black hover:bg-[#1A1A1A] font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                      id="gateway-step2-btn"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Step 3: PIN Input */}
                {gatewayStep === "pin" && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold block opacity-90 uppercase tracking-wider text-left">
                      Enter Account PIN number
                    </label>
                    <input
                      type="password"
                      value={paymentPin}
                      onChange={(e) => setPaymentPin(e.target.value)}
                      placeholder="● ● ● ●"
                      className="w-full h-11 px-4 bg-white text-black font-semibold text-center text-2xl rounded-md outline-none tracking-widest"
                      maxLength={5}
                      id="gateway-pin-input"
                    />
                    <div className="p-2 bg-black/30 rounded text-[10px] leading-tight text-center">
                      🔒 Secured client Sandbox: PIN is evaluated locally for sandbox satisfaction representation.
                    </div>
                    <button
                      onClick={handleGatewayPinSubmit}
                      className="w-full h-11 rounded-md bg-black hover:bg-[#1A1A1A] font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                      id="gateway-step3-btn"
                    >
                      Confirm Payment
                    </button>
                  </div>
                )}

                {/* Processing Spinner */}
                {gatewayStep === "processing" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-white border-t-transparent" />
                    <div>
                      <p className="text-sm font-bold animate-pulse">Validating Bank Credentials...</p>
                      <p className="text-[10px] opacity-75 mt-1">Acquiring token from Central Clearing Node</p>
                    </div>
                  </div>
                )}

              </div>

              {/* Gateway Brand Footer */}
              <div className="bg-black/10 py-2.5 text-center text-[9px] uppercase tracking-wider border-t border-white/10">
                Powered by official {paymentMethod} Secure Api integration.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
