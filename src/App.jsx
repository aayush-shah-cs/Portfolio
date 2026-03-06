import { useState, useEffect, useRef } from "react";

/* ── Google Fonts + global resets ── */
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap";
    l.rel  = "stylesheet";
    document.head.appendChild(l);
    document.body.style.cursor = "none";
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.body.style.cursor = ""; };
  }, []);
  return null;
};

/* ── One-time keyframe / helper CSS ── */
const Keyframes = () => (
  <style>{`
    @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulseGlow { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.65} 50%{transform:translate(-50%,-50%) scale(1.2);opacity:1} }
    @keyframes scanLine  { 0%{left:-100%} 100%{left:100%} }
    @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:.2} }
    @keyframes spin      { to{transform:rotate(360deg)} }

    .fadeup { animation: fadeUp .8s ease forwards; opacity:0; }
    .du1{animation-delay:.25s} .du2{animation-delay:.45s} .du3{animation-delay:.65s}
    .du4{animation-delay:.85s} .du5{animation-delay:1.05s}

    .reveal      { opacity:0; transform:translateY(36px); transition:opacity .7s ease,transform .7s ease; }
    .reveal.show { opacity:1; transform:translateY(0); }
    .td1{transition-delay:.07s} .td2{transition-delay:.14s} .td3{transition-delay:.21s}
    .td4{transition-delay:.28s} .td5{transition-delay:.35s} .td6{transition-delay:.42s}

    .scan-bar::after { content:''; position:absolute; top:0; left:-100%; width:100%; height:100%; background:#e8ff47; animation:scanLine 2.3s ease-in-out infinite; }
    .blink-dot       { animation:blink 1.6s ease-in-out infinite; }
    .hero-glow       { animation:pulseGlow 4s ease-in-out infinite; }
    .spin-loader     { animation:spin 1s linear infinite; }

    /* project row slide-in bg */
    .proj-row::before { content:''; position:absolute; left:-100%; top:0; bottom:0; width:100%; background:#161616; transition:left .32s ease; z-index:0; }
    .proj-row:hover::before { left:0; }
    .proj-row > * { position:relative; z-index:1; }

    /* service card bottom accent bar */
    .svc-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#e8ff47; transform:scaleX(0); transform-origin:left; transition:transform .32s ease; }
    .svc-card:hover::after { transform:scaleX(1); }

    body, input, textarea, select, button { font-family:'DM Mono',monospace !important; }
    ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#0a0a0a; } ::-webkit-scrollbar-thumb { background:#e8ff47; }
  `}</style>
);

/* ── Scroll-reveal ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); }),
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── Custom cursor ── */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mouse   = useRef({ x: 0, y: 0 });
  const ring    = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = e => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) { dotRef.current.style.left = e.clientX+"px"; dotRef.current.style.top = e.clientY+"px"; }
    };
    document.addEventListener("mousemove", move);
    let raf;
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * .13;
      ring.current.y += (mouse.current.y - ring.current.y) * .13;
      if (ringRef.current) { ringRef.current.style.left = ring.current.x+"px"; ringRef.current.style.top = ring.current.y+"px"; }
      raf = requestAnimationFrame(tick);
    };
    tick();
    const on  = () => { dotRef.current?.classList.add("scale-[2]"); ringRef.current?.classList.add("!w-16","!h-16"); };
    const off = () => { dotRef.current?.classList.remove("scale-[2]"); ringRef.current?.classList.remove("!w-16","!h-16"); };
    document.querySelectorAll("a,button,input,textarea,select,.svc-card,.ci-row").forEach(el => {
      el.addEventListener("mouseenter", on);
      el.addEventListener("mouseleave", off);
    });
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="fixed w-3 h-3 rounded-full bg-[#e8ff47] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 mix-blend-difference" />
      <div ref={ringRef} className="fixed w-10 h-10 rounded-full border border-[rgba(232,255,71,.35)] pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-300" />
    </>
  );
}

