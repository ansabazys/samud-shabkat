import { HomepageHeroSection } from "@/components/homepage/homepage-hero-section";
import { HomepageProductShowcase } from "@/components/homepage/homepage-product-showcase";
import { HomepageShopByCategory } from "@/components/homepage/homepage-shop-by-category";
import { HomepageDualPromo } from "@/components/homepage/homepage-dual-promo";
import { HomepageFeaturedBrands } from "@/components/homepage/homepage-featured-brands";
import { HomepageBestSellers } from "@/components/homepage/homepage-best-sellers";
import { HomepageNewArrivals } from "@/components/homepage/homepage-new-arrivals";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-white">
      <HomepageHeroSection />
      <HomepageProductShowcase />
      <HomepageShopByCategory />
      <HomepageDualPromo />
      <HomepageFeaturedBrands />
      <HomepageBestSellers />
      <HomepageNewArrivals />
    </main>
  );
}
