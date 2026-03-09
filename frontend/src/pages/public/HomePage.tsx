import HeroSection from '@/components/home/HeroSection';
import BrandsTicker from '@/components/home/BrandsTicker';
import FeaturedSection from '@/components/home/FeaturedSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandsTicker />
      <FeaturedSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <NewsletterSection />
    </>
  );
}
