import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Problem } from './components/sections/Problem';
import { Solution } from './components/sections/Solution';
import { Features } from './components/sections/Features';
import { Process } from './components/sections/Process';
import { Results } from './components/sections/Results';
import { Showcase } from './components/sections/Showcase';
import { CTA } from './components/sections/CTA';

export default function App() {
  // Once fonts/layout settle, recalculate all ScrollTrigger positions so the
  // pinned and horizontal sections measure correctly.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    // After web fonts load (affects heights) and after first paint.
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    const t = setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Process />
        <Results />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
