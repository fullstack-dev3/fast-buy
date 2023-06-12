import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TopCategories from '@/components/TopCategories';
import FeaturedProduct from '@/components/FeaturedProduct';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TopCategories />
      <FeaturedProduct />
      <Footer />
    </>
  )
}
