require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const products = [
    { name: "Organic Hass Avocados", price: 45.00, unit: "Box (40ct)", imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400", isFeatured: true, stock: 100 },
    { name: "Vine-Ripe Tomatoes", price: 22.50, unit: "Flat", imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400", isFeatured: true, stock: 50 },
    { name: "Crisp Romaine Hearts", price: 32.00, unit: "Case (24ct)", imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=400", isFeatured: true, stock: 200 },
    { name: "Sweet Yellow Onions", price: 18.00, unit: "50lb Sack", imageUrl: "https://images.unsplash.com/photo-1620574387735-3624d75b2dbc?auto=format&fit=crop&q=80&w=400", isFeatured: true, stock: 80 }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log("Seeded featured products.");
  await prisma.$disconnect();
  process.exit(0);
}

main().catch(console.error);
