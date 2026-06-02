import { useState, useEffect, useCallback } from 'react';

// TypeScript Interfaces
interface Project {
  id: number;
  title: string;
  category: 'kitchen' | 'living' | 'bedroom' | 'luxury';
  categoryLabel: string;
  slogan: string;
  image: string;
  description: string;
  gridClass?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  focusAreas: string[];
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

// Portfolio Projects Dataset using the user's actual project photos
const projects: Project[] = [
  {
    id: 1,
    title: "The Gilded Branch Lounge",
    category: "living",
    categoryLabel: "Living Area",
    slogan: "Nature Merged in Timber",
    image: "/images/living-room-main.jpg",
    description: "Features a hand-crafted brass tree sculpture mounted on fluted walnut wood wall paneling, balanced with curved bouclé chairs and marble flooring.",
    gridClass: "md:col-span-8 md:row-span-2"
  },
  {
    id: 2,
    title: "The Monolithic Sanctuary",
    category: "bedroom",
    categoryLabel: "Bedroom",
    slogan: "Serenity in Texture",
    image: "/images/bedroom-main.jpg",
    description: "Master bedroom concept integrating vertical oak wood slats, a custom terracotta leather headboard, and hidden LED backlighting.",
    gridClass: "md:col-span-4 md:row-span-2"
  },
  {
    id: 3,
    title: "The Sculptured Hearth",
    category: "living",
    categoryLabel: "Living Area",
    slogan: "Plaster & Stone Dialogue",
    image: "/images/living-room-close.jpg",
    description: "A closer look at a bespoke lounge featuring a raw plaster wave art piece, low-slung linen sofa, and travertine stone coffee tables.",
    gridClass: "md:col-span-4 md:row-span-1"
  },
  {
    id: 4,
    title: "The Obsidian Cinema",
    category: "luxury",
    categoryLabel: "Luxury Spaces",
    slogan: "Acoustic Perfection",
    image: "/images/living-room-main.jpg",
    description: "Luxury home cinema environment blending acoustic wood slot panels and plush deep velvet upholstery.",
    gridClass: "md:col-span-4 md:row-span-1"
  },
  {
    id: 5,
    title: "The Amber Lounge",
    category: "luxury",
    categoryLabel: "Luxury Spaces",
    slogan: "Atmospheric Bar & Wine Cellar",
    image: "/images/bedroom-main.jpg",
    description: "A private residential bar featuring backlit quartzite stone, raw timber counters, and mood lighting.",
    gridClass: "md:col-span-4 md:row-span-2"
  },
  {
    id: 6,
    title: "Chef's Culinary Hearth",
    category: "kitchen",
    categoryLabel: "Kitchen",
    slogan: "The Heart of the Home",
    image: "/images/living-room-close.jpg",
    description: "An ultra-luxury kitchen concept with a monolithic marble island, seamless hidden appliances, and oak cabinetry.",
    gridClass: "md:col-span-8 md:row-span-1"
  }
];

// Slideshow images for Hero Carousel
const heroSlides = [
  {
    image: "/images/living-room-main.jpg",
    alt: "Exotica flagship living room concept featuring bespoke wood paneling and gold details"
  },
  {
    image: "/images/bedroom-main.jpg",
    alt: "Master bedroom design with high texture slat header and modern lighting"
  },
  {
    image: "/images/living-room-close.jpg",
    alt: "Minimalist residential lounge with soft-textured organic furniture and wall sculpture"
  }
];

// Available Portfolio Tabs
const filterTabs = [
  { id: 'all', label: 'All Concepts' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'living', label: 'Living Area' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'luxury', label: 'Luxury Spaces' }
];

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [animateGrid, setAnimateGrid] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<'enter' | 'hold' | 'exit' | 'idle'>('idle');

