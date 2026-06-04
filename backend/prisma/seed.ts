import { PrismaClient, Role, VendorStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  seedExtendedCategories,
  seedExtraProducts,
} from "./seed-catalog.js";

const prisma = new PrismaClient();

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
];

async function ensureCartAndWishlist(userId: string) {
  await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  await prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

async function getCategoryId(slug: string): Promise<string> {
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) throw new Error(`Category not found: ${slug}. Run db push first.`);
  return cat.id;
}

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@marketplace.com" },
    update: {},
    create: {
      email: "admin@marketplace.com",
      passwordHash,
      name: "Admin User",
      role: Role.ADMIN,
      emailVerified: true,
    },
  });
  await ensureCartAndWishlist(admin.id);

  await prisma.user.upsert({
    where: { email: "customer@demo.com" },
    update: {},
    create: {
      email: "customer@demo.com",
      passwordHash,
      name: "Jane Customer",
      role: Role.CUSTOMER,
      emailVerified: true,
    },
  });
  const customer = await prisma.user.findUniqueOrThrow({
    where: { email: "customer@demo.com" },
  });
  await ensureCartAndWishlist(customer.id);

  await prisma.user.upsert({
    where: { email: "seller@demo.com" },
    update: {},
    create: {
      email: "seller@demo.com",
      passwordHash,
      name: "Tech Store Owner",
      role: Role.SELLER,
      emailVerified: true,
    },
  });
  let sellerUser = await prisma.user.findUnique({
    where: { email: "seller@demo.com" },
    include: { vendor: true },
  });
  if (sellerUser && !sellerUser.vendor) {
    await prisma.vendor.create({
      data: {
        userId: sellerUser.id,
        storeName: "TechHub Electronics",
        slug: "techhub-electronics",
        description: "Premium electronics and gadgets at great prices.",
        status: VendorStatus.APPROVED,
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
      },
    });
    sellerUser = await prisma.user.findUnique({
      where: { email: "seller@demo.com" },
      include: { vendor: true },
    });
  } else if (!sellerUser) {
    throw new Error("Failed to create seller user");
  } else {
    await prisma.vendor.upsert({
      where: { userId: sellerUser.id },
      update: { status: VendorStatus.APPROVED },
      create: {
        userId: sellerUser.id,
        storeName: "TechHub Electronics",
        slug: "techhub-electronics",
        description: "Premium electronics and gadgets at great prices.",
        status: VendorStatus.APPROVED,
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
      },
    });
    sellerUser = await prisma.user.findUnique({
      where: { email: "seller@demo.com" },
      include: { vendor: true },
    });
  }
  await ensureCartAndWishlist(sellerUser!.id);

  await prisma.user.upsert({
    where: { email: "fashion@demo.com" },
    update: {},
    create: {
      email: "fashion@demo.com",
      passwordHash,
      name: "Fashion Boutique",
      role: Role.SELLER,
      emailVerified: true,
    },
  });
  let seller2 = await prisma.user.findUnique({
    where: { email: "fashion@demo.com" },
    include: { vendor: true },
  });
  if (seller2 && !seller2.vendor) {
    await prisma.vendor.create({
      data: {
        userId: seller2.id,
        storeName: "Style Avenue",
        slug: "style-avenue",
        description: "Trendy fashion for every occasion.",
        status: VendorStatus.APPROVED,
      },
    });
  } else if (seller2?.vendor) {
    await prisma.vendor.update({
      where: { id: seller2.vendor.id },
      data: { status: VendorStatus.APPROVED },
    });
  } else {
    await prisma.vendor.create({
      data: {
        userId: seller2!.id,
        storeName: "Style Avenue",
        slug: "style-avenue",
        description: "Trendy fashion for every occasion.",
        status: VendorStatus.APPROVED,
      },
    });
  }
  seller2 = await prisma.user.findUnique({
    where: { email: "fashion@demo.com" },
    include: { vendor: true },
  });
  await ensureCartAndWishlist(seller2!.id);

  async function ensureVendorSeller(
    email: string,
    name: string,
    storeName: string,
    slug: string,
    description: string,
    logo?: string
  ) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name,
        role: Role.SELLER,
        emailVerified: true,
      },
    });
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await prisma.vendor.upsert({
      where: { userId: user.id },
      update: { status: VendorStatus.APPROVED, storeName, description, logo },
      create: {
        userId: user.id,
        storeName,
        slug,
        description,
        status: VendorStatus.APPROVED,
        logo,
      },
    });
    await ensureCartAndWishlist(user.id);
    return prisma.vendor.findUniqueOrThrow({ where: { userId: user.id } });
  }

  const gamingVendor = await ensureVendorSeller(
    "gaming@demo.com",
    "GameZone Owner",
    "GameZone Store",
    "gamezone",
    "Consoles, games, controllers, and pro gaming gear.",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200"
  );
  const homeVendor = await ensureVendorSeller(
    "home@demo.com",
    "Home Comfort Owner",
    "Home Comfort Co.",
    "home-comfort",
    "Furniture, kitchen essentials, and home décor."
  );

  await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    },
  });
  await prisma.category.upsert({
    where: { slug: "phones" },
    update: {},
    create: { name: "Phones", slug: "phones", parentId: (await prisma.category.findUnique({ where: { slug: "electronics" } }))!.id },
  });
  await prisma.category.upsert({
    where: { slug: "laptops" },
    update: {},
    create: { name: "Laptops", slug: "laptops", parentId: (await prisma.category.findUnique({ where: { slug: "electronics" } }))!.id },
  });
  await prisma.category.upsert({
    where: { slug: "audio" },
    update: {},
    create: { name: "Audio", slug: "audio", parentId: (await prisma.category.findUnique({ where: { slug: "electronics" } }))!.id },
  });
  await prisma.category.upsert({
    where: { slug: "fashion" },
    update: {},
    create: {
      name: "Fashion",
      slug: "fashion",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    },
  });
  const fashionParent = await prisma.category.findUniqueOrThrow({ where: { slug: "fashion" } });
  await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: { name: "Men", slug: "men", parentId: fashionParent.id },
  });
  await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: { name: "Women", slug: "women", parentId: fashionParent.id },
  });
  await prisma.category.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      name: "Home & Living",
      slug: "home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    },
  });
  await prisma.category.upsert({
    where: { slug: "gaming" },
    update: {},
    create: {
      name: "Games & Gaming",
      slug: "gaming",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400",
    },
  });
  await prisma.category.upsert({
    where: { slug: "sports" },
    update: {},
    create: {
      name: "Sports & Outdoors",
      slug: "sports",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    },
  });
  await prisma.category.upsert({
    where: { slug: "beauty" },
    update: {},
    create: {
      name: "Beauty & Health",
      slug: "beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    },
  });

  await seedExtendedCategories(prisma);

  const [audioId, phonesId, laptopsId, menId, womenId] = await Promise.all([
    getCategoryId("audio"),
    getCategoryId("phones"),
    getCategoryId("laptops"),
    getCategoryId("men"),
    getCategoryId("women"),
  ]);

  const vendor1 = sellerUser!.vendor!;
  const vendor2 = seller2!.vendor!;

  const productsData = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.",
      price: 249.99,
      comparePrice: 299.99,
      brand: "SoundMax",
      stock: 50,
      categoryId: audioId,
      vendorId: vendor1.id,
      isFeatured: true,
      rating: 4.5,
      reviewCount: 128,
      location: "New York, USA",
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description:
        "Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life in a sleek design.",
      price: 199.99,
      brand: "TechHub",
      stock: 75,
      categoryId: phonesId,
      vendorId: vendor1.id,
      isFeatured: true,
      rating: 4.3,
      reviewCount: 89,
      location: "California, USA",
    },
    {
      name: "Ultrabook Laptop 14\"",
      slug: "ultrabook-laptop-14",
      description:
        "Lightweight laptop with Intel i7, 16GB RAM, 512GB SSD. Perfect for work and creativity.",
      price: 899.99,
      comparePrice: 1099.99,
      brand: "ComputeX",
      stock: 25,
      categoryId: laptopsId,
      vendorId: vendor1.id,
      isFeatured: true,
      rating: 4.7,
      reviewCount: 56,
      location: "Texas, USA",
    },
    {
      name: "Running Sneakers Elite",
      slug: "running-sneakers-elite",
      description:
        "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.",
      price: 129.99,
      brand: "RunFast",
      stock: 100,
      categoryId: menId,
      vendorId: vendor2.id,
      rating: 4.4,
      reviewCount: 203,
      location: "Oregon, USA",
    },
    {
      name: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      description:
        "Timeless denim jacket with modern fit. 100% cotton, machine washable.",
      price: 79.99,
      comparePrice: 99.99,
      brand: "Style Avenue",
      stock: 60,
      categoryId: womenId,
      vendorId: vendor2.id,
      isFeatured: true,
      rating: 4.2,
      reviewCount: 45,
      location: "Los Angeles, USA",
    },
    {
      name: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      description:
        "Waterproof speaker with 360° sound, 12-hour playtime, and built-in microphone.",
      price: 59.99,
      brand: "SoundMax",
      stock: 120,
      categoryId: audioId,
      vendorId: vendor1.id,
      rating: 4.1,
      reviewCount: 312,
      location: "Florida, USA",
    },
  ];

  for (let i = 0; i < productsData.length; i++) {
    const data = productsData[i];
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        price: data.price,
        stock: data.stock,
        isFeatured: data.isFeatured ?? false,
      },
      create: {
        ...data,
        images: {
          create: [
            { url: PRODUCT_IMAGES[i % PRODUCT_IMAGES.length], sortOrder: 0 },
            {
              url: PRODUCT_IMAGES[(i + 1) % PRODUCT_IMAGES.length],
              sortOrder: 1,
            },
          ],
        },
      },
    });
  }

  await seedExtraProducts(prisma, {
    tech: vendor1.id,
    fashion: vendor2.id,
    gaming: gamingVendor.id,
    home: homeVendor.id,
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order",
      discountType: "percentage",
      discountValue: 10,
      minPurchase: 25,
      maxUses: 1000,
    },
  });

  console.log("Seed completed!");
  console.log("\nDemo accounts (password: Password123!):");
  console.log("  Admin:    admin@marketplace.com");
  console.log("  Customer: customer@demo.com");
  console.log("  Seller:   seller@demo.com");
  console.log("  Seller 2: fashion@demo.com");
  console.log("  Seller 3: gaming@demo.com");
  console.log("  Seller 4: home@demo.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
