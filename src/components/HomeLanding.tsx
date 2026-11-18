"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const CREATE_HREF = "/signup";
const SEARCH_HREF = "/search";
const IDEAS_HREF = "/blog";

const occasions = [
  { title: "Weddings", subtitle: "Start your new chapter", tone: "rose", art: "wedding", href: CREATE_HREF },
  { title: "Baby arrivals", subtitle: "Welcome little wonders", tone: "butter", art: "baby", href: CREATE_HREF },
  { title: "Birthdays", subtitle: "Make their day extra special", tone: "lilac", art: "birthday", href: CREATE_HREF },
  { title: "Housewarmings", subtitle: "A home full of happiness", tone: "sage", art: "home", href: CREATE_HREF },
  { title: "And more", subtitle: "Anniversaries, graduations & more", tone: "peach", art: "gift", href: CREATE_HREF },
];

const features = [
  { icon: "gift", title: "Add from anywhere", text: "Curate gifts from your favourite brands." },
  { icon: "people", title: "Group gifting", text: "Pool together for bigger wishes." },
  { icon: "rupee", title: "Cash gifts, too", text: "For the things that matter most." },
  { icon: "lock", title: "Your way", text: "Keep it public or invite-only." },
];

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "search": return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>;
    case "arrow": return <svg {...common}><path d="M4 12h15M13 5l7 7-7 7"/></svg>;
    case "chevron": return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
    case "gift": return <svg {...common}><path d="M3 10h18v11H3zM2 6h20v4H2zM12 6v15M12 6H7.8a2.3 2.3 0 1 1 2.1-3.2L12 6Zm0 0h4.2a2.3 2.3 0 1 0-2.1-3.2L12 6Z"/></svg>;
    case "people": return <svg {...common}><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20v-1.4a6.2 6.2 0 0 1 12.4 0V20M16 5.2a3.2 3.2 0 0 1 0 6.2M17.4 14.2a5.1 5.1 0 0 1 3.8 4.9V20"/></svg>;
    case "rupee": return <svg {...common}><circle cx="12" cy="12" r="9.5"/><path d="M8 7h9M8 10.5h9M8 7c5.5 0 6.8 6.8 0 6.8l8 5"/></svg>;
    case "lock": return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
    case "menu": return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "close": return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
    default: return null;
  }
}

function Spark({ className = "" }: { className?: string }) {
  return <svg className={`spark ${className}`} viewBox="0 0 44 44" aria-hidden="true"><path d="M22 2c1.7 11.2 4.8 14.3 20 20-15.2 5.7-18.3 8.8-20 20C20.3 30.8 17.2 27.7 2 22 17.2 16.3 20.3 13.2 22 2Z" fill="currentColor"/></svg>;
}

function Botanical({ className = "" }: { className?: string }) {
  return <svg className={`botanical ${className}`} viewBox="0 0 190 210" fill="none" aria-hidden="true">
    <path d="M18 198C54 148 65 99 91 13M55 145C24 139 12 119 9 94c27 3 45 18 46 51ZM75 94c-2-29 11-49 34-62 8 27-2 49-34 62ZM43 169c-22-5-35-19-40-42 25 2 39 14 40 42ZM91 52c-1-20 10-35 28-46 7 20-3 36-28 46Z" fill="#66834E" stroke="#66834E" strokeWidth="2" strokeLinecap="round"/>
    <path d="M91 13c-6-9-5-15 1-18 8 7 8 13-1 18Z" fill="#66834E"/>
    <g fill="#D94B72"><circle cx="123" cy="32" r="9"/><circle cx="139" cy="46" r="8"/><circle cx="119" cy="53" r="7"/><circle cx="131" cy="19" r="6"/></g>
    <g fill="#F5B52D"><circle cx="128" cy="37" r="3"/><circle cx="138" cy="46" r="2.5"/></g>
  </svg>;
}

