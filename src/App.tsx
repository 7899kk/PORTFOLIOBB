import { useEffect, useRef, useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertise, profile, projects, technologies } from './content';

gsap.registerPlugin(ScrollTrigger);
const navigation = ['Home', 'About', 'Expertise', 'Skills', 'Projects', 'Certifications', 'Contact'];
type ModalContent = { title: string; text: string; message?: string };

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="arrow-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 15 15 5M5 5h10v10' : 'M3 10h14m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Portrait({ hero = false, frame = 0 }: { hero?: boolean; frame?: number }) {
  const source = hero ? profile.heroFrames[frame] || profile.portrait : profile.portrait;
  return source ? <img className="portrait-image" src={source} alt={`${profile.fullName}${hero ? ', rotating portrait' : ''}`} /> : (
    <div className={`portrait-placeholder ${hero ? 'hero-placeholder' : ''}`} aria-label="Portrait placeholder, awaiting the owner's photos" role="img">
      <svg viewBox="0 0 500 650" aria-hidden="true">
        <defs>
          <linearGradient id={hero ? 'hero-silhouette' : 'profile-silhouette'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#b0ada9" stopOpacity=".44" /><stop offset="1" stopColor="#5b585a" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <path fill={`url(#${hero ? 'hero-silhouette' : 'profile-silhouette'})`} d="M250 75c-66 0-99 49-99 112 0 51 20 100 55 120v40c-20 21-50 30-82 44C65 418 39 473 29 650h442c-10-177-36-232-95-259-32-14-62-23-82-44v-40c35-20 55-69 55-120 0-63-33-112-99-112Z" />
        <path d="M206 347 250 435l44-88M250 435v215" fill="none" stroke="#d0ccc6" strokeOpacity=".16" />
      </svg>
      <span className="portrait-note">PORTRAIT / AWAITING PHOTO</span>
    </div>
  );
}

