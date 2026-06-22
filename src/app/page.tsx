import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Cursor from '@/components/Cursor';
import Stats from '@/components/Stats';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import Process from '@/components/Process';
import Testimonials from '@/components/Testimonials';
import Partners from '@/components/Partners';
import ContactForm from '@/components/ContactForm';
import About from '@/components/About';
import Footer from '@/components/Footer';

const ScrollReveal = dynamic(() => import('@/components/ScrollReveal'), { ssr: false });

export default function Home() {
  return (
    <>
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Projects />
        <Process />
        <Testimonials />
        <Partners />
        <ContactForm />
        <About />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
