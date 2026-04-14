import React from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import FocusProduct from '../components/FocusProduct';
import AboutUs from '../components/AboutUs';
import NewsSection from '../components/NewsSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title="Nguyễn Bính Sports - Chuyên đồ thể thao Cầu lông, Pickleball chính hãng"
        description="Nguyễn Bính Sports chuyên cung cấp vợt cầu lông, vợt pickleball, tennis, giày thể thao chính hãng. Uy tín, chất lượng tại TP.HCM."
        keywords="cầu lông, pickleball, tennis, giày thể thao, vợt cầu lông, Nguyễn Bính Sports"
      />
      <Navbar />
      <main>
        <HeroBanner />
        <CategorySection />
        <FeaturedProducts />
        <FocusProduct />
        <AboutUs />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
