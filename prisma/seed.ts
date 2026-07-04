import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Phones", slug: "phones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Tablets", slug: "tablets" },
  { name: "Audio", slug: "audio" },
  { name: "Accessories", slug: "accessories" },
];

const products = [
  {
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description:
      "The iPhone 15 Pro features a titanium design, A17 Pro chip, and an advanced camera system with 5x optical zoom. Experience the ultimate smartphone performance.",
    price: 999.99,
    stock: 50,
    featured: true,
    categorySlug: "phones",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '6.1" Super Retina XDR',
      Chip: "A17 Pro",
      Storage: "128GB",
      Camera: "48MP Main + 12MP Ultra Wide",
      Battery: "Up to 23 hours video playback",
    },
  },
  {
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    description:
      "Galaxy AI is here. Search like never before, translate calls in real time, and edit photos effortlessly with the Samsung Galaxy S24.",
    price: 799.99,
    stock: 45,
    featured: true,
    categorySlug: "phones",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '6.2" Dynamic AMOLED 2X',
      Chip: "Snapdragon 8 Gen 3",
      Storage: "256GB",
      Camera: "50MP Main + 12MP Ultra Wide",
      Battery: "4000 mAh",
    },
  },
  {
    name: "MacBook Air M3",
    slug: "macbook-air-m3",
    description:
      "Supercharged by the M3 chip, MacBook Air is strikingly thin and light with up to 18 hours of battery life. The perfect everyday laptop.",
    price: 1099.99,
    stock: 30,
    featured: true,
    categorySlug: "laptops",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '13.6" Liquid Retina',
      Chip: "Apple M3",
      Memory: "8GB Unified Memory",
      Storage: "256GB SSD",
      Battery: "Up to 18 hours",
    },
  },
  {
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    description:
      "Premium performance meets stunning design. The Dell XPS 15 features a breathtaking InfinityEdge display and powerful Intel processors.",
    price: 1499.99,
    stock: 20,
    featured: true,
    categorySlug: "laptops",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67dcc?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '15.6" 3.5K OLED',
      Processor: "Intel Core i7-13700H",
      Memory: "16GB DDR5",
      Storage: "512GB SSD",
      Graphics: "NVIDIA RTX 4050",
    },
  },
  {
    name: "iPad Air",
    slug: "ipad-air",
    description:
      "Serious performance in a thin and light design. iPad Air with M2 chip delivers incredible speed for work, creativity, and entertainment.",
    price: 599.99,
    stock: 35,
    featured: true,
    categorySlug: "tablets",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '10.9" Liquid Retina',
      Chip: "Apple M2",
      Storage: "64GB",
      Camera: "12MP Wide",
      Battery: "Up to 10 hours",
    },
  },
  {
    name: "Samsung Galaxy Tab S9",
    slug: "samsung-galaxy-tab-s9",
    description:
      "The ultimate Android tablet with Dynamic AMOLED 2X display, S Pen included, and IP68 water resistance for work and play anywhere.",
    price: 649.99,
    stock: 25,
    featured: false,
    categorySlug: "tablets",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '11" Dynamic AMOLED 2X',
      Chip: "Snapdragon 8 Gen 2",
      Storage: "128GB",
      SPen: "Included",
      Battery: "8400 mAh",
    },
  },
  {
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description:
      "Industry-leading noise cancellation with exceptional sound quality. The WH-1000XM5 headphones redefine what premium audio feels like.",
    price: 349.99,
    stock: 60,
    featured: true,
    categorySlug: "audio",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    ],
    specs: {
      Type: "Over-ear wireless",
      "Noise Cancellation": "Industry-leading ANC",
      "Battery Life": "Up to 30 hours",
      Connectivity: "Bluetooth 5.2, NFC",
      Weight: "250g",
    },
  },
  {
    name: "AirPods Pro (2nd Gen)",
    slug: "airpods-pro-2nd-gen",
    description:
      "Rebuilt from the sound up. AirPods Pro feature up to 2x more Active Noise Cancellation, Adaptive Audio, and personalized Spatial Audio.",
    price: 249.99,
    stock: 80,
    featured: true,
    categorySlug: "audio",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=800&fit=crop",
    ],
    specs: {
      Type: "In-ear wireless",
      "Noise Cancellation": "Active Noise Cancellation",
      "Battery Life": "Up to 6 hours (30 with case)",
      Chip: "Apple H2",
      "Water Resistance": "IPX4",
    },
  },
  {
    name: "USB-C Hub 7-in-1",
    slug: "usb-c-hub-7-in-1",
    description:
      "Expand your laptop connectivity with this versatile 7-in-1 USB-C hub featuring HDMI, USB 3.0 ports, SD card reader, and power delivery.",
    price: 49.99,
    stock: 100,
    featured: false,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1625729147590bc0643a2317f?w=800&h=800&fit=crop",
    ],
    specs: {
      Ports: "HDMI, 3x USB 3.0, SD, microSD, USB-C PD",
      "Power Delivery": "100W pass-through",
      "HDMI Output": "4K @ 30Hz",
      Compatibility: "USB-C laptops and tablets",
    },
  },
  {
    name: "Wireless Charging Pad",
    slug: "wireless-charging-pad",
    description:
      "Fast 15W wireless charging pad compatible with all Qi-enabled devices. Sleek design with non-slip surface and LED indicator.",
    price: 29.99,
    stock: 150,
    featured: false,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1591290619762-d2a4a7a2d1c8?w=800&h=800&fit=crop",
    ],
    specs: {
      "Max Output": "15W",
      Standard: "Qi-compatible",
      Input: "USB-C 18W adapter required",
      Material: "Aluminum + silicone",
      Indicator: "LED status light",
    },
  },
  {
    name: "Premium Phone Case",
    slug: "premium-phone-case",
    description:
      "Military-grade drop protection in a slim profile. Compatible with MagSafe accessories and available in multiple colors.",
    price: 39.99,
    stock: 200,
    featured: false,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
    ],
    specs: {
      Protection: "Military-grade drop tested",
      Compatibility: "MagSafe enabled",
      Material: "TPU + polycarbonate",
      Thickness: "2.5mm slim profile",
    },
  },
  {
    name: "Google Pixel 8",
    slug: "google-pixel-8",
    description:
      "The most helpful Pixel yet with Google AI, an amazing camera, and 7 years of updates. Pure Android experience at its finest.",
    price: 699.99,
    stock: 40,
    featured: false,
    categorySlug: "phones",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b173151719e?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '6.2" Actua OLED',
      Chip: "Google Tensor G3",
      Storage: "128GB",
      Camera: "50MP Main + 12MP Ultra Wide",
      Updates: "7 years of OS updates",
    },
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    slug: "lenovo-thinkpad-x1-carbon",
    description:
      "The legendary business laptop. Ultra-light carbon fiber construction, all-day battery, and the iconic ThinkPad keyboard.",
    price: 1299.99,
    stock: 15,
    featured: false,
    categorySlug: "laptops",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop",
    ],
    specs: {
      Display: '14" 2.8K OLED',
      Processor: "Intel Core i7-1355U",
      Memory: "16GB LPDDR5",
      Storage: "512GB SSD",
      Weight: "1.12 kg",
    },
  },
  {
    name: "Bose QuietComfort Earbuds",
    slug: "bose-quietcomfort-earbuds",
    description:
      "World-class noise cancellation in a compact earbud form. CustomTune technology adapts audio to your ears for immersive sound.",
    price: 279.99,
    stock: 55,
    featured: false,
    categorySlug: "audio",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop",
    ],
    specs: {
      Type: "In-ear wireless",
      "Noise Cancellation": "CustomTune ANC",
      "Battery Life": "Up to 6 hours (24 with case)",
      "Water Resistance": "IPX4",
      Connectivity: "Bluetooth 5.3",
    },
  },
  {
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    description:
      "Premium mechanical keyboard with hot-swappable switches, per-key RGB lighting, and aluminum frame for the ultimate typing experience.",
    price: 129.99,
    stock: 70,
    featured: false,
    categorySlug: "accessories",
    images: [
      "https://images.unsplash.com/photo-1511467658256-7a0fa6a3a4a5?w=800&h=800&fit=crop",
    ],
    specs: {
      Switches: "Hot-swappable mechanical",
      Layout: "Full-size 104 keys",
      Backlight: "Per-key RGB",
      Frame: "Aluminum",
      Connectivity: "USB-C wired / Bluetooth",
    },
  },
];

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  await prisma.user.upsert({
    where: { email: "admin@ecommace.com" },
    update: {},
    create: {
      email: "admin@ecommace.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Demo User",
      password: userPassword,
      role: "USER",
      address: "123 Tech Street",
      city: "San Francisco",
      postalCode: "94102",
      country: "US",
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const categoryMap = await prisma.category.findMany();
  const categoryBySlug = Object.fromEntries(categoryMap.map((c) => [c.slug, c.id]));

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData,
      create: {
        ...productData,
        categoryId: categoryBySlug[categorySlug],
      },
    });
  }

  console.log("Seed completed successfully!");
  console.log("Admin login: admin@ecommace.com / admin123");
  console.log("User login: user@example.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
