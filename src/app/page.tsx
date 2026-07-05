export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import CartToggleButton from "@/components/CartToggleButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function LandingPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const featuredProductsRaw = await db.product.findMany({
    where: { isFeatured: true },
    take: 4,
    include: {
      reviews: { select: { rating: true } }
    }
  });

  const featuredProducts = featuredProductsRaw.map(prod => {
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
    <div className={styles.mainContainer}>
      
      {/* 1. HEADER / NAVIGATION BAR */}
      <header className={styles.header}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            Just<span className={styles.logoAccent}>Fresh</span>
          </div>
          <nav className={styles.navLinks}>
            <Link href="#features">Why Choose Us</Link>
            <Link href="#categories">Our Produce</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#testimonials">Happy Customers</Link>
          </nav>
          <div className={styles.navActions}>
            <CartToggleButton />
            {session ? (
              <Link href="/portal/dashboard" className={styles.btnPrimary}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/portal/login" className={styles.btnText}>
                  Log In
                </Link>
                <Link href="/portal/register" className={styles.btnPrimary}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <span className={styles.badge}>Farm to Business Delivery</span>
            <h1 className={styles.heroTitle}>
              Fresh Produce. Delivered Straight to Your <span className={styles.titleHighlight}>Door.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We supply fresh, high-quality fruits and vegetables to supermarkets, restaurants, and kitchens. We guarantee everything is fresh and delivered exactly when you need it.
            </p>
            <div className={styles.heroActions}>
              <Link href="/portal/register" className={`${styles.btnPrimary} ${styles.btnLarge}`}>
                Create an Account
              </Link>
              <Link href="#categories" className={`${styles.btnSecondary} ${styles.btnLarge}`}>
                See Our Products
              </Link>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.imageContainer}>
              <Image 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh wholesale produce" 
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.heroImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST SIGNALS */}
      <section className={styles.trustBar}>
        <p className={styles.trustTitle}>Trusted by local restaurants, hotels, and markets</p>
        <div className={styles.trustLogos}>
          <span>METRO_MARKET</span>
          <span>GREEN_EATS</span>
          <span>HOTEL_GRAND</span>
          <span>APRON_STRINGS</span>
        </div>
      </section>

      {/* 3.5 FEATURED PRODUCTS (Quick Load) */}
      <section id="featured" className={`${styles.section} bg-white`}>
        <div className={styles.sectionHeader}>
          <h2>Today&apos;s Fresh Picks</h2>
          <p>Hand-selected premium produce available for immediate order.</p>
        </div>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-8 flex justify-center">
          <Link href="/portal/shop" className="bg-slate-100 text-slate-800 border border-slate-300 font-semibold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors">
            View All Products
          </Link>
        </div>
      </section>

      {/* 4. KEY VALUE PROPOSITIONS */}
      <section id="features" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <h2>Why Order From JustFresh?</h2>
          <p>We make getting fresh produce simple and reliable.</p>
        </div>
        <div className={styles.grid3}>
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.iconGreen}`}>✓</div>
            <h3>Always Fresh</h3>
            <p>We keep our produce in climate-controlled rooms and track every item so it always arrives perfectly fresh.</p>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.iconAmber}`}>$</div>
            <h3>Easy Payments</h3>
            <p>Pay easily with flexible options. We provide clear weekly statements and let you pay later as your business grows.</p>
          </div>
          <div className={styles.card}>
            <div className={`${styles.cardIcon} ${styles.iconBlue}`}>🚚</div>
            <h3>Fast, Reliable Delivery</h3>
            <p>Order by 10 PM to get guaranteed delivery the very next morning in our refrigerated trucks.</p>
          </div>
        </div>
      </section>

      {/* 5. CATEGORIZED PRODUCT PREVIEW */}
      <section id="categories" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <h2>What We Sell</h2>
          <p>We always have a huge variety of fresh, high-quality produce ready for you.</p>
        </div>
        <div className={styles.grid4}>
          {[
            { title: "Leafy Greens & Herbs", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400" },
            { title: "Root Crops & Tubers", img: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400" },
            { title: "Seasonal & Bulk Fruits", img: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400" },
            { title: "High-Volume Staples", img: "https://images.unsplash.com/photo-1587334206506-e17698f5a05e?auto=format&fit=crop&q=80&w=400" }
          ].map((cat, i) => (
            <div key={i} className={styles.categoryCard}>
              <Image src={cat.img} alt={cat.title} fill sizes="(max-width: 768px) 50vw, 25vw" className={styles.heroImg} />
              <div className={styles.categoryOverlay}>
                <h3>{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.centerText}>
          <Link href="/portal/login" className={styles.textLink}>
            Log in to see today&apos;s fresh products and prices →
          </Link>
        </div>
      </section>

      {/* 5. MEET OUR FARMERS */}
      <section id="farmers" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <h2>Meet Our Farmers</h2>
          <p>We work directly with the best local growers to bring you the freshest harvest.</p>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-lg">
            <Image src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c8e?auto=format&fit=crop&q=80&w=800" alt="Farmer in a field" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Sourced with Care</h3>
            <p className="text-slate-600 mb-4">Every morning, our partner farms harvest their best crops exclusively for JustFresh. By working directly with growers, we ensure they get paid fairly while you get the highest quality produce available.</p>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>✓ Hand-picked daily</li>
              <li>✓ Pesticide-free options</li>
              <li>✓ Supporting local agriculture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <h2>How to Get Started</h2>
          <p>It&apos;s easy to start ordering from us in just three simple steps.</p>
        </div>
        <div className={styles.grid3}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Sign Up</h3>
            <p>Fill out a quick form to tell us about your business and where to deliver.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Get Approved</h3>
            <p>We&apos;ll quickly review your account so you can see your special pricing and payment options.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Place Your Order</h3>
            <p>Log in, pick what you need, choose a delivery time, and checkout!</p>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE STATS COUNTER */}
      <section className={styles.statsBanner}>
        <div className={styles.grid4}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>15,000+</div>
            <div className={styles.statLabel}>Tons of Fresh Food Delivered</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>450+</div>
            <div className={styles.statLabel}>Happy Businesses</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.5%</div>
            <div className={styles.statLabel}>Perfect Orders</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>Kept Cold & Fresh</div>
          </div>
        </div>
      </section>

      {/* 8. DELIVERY ZONES */}
      <section id="delivery" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <h2>Where We Deliver</h2>
          <p>Fast, cold-chain delivery across the region.</p>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-lg text-slate-600 mb-8">We currently serve hundreds of businesses across the metropolitan area and surrounding suburbs. If you are located in our service zones, you qualify for our guaranteed next-morning delivery.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full font-semibold text-slate-700 shadow-sm">Downtown Metro</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full font-semibold text-slate-700 shadow-sm">Northside Suburbs</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full font-semibold text-slate-700 shadow-sm">West End Valley</span>
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-full font-semibold text-slate-700 shadow-sm">South Industrial</span>
          </div>
        </div>
      </section>

      {/* 9. CLIENT TESTIMONIALS */}
      <section id="testimonials" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <h2>What Our Customers Say</h2>
          <p>See how local businesses are thriving with JustFresh.</p>
        </div>
        <div className={styles.grid2}>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialQuote}>
              &quot;Switching our markets to JustFresh made a huge difference. Their produce lasts so much longer, and we throw away much less food now!&quot;
            </p>
            <div className={styles.testimonialAuthor}>
              <strong>Marcus Vance</strong>
              <span>Director of Procurement, Metro Market Corp</span>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <p className={styles.testimonialQuote}>
              &quot;As an executive chef, I need my ingredients on time every single day. JustFresh always delivers exactly when they promise, so my kitchens are always ready.&quot;
            </p>
            <div className={styles.testimonialAuthor}>
              <strong>Chef Elena Rostova</strong>
              <span>Culinary Lead, GreenEats Restaurant Group</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. OUR MISSION */}
      <section id="mission" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.sectionHeader}>
          <h2>Our Mission</h2>
          <p>Connecting local farms directly with your business.</p>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center text-lg text-slate-600">
          <p className="mb-4">
            At JustFresh, we believe that every business deserves access to the freshest, highest-quality produce without jumping through hoops. We cut out the middlemen so farmers get paid fairly and you get produce that lasts longer.
          </p>
          <p>
            Whether you run a small café or a massive grocery chain, we are committed to being the most reliable partner in your kitchen.
          </p>
        </div>
      </section>

      {/* 11. QUALITY GUARANTEE */}
      <section className="py-12 bg-green-50 border-y border-green-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Our 100% Freshness Guarantee</h2>
          <p className="text-green-700 text-lg">
            If any item in your order doesn&apos;t meet your standards, simply let us know within 24 hours. We will immediately refund the item or replace it on your next delivery—no questions asked.
          </p>
        </div>
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about ordering with us.</p>
        </div>
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Is there a minimum order size?</h3>
            <p className="text-slate-600">No, we support businesses of all sizes. Whether you need a single crate of tomatoes or a truckload, we can deliver.</p>
          </div>
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">How fast is delivery?</h3>
            <p className="text-slate-600">If you place your order before 10 PM, we guarantee delivery the very next morning.</p>
          </div>
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Can I pay later?</h3>
            <p className="text-slate-600">Yes! We offer flexible credit lines for approved businesses so you can pay on a Net-30 basis.</p>
          </div>
        </div>
      </section>

      {/* 13. STAY UPDATED (NEWSLETTER) */}
      <section className={`${styles.section} ${styles.sectionGray}`}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get Weekly Market Updates</h2>
          <p className="text-slate-600 mb-8">Join our newsletter to receive weekly updates on seasonal availability, special bulk pricing, and market trends.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-lg border border-slate-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-600" />
            <button type="button" className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>

      {/* 14. FINAL CALL TO ACTION BANNER */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2>Ready to Get Fresh Produce Delivered?</h2>
          <p>
            Create your free account today and start ordering the freshest fruits and vegetables for your business.
          </p>
          <Link href="/portal/register" className={`${styles.btnWhite} ${styles.btnLarge}`}>
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* 15. FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              Just<span className={styles.logoAccent}>Fresh</span>
            </div>
            <p>Providing fresh, reliable produce delivery for businesses of all sizes.</p>
            <div className={styles.copyright}>© 2026 JustFresh Inc. All rights reserved.</div>
          </div>
          <div className={styles.footerColumn}>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="#features">Why Choose Us</Link></li>
              <li><Link href="#categories">Our Produce</Link></li>
              <li><Link href="#how-it-works">How to Order</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Legal</h4>
            <ul>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/credit">Payment Policies</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Contact Us</h4>
            <p className={styles.address}>
              Terminal Warehouse Block B-40<br />
              Industrial Freight Logistics District<br />
              support@justfreshagro.com
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}