  // Page transition navigation handler
  const navigateTo = useCallback((targetId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionPhase('enter');
    setIsMobileMenuOpen(false);

    // Phase 1: Overlay slides in (500ms)
    setTimeout(() => {
      setTransitionPhase('hold');
      // Scroll to target while overlay is visible
      const el = document.getElementById(targetId);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 80, behavior: 'auto' });
      }
    }, 500);

    // Phase 2: Hold with logo (600ms)
    setTimeout(() => {
      setTransitionPhase('exit');
    }, 1100);

    // Phase 3: Overlay exits (500ms)
    setTimeout(() => {
      setTransitionPhase('idle');
      setIsTransitioning(false);
    }, 1600);
  }, [isTransitioning]);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    focusAreas: ['Space Planning'],
    message: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  // --- Effects ---
  // Sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero slideshow interval rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Trigger grid animation effect when activeTab changes
  useEffect(() => {
    setAnimateGrid(false);
    const timer = setTimeout(() => setAnimateGrid(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // --- Helper Functions ---
  const filteredProjects = activeTab === 'all'
    ? projects
    : projects.filter(p => p.category === activeTab);

  // Validate form entries
  const validateField = (name: keyof FormData, value: string): string => {
    if (!value.trim()) {
      return `Please enter your ${name === 'name' ? 'full name' : name === 'phone' ? 'phone number' : 'email address'}.`;
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'name' || name === 'email' || name === 'phone') {
      const errorMsg = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleCheckboxChange = (area: string) => {
    setFormData(prev => {
      const selected = prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: selected };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};
    
    // Check all required fields
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const phoneErr = validateField('phone', formData.phone);
    
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (phoneErr) errors.phone = phoneErr;

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log("Consultation form brief successfully submitted:", formData);
      setIsFormSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      focusAreas: ['Space Planning'],
      message: ''
    });
    setFormErrors({});
    setIsFormSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1C1C1C] flex flex-col font-sans overflow-x-hidden selection:bg-[#D34E36] selection:text-white">
      
      {/* Page Transition Overlay with Brand Logo */}
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none ${
          transitionPhase === 'idle' ? 'invisible' : 'visible pointer-events-auto'
        }`}
        aria-hidden="true"
      >
        {/* Solid Background Panel */}
        <div
          className={`absolute inset-0 bg-[#D34E36] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            transitionPhase === 'enter' ? 'translate-x-0' :
            transitionPhase === 'hold' ? 'translate-x-0' :
            transitionPhase === 'exit' ? 'translate-x-full' :
            '-translate-x-full'
          }`}
        />
        {/* Logo Content */}
        <div
          className={`relative z-10 flex flex-col items-center gap-4 transition-all duration-300 ${
            transitionPhase === 'hold' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <img
            src="/images/exotica-logo.jpg"
            alt=""
            className="h-20 w-20 md:h-24 md:w-24 object-cover shadow-2xl"
          />
          <div className="flex flex-col items-center">
            <span className="font-serif font-bold text-3xl md:text-4xl tracking-[0.2em] text-[#FBFBFA] leading-none">EXOTICA</span>
            <span className="font-sans text-[0.65rem] font-semibold tracking-[0.4em] text-[#FBFBFA]/70 mt-2 leading-none">INTERIOR DESIGN STUDIO</span>
          </div>
          {/* Subtle pulsing line */}
          <div className="w-16 h-[2px] bg-[#C5A880] mt-2 animate-pulse" />
        </div>
      </div>
      
      {/* Sticky Navigation Bar */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FBFBFA]/90 backdrop-blur-md shadow-sm border-b border-[#1C1C1C]/5 py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <button onClick={() => navigateTo('hero')} className="flex items-center gap-3.5 group cursor-pointer bg-transparent border-none" aria-label="Exotica Interior Design Studio Home">
            <img 
              src="/images/exotica-logo.jpg" 
              alt="Exotica Logo mark with red background" 
              className="h-10 w-10 md:h-11 md:w-11 object-cover border border-[#1C1C1C]/5 rounded-none" 
            />
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-xl tracking-[0.18em] text-[#D34E36] leading-none">EXOTICA</span>
              <span className="font-sans text-[0.55rem] md:text-[0.6rem] font-semibold tracking-[0.3em] text-[#1C1C1C]/50 mt-1 leading-none">INTERIOR DESIGN STUDIO</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:block" aria-label="Primary Navigation">
            <ul className="flex items-center gap-10">
              {['Home', 'Our Story', 'Services', 'Portfolio'].map((link) => {
                const targetId = link === 'Home' ? 'hero' : link === 'Our Story' ? 'about' : link.toLowerCase().replace(' ', '');
                return (
                  <li key={link}>
                    <button 
                      onClick={() => navigateTo(targetId)}
                      className="font-sans text-xs tracking-[0.15em] text-[#1C1C1C]/80 hover:text-[#1C1C1C] uppercase relative py-1 bg-transparent border-none cursor-pointer after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-[#D34E36] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
                    >
                      {link}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden md:block">
            <button 
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center justify-center bg-[#D34E36] hover:bg-[#B93C27] text-white text-xs font-semibold tracking-[0.15em] uppercase px-6 py-3.5 transition-all duration-500 ease-out hover:-translate-y-0.5 cursor-pointer border-none"
            >
              Book Free Consultation
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden flex flex-col justify-between w-6 h-4 bg-transparent border-none cursor-pointer z-50 focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            <span className={`w-full h-[2px] bg-[#1C1C1C] transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`w-full h-[2px] bg-[#1C1C1C] transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-[2px] bg-[#1C1C1C] transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          id="mobile-menu"
          className={`fixed top-0 right-0 w-[80%] max-w-[400px] h-screen bg-[#FBFBFA] border-l border-[#1C1C1C]/10 shadow-2xl p-10 pt-28 flex flex-col gap-8 transition-transform duration-500 ease-out z-40 md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ul className="flex flex-col gap-6">
            {['Home', 'Our Story', 'Services', 'Portfolio'].map((link) => {
              const targetId = link === 'Home' ? 'hero' : link === 'Our Story' ? 'about' : link.toLowerCase().replace(' ', '');
              return (
                <li key={link}>
                  <button 
                    onClick={() => navigateTo(targetId)}
                    className="font-sans text-lg tracking-[0.15em] text-[#1C1C1C] uppercase bg-transparent border-none cursor-pointer text-left"
                  >
                    {link}
                  </button>
                </li>
              );
            })}
          </ul>
          
          <button 
            onClick={() => navigateTo('contact')}
            className="w-full text-center bg-[#D34E36] hover:bg-[#B93C27] text-white text-sm font-semibold tracking-[0.15em] uppercase py-4 transition-all duration-300 cursor-pointer border-none"
          >
            Book Free Consultation
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section id="hero" className="min-h-screen pt-20 flex items-center bg-[#FBFBFA] overflow-hidden">
          <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-6">
            
            {/* Left Content column */}
            <div className="lg:col-span-5 flex flex-col justify-center h-full relative z-10 py-12 lg:py-0">
              <span className="font-sans text-[0.8rem] font-semibold tracking-[0.25em] text-[#D34E36] uppercase mb-4 animate-[fadeIn_1.2s_ease-out]">
                Crafting Spaces that Inspire
              </span>
              <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] text-[#1C1C1C] mb-6 font-medium animate-[slideUp_1.2s_ease-out]">
                Every great design begins with an even better story...
              </h1>
              <p className="font-sans font-light text-base md:text-lg text-[#1C1C1C]/60 mb-8 max-w-[480px] animate-[fadeIn_1.5s_ease-out]">
                We translate personal narratives into bespoke architectural environments where form, texture, and light dance in absolute harmony.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-[fadeIn_1.5s_ease-out]">
                <button 
                  onClick={() => navigateTo('contact')}
                  className="bg-[#D34E36] hover:bg-[#B93C27] text-white text-xs font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  Begin Your Story
                </button>
                <button 
                  onClick={() => navigateTo('portfolio')}
                  className="border border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FBFBFA] text-[#1C1C1C] text-xs font-semibold tracking-[0.15em] uppercase px-8 py-4 transition-all duration-500 ease-out hover:-translate-y-0.5 cursor-pointer bg-transparent"
                >
                  Explore Portfolio
                </button>
              </div>
            </div>

            {/* Right Slideshow column displaying user's real project photos */}
            <div className="lg:col-span-7 h-[50vh] lg:h-[80vh] relative overflow-hidden group border border-[#1C1C1C]/5 shadow-lg">
              <div className="w-full h-full relative">
                {heroSlides.map((slide, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden ${
                      idx === activeSlide ? 'opacity-100 visible z-10' : 'opacity-0 invisible z-0'
                    }`}
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.alt} 
                      className={`w-full h-full object-cover transition-transform duration-[7000ms] ease-out ${
                        idx === activeSlide ? 'scale-100' : 'scale-110'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-6 right-6 flex gap-3 z-20 bg-[#1C1C1C]/30 backdrop-blur-sm px-4 py-2">
                {heroSlides.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-[2px] transition-all duration-300 focus:outline-none ${
                      idx === activeSlide ? 'bg-[#FBFBFA] w-10' : 'bg-[#FBFBFA]/40 w-6'
                    }`}
                    aria-label={`View project photo ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Our Story & Core Team Section */}
        <section id="about" className="py-24 md:py-36 bg-[#FBFBFA] border-t border-[#1C1C1C]/5">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Story text */}
            <div className="lg:col-span-7">
              <span className="font-sans text-[0.8rem] font-semibold tracking-[0.25em] text-[#D34E36] uppercase mb-4 inline-block">
                Our Story
              </span>
              <h2 className="font-serif text-[2rem] md:text-[3rem] leading-[1.2] text-[#1C1C1C] mb-8 font-medium">
                We are the architects of dreams and craftsmen of imagination.
              </h2>
              <p className="font-sans font-light text-base text-[#1C1C1C]/75 mb-8 leading-relaxed max-w-[620px]">
                At Exotica, we believe a home is a living canvas. We design not just for the eyes, but for the soul—sculpting proportions, curating rare materials, and balancing tones to tell your unique story. From initial conceptualization to the final touch, every detail is engineered to inspire.
              </p>
              <blockquote className="font-serif text-2xl font-light italic text-[#D34E36] border-l-[3px] border-[#C5A880] pl-6 py-2 my-8">
                "From concept to creation, every detail matters."
              </blockquote>
            </div>

            {/* Core Team framework panel */}
            <div className="lg:col-span-5 bg-[#FBFBFA] border border-[#1C1C1C]/10 p-8 md:p-10 relative overflow-hidden group hover:border-[#D34E36] transition-all duration-500 ease-out shadow-sm">
              <h3 className="font-serif text-2xl mb-6 text-[#1C1C1C] tracking-[0.02em] border-b border-[#1C1C1C]/5 pb-4">Our Framework</h3>
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="font-serif text-lg text-[#C5A880] font-medium min-w-[24px]">01</div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm tracking-wider uppercase text-[#1C1C1C]">Visionary Designers</h4>
                    <p className="font-sans font-light text-sm text-[#1C1C1C]/60 mt-1">Scribing unique spatial narratives, drawing from client briefs to propose bespoke concepts.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="font-serif text-lg text-[#C5A880] font-medium min-w-[24px]">02</div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm tracking-wider uppercase text-[#1C1C1C]">Expert Builders</h4>
                    <p className="font-sans font-light text-sm text-[#1C1C1C]/60 mt-1">Translating abstract visuals into actual structural elements with meticulous technical execution.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="font-serif text-lg text-[#C5A880] font-medium min-w-[24px]">03</div>
                  <div>
                    <h4 className="font-sans font-semibold text-sm tracking-wider uppercase text-[#1C1C1C]">Creative Minds</h4>
                    <p className="font-sans font-light text-sm text-[#1C1C1C]/60 mt-1">Curating rare wood panels, backlit natural stones, plaster wave sculptures, and textiles.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Brand Showcase Section: Detailing user's actual design photos */}
        <section className="py-24 bg-[#D34E36] text-[#FBFBFA]">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="font-sans text-[0.8rem] font-semibold tracking-[0.25em] text-[#C5A880] uppercase mb-4 inline-block">
                Flagship Showcase
              </span>
              <h2 className="font-serif text-[2rem] md:text-[3rem] text-[#FBFBFA] font-medium leading-tight">
                Authentic Spaces Created by Exotica
              </h2>
              <p className="font-sans font-light text-[#FBFBFA]/80 mt-4">
                Walk through the materials, layouts, and philosophies embedded in our flagship interior designs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Photo 1 details */}
              <div className="flex flex-col bg-white/[0.03] border border-white/10 p-6 md:p-8 hover:bg-white/[0.06] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden mb-6 border border-white/5">
                  <img src="/images/living-room-main.jpg" alt="Exotica flagship living room paneling details" className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                </div>
                <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[#C5A880]">Living Area Concept</span>
                <h3 className="font-serif text-2xl text-white mt-1 mb-4 font-normal">The Gilded Branch</h3>
                <p className="font-sans font-light text-sm text-[#FBFBFA]/75 leading-relaxed">
                  Features a massive hand-crafted brass tree sculpture mounted on fluted walnut wood paneling, balanced with curved bouclé chairs and marble flooring.
                </p>
              </div>

              {/* Photo 2 details */}
              <div className="flex flex-col bg-white/[0.03] border border-white/10 p-6 md:p-8 hover:bg-white/[0.06] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden mb-6 border border-white/5">
                  <img src="/images/bedroom-main.jpg" alt="Exotica master bedroom wood paneling details" className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                </div>
                <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[#C5A880]">Bedroom Concept</span>
                <h3 className="font-serif text-2xl text-white mt-1 mb-4 font-normal">The Monolithic Suite</h3>
                <p className="font-sans font-light text-sm text-[#FBFBFA]/75 leading-relaxed">
                  Master bedroom suite blending vertical oak wood slats with hidden LED backlighting. A low-profile bed features a custom terracotta leather headboard and plush textiles.
                </p>
              </div>

              {/* Photo 3 details */}
              <div className="flex flex-col bg-white/[0.03] border border-white/10 p-6 md:p-8 hover:bg-white/[0.06] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden mb-6 border border-white/5">
                  <img src="/images/living-room-close.jpg" alt="Minimalist plaster sculpture details" className="w-full h-full object-cover hover:scale-105 transition-all duration-500" />
                </div>
                <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-[#C5A880]">Living Area Close-up</span>
                <h3 className="font-serif text-2xl text-white mt-1 mb-4 font-normal">The Sculptured Hearth</h3>
                <p className="font-sans font-light text-sm text-[#FBFBFA]/75 leading-relaxed">
                  A closer view of the lounge detailing the raw plaster wave art piece, low-slung linen sofa, travertine coffee tables, and organic side chairs.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Services / Consultation Pillars Section */}
        <section id="services" className="py-24 bg-[#FBFBFA] border-t border-[#1C1C1C]/5">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="font-sans text-[0.8rem] font-semibold tracking-[0.25em] text-[#D34E36] uppercase mb-4 inline-block">
                Core Pillars
              </span>
              <h2 className="font-serif text-[2rem] md:text-[2.8rem] text-[#1C1C1C] font-medium">
                The Foundation of Our Craft
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Pillar 1 */}
              <div className="bg-[#FBFBFA] border border-[#1C1C1C]/10 p-10 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#D34E36] hover:shadow-2xl hover:shadow-[#D34E36]/5 group after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D34E36] hover:after:w-full after:transition-all after:duration-500">
                <div className="font-serif text-5xl text-[#1C1C1C]/10 mb-6 group-hover:text-[#C5A880] group-hover:-translate-y-1 transition-all duration-500">01</div>
                <h3 className="font-serif text-2xl mb-4 text-[#1C1C1C] font-medium">Space Planning</h3>
                <p className="font-sans font-light text-sm text-[#1C1C1C]/60 leading-relaxed">
                  Architectural spatial optimization. We configure layouts that maximize flow, scale, and function, establishing an intuitive relationship between adjacent zones.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#FBFBFA] border border-[#1C1C1C]/10 p-10 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#D34E36] hover:shadow-2xl hover:shadow-[#D34E36]/5 group after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D34E36] hover:after:w-full after:transition-all after:duration-500">
                <div className="font-serif text-5xl text-[#1C1C1C]/10 mb-6 group-hover:text-[#C5A880] group-hover:-translate-y-1 transition-all duration-500">02</div>
                <h3 className="font-serif text-2xl mb-4 text-[#1C1C1C] font-medium">Material Selection</h3>
                <p className="font-sans font-light text-sm text-[#1C1C1C]/60 leading-relaxed">
                  A tactile dialogue. We source rare marbles, rich timber, fine metal detailing, and bespoke textiles that enrich the sensory experience of your home.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#FBFBFA] border border-[#1C1C1C]/10 p-10 relative overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#D34E36] hover:shadow-2xl hover:shadow-[#D34E36]/5 group after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D34E36] hover:after:w-full after:transition-all after:duration-500">
                <div className="font-serif text-5xl text-[#1C1C1C]/10 mb-6 group-hover:text-[#C5A880] group-hover:-translate-y-1 transition-all duration-500">03</div>
                <h3 className="font-serif text-2xl mb-4 text-[#1C1C1C] font-medium">Color Consultation</h3>
                <p className="font-sans font-light text-sm text-[#1C1C1C]/60 leading-relaxed">
                  Atmospheric curation. We design color harmonies that capture shifting daylight, define regional moods, and tie architectural layers together.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 md:py-36 bg-[#FBFBFA] border-t border-[#1C1C1C]/5">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12">
            
            <div className="mb-12">
              <span className="font-sans text-[0.8rem] font-semibold tracking-[0.25em] text-[#D34E36] uppercase mb-4 inline-block">
                Concept Portfolio
              </span>
              <h2 className="font-serif text-[2rem] md:text-[3rem] text-[#1C1C1C] font-medium">
                Explore Our Specialties
              </h2>
            </div>

            {/* Tabs Row */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-12 border-b border-[#1C1C1C]/10 pb-4" role="tablist" aria-label="Portfolio filters">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-sans text-xs font-semibold uppercase tracking-widest px-4 py-2 cursor-pointer transition-all duration-300 relative after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-[#D34E36] after:transition-all after:duration-300 ${
                    activeTab === tab.id 
                      ? 'text-[#1C1C1C] after:scale-x-100' 
                      : 'text-[#1C1C1C]/40 hover:text-[#1C1C1C]/80 after:scale-x-0'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Asymmetrical Bento Grid */}
            <div 
              className={`grid grid-cols-1 md:grid-cols-12 md:auto-rows-[220px] gap-6 transition-all duration-500 ease-out ${
                animateGrid ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              aria-live="polite"
            >
              {filteredProjects.map((project) => (
                <div 
                  key={project.id}
                  className={`relative overflow-hidden group border border-[#1C1C1C]/10 min-h-[300px] md:min-h-0 ${
                    activeTab === 'all' && project.gridClass ? project.gridClass : 'md:col-span-4 md:row-span-2'
                  }`}
                >
                  <img 
                    src={project.image} 
                    alt={`${project.title} - ${project.slogan}`}
                    className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-[0.8]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-[#1C1C1C]/10 to-transparent flex flex-col justify-end p-6 opacity-90 transition-all duration-300 group-hover:bg-[#1C1C1C]/50">
                    <span className="font-sans text-[0.65rem] tracking-[0.25em] text-[#C5A880] uppercase mb-1">{project.categoryLabel} Concepts</span>
                    <h4 className="font-serif text-xl md:text-2xl text-[#FBFBFA] font-light leading-tight">{project.title}</h4>
                    <p className="font-serif text-sm italic text-[#FBFBFA]/70 mt-1">{project.slogan}</p>
                    <p className="font-sans font-light text-[0.75rem] text-[#FBFBFA]/50 mt-1.5 hidden group-hover:block transition-all duration-300">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Lead Intake Form and Details */}
        <section id="contact" className="py-24 bg-[#FBFBFA] border-t border-[#1C1C1C]/5">
          <div className="max-w-[1300px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            {/* Address Column */}
            <div className="lg:col-span-5">
              <div className="mb-10 flex items-center gap-4">
                <img 
                  src="/images/exotica-logo.jpg" 
                  alt="Exotica brand logo mark" 
                  className="h-12 w-12 object-cover border border-[#1C1C1C]/10" 
                />
                <div className="flex flex-col">
                  <h2 className="font-serif text-3xl tracking-wider text-[#D34E36] font-bold leading-none">EXOTICA</h2>
                  <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#1C1C1C]/50 mt-1 leading-none">INTERIOR DESIGN STUDIO</p>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-serif text-xl text-[#1C1C1C] mb-6 tracking-wide border-b border-[#1C1C1C]/5 pb-2">Connect Direct</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <span className="font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider">Phone / WhatsApp</span>
                    <a href="tel:+919703400005" className="font-serif text-lg text-[#1C1C1C] hover:text-[#D34E36] transition-colors mt-0.5">+91 9703400005</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider">Email Address</span>
                    <a href="mailto:exoticadesignstudio3@gmail.com" className="font-serif text-lg text-[#1C1C1C] hover:text-[#D34E36] transition-colors mt-0.5">exoticadesignstudio3@gmail.com</a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-xl text-[#1C1C1C] mb-6 tracking-wide border-b border-[#1C1C1C]/5 pb-2">Our Footprint</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="pb-4 border-b border-[#1C1C1C]/10 sm:col-span-2">
                    <span className="font-serif text-lg text-[#1C1C1C] font-normal">Hyderabad</span>
                    <span className="block font-sans text-[0.65rem] font-bold text-[#D34E36] uppercase tracking-[0.15em] mt-0.5">Head Office</span>
                    <p className="font-sans font-light text-sm text-[#1C1C1C]/50 mt-1">Banjara Hills, Road No. 12</p>
                  </div>
                  <div className="pb-4 border-b border-[#1C1C1C]/10">
                    <span className="font-serif text-base text-[#1C1C1C]">Bangalore</span>
                    <span className="block font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider mt-0.5">Branch Office</span>
                    <p className="font-sans font-light text-xs text-[#1C1C1C]/50 mt-1">Indiranagar, 100 Feet Rd</p>
                  </div>
                  <div className="pb-4 border-b border-[#1C1C1C]/10">
                    <span className="font-serif text-base text-[#1C1C1C]">Vizag</span>
                    <span className="block font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider mt-0.5">Branch Office</span>
                    <p className="font-sans font-light text-xs text-[#1C1C1C]/50 mt-1">VIP Road, Siripuram</p>
                  </div>
                  <div className="pb-4 border-b border-[#1C1C1C]/10">
                    <span className="font-serif text-base text-[#1C1C1C]">Vijayawada</span>
                    <span className="block font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider mt-0.5">Branch Office</span>
                    <p className="font-sans font-light text-xs text-[#1C1C1C]/50 mt-1">M.G. Road, Labbipet</p>
                  </div>
                  <div className="pb-4 border-b border-[#1C1C1C]/10">
                    <span className="font-serif text-base text-[#1C1C1C]">Warangal</span>
                    <span className="block font-sans text-[0.65rem] font-semibold text-[#D34E36] uppercase tracking-wider mt-0.5">Branch Office</span>
                    <p className="font-sans font-light text-xs text-[#1C1C1C]/50 mt-1">Hanamkonda Main Road</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Form Column */}
            <div className="lg:col-span-7 bg-[#FBFBFA] border border-[#1C1C1C]/10 p-8 md:p-12 relative shadow-sm">
              
              {!isFormSubmitted ? (
                <form onSubmit={handleFormSubmit} className="flex flex-col" noValidate>
                  <div className="mb-10">
                    <h3 className="font-serif text-2xl md:text-3xl text-[#1C1C1C] mb-2 font-medium">Free Consultation</h3>
                    <p className="font-sans font-light text-sm text-[#1C1C1C]/50">
                      Co-author your dream space. Register your interest below to begin designing your home.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="relative mb-8 group">
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder=" " 
                      required
                      className={`w-full bg-transparent border-b py-3 font-sans text-sm text-[#1C1C1C] focus:outline-none focus:border-[#D34E36] transition-colors peer ${
                        formErrors.name ? 'border-[#D34E36]' : 'border-[#1C1C1C]/15'
                      }`}
                    />
                    <label 
                      htmlFor="name" 
                      className="absolute left-0 top-3 font-sans font-light text-sm text-[#1C1C1C]/40 pointer-events-none transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D34E36] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#D34E36] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Your Full Name
                    </label>
                    {formErrors.name && (
                      <span className="text-[0.7rem] text-[#D34E36] font-medium absolute bottom-[-18px] left-0">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="relative mb-8 group">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" " 
                      required
                      className={`w-full bg-transparent border-b py-3 font-sans text-sm text-[#1C1C1C] focus:outline-none focus:border-[#D34E36] transition-colors peer ${
                        formErrors.email ? 'border-[#D34E36]' : 'border-[#1C1C1C]/15'
                      }`}
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-0 top-3 font-sans font-light text-sm text-[#1C1C1C]/40 pointer-events-none transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D34E36] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#D34E36] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Email Address
                    </label>
                    {formErrors.email && (
                      <span className="text-[0.7rem] text-[#D34E36] font-medium absolute bottom-[-18px] left-0">{formErrors.email}</span>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="relative mb-8 group">
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder=" " 
                      required
                      className={`w-full bg-transparent border-b py-3 font-sans text-sm text-[#1C1C1C] focus:outline-none focus:border-[#D34E36] transition-colors peer ${
                        formErrors.phone ? 'border-[#D34E36]' : 'border-[#1C1C1C]/15'
                      }`}
                    />
                    <label 
                      htmlFor="phone" 
                      className="absolute left-0 top-3 font-sans font-light text-sm text-[#1C1C1C]/40 pointer-events-none transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D34E36] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#D34E36] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Phone Number
                    </label>
                    {formErrors.phone && (
                      <span className="text-[0.7rem] text-[#D34E36] font-medium absolute bottom-[-18px] left-0">{formErrors.phone}</span>
                    )}
                  </div>

                  {/* Checkbox pills */}
                  <div className="flex flex-col mb-8">
                    <span className="font-sans text-[0.7rem] font-semibold text-[#C5A880] uppercase tracking-wider mb-4">Focus Area (Select all that apply)</span>
                    <div className="flex flex-wrap gap-2.5">
                      {['Space Planning', 'Color Schemes', 'Furniture Selection'].map((area) => {
                        const isChecked = formData.focusAreas.includes(area);
                        return (
                          <label key={area} className="cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="focus-area" 
                              checked={isChecked}
                              onChange={() => handleCheckboxChange(area)}
                              className="sr-only"
                            />
                            <span 
                              className={`inline-block px-4 py-2 border transition-all duration-300 text-xs tracking-wider font-sans ${
                                isChecked 
                                  ? 'bg-[#D34E36] border-[#D34E36] text-[#FBFBFA]' 
                                  : 'bg-[#FBFBFA] border-[#1C1C1C]/10 text-[#1C1C1C] hover:border-[#D34E36]'
                              }`}
                            >
                              {area}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="relative mb-10 group">
                    <textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder=" " 
                      rows={3}
                      className="w-full bg-transparent border-b py-3 font-sans text-sm text-[#1C1C1C] focus:outline-none focus:border-[#D34E36] transition-colors peer border-[#1C1C1C]/15 resize-none"
                    />
                    <label 
                      htmlFor="message" 
                      className="absolute left-0 top-3 font-sans font-light text-sm text-[#1C1C1C]/40 pointer-events-none transition-all duration-300 peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-[#D34E36] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#D34E36] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Tell us about your space (Optional)
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#D34E36] hover:bg-[#B93C27] text-white text-xs font-semibold tracking-[0.15em] uppercase py-4 transition-all duration-500 ease-out hover:-translate-y-0.5 cursor-pointer"
                  >
                    Request Consultation
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center py-10 animate-[fadeIn_0.6s_ease-out]">
                  <div className="w-16 h-16 bg-[#D34E36]/10 rounded-full text-[#D34E36] flex items-center justify-center text-2xl mb-6">✓</div>
                  <h4 className="font-serif text-3xl mb-4 text-[#1C1C1C] font-medium">Thank You</h4>
                  <p className="font-sans font-light text-sm text-[#1C1C1C]/50 max-w-[400px] mb-8 leading-relaxed">
                    Your design brief has been received. Our chief architect will contact you within 24 hours to schedule your session.
                  </p>
                  <button 
                    onClick={handleResetForm}
                    className="border border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FBFBFA] text-[#1C1C1C] text-xs font-semibold tracking-[0.15em] uppercase px-6 py-3 transition-all duration-500 ease-out"
                  >
                    Submit another request
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Footer separator and bottom bar */}
          <div className="max-w-[1300px] mx-auto px-6 md:px-12">
            <hr className="border-none border-t border-[#1C1C1C]/10 mt-20 mb-8" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <p className="font-sans font-light text-xs text-[#1C1C1C]/40">&copy; 2026 Exotica Interior Design Studio. All rights reserved.</p>
              <div className="flex gap-8">
                <a href="#" className="font-sans font-light text-xs text-[#1C1C1C]/40 hover:text-[#D34E36] transition-colors">Instagram</a>
                <a href="#" className="font-sans font-light text-xs text-[#1C1C1C]/40 hover:text-[#D34E36] transition-colors">Pinterest</a>
                <a href="#" className="font-sans font-light text-xs text-[#1C1C1C]/40 hover:text-[#D34E36] transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
