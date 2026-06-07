export interface Perfume {
  id: string;
  name: string;
  brand: string;
  originalPrice: number; // For 100ml full bottle
  discountPrice: number; // For 100ml full bottle
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  category: "men" | "women" | "unisex" | "decants" | "attar";
  volumeOptions: string[]; // e.g. ["5ml Decant", "10ml Decant", "50ml Bottle", "100ml Full Bottle"]
  priceByVolume: { [volume: string]: number }; // Price for each volume option
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  isFeatured: boolean;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export interface CartItem {
  perfume: Perfume;
  selectedVolume: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  district: "Dhaka" | "Outside Dhaka";
  deliveryCharge: number;
  items: {
    perfumeId: string;
    brand: string;
    name: string;
    selectedVolume: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: "COD" | "bKash" | "Nagad";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentDetails: {
    phoneNumber?: string;
    transactionId?: string;
    completedAt?: string;
  };
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  perfumeId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