function OccasionArt({ type }: { type: string }) {
  if (type === "wedding") return <svg viewBox="0 0 220 130" className="occasion-art" aria-hidden="true">
    <path d="M35 112V30h150v82M35 30l-15 15M185 30l15 15" stroke="#B77A43" strokeWidth="3" fill="none"/>
    <path d="M35 31q16 9 20 29v51M185 31q-16 9-20 29v51" stroke="#D9A65C" strokeWidth="7" fill="none"/>
    <path d="M58 92q52-35 104 0v20H58Z" fill="#F0C99B"/><rect x="78" y="83" width="64" height="20" rx="8" fill="#9C3345"/>
    <path d="M78 28v22m32-22v15m32-15v22" stroke="#C18A4E" strokeWidth="2"/><path d="M72 49h12m-6-6v12m58-4h12m-6-6v12" stroke="#E4AF3E" strokeWidth="2"/>
    <path d="M110 15v18m-7-9h14" stroke="#D99B28" strokeWidth="2"/>
  </svg>;
  if (type === "baby") return <svg viewBox="0 0 220 130" className="occasion-art" aria-hidden="true">
    <path d="M30 23h160M53 23v22m57-22v17m57-17v22" stroke="#B77A43" strokeWidth="3" strokeLinecap="round"/>
    <path d="M36 49q17 23 34 0M78 42q15 21 30 0M139 48q16 22 32 0" fill="#FFF8E8" stroke="#E9BD74" strokeWidth="2"/>
    <path d="M110 57c-17 0-29 14-29 31s12 29 29 29 29-12 29-29-12-31-29-31Z" fill="#D8B58B"/>
    <path d="M88 72q-18-8-18 12 1 15 17 11M132 72q18-8 18 12-1 15-17 11" fill="#D8B58B"/>
    <circle cx="101" cy="84" r="3" fill="#6F4035"/><circle cx="119" cy="84" r="3" fill="#6F4035"/><path d="M104 96q6 6 12 0" stroke="#A65B56" strokeWidth="2" fill="none"/>
    <path d="M51 60v10m-5-5h10M171 67v10m-5-5h10" stroke="#E6B33B" strokeWidth="2"/>
  </svg>;
  if (type === "birthday") return <svg viewBox="0 0 220 130" className="occasion-art" aria-hidden="true">
    <path d="M58 76h104l-10 40H68Z" fill="#F5C47C"/><path d="M58 76q13-13 26 0t26 0 26 0 26 0" fill="#FFF1D8" stroke="#D89A55" strokeWidth="2"/>
    <path d="M73 94q10-9 20 0t20 0 20 0 20 0" stroke="#E98B79" strokeWidth="5" fill="none"/>
    <path d="M82 72V35m28 37V25m28 47V35" stroke="#8C3C42" strokeWidth="3"/><path d="M77 37q5-18 10 0M105 27q5-18 10 0M133 37q5-18 10 0" fill="#F4B52D" stroke="#E89D25" strokeWidth="2"/>
    <path d="M53 117h114" stroke="#B77943" strokeWidth="3" strokeLinecap="round"/><circle cx="82" cy="84" r="3" fill="#D34F60"/><circle cx="139" cy="84" r="3" fill="#D34F60"/>
  </svg>;
  if (type === "home") return <svg viewBox="0 0 220 130" className="occasion-art" aria-hidden="true">
    <path d="M110 21v91M110 48Q70 10 50 42q2 30 60 20M110 57q37-47 61-17-2 31-61 37M110 82Q70 53 61 83q8 25 49 20M110 88q37-30 49-3-8 25-49 25" fill="#66844C" stroke="#55733F" strokeWidth="2"/>
    <path d="M84 91h52l-7 27H91Z" fill="#D96A56"/><path d="M80 91q30 10 60 0" stroke="#A94A42" strokeWidth="4"/>
    <path d="M91 103h8m9 0h8m9 0h4" stroke="#F8D9A4" strokeWidth="3"/>
    <path d="M76 46l-4 9m86-15 6 8" stroke="#E5A82D" strokeWidth="3"/>
  </svg>;
  return <svg viewBox="0 0 220 130" className="occasion-art" aria-hidden="true">
    <path d="M43 57h134v57H43z" fill="#F5D8B9"/><path d="M31 44h158v19H31z" fill="#E8B76B"/><path d="M110 44V114" stroke="#A12D48" strokeWidth="9"/><path d="M110 45c-38-37-62-8-29 5 14 6 22 0 29-5Zm0 0c38-37 62-8 29 5-14 6-22 0-29-5Z" fill="#A12D48" stroke="#8D203C" strokeWidth="2"/>
    <path d="M65 78h22m46 0h22" stroke="#D69B65" strokeWidth="3" strokeLinecap="round"/><circle cx="71" cy="91" r="3" fill="#D96A68"/><circle cx="153" cy="91" r="3" fill="#D96A68"/>
  </svg>;
}

