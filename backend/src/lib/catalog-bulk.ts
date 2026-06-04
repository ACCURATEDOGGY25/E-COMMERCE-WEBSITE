/**
 * Additional products so every category page has plenty to browse (6–10+ each).
 */

export type BulkProductSeed = {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  brand: string;
  stock: number;
  categorySlug: string;
  vendorKey: "tech" | "fashion" | "gaming" | "home";
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  location?: string;
  image: string;
};

type Item = { name: string; slug: string; price: number; compare?: number };

export function batch(
  categorySlug: string,
  vendorKey: BulkProductSeed["vendorKey"],
  brand: string,
  image: string,
  items: Item[],
  featuredFirst = 1
): BulkProductSeed[] {
  return items.map((item, i) => ({
    name: item.name,
    slug: item.slug,
    description: `${item.name} — quality ${brand} product with fast shipping.`,
    price: item.price,
    comparePrice: item.compare,
    brand,
    stock: 20 + (i % 5) * 15,
    categorySlug,
    vendorKey,
    isFeatured: i < featuredFirst,
    rating: 4.1 + (i % 8) * 0.1,
    reviewCount: 30 + i * 17,
    location: "USA",
    image,
  }));
}

const G = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800";
const F = "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800";
const E = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800";
const H = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800";
const S = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800";
const B = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800";

