import HeroSection from '@/components/home/HeroSection';
import BrandsTicker from '@/components/home/BrandsTicker';
import StatsSection from '@/components/home/StatsSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import CircuitDivider from '@/components/home/CircuitDivider';
import FeaturedSection from '@/components/home/FeaturedSection';
import DealOfTheDaySection from '@/components/home/DealOfTheDaySection';
import CategoriesSection from '@/components/home/CategoriesSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandsTicker />
      <StatsSection />
      <WhyChooseUsSection />
      <CircuitDivider />
      <FeaturedSection />
      <DealOfTheDaySection />
      <CategoriesSection />
      <NewArrivalsSection />
      <CircuitDivider flip />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
