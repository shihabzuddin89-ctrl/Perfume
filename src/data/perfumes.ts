import { Perfume } from "../types";

export const INITIAL_PERFUMES: Perfume[] = [
  {
    id: "creed-aventus",
    name: "Aventus",
    brand: "Creed",
    originalPrice: 38000,
    discountPrice: 34500,
    rating: 4.8,
    reviewsCount: 142,
    description: "The exceptional Aventus was inspired by the dramatic life of a historic emperor, celebrating strength, power and success. Introduced in 2010, this scent has grown to become the most popular fragrance in the history of the brand.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
    category: "men",
    volumeOptions: ["5ml Decant", "10ml Decant", "50ml Bottle", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 1250,
      "10ml Decant": 2400,
      "50ml Bottle": 18500,
      "100ml Full Bottle": 34500
    },
    stockStatus: "In Stock",
    isFeatured: true,
    notes: {
      top: ["Pineapple", "Bergamot", "Blackcurrant", "Apple"],
      middle: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
      base: ["Musk", "Oakmoss", "Ambergris", "Vanilla"]
    }
  },
  {
    id: "bleu-de-chanel",
    name: "Bleu de Chanel EDP",
    brand: "Chanel",
    originalPrice: 22000,
    discountPrice: 19500,
    rating: 4.9,
    reviewsCount: 218,
    description: "An ode to masculine freedom expressed in a woody aromatic fragrance with a captivating trail. A timeless scent housed in a bottle of deep and mysterious blue.",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600",
    category: "men",
    volumeOptions: ["5ml Decant", "10ml Decant", "50ml Bottle", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 850,
      "10ml Decant": 1600,
      "50ml Bottle": 11500,
      "100ml Full Bottle": 19500
    },
    stockStatus: "In Stock",
    isFeatured: true,
    notes: {
      top: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
      middle: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
      base: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli", "Labdanum"]
    }
  },
  {
    id: "sauvage-dior",
    name: "Sauvage EDP",
    brand: "Dior",
    originalPrice: 20000,
    discountPrice: 17800,
    rating: 4.7,
    reviewsCount: 384,
    description: "An act of creation inspired by wide-open spaces. An ozone blue sky that dominates a white-hot rocky landscape. The strong gust of Citrus in Sauvage is powerfully anchored by the raw nobility of Amberwood.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600",
    category: "men",
    volumeOptions: ["5ml Decant", "10ml Decant", "50ml Bottle", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 750,
      "10ml Decant": 1400,
      "50ml Bottle": 10500,
      "100ml Full Bottle": 17800
    },
    stockStatus: "In Stock",
    isFeatured: false,
    notes: {
      top: ["Calabrian Bergamot", "Pepper"],
      middle: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Vetiver", "Patchouli", "Geranium", "Elemi"],
      base: ["Ambroxan", "Cedar", "Labdanum"]
    }
  },
  {
    id: "br540-extrait",
    name: "Baccarat Rouge 540 Extrait",
    brand: "Maison Francis Kurkdjian",
    originalPrice: 52000,
    discountPrice: 47500,
    rating: 4.9,
    reviewsCount: 95,
    description: "Baccarat Rouge 540 extrait de parfum intensifies the power and radiance of the crystalline floral woody amber breath of the fragrance. In this exalted version of a signature scent, jasmine blossoms and woody musks engage in an alchemy of the senses.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600",
    category: "unisex",
    volumeOptions: ["5ml Decant", "10ml Decant", "35ml Bottle", "70ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 1850,
      "10ml Decant": 3500,
      "35ml Bottle": 26500,
      "70ml Full Bottle": 47500
    },
    stockStatus: "In Stock",
    isFeatured: true,
    notes: {
      top: ["Bitter Almond", "Saffron"],
      middle: ["Egyptian Jasmine", "Cedar"],
      base: ["Ambergris", "Woody Notes", "Musk"]
    }
  },
  {
    id: "club-de-nuit-intense",
    name: "Club de Nuit Intense Man EDT",
    brand: "Armaf",
    originalPrice: 5500,
    discountPrice: 4800,
    rating: 4.6,
    reviewsCount: 512,
    description: "A provocative woody spicy masculine scent that opens with fresh fruity notes of lemon, apple and blackcurrant leading to an opulent floral heart of rose and jasmine spiced with birch to add a smoky leather nuance.",
    image: "https://images.unsplash.com/photo-1615655496458-afffffcc6b67?auto=format&fit=crop&q=80&w=600",
    category: "men",
    volumeOptions: ["5ml Decant", "10ml Decant", "105ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 250,
      "10ml Decant": 450,
      "105ml Full Bottle": 4800
    },
    stockStatus: "In Stock",
    isFeatured: true,
    notes: {
      top: ["Lemon", "Pineapple", "Blackcurrant", "Bergamot", "Apple"],
      middle: ["Birch", "Jasmine", "Rose"],
      base: ["Musk", "Ambergris", "Patchouli", "Vanilla"]
    }
  },
  {
    id: "lattafa-khamrah",
    name: "Khamrah EDP",
    brand: "Lattafa",
    originalPrice: 4800,
    discountPrice: 3950,
    rating: 4.8,
    reviewsCount: 310,
    description: "Khamrah is a luxurious oriental-spicy unisex perfume that combines precious spices, the warmth of woody notes, and the softness of vanilla. A warm gourmand fragrance with incredible longevity and sillage, highly praised in Bangladesh winter.",
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600",
    category: "unisex",
    volumeOptions: ["5ml Decant", "10ml Decant", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 250,
      "10ml Decant": 450,
      "100ml Full Bottle": 3950
    },
    stockStatus: "In Stock",
    isFeatured: true,
    notes: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      middle: ["Dates", "Praline", "Tuberose", "Mahonial"],
      base: ["Vanilla", "Tonka Bean", "Amberwood", "Myrrh", "Benzoin", "Sandalwood"]
    }
  },
  {
    id: "coco-mademoiselle",
    name: "Coco Mademoiselle Intense",
    brand: "Chanel",
    originalPrice: 25000,
    discountPrice: 22000,
    rating: 4.9,
    reviewsCount: 164,
    description: "The essence of a free and captivating woman. A woody and ambery oriental with a full-bodied character: sensual, deep and addictive. Extremely luxurious, ideal for sophisticated events.",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=600",
    category: "women",
    volumeOptions: ["5ml Decant", "10ml Decant", "50ml Bottle", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 950,
      "10ml Decant": 1800,
      "50ml Bottle": 12800,
      "100ml Full Bottle": 22000
    },
    stockStatus: "In Stock",
    isFeatured: false,
    notes: {
      top: ["Sicilian Orange", "Calabrian Bergamot", "Lemon"],
      middle: ["Rose", "Fruity Notes", "Jasmine"],
      base: ["Patchouli", "Madagascar Vanilla", "Tonka Bean", "White Musk", "Labdanum"]
    }
  },
  {
    id: "ysl-libre-intense",
    name: "Libre Intense EDP",
    brand: "Yves Saint Laurent",
    originalPrice: 21000,
    discountPrice: 18500,
    rating: 4.8,
    reviewsCount: 128,
    description: "The perfume of an insticntive, wild and free woman. The tension between French Lavender and sensual Moroccan Orange Blossom reinterpreted in an upbeat, warm, and highly lingering way.",
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600",
    category: "women",
    volumeOptions: ["5ml Decant", "10ml Decant", "50ml Bottle", "90ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 850,
      "10ml Decant": 1600,
      "50ml Bottle": 11200,
      "90ml Full Bottle": 18500
    },
    stockStatus: "In Stock",
    isFeatured: false,
    notes: {
      top: ["Lavender", "Mandarin Orange", "Bergamot"],
      middle: ["Lavender", "Tunisian Orange Blossom", "Jasmine Sambac", "Orchid"],
      base: ["Madagascar Vanilla", "Tonka Bean", "Ambergris", "Vetiver"]
    }
  },
  {
    id: "rasasi-hawas",
    name: "Hawas for Him EDP",
    brand: "Rasasi",
    originalPrice: 7500,
    discountPrice: 6500,
    rating: 4.7,
    reviewsCount: 289,
    description: "Hawas for Him blends cinnamon, bergamot, orange blossom, grey amber and sandalwood to create an aquatic scent designed to embody masculine strength and vigor. The scent is extremely famous for incredible longevity in tropical hot climates.",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600",
    category: "men",
    volumeOptions: ["5ml Decant", "10ml Decant", "100ml Full Bottle"],
    priceByVolume: {
      "5ml Decant": 380,
      "10ml Decant": 700,
      "100ml Full Bottle": 6500
    },
    stockStatus: "In Stock",
    isFeatured: false,
    notes: {
      top: ["Apple", "Bergamot", "Lemon", "Cinnamon"],
      middle: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
      base: ["Ambergris", "Musk", "Patchouli", "Driftwood"]
    }
  },
  {
    id: "rose-oud-attar",
    name: "Rose Oud Premium Attar",
    brand: "Premium Collection",
    originalPrice: 1500,
    discountPrice: 1200,
    rating: 4.9,
    reviewsCount: 78,
    description: "A highly concentrated, alcohol-free premium attar featuring rich, intense notes of deep, warm Cambodian Oud paired with high-grade Turkish Rose. Highly spiritual, soothing, and incredibly elegant.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600", // Reuse Unsplash perfume image nicely
    category: "attar",
    volumeOptions: ["3ml Concentrated", "6ml Concentrated", "12ml Concentrated"],
    priceByVolume: {
      "3ml Concentrated": 350,
      "6ml Concentrated": 650,
      "12ml Concentrated": 1200
    },
    stockStatus: "In Stock",
    isFeatured: false,
    notes: {
      top: ["Damask Rose", "Saffron"],
      middle: ["Oudh", "Geranium", "Clove"],
      base: ["Guaiac Wood", "Sandalwood", "Amber", "Praline"]
    }
  }
];

export const SHIPPINGS = {
  dhaka: {
    name: "Inside Dhaka (Home Delivery)",
    cost: 80,
    time: "24 - 48 Hours"
  },
  outside: {
    name: "Outside Dhaka (Courier/Home Delivery)",
    cost: 150,
    time: "2 - 4 Days"
  }
};