function App() {
  const app = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [frame, setFrame] = useState(0);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [copied, setCopied] = useState(false);
  const [sender, setSender] = useState('');
  const [intent, setIntent] = useState('');

  useEffect(() => {
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-intro > *', { y: 22, opacity: 0, duration: .9, stagger: .12, delay: .15, ease: 'power3.out' });
        const timeline = gsap.timeline({ scrollTrigger: { trigger: hero.current, start: 'top top', end: '+=120%', pin: true, scrub: .8,
          onUpdate: self => setFrame(Math.min(profile.heroFrames.length - 1, Math.floor(self.progress * profile.heroFrames.length))),
        } });
        timeline.to('.hero-stage', { '--turn': '18deg', duration: 1, ease: 'none' }, 0)
          .to('.hero-title-first', { yPercent: -115, opacity: 0, duration: .22 }, .35)
          .fromTo('.hero-title-second', { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .22 }, .35)
          .to('.hero-stage', { '--turn': '0deg', duration: .65, ease: 'none' }, 1);
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
          gsap.from(element, { y: 32, opacity: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } });
        });
      });
    }, app);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); media.revert(); context.revert(); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (modal && !dialog.current?.open) dialog.current?.showModal();
  }, [modal]);

  function openModal(content: ModalContent) { setCopied(false); setModal(content); }
  function closeModal() { dialog.current?.close(); setModal(null); }
  function navigateTo(name: string, event?: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    if (name === 'Certifications') {
      openModal({ title: 'Certifications', text: 'Certification details will be added when supplied by the portfolio owner.' });
      return;
    }
    event?.preventDefault();
    // Let the mobile menu release its scroll lock before measuring section positions.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const id = name.toLowerCase();
      const section = document.getElementById(id);
      if (!section) return;
      const top = id === 'home' ? 0 : window.scrollY + section.getBoundingClientRect().top - 80;
      window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }));
  }
  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `From: ${form.get('firstName')} ${form.get('lastName')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`;
    if (profile.email) {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio enquiry')}&body=${encodeURIComponent(message)}`;
      openModal({ title: 'Continue in your email app', text: 'Your email app will open with the message filled in. Send it there to complete your enquiry.', message });
    } else {
      openModal({ title: 'Your message draft', text: 'Delivery is not connected yet. You can copy your message below; no message has been sent.', message });
    }
  }
  async function copyMessage() {
    if (!modal?.message) return;
    try { await navigator.clipboard.writeText(modal.message); setCopied(true); }
    catch { setCopied(false); }
  }

  return <div ref={app}>
    <a className="skip-link" href="#about">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={() => setMenuOpen(false)}>{profile.firstName}<span>.</span></a>
      <nav className={menuOpen ? 'navigation is-open' : 'navigation'} id="primary-nav" aria-label="Main navigation">
        {navigation.map(name => name === 'Certifications' ?
          <button key={name} onClick={() => navigateTo(name)}>{name}</button> :
          <a key={name} href={`#${name.toLowerCase()}`} aria-current={activeSection === name.toLowerCase() ? 'location' : undefined} onClick={event => navigateTo(name, event)}>{name}</a>)}
      </nav>
      <a className="pill header-contact" href="#contact">Hire Me <Arrow diagonal /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>

    <main>
      <section id="home" className="hero" ref={hero} aria-label="Introduction">
        <div className="hero-halo" />
        <div className="hero-stage"><Portrait hero frame={Math.max(0, frame)} /></div>
        <div className="hero-intro">
          <p className="eyebrow">HI, I'M {profile.firstName.toUpperCase()}</p>
          <h1 className="hero-title"><span className="hero-title-first">CREATIVE<br />DEVELOPER.</span><span className="hero-title-second" aria-hidden="true">SCALABLE<br />SYSTEMS.</span></h1>
        </div>
        <div className="hero-aside"><span className="mono">// CRAFTED FROM REAL IDEAS</span><p>Engineering seamless digital experiences<br />with thoughtful design and clean code.</p></div>
        <div className="hero-bottom"><p className="scroll-hint mono"><span aria-hidden="true">↓</span> SCROLL TO SCRUB TIMELINE</p><div className="flex gap-3"><a className="pill pill-light" href="#projects">View My Work <Arrow diagonal /></a><a className="pill" href="#contact">Contact Me <Arrow diagonal /></a></div></div>
      </section>

      <section className="about section-shell" id="about">
        <div className="profile-card" data-reveal>
          <div className="profile-photo"><Portrait /></div>
          <div className="availability mono"><span className="status-dot" /> OPEN TO OPPORTUNITIES <span className="availability-mark">[01]</span></div>
          <span className="corner corner-tl" /><span className="corner corner-br" />
        </div>
        <div className="about-content" data-reveal>
          <p className="section-label">● // SYSTEM PROFILE</p>
          <h2>Hello, I'm<br /><span>{profile.fullName}</span></h2>
          <p className="about-description">{profile.introduction}</p>
          <div className="profile-stats"><div><strong>Full-Stack</strong><span>DEVELOPMENT</span></div><div><strong>React & Node</strong><span>CORE STACK</span></div><div><strong>Scalable</strong><span>SYSTEMS</span></div></div>
        </div>
      </section>

      <section className="skills-section section-shell" id="skills">
        <div className="section-heading" data-reveal><p className="section-label">+ TECHNICAL STACK</p><h2>Technologies I Work With</h2><p>Full-stack expertise across modern web development, artificial intelligence, and cloud<br className="desktop-break" /> infrastructure.</p></div>
        <div className="technology-cloud" data-reveal>{technologies.map((technology, index) => <span className="technology" key={technology}><span className="tech-mark" aria-hidden="true">{['⌘', '◇', '⌁', '⟐', '{ }', '◈'][index % 6]}</span>{technology}</span>)}</div>
      </section>

      <section className="expertise-section section-shell" id="expertise">
        <div className="section-heading" data-reveal><p className="section-label">// EXECUTION ROADMAP</p><h2>Core Execution Root Map</h2></div>
        <div className="expertise-grid">{expertise.map((item, index) => <article className="expertise-card" key={item.title} data-reveal>
          <div className="card-top mono"><span>// ROOT 0{index + 1}</span><span className="root-node" aria-hidden="true">⊙</span></div>
          <h3>{item.title}</h3><p>{item.text}</p><div className="expertise-tag mono">{item.tag}</div>
        </article>)}</div>
      </section>

      <section className="projects-section section-shell" id="projects">
        <div className="section-heading" data-reveal><p className="section-label">// ENGINEERING FOCUS</p><h2>Featured Engineering Projects</h2></div>
        <div className="projects-grid">{projects.map((project, index) => <article className={`project-card ${index === 1 ? 'featured' : ''}`} key={project.title} data-reveal>
          <div className="card-top mono"><span>// PROJECT 0{index + 1}</span><span aria-hidden="true">⌁</span></div>
          <p className="project-category mono">{project.category}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p>
          <div className="project-bottom"><div className="project-tags mono">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="code-link mono" aria-label={`View ${project.title} details`} onClick={() => openModal({ title: project.title, text: `${project.detail} This is reference content; the owner's project details and source links have not been supplied.` })}>CODE <Arrow /></button></div>
        </article>)}</div>
      </section>

      <section className="contact-section section-shell" id="contact">
        <span className="contact-watermark" aria-hidden="true">CONNECT</span>
        <div className="contact-info" data-reveal>
          <p className="mono contact-label">// LIVE DISPATCH NODE <span className="status-dot" /></p>
          <h2>Let's Build Something<br />Exceptional.</h2><p>Fill out the transmission form or preview your payload stream directly below.</p>
          <div className="terminal mono"><p><span>//</span> payload_preview.json</p><p><span>sender:</span> {sender || 'Incoming Human'}</p><p><span>intent:</span> {intent || 'Building Something'}</p><p><span>status:</span> <span className="terminal-accent">Awaiting Transmission</span><span className="terminal-caret" /></p></div>
        </div>
        <form className="contact-form" onSubmit={submitMessage} onChange={event => {
          const data = new FormData(event.currentTarget);
          setSender(`${data.get('firstName') || ''} ${data.get('lastName') || ''}`.trim());
          const message = String(data.get('message') || '');
          setIntent(message.length > 38 ? `${message.slice(0, 38)}…` : message);
        }} data-reveal>
          <div className="name-fields"><label><span className="sr-only">First name</span><input name="firstName" placeholder="First Name" required maxLength={80} autoComplete="given-name" /></label><label><span className="sr-only">Last name</span><input name="lastName" placeholder="Last Name" required maxLength={80} autoComplete="family-name" /></label></div>
          <label><span className="sr-only">Email address</span><input name="email" type="email" placeholder="Email Address" required maxLength={254} autoComplete="email" /></label>
          <label><span className="sr-only">Message</span><textarea name="message" placeholder="Type your message here..." required minLength={10} maxLength={5000} rows={5} /></label>
          <div className="form-bottom"><p className="mono"><span aria-hidden="true">▣</span> YOUR NEXT GREAT IDEA<br />STARTS WITH A CONVERSATION.</p><button className="pill pill-light" type="submit">Send Message <Arrow diagonal /></button></div>
        </form>
      </section>
    </main>

    <footer className="site-footer section-shell">
      <div className="footer-top mono"><p>// System Architecture<br />Full-Stack Web Engineering<br />AI & Machine Learning Solutions</p><div className="footer-nav"><a href="#home">// Index</a><a href="#projects">Selected Projects</a><a href="#contact">Let's Talk <Arrow diagonal /></a></div><p className="footer-status"><span className="status-dot" /> SYSTEM ONLINE<br /><span>BUILT WITH INTENTION</span></p></div>
      <a className="footer-name" href="#home" aria-label="Back to top">{profile.firstName.toUpperCase()}</a>
      <div className="footer-bottom mono"><div><a href="#contact">Contact Transmission</a><p>© {new Date().getFullYear()} {profile.fullName}. All rights reserved.</p></div><p>DESIGNED TO CONNECT. BUILT TO PERFORM.</p><a href="#home">BACK TO TOP ↑</a></div>
    </footer>

    <dialog ref={dialog} aria-labelledby="dialog-title" className="detail-dialog" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) closeModal(); }} onClose={() => setModal(null)}>
      {modal && <><button className="dialog-close" onClick={closeModal} aria-label="Close dialog">×</button><p className="section-label">// TRANSMISSION DETAILS</p><h2 id="dialog-title">{modal.title}</h2><p>{modal.text}</p>{modal.message && <><pre tabIndex={0}>{modal.message}</pre><button className="pill pill-light" onClick={copyMessage}>{copied ? 'Copied ✓' : 'Copy message'}</button><p className="copy-help" role="status">{copied ? 'Message copied to your clipboard.' : 'You can also select and copy the text above.'}</p></>}</>}
    </dialog>
  </div>;
}
export default App;
