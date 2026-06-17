import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import About from '@/components/About';
import Footer from '@/components/Footer';

const ScrollReveal = dynamic(() => import('@/components/ScrollReveal'), { ssr: false });

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Projects />
        <ContactForm />
        <About />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