export const BULK_PRODUCTS: BulkProductSeed[] = [
  ...batch("gaming-accessories", "gaming", "GameZone", G, [
    { name: "XL RGB Gaming Mouse Pad", slug: "xl-rgb-gaming-mouse-pad", price: 29.99, compare: 39.99 },
    { name: "Stream Deck Mini Controller", slug: "stream-deck-mini-controller", price: 79.99 },
    { name: "Racing Wheel & Pedals Set", slug: "racing-wheel-pedals-set", price: 199.99, compare: 249.99 },
    { name: "Arcade Fight Stick Pro", slug: "arcade-fight-stick-pro", price: 149.99 },
    { name: "Blue Light Gaming Glasses", slug: "blue-light-gaming-glasses", price: 24.99 },
    { name: "USB 3.0 Hub for Gaming Setup", slug: "usb-hub-gaming-setup", price: 34.99 },
    { name: "Memory Foam Wrist Rest", slug: "memory-foam-wrist-rest", price: 19.99 },
    { name: "Capture Card 4K60", slug: "capture-card-4k60", price: 129.99, compare: 159.99 },
  ]),
  ...batch("gaming-consoles", "gaming", "GameZone", G, [
    { name: "Compact Gaming Console 512GB", slug: "compact-gaming-console-512gb", price: 299.99 },
    { name: "Premium Console Bundle + Game", slug: "premium-console-bundle-game", price: 549.99, compare: 599.99 },
    { name: "Retro Mini Console 8-bit", slug: "retro-mini-console-8bit", price: 79.99 },
    { name: "VR Headset Starter Kit", slug: "vr-headset-starter-kit", price: 399.99, compare: 449.99 },
    { name: "Family Party Game Console", slug: "family-party-game-console", price: 249.99 },
    { name: "Refurbished Last-Gen Console", slug: "refurbished-last-gen-console", price: 199.99 },
  ]),
  ...batch("pc-gaming", "gaming", "GameZone", G, [
    { name: "Prebuilt Gaming PC RTX", slug: "prebuilt-gaming-pc-rtx", price: 1299.99, compare: 1499.99 },
    { name: "32GB DDR5 RAM Kit", slug: "32gb-ddr5-ram-kit", price: 119.99 },
    { name: "1TB NVMe Gen4 SSD", slug: "1tb-nvme-gen4-ssd", price: 89.99 },
    { name: "AIO Liquid CPU Cooler", slug: "aio-liquid-cpu-cooler", price: 99.99 },
    { name: "1080p Streaming Webcam", slug: "1080p-streaming-webcam", price: 59.99 },
    { name: "RGB Case Fan 3-Pack", slug: "rgb-case-fan-3-pack", price: 39.99 },
    { name: '34" Ultrawide Gaming Monitor', slug: "34-inch-ultrawide-gaming-monitor", price: 449.99, compare: 529.99 },
  ]),
  ...batch("video-games", "gaming", "GameZone", G, [
    { name: "Space Explorer RPG", slug: "space-explorer-rpg", price: 59.99 },
    { name: "Street Racer 2025", slug: "street-racer-2025", price: 69.99 },
    { name: "Zombie Survival Saga", slug: "zombie-survival-saga", price: 49.99 },
    { name: "Fantasy Kingdom Builder", slug: "fantasy-kingdom-builder", price: 39.99 },
    { name: "Pro Basketball 2025", slug: "pro-basketball-2025", price: 69.99 },
    { name: "Indie Puzzle Adventure", slug: "indie-puzzle-adventure", price: 19.99 },
    { name: "Co-op Shooter Deluxe", slug: "co-op-shooter-deluxe", price: 54.99 },
    { name: "Kids Learning Game Pack", slug: "kids-learning-game-pack", price: 29.99 },
  ]),
  ...batch("gaming", "gaming", "GameZone", G, [
    { name: "Starter Gaming Bundle", slug: "starter-gaming-bundle", price: 199.99, compare: 279.99 },
    { name: "Pro Gamer Gift Set", slug: "pro-gamer-gift-set", price: 149.99 },
    { name: "Monthly Game Pass 3 Months", slug: "game-pass-3-months", price: 34.99 },
    { name: "Esports Team Jersey", slug: "esports-team-jersey", price: 44.99 },
  ]),
  ...batch("men", "fashion", "Style Avenue", F, [
    { name: "Classic Cotton Crew Tee 3-Pack", slug: "mens-cotton-crew-tee-3pack", price: 29.99 },
    { name: "Performance Polo Shirt", slug: "mens-performance-polo", price: 39.99 },
    { name: "Slim Dark Wash Jeans", slug: "mens-slim-dark-jeans", price: 59.99, compare: 79.99 },
    { name: "Leather Dress Belt", slug: "mens-leather-dress-belt", price: 34.99 },
    { name: "Stainless Steel Watch", slug: "mens-stainless-steel-watch", price: 89.99 },
    { name: "Athletic Gym Shorts", slug: "mens-athletic-gym-shorts", price: 24.99 },
    { name: "Quilted Winter Parka", slug: "mens-quilted-winter-parka", price: 129.99, compare: 179.99 },
    { name: "Oxford Button-Down Shirt", slug: "mens-oxford-button-down", price: 49.99 },
  ]),
  ...batch("women", "fashion", "Style Avenue", F, [
    { name: "High-Waist Yoga Leggings", slug: "womens-high-waist-leggings", price: 34.99 },
    { name: "Silk Blend Blouse", slug: "womens-silk-blend-blouse", price: 44.99 },
    { name: "Pleated Midi Skirt", slug: "womens-pleated-midi-skirt", price: 39.99 },
    { name: "Cashmere Feel Cardigan", slug: "womens-cashmere-cardigan", price: 64.99, compare: 89.99 },
    { name: "Evening Cocktail Dress", slug: "womens-evening-cocktail-dress", price: 89.99 },
    { name: "Activewear Sports Bra 2-Pack", slug: "womens-sports-bra-2pack", price: 32.99 },
    { name: "Wool Blend Winter Scarf", slug: "womens-wool-winter-scarf", price: 28.99 },
    { name: "Wide-Leg Linen Pants", slug: "womens-wide-leg-linen-pants", price: 54.99 },
  ]),
  ...batch("fashion-accessories", "fashion", "Style Avenue", F, [
    { name: "Minimalist Leather Wallet", slug: "minimalist-leather-wallet", price: 39.99 },
    { name: "Canvas Baseball Cap", slug: "canvas-baseball-cap", price: 19.99 },
    { name: "Knit Beanie Winter Hat", slug: "knit-beanie-winter-hat", price: 16.99 },
    { name: "Layered Gold Necklace", slug: "layered-gold-necklace", price: 29.99 },
    { name: "Charm Bracelet Set", slug: "charm-bracelet-set", price: 22.99 },
    { name: "Designer Silk Tie 2-Pack", slug: "designer-silk-tie-2pack", price: 34.99 },
    { name: "Merino Wool Socks 5-Pack", slug: "merino-wool-socks-5pack", price: 24.99 },
    { name: "Structured Tote Bag", slug: "structured-tote-bag", price: 69.99, compare: 89.99 },
  ]),
  ...batch("fashion-shoes", "fashion", "Style Avenue", F, [
    { name: "Women's Running Shoes Air", slug: "womens-running-shoes-air", price: 99.99, compare: 129.99 },
    { name: "Men's Leather Loafers", slug: "mens-leather-loafers", price: 109.99 },
    { name: "Summer Strappy Sandals", slug: "summer-strappy-sandals", price: 44.99 },
    { name: "Kids Velcro Sneakers", slug: "kids-velcro-sneakers", price: 39.99 },
    { name: "Basketball High-Tops", slug: "basketball-high-tops", price: 89.99 },
    { name: "Hiking Trail Boots", slug: "hiking-trail-boots", price: 119.99 },
    { name: "Memory Foam Slippers", slug: "memory-foam-slippers", price: 24.99 },
    { name: "Platform Ankle Boots", slug: "platform-ankle-boots", price: 79.99 },
  ]),
  ...batch("fashion", "fashion", "Style Avenue", F, [
    { name: "Season Sale Mystery Box", slug: "fashion-season-mystery-box", price: 49.99 },
    { name: "Capsule Wardrobe Essentials Kit", slug: "capsule-wardrobe-kit", price: 199.99 },
    { name: "Sustainable Organic Cotton Set", slug: "sustainable-cotton-set", price: 74.99 },
  ]),
  ...batch("phones", "tech", "TechHub", E, [
    { name: "5G Smartphone Unlocked 128GB", slug: "5g-smartphone-unlocked-128gb", price: 599.99, compare: 699.99 },
    { name: "Tempered Glass Screen Protector 2-Pack", slug: "tempered-glass-protector-2pack", price: 14.99 },
    { name: "MagSafe Wireless Charger Stand", slug: "magsafe-wireless-charger-stand", price: 39.99 },
    { name: "Phone Gimbal Stabilizer", slug: "phone-gimbal-stabilizer", price: 79.99 },
    { name: "10\" Android Tablet WiFi", slug: "10-inch-android-tablet", price: 149.99, compare: 199.99 },
    { name: "Active Stylus Pen", slug: "active-stylus-pen", price: 29.99 },
    { name: "Car Vent Phone Mount", slug: "car-vent-phone-mount", price: 12.99 },
    { name: "Fast Charge Cable 3-Pack", slug: "fast-charge-cable-3pack", price: 18.99 },
  ]),
  ...batch("laptops", "tech", "TechHub", E, [
    { name: "Padded Laptop Sleeve 15\"", slug: "padded-laptop-sleeve-15", price: 24.99 },
    { name: "24\" Full HD Office Monitor", slug: "24-inch-full-hd-monitor", price: 179.99 },
    { name: "USB-C Docking Station Dual HDMI", slug: "usb-c-docking-dual-hdmi", price: 89.99, compare: 119.99 },
    { name: "Aluminum Laptop Stand", slug: "aluminum-laptop-stand", price: 34.99 },
    { name: "Wireless Keyboard & Mouse Combo", slug: "wireless-keyboard-mouse-combo", price: 49.99 },
    { name: "Privacy Screen Filter 14\"", slug: "privacy-screen-filter-14", price: 27.99 },
    { name: "Portable SSD 2TB", slug: "portable-ssd-2tb", price: 159.99 },
  ]),
  ...batch("audio", "tech", "SoundMax", E, [
    { name: "USB Condenser Podcast Mic", slug: "usb-condenser-podcast-mic", price: 69.99 },
    { name: "2.1 Channel Soundbar", slug: "2-1-channel-soundbar", price: 129.99, compare: 169.99 },
    { name: "Bluetooth Turntable", slug: "bluetooth-turntable", price: 199.99 },
    { name: "In-Ear Monitor Earphones", slug: "in-ear-monitor-earphones", price: 49.99 },
    { name: "Portable DAC Headphone Amp", slug: "portable-dac-headphone-amp", price: 79.99 },
    { name: "Smart Speaker with Assistant", slug: "smart-speaker-assistant", price: 89.99 },
    { name: "Studio Monitor Headphones", slug: "studio-monitor-headphones", price: 149.99 },
  ]),
  ...batch("electronics", "tech", "TechHub", E, [
    { name: "Smart Home Hub", slug: "smart-home-hub", price: 99.99 },
    { name: "4K Streaming Device", slug: "4k-streaming-device", price: 49.99 },
    { name: "Robot Vacuum Basic", slug: "robot-vacuum-basic", price: 199.99, compare: 249.99 },
    { name: "NAS Home Storage 4-Bay", slug: "nas-home-storage-4bay", price: 399.99 },
    { name: "Network Attached Printer Wi-Fi", slug: "network-printer-wifi", price: 179.99 },
    { name: "Graphics Drawing Tablet", slug: "graphics-drawing-tablet", price: 89.99 },
    { name: "USB Microscope Digital", slug: "usb-microscope-digital", price: 45.99 },
    { name: "Electric Scooter Commuter", slug: "electric-scooter-commuter", price: 599.99, compare: 699.99 },
  ], 2),
  ...batch("home-furniture", "home", "Home Comfort Co.", H, [
    { name: "Solid Wood Dining Table", slug: "solid-wood-dining-table", price: 599.99 },
    { name: "5-Tier Bookshelf", slug: "5-tier-bookshelf", price: 129.99 },
    { name: "Standing Desk Electric", slug: "standing-desk-electric", price: 399.99, compare: 499.99 },
    { name: "Memory Foam Mattress Topper", slug: "memory-foam-mattress-topper", price: 89.99 },
    { name: "Queen Platform Bed Frame", slug: "queen-platform-bed-frame", price: 249.99 },
    { name: "Floating TV Stand 65\"", slug: "floating-tv-stand-65", price: 179.99 },
    { name: "Accent Armchair Velvet", slug: "accent-armchair-velvet", price: 299.99 },
  ]),
  ...batch("home-kitchen", "home", "Home Comfort Co.", H, [
    { name: "Digital Air Fryer 5.8QT", slug: "digital-air-fryer-58qt", price: 79.99, compare: 99.99 },
    { name: "High-Speed Blender", slug: "high-speed-blender", price: 69.99 },
    { name: "Programmable Coffee Maker", slug: "programmable-coffee-maker", price: 49.99 },
    { name: "Professional Knife Block Set", slug: "professional-knife-block-set", price: 89.99 },
    { name: "Ceramic Dinnerware 16pc", slug: "ceramic-dinnerware-16pc", price: 59.99 },
    { name: "Glass Food Storage Set", slug: "glass-food-storage-set", price: 34.99 },
    { name: "Electric Kettle Temperature Control", slug: "electric-kettle-temp-control", price: 44.99 },
  ]),
  ...batch("home", "home", "Home Comfort Co.", H, [
    { name: "Cozy Throw Blanket Set", slug: "cozy-throw-blanket-set", price: 39.99 },
    { name: "Blackout Curtain Pair", slug: "blackout-curtain-pair", price: 54.99 },
    { name: "Scented Candle Gift Set", slug: "scented-candle-gift-set", price: 29.99 },
  ]),
  ...batch("fitness", "fashion", "RunFast", S, [
    { name: "Resistance Bands Set 5 Levels", slug: "resistance-bands-5-levels", price: 22.99 },
    { name: "High-Density Foam Roller", slug: "high-density-foam-roller", price: 24.99 },
    { name: "Speed Jump Rope", slug: "speed-jump-rope", price: 12.99 },
    { name: "Insulated Steel Water Bottle 32oz", slug: "insulated-water-bottle-32oz", price: 19.99 },
    { name: "Gym Duffel Bag", slug: "gym-duffel-bag", price: 39.99 },
    { name: "Foldable Exercise Bike", slug: "foldable-exercise-bike", price: 199.99, compare: 279.99 },
    { name: "Weighted Training Gloves", slug: "weighted-training-gloves", price: 29.99 },
  ]),
  ...batch("outdoor", "fashion", "RunFast", S, [
    { name: "65L Hiking Backpack", slug: "65l-hiking-backpack", price: 89.99 },
    { name: "3-Season Sleeping Bag", slug: "3-season-sleeping-bag", price: 69.99 },
    { name: "Hard Cooler 45QT", slug: "hard-cooler-45qt", price: 119.99 },
    { name: "Waterproof Trail Shoes", slug: "waterproof-trail-shoes", price: 99.99 },
    { name: "Compact Binoculars 10x42", slug: "compact-binoculars-10x42", price: 79.99 },
    { name: "Portable Camping Stove", slug: "portable-camping-stove", price: 34.99 },
    { name: "LED Camping Lantern", slug: "led-camping-lantern", price: 24.99 },
  ]),
  ...batch("sports", "fashion", "RunFast", S, [
    { name: "Soccer Ball Official Size", slug: "soccer-ball-official-size", price: 29.99 },
    { name: "Tennis Racket Beginner", slug: "tennis-racket-beginner", price: 49.99 },
    { name: "Yoga Block & Strap Set", slug: "yoga-block-strap-set", price: 18.99 },
  ]),
  ...batch("skincare", "fashion", "GlowLab", B, [
    { name: "Daily Hydrating Moisturizer", slug: "daily-hydrating-moisturizer", price: 18.99 },
    { name: "SPF 50 Face Sunscreen", slug: "spf-50-face-sunscreen", price: 16.99 },
    { name: "Gentle Foaming Cleanser", slug: "gentle-foaming-cleanser", price: 14.99 },
    { name: "Retinol Night Cream", slug: "retinol-night-cream", price: 32.99, compare: 42.99 },
    { name: "Caffeine Eye Cream", slug: "caffeine-eye-cream", price: 22.99 },
    { name: "Sheet Mask Variety 10-Pack", slug: "sheet-mask-variety-10pack", price: 19.99 },
    { name: "Niacinamide Serum", slug: "niacinamide-serum", price: 24.99 },
  ]),
  ...batch("makeup", "fashion", "GlowLab", B, [
    { name: "Full Coverage Foundation", slug: "full-coverage-foundation", price: 26.99 },
    { name: "Volumizing Mascara", slug: "volumizing-mascara", price: 14.99 },
    { name: "Neutral Eyeshadow Palette", slug: "neutral-eyeshadow-palette", price: 29.99 },
    { name: "Cream Blush Duo", slug: "cream-blush-duo", price: 18.99 },
    { name: "Professional Brush Set 12pc", slug: "professional-brush-set-12pc", price: 34.99 },
    { name: "Makeup Primer Pore Minimizing", slug: "makeup-primer-pore-minimizing", price: 21.99 },
    { name: "Setting Spray Long Wear", slug: "setting-spray-long-wear", price: 16.99 },
  ]),
  ...batch("beauty", "fashion", "GlowLab", B, [
    { name: "Spa Gift Basket", slug: "spa-gift-basket", price: 49.99 },
    { name: "Electric Facial Cleansing Brush", slug: "electric-facial-cleansing-brush", price: 39.99 },
  ]),
  ...batch("books", "home", "PageTurner", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800", [
    { name: "Modern Home Cooking Cookbook", slug: "modern-home-cooking-cookbook", price: 24.99 },
    { name: "Mindfulness & Habits Guide", slug: "mindfulness-habits-guide", price: 16.99 },
    { name: "Sci-Fi Galaxy Chronicles", slug: "sci-fi-galaxy-chronicles", price: 14.99 },
    { name: "Children's Bedtime Stories", slug: "childrens-bedtime-stories", price: 12.99 },
    { name: "Graphic Novel Collection Vol.1", slug: "graphic-novel-collection-vol1", price: 19.99 },
    { name: "Business Leader Biography", slug: "business-leader-biography", price: 18.99 },
    { name: "True Crime Bestseller", slug: "true-crime-bestseller", price: 15.99 },
  ]),
  ...batch("men", "fashion", "Style Avenue", F, [
    { name: "Water-Resistant Windbreaker", slug: "mens-water-resistant-windbreaker", price: 64.99 },
    { name: "Merino Wool Base Layer", slug: "mens-merino-wool-base-layer", price: 54.99 },
    { name: "Cargo Jogger Pants", slug: "mens-cargo-jogger-pants", price: 44.99 },
  ]),
  ...batch("women", "fashion", "Style Avenue", F, [
    { name: "Wrap Maxi Dress", slug: "womens-wrap-maxi-dress", price: 59.99 },
    { name: "Faux Leather Moto Jacket", slug: "womens-faux-leather-moto-jacket", price: 89.99, compare: 119.99 },
    { name: "Ballet Flats Leather", slug: "womens-ballet-flats-leather", price: 49.99 },
  ]),
  ...batch("sports", "fashion", "RunFast", S, [
    { name: "Adjustable Dumbbells Pair", slug: "adjustable-dumbbells-pair", price: 299.99 },
    { name: "Pickleball Paddle Set", slug: "pickleball-paddle-set", price: 59.99 },
    { name: "Golf Rangefinder Slope", slug: "golf-rangefinder-slope", price: 189.99 },
    { name: "Swim Goggles Anti-Fog 2-Pack", slug: "swim-goggles-antifog-2pack", price: 18.99 },
    { name: "Cycling Helmet MIPS", slug: "cycling-helmet-mips", price: 79.99 },
  ]),
  ...batch("books", "home", "PageTurner", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800", [
    { name: "Python Programming Handbook", slug: "python-programming-handbook", price: 34.99 },
    { name: "World Atlas Hardcover", slug: "world-atlas-hardcover", price: 42.99 },
    { name: "Poetry Collection Modern Voices", slug: "poetry-collection-modern-voices", price: 17.99 },
  ]),
  ...batch("toys", "home", "PlayCraft", "https://images.unsplash.com/photo-1558060370-aba9b14b4237?w=800", [
    { name: "Superhero Action Figure Set", slug: "superhero-action-figure-set", price: 29.99 },
    { name: "Family Board Game Night Pack", slug: "family-board-game-night-pack", price: 34.99 },
    { name: "1000-Piece Landscape Puzzle", slug: "1000-piece-landscape-puzzle", price: 19.99 },
    { name: "RC Stunt Car USB Charge", slug: "rc-stunt-car-usb", price: 39.99, compare: 49.99 },
    { name: "Giant Plush Teddy Bear", slug: "giant-plush-teddy-bear", price: 44.99 },
    { name: "Art & Craft Supply Kit", slug: "art-craft-supply-kit", price: 27.99 },
    { name: "Educational Tablet for Kids", slug: "educational-tablet-kids", price: 79.99 },
  ]),
];
