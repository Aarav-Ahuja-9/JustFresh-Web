import ProductCard from "@/components/ProductCard";
import CartToggleButton from "@/components/CartToggleButton";
import { db } from "@/lib/db";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ShopFilters from "./ShopFilters";

export default async function Shop(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const searchParams = await props.searchParams;
  const q = searchParams?.q as string || "";
  const category = searchParams?.category as string || "";

  // Build Prisma where clause
  const whereClause: any = {};
  if (q) {
    whereClause.name = { contains: q, mode: 'insensitive' };
  }
  if (category && category !== "All") {
    whereClause.category = category;
  }

  const productsRaw = await db.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      reviews: {
        select: { rating: true }
      }
    }
  });

  const products = productsRaw.map(prod => {
    const reviewCount = prod.reviews.length;
    const averageRating = reviewCount > 0 
      ? prod.reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount 
      : 0;
    
    return {
      ...prod,
      reviewCount,
      averageRating
    };
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Navbar / Header */}
      <header className="bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
              Just<span className="text-green-600">Fresh</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">
              Home
            </Link>
            {session ? (
              <Link href="/portal/dashboard" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/portal/login" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">
                Log In
              </Link>
            )}
            <CartToggleButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-20 px-6">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
            alt="Fresh produce background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-start">
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
            Farm to Table
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            Fresh Produce
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
            Order the freshest vegetables, fruits, and organic products directly from local farmers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        
        <ShopFilters />

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found.</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}