/* ── Nav ── */
const NAV_LINKS = ["hero","about","work","services","contact"];
function Nav({ active }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-14 py-6"
         style={{ background:"linear-gradient(to bottom,rgba(10,10,10,.97),transparent)" }}>
      <a href="#hero" className="font-['Syne'] font-extrabold text-xl text-white no-underline cursor-none">
        Aayush<span className="text-[#e8ff47]">.</span>dev
      </a>
      <ul className="hidden md:flex gap-10 list-none m-0 p-0">
        {NAV_LINKS.map(s => (
          <li key={s}>
            <a href={`#${s}`} className={`text-[11px] tracking-[1.5px] uppercase no-underline cursor-none transition-colors duration-200 ${active===s ? "text-[#e8ff47]" : "text-[#666] hover:text-[#e8ff47]"}`}>
              {s === "hero" ? "Home" : s.charAt(0).toUpperCase()+s.slice(1)}
            </a>
          </li>
        ))}
      </ul>
      <a href="#contact" className="bg-[#e8ff47] text-[#0a0a0a] px-6 py-2.5 text-[11px] tracking-widest uppercase no-underline cursor-none transition-all duration-200 hover:bg-white hover:-translate-y-0.5">
        Hire Me
      </a>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center px-14 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage:"linear-gradient(rgba(232,255,71,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(232,255,71,.03) 1px,transparent 1px)", backgroundSize:"80px 80px" }} />
      <div className="hero-glow absolute w-[580px] h-[580px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(circle,rgba(232,255,71,.08) 0%,transparent 70%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />

      <p className="fadeup du1 text-[11px] tracking-[3px] uppercase text-[#e8ff47] mb-6">
        <span className="text-[#555]">// </span>Available for freelance — 2026
      </p>

      <h1 className="fadeup du2 font-['Syne'] font-extrabold leading-[.91] tracking-[-4px] text-white"
          style={{ fontSize:"clamp(60px,10vw,136px)" }}>
        <span className="block" style={{ color:"transparent", WebkitTextStroke:"1px rgba(240,240,240,.2)" }}>Crafting</span>
        <span className="block" style={{ color:"transparent", WebkitTextStroke:"1px rgba(240,240,240,.2)" }}>Digital</span>
        <span className="block text-[#e8ff47]">Experiences.</span>
      </h1>

      <p className="fadeup du3 max-w-md mt-10 text-sm leading-[1.85] text-[#666]">
        I'm Aayush Shah — a full-stack web developer who builds fast, accessible, and visually striking products. From concept to deployment.
      </p>

      <div className="fadeup du4 flex flex-wrap gap-5 mt-12">
        <a href="#work"    className="bg-[#e8ff47] text-[#0a0a0a] px-10 py-4 text-[11px] tracking-[1.5px] uppercase no-underline cursor-none transition-all duration-200 hover:bg-white hover:-translate-y-1">View My Work</a>
        <a href="#contact" className="border border-[#333] text-white px-10 py-4 text-[11px] tracking-[1.5px] uppercase no-underline cursor-none transition-all duration-200 hover:border-[#e8ff47] hover:text-[#e8ff47] hover:-translate-y-1">Let's Talk</a>
      </div>

      <div className="fadeup du5 absolute bottom-10 left-14 flex items-center gap-3 text-[10px] tracking-[2px] uppercase text-[#666]">
        <div className="scan-bar relative w-14 h-px bg-[#222] overflow-hidden" />
        Scroll to explore
      </div>

      <div className="fadeup du5 absolute bottom-10 right-14 flex gap-12">
        {[["5","Projects"],["2","Major Systems"],["1","Year Learning"]].map(([n,l]) => (
          <div key={l} className="text-right">
            <div className="font-['Syne'] font-extrabold text-[38px] text-white leading-none">{n}<span className="text-[#e8ff47]">+</span></div>
            <div className="text-[10px] tracking-[2px] uppercase text-[#666] mt-1">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── About ── */
const SKILLS = ["React / Next.js","TypeScript","Node.js","PostgreSQL","Tailwind CSS","GraphQL","Docker / K8s","AWS / Vercel","Three.js / GSAP","Figma / Design"];
function About() {
  return (
    <section id="about" className="min-h-screen grid md:grid-cols-2 bg-[#111111]">
      <div className="flex flex-col justify-center px-14 py-28 border-b md:border-b-0 md:border-r border-[#222]">
        <p className="reveal td1 text-[11px] tracking-[3px] uppercase text-[#e8ff47] mb-5"><span className="text-[#555]">// </span>About Me</p>
        <h2 className="reveal td2 font-['Syne'] font-extrabold leading-none tracking-[-2px] text-white mb-8" style={{fontSize:"clamp(34px,5vw,60px)"}}>Code is my<br/>medium.</h2>
        {[
          <>I specialize in building <strong className="text-[#e0e0e0] font-normal">high-performance web applications</strong> with clean architecture and exceptional user experiences.</>,
          <>Based in <strong className="text-[#e0e0e0] font-normal">India</strong>, I am an engineering student passionate about cloud computing, web development, and building scalable applications.</>,
          <>When I'm not building projects, you'll find me exploring new technologies, improving my problem-solving skills, or learning more about cloud computing and modern web development.</>
        ].map((txt,i) => (
          <p key={i} className={`reveal td${i+3} text-sm leading-[1.9] text-[#666] mb-5`}>{txt}</p>
        ))}
      </div>
      <div className="flex flex-col justify-center px-14 py-28 gap-10">
        <div>
          <p className="reveal text-[10px] tracking-[2px] uppercase text-[#666] mb-3">Tech Stack</p>
          <div className="reveal td1 grid grid-cols-2 gap-0.5">
            {SKILLS.map(s => (
              <div key={s} className="flex items-center gap-2.5 bg-[#1a1a1a] px-4 py-3.5 text-xs text-[#e0e0e0] border-l-2 border-transparent transition-all duration-200 hover:border-[#e8ff47] hover:bg-[#212121] cursor-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] flex-shrink-0" />{s}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="reveal td2 text-[10px] tracking-[2px] uppercase text-[#666] mb-3">Currently</p>
          <div className="reveal td3 grid grid-cols-2 gap-0.5">
            {["Open to Projects","Full-time Freelance"].map(s => (
              <div key={s} className="flex items-center gap-2.5 bg-[#1a1a1a] px-4 py-3.5 text-xs text-[#e0e0e0] border-l-2 border-transparent transition-all duration-200 hover:border-[#e8ff47] hover:bg-[#212121] cursor-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] flex-shrink-0" />{s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Work ── */
const PROJECTS = [
  { num:"01", name:"Luminary Dashboard", desc:"Real-time analytics platform for SaaS businesses with 500k+ events/day",  tags:["Next.js","PostgreSQL","WebSockets"] },
  { num:"02", name:"Forge Commerce",     desc:"Headless e-commerce engine with custom CMS and 99.9% uptime SLA",           tags:["React","Shopify","Node.js"] },
  { num:"03", name:"Vanta Studio",       desc:"Interactive 3D portfolio builder for creative professionals",                tags:["Three.js","GSAP","Supabase"] },
  { num:"04", name:"Pulse Health",       desc:"HIPAA-compliant telehealth platform connecting 10,000+ patients",            tags:["TypeScript","Docker","AWS"] },
  { num:"05", name:"NomadOS",            desc:"Remote work management suite with AI-powered team coordination",             tags:["React","GraphQL","Redis"] },
];
function Work() {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="work" className="min-h-screen bg-[#0a0a0a] px-14 py-28">
      <div className="flex flex-wrap justify-between items-end gap-6 mb-20">
        <div>
          <p className="reveal text-[11px] tracking-[3px] uppercase text-[#e8ff47] mb-5"><span className="text-[#555]">// </span>Selected Work</p>
          <h2 className="reveal td1 font-['Syne'] font-extrabold leading-none tracking-[-2px] text-white" style={{fontSize:"clamp(34px,5vw,60px)"}}>Projects that<br/>ship.</h2>
        </div>
        <a href="#contact" className="reveal td2 text-[11px] tracking-widest uppercase text-[#666] no-underline border-b border-[#333] pb-1 transition-all duration-200 hover:text-[#e8ff47] hover:border-[#e8ff47] cursor-none">View all projects →</a>
      </div>
      <div>
        {PROJECTS.map((p,i) => (
          <a key={p.num} href="#"
             className={`proj-row reveal td${i+1} relative grid items-center gap-8 py-8 border-t border-[#1e1e1e] last:border-b no-underline cursor-none overflow-hidden`}
             style={{ gridTemplateColumns:"72px 1fr auto auto" }}
             onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <span className="text-[11px] tracking-[2px] text-[#555]">{p.num}</span>
            <div>
              <div className={`font-['Syne'] font-bold text-2xl tracking-tight mb-1.5 transition-colors duration-200 ${hovered===i ? "text-[#e8ff47]" : "text-white"}`}>{p.name}</div>
              <div className="text-xs text-[#555]">{p.desc}</div>
            </div>
            <div className="hidden md:flex gap-2 flex-wrap justify-end">
              {p.tags.map(t => (
                <span key={t} className={`text-[10px] tracking-widest uppercase px-2.5 py-1 border transition-all duration-200 ${hovered===i ? "border-[rgba(232,255,71,.35)] text-[#e8ff47]" : "border-[#222] text-[#555]"}`}>{t}</span>
              ))}
            </div>
            <span className={`text-lg transition-all duration-200 ${hovered===i ? "text-[#e8ff47] translate-x-1 -translate-y-1" : "text-[#555]"}`}>↗</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── Services ── */
const SERVICES = [
  { icon:"⬡", name:"Frontend Development", desc:"Pixel-perfect interfaces with buttery-smooth animations and best-in-class performance scores.", list:["React & Next.js applications","Interactive UI / micro-animations","Core Web Vitals optimization","Accessibility (WCAG 2.1 AA)"] },
  { icon:"◈", name:"Backend & APIs",        desc:"Scalable server-side architecture and APIs built for reliability and developer experience.",   list:["Node.js & REST / GraphQL APIs","Database design & optimization","Authentication & security","Microservices architecture"] },
  { icon:"◎", name:"Cloud & DevOps",        desc:"Automated CI/CD pipelines and cloud infrastructure that scale with your business.",            list:["AWS / GCP / Vercel deployments","Docker & Kubernetes","CI/CD pipeline setup","Monitoring & alerting"] },
  { icon:"✦", name:"Performance Audits",    desc:"Deep-dive analysis of your existing product to eliminate bottlenecks and improve metrics.",    list:["Lighthouse & Web Vitals audit","Bundle size optimization","Database query tuning","Full remediation roadmap"] },
  { icon:"◻", name:"Design Systems",        desc:"Scalable component libraries and design tokens that unify your product language.",              list:["Component library creation","Figma-to-code handoff","Documentation & Storybook","Brand consistency tooling"] },
  { icon:"⬖", name:"Technical Consulting",  desc:"Strategic guidance on architecture decisions, tech stack selection, and engineering process.", list:["Architecture reviews","Tech stack consulting","Code quality workshops","Team mentoring & pairing"] },
];
function Services() {
  return (
    <section id="services" className="min-h-screen bg-[#111111] px-14 py-28">
      <div className="grid md:grid-cols-2 gap-16 items-end mb-20">
        <div>
          <p className="reveal text-[11px] tracking-[3px] uppercase text-[#e8ff47] mb-5"><span className="text-[#555]">// </span>What I Do</p>
          <h2 className="reveal td1 font-['Syne'] font-extrabold leading-none tracking-[-2px] text-white" style={{fontSize:"clamp(34px,5vw,60px)"}}>End-to-end<br/>expertise.</h2>
        </div>
        <p className="reveal td2 text-sm leading-[1.9] text-[#666]">
          From initial wireframes to production deployment, I handle the full development lifecycle — delivering robust, maintainable, and beautifully engineered products on time.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-0.5">
        {SERVICES.map((s,i) => (
          <div key={s.name} className={`svc-card reveal td${i+1} relative bg-[#1a1a1a] px-10 py-12 overflow-hidden transition-colors duration-300 hover:bg-[#1e1e1e] cursor-none`}>
            <span className="absolute top-10 right-10 font-['Syne'] font-extrabold text-[54px] leading-none select-none pointer-events-none" style={{color:"rgba(255,255,255,.035)"}}>0{i+1}</span>
            <span className="block text-3xl mb-6">{s.icon}</span>
            <div className="font-['Syne'] font-bold text-[19px] text-white mb-4 tracking-tight">{s.name}</div>
            <p className="text-[13px] leading-[1.8] text-[#666] mb-6">{s.desc}</p>
            <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
              {s.list.map(l => (
                <li key={l} className="text-[11px] tracking-wide text-[#555] pl-4 relative before:content-['→'] before:absolute before:left-0 before:text-[#e8ff47] before:text-[10px]">{l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Contact Form ── */
function ContactForm() {
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", service:"", message:"" });
  const [errs, setErrs] = useState({});
  const [status, setStatus] = useState("idle");

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (form.phone && !/^[\d\s+\-()]{7,}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const set = f => e => { setForm(p => ({...p,[f]:e.target.value})); setErrs(p => ({...p,[f]:""})); };

  const submit = e => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrs(v); return; }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1800);
  };

  const inp = "w-full bg-[#0d0d0d] border border-[#1e1e1e] text-[#e0e0e0] px-4 py-3.5 text-[13px] outline-none transition-all duration-200 focus:border-[#e8ff47] focus:bg-[#101010] placeholder-[#383838] cursor-none rounded-none";
  const lbl = "block text-[10px] tracking-[2px] uppercase text-[#555] mb-2";
  const err = "text-[11px] text-[#ff6b35] bg-[rgba(255,107,53,.07)] border border-[rgba(255,107,53,.18)] px-3 py-2 mt-1.5";

  if (status === "success") return (
    <div className="bg-[rgba(74,222,128,.06)] border border-[rgba(74,222,128,.18)] px-8 py-14 text-center">
      <div className="text-5xl mb-4">✓</div>
      <div className="text-[#4ade80] text-sm mb-2">Message sent successfully!</div>
      <div className="text-[11px] text-[#555]">I'll get back to you within 24 hours.</div>
    </div>
  );

  return (
    <div>
      <div className="font-['Syne'] font-bold text-xl text-white mb-1">Send a Message</div>
      <p className="text-xs text-[#555] mb-7"><span className="text-[#e8ff47]">// </span>Fill out the form and I'll respond within 24 hours</p>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Full Name *</label>
            <input className={inp} placeholder="Aayush shah" value={form.name} onChange={set("name")} />
            {errs.name && <div className={err}>{errs.name}</div>}
          </div>
          <div>
            <label className={lbl}>Email Address *</label>
            <input className={inp} type="email" placeholder="aayush@gmail.com" value={form.email} onChange={set("email")} />
            {errs.email && <div className={err}>{errs.email}</div>}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Phone Number</label>
            <input className={inp} type="tel" placeholder="+91 88650 XXXXX" value={form.phone} onChange={set("phone")} />
            {errs.phone && <div className={err}>{errs.phone}</div>}
          </div>
          <div>
            <label className={lbl}>Service Needed</label>
            <div className="relative">
              <select className={inp + " appearance-none pr-8"} value={form.service} onChange={set("service")}>
                <option value="">Select a service…</option>
                {["Frontend Development","Backend & APIs","Cloud & DevOps","Performance Audit","Design System","Technical Consulting","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none text-xs">▾</span>
            </div>
          </div>
        </div>
        <div>
          <label className={lbl}>Subject</label>
          <input className={inp} placeholder="Project overview / inquiry topic" value={form.subject} onChange={set("subject")} />
        </div>
        <div>
          <label className={lbl}>Message *</label>
          <textarea className={inp} rows={5} style={{resize:"vertical"}} placeholder="Tell me about your project, goals, timeline, and budget…" value={form.message} onChange={set("message")} />
          {errs.message && <div className={err}>{errs.message}</div>}
        </div>
        <button type="submit" disabled={status==="loading"}
                className="w-full bg-[#e8ff47] text-[#0a0a0a] py-4 text-[11px] tracking-[2px] uppercase cursor-none transition-all duration-200 hover:bg-white hover:-translate-y-0.5 disabled:bg-[#2a2a2a] disabled:text-[#555] disabled:translate-y-0 flex items-center justify-center gap-2.5 font-medium">
          {status==="loading"
            ? <><span className="spin-loader inline-block w-3.5 h-3.5 border-2 border-[#0a0a0a] border-t-transparent rounded-full"/>Sending…</>
            : "Send Message →"}
        </button>
      </form>
    </div>
  );
}

/* ── Contact ── */
const CONTACT_ITEMS = [
  { icon:"✉", label:"Email",         val: <a href="mailto:aayush.shah.jp@gmail.com" className="text-[#e0e0e0] no-underline cursor-none hover:text-[#e8ff47] transition-colors duration-200">aayush.shah.jp@gmail.com</a> },
  { icon:"☎", label:"Phone",         val: <a href="tel:+91 88650 68767" className="text-[#e0e0e0] no-underline cursor-none hover:text-[#e8ff47] transition-colors duration-200">+91 88650 68767</a> },
  { icon:"◎", label:"Location",      val: <span className="text-[#e0e0e0]">India</span> },
  { icon:"◷", label:"Working Hours", val: <span className="text-[#e0e0e0]">Mon – Fri, 9:00 AM – 6:00 PM PST</span> },
];
function Contact() {
  return (
    <section id="contact" className="min-h-screen bg-[#0a0a0a] px-14 py-28">
      <p className="reveal text-[11px] tracking-[3px] uppercase text-[#e8ff47] mb-5"><span className="text-[#555]">// </span>Get in Touch</p>
      <h2 className="reveal td1 font-['Syne'] font-extrabold leading-none tracking-[-2px] text-white mb-16" style={{fontSize:"clamp(34px,5vw,58px)"}}>
        Let's build something <span className="text-[#e8ff47]">great.</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-20">
        {/* info */}
        <div>
          <p className="reveal text-sm leading-[1.9] text-[#666] mb-12">
            Have a project in mind? I'm currently available for freelance work and always open to discussing interesting opportunities. Reach out directly or fill in the form.
          </p>
          <div className="reveal td1 flex flex-col gap-0.5 mb-12">
            {CONTACT_ITEMS.map(({ icon, label, val }) => (
              <div key={label} className="ci-row flex items-center gap-4 px-5 py-5 bg-[#111] border-l-2 border-[#1e1e1e] transition-all duration-200 hover:border-[#e8ff47] cursor-none">
                <span className="text-xl w-10 text-center flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-[10px] tracking-[2px] uppercase text-[#555] mb-1">{label}</div>
                  <div className="text-sm">{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal td2">
            <p className="text-[10px] tracking-[2px] uppercase text-[#555] mb-3">Find me on</p>
            <div className="flex flex-wrap gap-2.5">
              {["GitHub","LinkedIn","Twitter / X","Dribbble"].map(s => (
                <a key={s} href="#" className="text-[11px] tracking-widest uppercase text-[#555] no-underline px-5 py-2.5 border border-[#1e1e1e] transition-all duration-200 hover:text-[#e8ff47] hover:border-[#e8ff47] cursor-none">{s}</a>
              ))}
            </div>
          </div>
        </div>

        {/* form */}
        <div className="reveal td3">
          <ContactForm />
        </div>
      </div>

      {/* footer */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-t border-[#1a1a1a] mt-20 pt-8">
        <p className="text-[11px] tracking-wide text-[#555]">© 2026 Aayush Shah — Made with <span className="text-[#e8ff47]">♥</span> &amp; lots of coffee</p>
        <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-[#555]">
          <span className="blink-dot w-2 h-2 rounded-full bg-[#4ade80] flex-shrink-0" />
          Available for new projects
        </div>
      </div>
    </section>
  );
}

/* ── Root ── */
export default function Portfolio() {
  const [active, setActive] = useState("hero");
  useReveal();

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    document.querySelectorAll("section[id]").forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-[#f0f0f0] overflow-x-hidden">
      <FontLoader />
      <Keyframes />
      <Cursor />
      <Nav active={active} />
      <Hero />
      <About />
      <Work />
      <Services />
      <Contact />
    </div>
  );
}