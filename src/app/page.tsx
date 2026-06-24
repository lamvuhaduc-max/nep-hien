import dynamic from 'next/dynamic';
import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
      <Header isDark={true} />
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

      {/* QR float button */}
      <Link href="/uu-dai" className="qr-float" aria-label="Nhận ưu đãi qua QR">
        <span className="qr-float-icon">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="5" y="5" width="3" height="3" fill="currentColor"/>
            <rect x="16" y="5" width="3" height="3" fill="currentColor"/>
            <rect x="5" y="16" width="3" height="3" fill="currentColor"/>
            <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" fill="currentColor"/>
          </svg>
        </span>
        <span className="qr-float-text">Ưu đãi<br/>QR</span>
      </Link>
    </>
  );
}