function GiftHeroArt() {
  return <div className="hero-art" aria-label="Illustration of beautifully wrapped gifts">
    <div className="hero-glow" />
    <div className="hero-flower flower-one">✿</div><div className="hero-flower flower-two">✿</div>
    <div className="gift-box gift-small"><span className="gift-ribbon"/><span className="gift-bow">⌁</span></div>
    <div className="gift-box gift-main"><span className="gift-ribbon"/><span className="gift-bow">⌁</span><span className="gift-label">a little<br/>something<br/><b>lovely</b></span></div>
    <div className="gift-box gift-flat"><span className="gift-ribbon"/><span className="gift-bow">⌁</span></div>
    <div className="flower-bowl"><span>✿ ✿ ✿</span></div>
    <Spark className="hero-spark" />
  </div>;
}

export function HomeLanding() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <main className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Shubh Sagan home">Shubh Sagan<span className="brand-sun">✳</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#occasions">Occasions <Icon name="chevron" size={15}/></a>
          <a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#gift-ideas">Gift ideas</a><a href="#guests">For guests</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Icon name="search" /></button>
          <Link className="button button-outline login-button" href="/login">Log in</Link>
          <Link className="button button-primary header-cta" href={CREATE_HREF}>Create registry</Link>
          <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
        </div>
        <AnimatePresence>
          {searchOpen && <motion.form className="search-popover" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={(e) => { e.preventDefault(); router.push(`${SEARCH_HREF}?q=${encodeURIComponent(query)}`); }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a registry..." aria-label="Search a registry"/>
            <button type="submit"><Icon name="search" size={18}/></button>
          </motion.form>}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
          {["Occasions", "How it works", "Features", "Gift ideas", "For guests"].map((item, i) => <a key={item} href={["#occasions", "#how-it-works", "#features", "#gift-ideas", "#guests"][i]} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <Link href="/login" onClick={() => setMenuOpen(false)}>Log in</Link><Link href={CREATE_HREF} className="mobile-nav-cta" onClick={() => setMenuOpen(false)}>Create registry <Icon name="arrow" size={17}/></Link>
        </motion.nav>}
      </AnimatePresence>

      <section className="hero-section">
        <Botanical className="botanical botanical-left"/>
        <div className="hero-copy">
          <div className="eyebrow"><span/> A little something to celebrate <span/></div>
          <h1>A little wish.<br/><em>A lot of Shubh Sagan.</em></h1>
          <p>Create a gift registry for life&apos;s special moments, share it with your people, and get gifts you&apos;ll actually love.</p>
          <div className="hero-buttons">
            <Link className="button button-primary button-large" href={CREATE_HREF}>Create your registry <Icon name="arrow" size={20}/></Link>
            <Link className="button button-outline button-large" href={SEARCH_HREF}><Icon name="search" size={19}/> Find a registry</Link>
          </div>
          <div className="hero-note"><span className="tiny-flower">✿</span> Made for your moments, big and small.</div>
        </div>
        <div className="hero-visual"><GiftHeroArt /></div>
        <Spark className="spark spark-hero-copy"/>
        <Botanical className="botanical botanical-right"/>
      </section>

      <section className="occasions-section section-wrap" id="occasions">
        <div className="section-heading">
          <span className="heading-flourish">✳</span><div><span className="eyebrow">The joy comes in many forms</span><h2>For every occasion worth celebrating</h2></div><span className="heading-flourish">✳</span>
        </div>
        <div className="occasion-grid">
          {occasions.map((occasion, index) => <motion.a href={occasion.href} className={`occasion-card ${occasion.tone}`} key={occasion.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .45, delay: index * .07 }} whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }}>
            <div className="occasion-art-wrap"><OccasionArt type={occasion.art}/></div>
            <h3>{occasion.title}</h3><p>{occasion.subtitle} <span>→</span></p>
          </motion.a>)}
        </div>
      </section>

      <section className="how-section section-wrap" id="how-it-works">
        <div className="how-title"><span className="eyebrow">Easy as one, two, yay!</span><h2>How<br/>Shubh Sagan<br/>works</h2><Spark/></div>
        <div className="steps">
          <div className="step">
            <div className="step-illustration laptop-illustration"><div className="laptop-screen"><Icon name="gift" size={48}/></div><div className="laptop-base"/></div>
            <div className="step-copy"><span className="step-number">1</span><h3>Create your list</h3><p>Add everything you&apos;d love to receive.</p></div>
          </div>
          <div className="step-arrow">〰<span>›</span></div>
          <div className="step">
            <div className="step-illustration paper-plane">➤<span>✦</span></div>
            <div className="step-copy"><span className="step-number">2</span><h3>Share your link</h3><p>Send it to friends and family in a click.</p></div>
          </div>
          <div className="step-arrow">〰<span>›</span></div>
          <div className="step">
            <div className="step-illustration present-illustration"><div className="present-bow">∞</div><div className="present-box"><i/></div></div>
            <div className="step-copy"><span className="step-number">3</span><h3>Let the Shubh Sagan roll in</h3><p>Everyone picks a gift you&apos;ll actually love.</p></div>
          </div>
        </div>
      </section>

      <section className="features-strip section-wrap" id="features">
        {features.map((feature) => <div className="feature-item" key={feature.title}><div className="feature-icon"><Icon name={feature.icon} size={35}/></div><div><h3>{feature.title}</h3><p>{feature.text}</p></div></div>)}
      </section>

      <section className="gift-ideas-section section-wrap" id="gift-ideas">
        <div className="gift-ideas-copy"><span className="eyebrow">A thoughtful little nudge</span><h2>Not sure what to add?<br/><em>Follow the happy.</em></h2><p>From everyday favourites to once-in-a-lifetime treats, build a list that feels just like you.</p><Link href={IDEAS_HREF} className="text-link">Explore gift ideas <Icon name="arrow" size={18}/></Link></div>
        <div className="idea-art"><div className="idea-circle circle-a"/><div className="idea-circle circle-b"/><div className="idea-card idea-card-one"><span>✿</span><b>Something<br/>to keep</b></div><div className="idea-card idea-card-two"><span>♡</span><b>Something<br/>to do</b></div><div className="idea-card idea-card-three"><span>✦</span><b>Something<br/>just because</b></div><div className="idea-ribbon">little joys, big smiles</div></div>
      </section>

      <section className="guests-section section-wrap" id="guests">
        <div className="guest-flower">✿</div><div><span className="eyebrow">For the people who make it special</span><h2>Giving just got<br/><em>more thoughtful.</em></h2><p>One link. All the wishes. Find a registry, choose a gift, and make someone&apos;s day.</p></div><Link className="button button-outline button-large" href={SEARCH_HREF}>Find a registry <Icon name="arrow" size={19}/></Link>
      </section>

      <section className="final-cta">
        <div className="cta-decor cta-bowl">✿ ✿ ✿</div><div className="cta-content"><span className="eyebrow">Your moment deserves a little magic</span><h2>Ready to create your Shubh Sagan?</h2><Link className="button button-cream button-large" href={CREATE_HREF}>Create your registry <Icon name="arrow" size={20}/></Link></div><div className="cta-envelope"><span>✿</span></div><Botanical className="cta-botanical"/>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><div><Link href="/" className="brand footer-brand">Shubh Sagan<span className="brand-sun">✳</span></Link><p>Little wishes. Lovely moments.<br/>A whole lot of happy.</p></div><div className="footer-links"><div><b>Explore</b><a href="#occasions">Occasions</a><a href="#how-it-works">How it works</a><Link href={IDEAS_HREF}>Gift ideas</Link></div><div><b>Need a hand?</b><Link href={IDEAS_HREF}>Help centre</Link><a href="mailto:hello@shubhsagan.com">Contact us</a><a href="#guests">For guests</a></div><div><b>The details</b><Link href="/login">Account</Link><Link href={SEARCH_HREF}>Find a registry</Link></div></div></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Shubh Sagan. Made with a little extra love.</span><span>✿ Celebrating all the little big things ✿</span></div>
      </footer>
    </main>
  );
}
