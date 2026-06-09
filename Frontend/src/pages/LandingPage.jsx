import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    const sections = ['hero', 'features', 'platform', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observerRef.current.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 selection:text-white">
      <Header />

      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]"></div>

      <section 
        id="hero" 
        className={`relative z-10 pt-40 pb-20 px-4 min-h-[85vh] flex flex-col items-center justify-center transition-all duration-1000 transform ${
          isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">TDC Matchmaker Operating System</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold mb-6 tracking-tight text-white leading-[1.1]">
            Intelligent Matchmaking, <br className="hidden md:block" />
            <span className="text-gray-400">Streamlined.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
            The professional platform for high-end matchmakers. Manage clients, track journey stages, and leverage advanced algorithms to curate perfect connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link to="/login" className="px-6 py-3 bg-white text-black rounded-md font-medium transition-all hover:bg-gray-100 w-full sm:w-auto text-center border border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Access Dashboard
            </Link>
            <button className="px-6 py-3 bg-transparent text-white rounded-md font-medium transition-all hover:bg-white/5 w-full sm:w-auto text-center border border-white/20">
              Read Documentation
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-4xl mt-12 rounded-lg border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden group">
            <div className="h-10 bg-[#111] border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="p-6 grid grid-cols-4 gap-4 opacity-50 group-hover:opacity-100 transition-opacity duration-700">
              <div className="col-span-1 border border-white/5 rounded p-4 h-48 bg-white/5"></div>
              <div className="col-span-3 border border-white/5 rounded p-4 h-48 bg-white/5"></div>
              <div className="col-span-4 border border-white/5 rounded p-4 h-32 bg-white/5"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      <section 
        id="features" 
        className={`relative z-10 py-32 px-4 border-t border-white/10 bg-[#050505] transition-all duration-1000 transform ${
          isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl font-semibold mb-4 text-white">Powerful Primitives</h2>
            <p className="text-gray-400 max-w-2xl text-lg">Built from the ground up to support complex matchmaking workflows, providing you with the tools to manage your client portfolio efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Algorithmic Scoring', desc: 'Compute compatibility across 15+ vectors including religion, caste, diet, and lifestyle preferences instantly.' },
              { title: 'Journey Tracking', desc: 'Monitor pipeline stages. Move clients from Onboarding to Active, On Hold, or Matched with clear visibility.' },
              { title: 'Structured Biodata', desc: 'Standardized schemas for capturing comprehensive personal, professional, and family background data.' },
              { title: 'Meeting Intel', desc: 'Chronological note-taking for calls and face-to-face meetings, attached directly to the client profile.' },
              { title: 'Automated Intros', desc: 'Generate personalized, context-aware match introduction emails highlighting specific compatibility points.' },
              { title: 'Access Control', desc: 'Secure architecture ensuring matchmaker data partitioning and strict privacy compliance.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-white/10 bg-[#0A0A0A] hover:bg-[#111] transition-colors">
                <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-lg font-medium mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        id="platform" 
        className={`relative z-10 py-32 px-4 border-t border-white/10 transition-all duration-1000 transform ${
          isVisible.platform ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6">Designed for Focus</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                We stripped away the noise. No infinite scrolls, no social feeds. Just a clean, high-density interface that lets you process profiles and find matches faster.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Real-time Search & Filter', desc: 'Instantly query your database by name, city, or journey status.' },
                  { title: 'Comprehensive Profiles', desc: 'All data points unified on a single screen to eliminate context switching.' },
                  { title: 'Frictionless Actions', desc: 'Update statuses and record notes with zero page reloads.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0 bg-white/5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-lg border border-white/10 bg-[#0A0A0A] p-8 flex flex-col gap-4">
                <div className="w-full h-8 bg-white/5 rounded border border-white/5"></div>
                <div className="flex gap-4">
                  <div className="w-1/3 h-64 bg-white/5 rounded border border-white/5"></div>
                  <div className="w-2/3 flex flex-col gap-4">
                    <div className="w-full h-20 bg-white/5 rounded border border-white/5"></div>
                    <div className="w-full h-40 bg-white/5 rounded border border-white/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        id="contact" 
        className={`relative z-10 py-32 px-4 border-t border-white/10 bg-[#050505] transition-all duration-1000 transform ${
          isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">Deploy to your organization today.</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
            Experience the efficiency of a purpose-built matchmaking OS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="px-6 py-3 bg-white text-black rounded-md font-medium transition-all hover:bg-gray-100 border border-white">
              Start Building Matches
            </Link>
            <button className="px-6 py-3 bg-transparent text-white rounded-md font-medium transition-all hover:bg-white/5 border border-white/20">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;