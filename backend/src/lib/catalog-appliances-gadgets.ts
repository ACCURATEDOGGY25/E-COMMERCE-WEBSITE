/**
 * Real-world electronics, home appliances, and gadgets across all departments.
 */
import { batch } from "./catalog-bulk.js";

const E = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800";
const P = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800";
const L = "https://images.unsplash.com/photo-1496181133176-c407dc4b2d4f?w=800";
const A = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
const TV = "https://images.unsplash.com/photo-1593359676880-d891d697e3f6?w=800";
const K = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800";
const CAM = "https://images.unsplash.com/photo-1516035069377-29a754fdf791?w=800";
const W = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
const G = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800";
const H = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800";

export const APPLIANCE_GADGET_PRODUCTS = [
  ...batch("electronics", "tech", "TechHub", E, [
    { name: "55\" 4K UHD Smart TV", slug: "55-inch-4k-smart-tv", price: 499.99, compare: 649.99 },
    { name: "65\" QLED Smart TV", slug: "65-inch-qled-smart-tv", price: 799.99, compare: 999.99 },
    { name: "32\" HD Bedroom TV", slug: "32-inch-hd-bedroom-tv", price: 179.99 },
    { name: "Laser 4K Projector Home Theater", slug: "laser-4k-home-projector", price: 899.99, compare: 1099.99 },
    { name: "Smart Wi-Fi Thermostat", slug: "smart-wifi-thermostat", price: 129.99 },
    { name: "Video Doorbell with Night Vision", slug: "video-doorbell-night-vision", price: 99.99, compare: 129.99 },
    { name: "Indoor Security Camera 2-Pack", slug: "indoor-security-camera-2pack", price: 79.99 },
    { name: "Outdoor Floodlight Camera", slug: "outdoor-floodlight-camera", price: 149.99 },
    { name: "Smart Lock Keyless Entry", slug: "smart-lock-keyless-entry", price: 189.99 },
    { name: "Mesh Wi-Fi 6 System (3-Pack)", slug: "mesh-wifi-6-system-3pack", price: 249.99, compare: 299.99 },
    { name: "Robot Vacuum with Mop", slug: "robot-vacuum-with-mop", price: 349.99, compare: 429.99 },
    { name: "Cordless Stick Vacuum", slug: "cordless-stick-vacuum", price: 279.99 },
    { name: "Air Purifier HEPA Large Room", slug: "air-purifier-hepa-large-room", price: 199.99 },
    { name: "Smart Humidifier Ultrasonic", slug: "smart-humidifier-ultrasonic", price: 59.99 },
    { name: "Portable Power Station 600W", slug: "portable-power-station-600w", price: 449.99 },
    { name: "Solar Panel Charger 100W", slug: "solar-panel-charger-100w", price: 199.99 },
    { name: "Garage Smart Opener Kit", slug: "garage-smart-opener-kit", price: 159.99 },
    { name: "Smart Plug 4-Pack Energy Monitor", slug: "smart-plug-4pack-energy", price: 34.99 },
    { name: "LED Smart Bulb Starter Kit", slug: "led-smart-bulb-starter-kit", price: 49.99 },
    { name: "Digital Photo Frame 10\"", slug: "digital-photo-frame-10", price: 89.99 },
    { name: "Label Maker Bluetooth", slug: "label-maker-bluetooth", price: 39.99 },
    { name: "Electric Toothbrush with UV Sanitizer", slug: "electric-toothbrush-uv-sanitizer", price: 79.99 },
    { name: "Hair Dryer Ionic Professional", slug: "hair-dryer-ionic-professional", price: 69.99, compare: 89.99 },
    { name: "Cordless Handheld Vacuum Car", slug: "cordless-handheld-vacuum-car", price: 49.99 },
    { name: "Mini Fridge Beverage Cooler", slug: "mini-fridge-beverage-cooler", price: 129.99 },
    { name: "Wine Fridge Dual Zone 18 Bottle", slug: "wine-fridge-dual-zone-18", price: 249.99 },
    { name: "Countertop Ice Maker", slug: "countertop-ice-maker", price: 119.99 },
    { name: "Smart Scale Body Composition", slug: "smart-scale-body-composition", price: 44.99 },
    { name: "Blood Pressure Monitor Bluetooth", slug: "blood-pressure-monitor-bluetooth", price: 54.99 },
    { name: "Pulse Oximeter Fingertip", slug: "pulse-oximeter-fingertip", price: 24.99 },
  ], 3),
  ...batch("phones", "tech", "TechHub", P, [
    { name: "Flagship Smartphone 256GB", slug: "flagship-smartphone-256gb", price: 899.99, compare: 999.99 },
    { name: "Budget Android Phone 128GB", slug: "budget-android-phone-128gb", price: 199.99 },
    { name: "Rugged Outdoor Smartphone", slug: "rugged-outdoor-smartphone", price: 449.99 },
    { name: "Foldable Phone Cover Case", slug: "foldable-phone-cover-case", price: 49.99 },
    { name: "Power Bank 20000mAh PD", slug: "power-bank-20000mah-pd", price: 39.99, compare: 54.99 },
    { name: "Car Charger Dual USB-C 65W", slug: "car-charger-dual-usbc-65w", price: 29.99 },
    { name: "Ring Light Phone Clip Kit", slug: "ring-light-phone-clip-kit", price: 22.99 },
    { name: "eSIM Travel Data Hotspot", slug: "esim-travel-data-hotspot", price: 129.99 },
    { name: "Kids Smartwatch GPS", slug: "kids-smartwatch-gps", price: 79.99 },
    { name: "Bluetooth Tracker Tag 4-Pack", slug: "bluetooth-tracker-tag-4pack", price: 32.99 },
  ], 2),
  ...batch("laptops", "tech", "TechHub", L, [
    { name: "Ultrabook Laptop 14\" 16GB", slug: "ultrabook-laptop-14-16gb", price: 999.99, compare: 1199.99 },
    { name: "Gaming Laptop RTX 15.6\"", slug: "gaming-laptop-rtx-156", price: 1499.99, compare: 1699.99 },
    { name: "Chromebook 11.6\" Student", slug: "chromebook-116-student", price: 249.99 },
    { name: "2-in-1 Convertible Touch Laptop", slug: "2-in-1-convertible-touch-laptop", price: 749.99 },
    { name: "Mechanical Keyboard Wireless", slug: "mechanical-keyboard-wireless", price: 89.99 },
    { name: "Ergonomic Vertical Mouse", slug: "ergonomic-vertical-mouse", price: 34.99 },
    { name: "27\" 4K IPS Monitor", slug: "27-inch-4k-ips-monitor", price: 329.99, compare: 399.99 },
    { name: "Thunderbolt 4 Dock", slug: "thunderbolt-4-dock", price: 199.99 },
    { name: "Laptop Cooling Pad RGB", slug: "laptop-cooling-pad-rgb", price: 29.99 },
    { name: "Webcam 4K Auto-Focus", slug: "webcam-4k-auto-focus", price: 99.99 },
  ], 2),
  ...batch("audio", "tech", "SoundMax", A, [
    { name: "Over-Ear ANC Headphones", slug: "over-ear-anc-headphones", price: 199.99, compare: 249.99 },
    { name: "Open-Ear Bone Conduction", slug: "open-ear-bone-conduction", price: 129.99 },
    { name: "Party Speaker 360° Bass", slug: "party-speaker-360-bass", price: 149.99 },
    { name: "Home Theater 5.1 Speaker Set", slug: "home-theater-51-speaker-set", price: 399.99, compare: 499.99 },
    { name: "Vinyl Record Player Bluetooth", slug: "vinyl-record-player-bluetooth", price: 179.99 },
    { name: "Podcast Mic Arm Boom Kit", slug: "podcast-mic-arm-boom-kit", price: 89.99 },
    { name: "Sleep Earbuds White Noise", slug: "sleep-earbuds-white-noise", price: 59.99 },
    { name: "Car FM Transmitter Bluetooth", slug: "car-fm-transmitter-bluetooth", price: 19.99 },
  ], 2),
  ...batch("home-kitchen", "home", "Home Comfort Co.", K, [
    { name: "French Door Refrigerator Stainless", slug: "french-door-refrigerator-stainless", price: 1899.99, compare: 2199.99 },
    { name: "Countertop Microwave 1000W", slug: "countertop-microwave-1000w", price: 89.99 },
    { name: "Convection Toaster Oven XL", slug: "convection-toaster-oven-xl", price: 129.99 },
    { name: "Induction Cooktop Portable", slug: "induction-cooktop-portable", price: 79.99 },
    { name: "Stainless Steel Rice Cooker", slug: "stainless-steel-rice-cooker", price: 49.99 },
    { name: "Slow Cooker 6-Quart Digital", slug: "slow-cooker-6qt-digital", price: 59.99 },
    { name: "Stand Mixer 5-Qt Pro", slug: "stand-mixer-5qt-pro", price: 299.99, compare: 349.99 },
    { name: "Espresso Machine Semi-Auto", slug: "espresso-machine-semi-auto", price: 249.99 },
    { name: "Single-Serve Pod Coffee Maker", slug: "single-serve-pod-coffee-maker", price: 79.99 },
    { name: "Electric Pressure Cooker 8QT", slug: "electric-pressure-cooker-8qt", price: 99.99, compare: 129.99 },
    { name: "Food Processor 12-Cup", slug: "food-processor-12-cup", price: 119.99 },
    { name: "Immersion Hand Blender Set", slug: "immersion-hand-blender-set", price: 39.99 },
    { name: "Dishwasher Countertop Compact", slug: "dishwasher-countertop-compact", price: 349.99 },
    { name: "Water Filter Pitcher + 4 Filters", slug: "water-filter-pitcher-4-filters", price: 34.99 },
    { name: "Smart Faucet Touchless Kitchen", slug: "smart-faucet-touchless-kitchen", price: 199.99 },
  ], 2),
  ...batch("home", "home", "Home Comfort Co.", H, [
    { name: "Front-Load Washer 4.5 cu ft", slug: "front-load-washer-45-cuft", price: 699.99, compare: 849.99 },
    { name: "Electric Dryer Sensor Dry", slug: "electric-dryer-sensor-dry", price: 599.99 },
    { name: "Portable AC 12000 BTU", slug: "portable-ac-12000-btu", price: 399.99 },
    { name: "Tower Fan with Remote", slug: "tower-fan-with-remote", price: 49.99 },
    { name: "Space Heater Ceramic Safe", slug: "space-heater-ceramic-safe", price: 39.99 },
    { name: "Dehumidifier 50-Pint", slug: "dehumidifier-50-pint", price: 219.99 },
    { name: "Steam Mop Hard Floors", slug: "steam-mop-hard-floors", price: 69.99 },
    { name: "Iron Steam Station Pro", slug: "iron-steam-station-pro", price: 149.99 },
  ], 1),
  ...batch("gaming-accessories", "gaming", "GameZone", G, [
    { name: "Wireless Gaming Headset DTS", slug: "wireless-gaming-headset-dts", price: 119.99 },
    { name: "Thumbstick Grip Kit Pro", slug: "thumbstick-grip-kit-pro", price: 14.99 },
    { name: "PS5 Dual Charging Dock", slug: "ps5-dual-charging-dock", price: 29.99 },
    { name: "Nintendo Switch Carry Case", slug: "nintendo-switch-carry-case", price: 24.99 },
    { name: "Meta Quest 3 Elite Strap", slug: "meta-quest-3-elite-strap", price: 49.99 },
  ]),
  ...batch("pc-gaming", "gaming", "GameZone", G, [
    { name: "RTX Graphics Card 12GB", slug: "rtx-graphics-card-12gb", price: 449.99, compare: 499.99 },
    { name: "750W Gold Modular PSU", slug: "750w-gold-modular-psu", price: 109.99 },
    { name: "Mid-Tower ATX Case Tempered Glass", slug: "mid-tower-atx-case-glass", price: 89.99 },
  ]),
  ...batch("electronics", "tech", "TechHub", CAM, [
    { name: "Mirrorless Camera Body 24MP", slug: "mirrorless-camera-body-24mp", price: 899.99, compare: 999.99 },
    { name: "Action Camera 4K Waterproof", slug: "action-camera-4k-waterproof", price: 199.99 },
    { name: "Drone 4K GPS Follow Me", slug: "drone-4k-gps-follow-me", price: 399.99, compare: 479.99 },
    { name: "360° VR Camera", slug: "360-vr-camera", price: 299.99 },
    { name: "Ring Light Studio Kit", slug: "ring-light-studio-kit", price: 54.99 },
  ], 2),
  ...batch("electronics", "tech", "TechHub", W, [
    { name: "Smartwatch GPS Fitness", slug: "smartwatch-gps-fitness", price: 249.99, compare: 299.99 },
    { name: "Fitness Tracker Band", slug: "fitness-tracker-band", price: 49.99 },
    { name: "Smart Ring Health Monitor", slug: "smart-ring-health-monitor", price: 299.99 },
    { name: "Wireless Charging Pad 3-in-1", slug: "wireless-charging-pad-3in1", price: 59.99 },
  ], 2),
  ...batch("fashion-accessories", "fashion", "TechHub", W, [
    { name: "Blue Light Blocking Glasses", slug: "blue-light-blocking-glasses", price: 29.99 },
    { name: "Noise-Cancelling Travel Earbuds Case", slug: "travel-earbuds-hard-case", price: 19.99 },
  ]),
  ...batch("fitness", "fashion", "RunFast", W, [
    { name: "GPS Running Watch", slug: "gps-running-watch", price: 199.99 },
    { name: "Heart Rate Chest Strap", slug: "heart-rate-chest-strap", price: 49.99 },
    { name: "Smart Jump Rope Counter", slug: "smart-jump-rope-counter", price: 34.99 },
  ]),
  ...batch("toys", "home", "PlayCraft", G, [
    { name: "Coding Robot for Kids", slug: "coding-robot-for-kids", price: 89.99 },
    { name: "Mini Drone Indoor Safe", slug: "mini-drone-indoor-safe", price: 49.99 },
    { name: "Electronic Keyboard 61-Key", slug: "electronic-keyboard-61-key", price: 79.99 },
  ]),
  ...batch("beauty", "fashion", "GlowLab", E, [
    { name: "LED Face Mask Light Therapy", slug: "led-face-mask-light-therapy", price: 129.99 },
    { name: "Sonic Facial Massager", slug: "sonic-facial-massager", price: 59.99 },
  ]),
  ...batch("outdoor", "fashion", "RunFast", E, [
    { name: "Solar Camping Lantern USB", slug: "solar-camping-lantern-usb", price: 34.99 },
    { name: "Portable Bluetooth Speaker Rugged", slug: "portable-bluetooth-speaker-rugged", price: 69.99 },
    { name: "Hand-Crank Emergency Radio", slug: "hand-crank-emergency-radio", price: 44.99 },
  ]),
];
