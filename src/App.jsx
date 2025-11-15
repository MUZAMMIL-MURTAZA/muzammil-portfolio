
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

/* NOTE: This file is the full portfolio app created for Muzammil.
   It uses external Unsplash images for demo and implements:
   - multi-page routing
   - project pages with sliders
   - todo app, weather demo (needs API key), expense tracker demo
   - theme toggle, contact buttons
   Replace/adjust as needed.
*/

const ASSETS = {
  splash: "/assets/profile.jpg",
  profile: "/assets/profile.jpg",
  hero: "/assets/profile.jpg",
  projects: {
    todo: [
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555949963-aa79dcee981d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526378723277-2f8d2f0d6f9b?auto=format&fit=crop&w=1200&q=80",
    ],
    weather: [
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526403224740-9e3a2d0a4f6a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80",
    ],
    expense: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555529669-8d6f3b1f6b0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Inject main CSS for the app (so the user doesn't need external CSS)
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;600;700&display=swap');
      :root{--bg:#0b0b0c;--panel:#101214;--muted:#aeb0b3;--accent:#ff6a00;--glass:rgba(255,255,255,0.03);--card1:#ff9a76;--card2:#6ad1ff;--card3:#d6d66a}
      [data-theme='light']{--bg:#ffffff;--panel:#f7f7f8;--muted:#505050;--accent:#ff6a00;--glass:rgba(0,0,0,0.03);--card1:#ffd6c2;--card2:#cfeffd;--card3:#f3f3c2}
      *{box-sizing:border-box}
      html,body,#root{height:100%}
      body{margin:0;font-family:Inter,system-ui,Arial;background:var(--bg);color:var(--text,#eee);-webkit-font-smoothing:antialiased}
      a{color:inherit}
      .app{min-height:100vh;display:flex}
      .sidebar{width:320px;background:linear-gradient(180deg,var(--panel),#0b0b0c);border-right:1px solid rgba(0,0,0,0.06);display:flex;flex-direction:column}
      .sidebar .top{padding:28px 22px;border-bottom:1px solid rgba(0,0,0,0.04);display:flex;gap:12px;align-items:center}
      .avatar{width:68px;height:68px;border-radius:12px;overflow:hidden;flex:0 0 68px;box-shadow:0 6px 20px rgba(0,0,0,0.35)}
      .avatar img{width:100%;height:100%;object-fit:cover}
      .name{font-weight:700;font-size:18px}
      .role{font-size:13px;color:var(--muted);margin-top:4px}
      .nav{padding:22px 16px;flex:1}
      .nav ul{list-style:none;padding:0;margin:0}
      .nav li{margin-bottom:10px}
      .nav a{display:block;padding:10px 14px;border-radius:8px;color:var(--muted);transition:all .16s ease;font-weight:600}
      .nav a.active, .nav a:hover{background:var(--accent);color:#0b0b0c;transform:translateX(4px)}
      .sidebar .contact{padding:16px;border-top:1px solid rgba(0,0,0,0.04);font-size:14px}
      .sidebar .contact a{display:block;color:var(--muted);margin-bottom:8px}
      .main{flex:1;background:var(--bg);padding:22px 30px;overflow:auto}
      header.topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 0}
      .badge{background:transparent;border:1px solid rgba(255,255,255,0.04);padding:8px 12px;border-radius:8px;color:var(--muted);font-weight:600}
      .splash{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(6,6,7,0.95),rgba(6,6,7,0.95));z-index:9999}
      .splash-inner{display:flex;flex-direction:column;align-items:center;gap:12px}
      .splash img{width:140px;height:140px;border-radius:14px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.7);animation:logoPop 1.2s cubic-bezier(.2,.9,.3,1)}
      .splash .text{color:var(--muted);font-weight:600}
      @keyframes logoPop{0%{transform:scale(.75);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1);opacity:1}}
      .hero{display:grid;grid-template-columns:1fr 420px;gap:28px;align-items:center;margin-top:8px}
      .hero-card{background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);padding:24px;border-radius:12px;border:1px solid rgba(0,0,0,0.06)}
      .title{font-family:Anton,Impact,Arial;font-size:44px;letter-spacing:1px;margin:0;color:#f4f4f4}
      .intro{color:var(--muted);margin-top:12px;line-height:1.6}
      .hero .photo{background:var(--glass);padding:12px;border-radius:10px;display:flex;align-items:center;justify-content:center}
      .hero .photo img{width:100%;height:100%;object-fit:cover;border-radius:8px}
      .controls{margin-top:14px;display:flex;gap:10px}
      .btn{display:inline-block;padding:10px 14px;border-radius:999px;font-weight:700;border:2px solid transparent;background:var(--accent);color:#0b0b0c}
      .btn.ghost{background:transparent;border-color:rgba(0,0,0,0.06);color:var(--muted)}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:14px}
      .card{background:linear-gradient(180deg,rgba(255,255,255,0.015),transparent);padding:12px;border-radius:10px;border:1px solid rgba(0,0,0,0.06);transition:all .18s ease}
      .card:hover{transform:translateY(-6px);box-shadow:0 12px 30px rgba(0,0,0,0.45)}
      .card .preview{height:120px;border-radius:8px;overflow:hidden;background:var(--bg);display:flex;align-items:center;justify-content:center}
      .card .title{font-weight:700;margin-top:8px}
      .card .muted{color:var(--muted);font-size:13px;margin-top:6px}
      .tag{font-size:12px;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,0.02);border:1px solid rgba(0,0,0,0.04);color:var(--muted)}
      .boxes{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
      .box{background:transparent;border:1px solid rgba(0,0,0,0.04);padding:12px;border-radius:8px}
      .form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .input{background:transparent;border:1px solid rgba(0,0,0,0.06);padding:10px;border-radius:8px;color:var(--muted)}
      .slider{position:relative;overflow:hidden;border-radius:8px;margin-top:12px}
      .slides{display:flex;transition:transform .45s ease}
      .slide{min-width:100%;height:320px;display:flex;align-items:center;justify-content:center;background:var(--bg)}
      .slide img{width:100%;height:100%;object-fit:cover}
      .arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.35);border-radius:999px;padding:8px;cursor:pointer}
      .arrow.left{left:8px}
      .arrow.right{right:8px}
      .dots{display:flex;gap:8px;justify-content:center;margin-top:8px}
      .dot{width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,0.12)}
      .dot.active{background:var(--accent)}
      .test-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
      .test-card{padding:16px;border-radius:10px;color:#111;transition:all .25s ease;cursor:pointer}
      .test-card .quote{font-weight:700}
      .test-card:hover{transform:translateY(-6px);filter:brightness(1.05)}
      footer{margin-top:18px;color:var(--muted);text-align:center}
      @media (max-width:980px){.hero{grid-template-columns:1fr 300px}.sidebar{width:260px}}
      @media (max-width:820px){.sidebar{display:none}.app{flex-direction:column}.main{padding:18px}.hero{grid-template-columns:1fr}.slide{height:220px}}
    `;
    const styleEl = document.createElement("style");
    styleEl.id = "portfolio-css-final";
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
    return () => {
      const el = document.getElementById("portfolio-css-final");
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  return (
    <Router>
      <div className="app" data-theme={theme === 'light' ? 'light' : 'dark'}>
        {loading && (
          <div className="splash">
            <div className="splash-inner">
              <img src={ASSETS.splash} alt="logo" />
              <div className="text">Loading portfolio — Muzammil</div>
            </div>
          </div>
        )}

        <aside className="sidebar">
          <div className="top">
            <div className="avatar"><img src={ASSETS.profile} alt="profile" /></div>
            <div>
              <div className="name">Muzammil Murtaza</div>
              <div className="role">Web Developer</div>
            </div>
          </div>

          <nav className="nav">
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/resume">Resume</NavLink></li>
              <li><NavLink to="/portfolio">Portfolio</NavLink></li>
              <li><NavLink to="/testimonials">Testimonials</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
            </ul>
          </nav>

          <div className="contact">
            <a href="mailto:muzammilmurtaza691@gmail.com">muzammilmurtaza691@gmail.com</a>
            <a href="https://wa.me/923024402752" target="_blank" rel="noreferrer">WhatsApp: 03024402752</a>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div className="badge">Updated • Portfolio</div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div className="badge">BSc (1st Semester)</div>
              <button
                onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                className="badge"
                aria-label="Toggle theme"
              >
                Toggle theme
              </button>
            </div>
          </header>

          <div className="content">
            <Routes>
              <Route path="/" element={<Home hero={ASSETS.hero} />} />
              <Route path="/about" element={<About />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />

              {/* Project detail pages */}
              <Route path="/projects/todo" element={<ProjectDetail key="todo" projectId="todo" />} />
              <Route path="/projects/weather" element={<ProjectDetail key="weather" projectId="weather" />} />
              <Route path="/projects/portfolio-template" element={<ProjectDetail key="portfolio" projectId="portfolio" />} />
              <Route path="/projects/expense-tracker" element={<ProjectDetail key="expense" projectId="expense" />} />
            </Routes>

            <footer>© {new Date().getFullYear()} Muzammil Murtaza — All rights reserved</footer>
          </div>
        </main>
      </div>
    </Router>
  );
}

/* Helper components (Home, About, Resume, Portfolio, Testimonials, Contact, ProjectDetail, ImageSlider, TodoApp, WeatherApp, ExpenseTracker) */

/* NavLink */
function NavLink({ to, children }) {
  const loc = useLocation();
  const active = loc.pathname === to || (to === "/" && loc.pathname === "/");
  return (
    <Link to={to} className={active ? "active" : ""}>
      {children}
    </Link>
  );
}

/* Home - simplified hero only */
function Home({ hero }) {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-card">
        <div>
          <div className="title">PORTFOLIO</div>
          <p className="intro">Hi, I'm <strong>Muzammil Murtaza</strong> — a Web Developer building modern, accessible, and performant sites. I specialize in React, clean UI, and responsive design.</p>
        </div>

        <div className="controls">
          <Link to="/portfolio" className="btn">View Work</Link>
          <Link to="/contact" className="btn ghost">Hire Me</Link>
        </div>
      </div>

      <div className="photo">
        <img src={hero} alt="hero" />
      </div>
    </section>
  );
}

/* About */
function About() {
  return (
    <section>
      <h2 style={{fontSize:28,fontWeight:700}}>About Me</h2>
      <p style={{color:'#cfcfcf',marginTop:12}}>I'm currently studying BSc (1st Semester) while also studying Dars-e-Nizami. I build web apps using React and standard web technologies. I focus on clean code, performance, and UX.</p>

      <div className="boxes">
        <div className="box">Education<br/><strong>BSc — 1st Semester</strong></div>
        <div className="box">Languages<br/><strong>Urdu, English</strong></div>
        <div className="box">Tools<br/><strong>React, CSS, Git, VS Code</strong></div>
      </div>
    </section>
  );
}

/* Resume */
function Resume() {
  return (
    <section>
      <h2 style={{fontSize:28,fontWeight:700}}>Resume</h2>
      <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div className="card">
          <div className="title">Education</div>
          <div className="muted">BSc (1st Semester) — Currently studying</div>
        </div>
        <div className="card">
          <div className="title">Experience</div>
          <div className="muted">Building personal projects and freelancing small tasks.</div>
        </div>
      </div>
    </section>
  );
}

/* Portfolio main page */
function Portfolio() {
  const projects = [
    {id:1,title:'Todo App',desc:'Tasks, due dates, localStorage, responsive',img:ASSETS.hero,live:'/projects/todo',code:'#'},
    {id:2,title:'Weather App',desc:'OpenWeather API, responsive',img:ASSETS.hero,live:'/projects/weather',code:'#'},
    {id:3,title:'Portfolio Design',desc:'This template converted to React',img:ASSETS.hero,live:'/projects/portfolio-template',code:'#'},
    {id:4,title:'Real Estate Landing',desc:'Property listings, search UI',img:ASSETS.hero,live:'#',code:'#'},
    {id:5,title:'AI Story Tool',desc:'Story prompts & outline generator',img:ASSETS.hero,live:'#',code:'#'},
    {id:6,title:'Expense Tracker',desc:'Add/remove expenses, monthly totals',img:ASSETS.hero,live:'/projects/expense-tracker',code:'#'},
  ];

  return (
    <section>
      <h2 style={{fontSize:28,fontWeight:700}}>Portfolio</h2>
      <div className="grid" style={{marginTop:14}}>
        {projects.map(p=> (
          <div key={p.id} className="card" onClick={()=> window.location.href = p.live} style={{cursor:'pointer'}}>
            <div className="preview"><img src={p.img} alt={p.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
            <div style={{marginTop:10,fontWeight:700}}>{p.title}</div>
            <div className="muted">{p.desc}</div>
            <div style={{marginTop:10}}>
              <a href={p.live} className="btn">Open</a>
              <a href={p.code} className="btn ghost" style={{marginLeft:8}}>Code</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Testimonials */
function Testimonials(){
  return (
    <section>
      <h2 style={{fontSize:28,fontWeight:700}}>Testimonials</h2>
      <div className="test-grid" style={{marginTop:12}}>
        <div className="test-card" style={{background:'var(--card1)'}}>“Excellent work — delivered quickly.”<div className="muted">— Client A</div></div>
        <div className="test-card" style={{background:'var(--card2)'}}>“Very easy to communicate and fast updates.”<div className="muted">— Client B</div></div>
      </div>
    </section>
  );
}

/* Contact */
function Contact(){
  function copyEmail(){ navigator.clipboard.writeText('muzammilmurtaza691@gmail.com'); alert('Email copied to clipboard'); }
  return (
    <section>
      <h2 style={{fontSize:28,fontWeight:700}}>Contact</h2>
      <p style={{color:'#cfcfcf',marginTop:10}}>I respond fastest on WhatsApp. Send a message or use the contact form below.</p>

      <div style={{marginTop:16,display:'flex',gap:12,flexWrap:'wrap'}}>
        <a href="mailto:muzammilmurtaza691@gmail.com" className="btn" onClick={copyEmail}>Email</a>
        <a href="https://wa.me/923024402752" className="btn" target="_blank" rel="noreferrer" onClick={() => window.open('https://wa.me/923024402752','_blank')}>WhatsApp</a>
      </div>

      <form style={{marginTop:18,maxWidth:720}} onSubmit={(e)=>{e.preventDefault();alert('Message sent (demo)')}}>
        <div className="form-row">
          <input placeholder="Your name" className="input" />
          <input placeholder="Your email" className="input" />
        </div>
        <textarea placeholder="Message" className="input" style={{height:120,marginTop:10}} />
        <button className="btn" style={{marginTop:10}}>Send Message</button>

        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="card">
            <div style={{fontWeight:700}}>Email</div>
            <div className="muted">muzammilmurtaza691@gmail.com</div>
          </div>
          <div className="card">
            <div style={{fontWeight:700}}>WhatsApp</div>
            <div className="muted">+92 302 4402752</div>
          </div>
        </div>
      </form>
    </section>
  );
}

/* Project detail page component with auto-slider */
function ProjectDetail({ projectId }) {
  const navigate = useNavigate();
  const projectMap = {
    todo: {
      title: "Todo App",
      desc: "A lightweight task manager with local storage and clean UX.",
      features: ["Add / remove tasks", "Mark complete", "LocalStorage persistence", "Responsive layout"],
      tech: ["React", "LocalStorage"],
      images: ASSETS.projects.todo,
    },
    weather: {
      title: "Weather App",
      desc: "OpenWeather API integration and responsive UI.",
      features: ["Search city", "Current weather", "Temperature & humidity", "Responsive design"],
      tech: ["React", "OpenWeather API"],
      images: ASSETS.projects.weather,
    },
    portfolio: {
      title: "Portfolio Template",
      desc: "This template converted to React with multi-page routing.",
      features: ["Multi-page routing", "Responsive grid", "Clean UI", "Deploy-ready"],
      tech: ["React", "React Router"],
      images: ASSETS.projects.portfolio,
    },
    expense: {
      title: "Expense Tracker",
      desc: "Simple tracker for monthly spending and charts.",
      features: ["Add expenses", "Monthly totals", "Filter by category", "Simple charts"],
      tech: ["JavaScript", "Charts.js"],
      images: ASSETS.projects.expense,
    },
  };

  const project = projectMap[projectId] || projectMap.todo;

  return (
    <section>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{fontSize:28,fontWeight:700}}>{project.title}</h2>
        <button className="btn ghost" onClick={() => navigate('/portfolio')}>Back to Projects</button>
      </div>

      <p style={{color:'#cfcfcf',marginTop:10}}>{project.desc}</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:18,marginTop:18}}>
        <div>
          <h3 style={{fontWeight:700}}>Features</h3>
          <ul>
            {project.features.map((f,i)=> <li key={i} style={{color:'var(--muted)',marginTop:8}}>- {f}</li>)}
          </ul>

          <h3 style={{fontWeight:700,marginTop:14}}>Tech Stack</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:8}}>
            {project.tech.map((t,i)=> <div key={i} className="tag">{t}</div>)}
          </div>
        </div>

        <div>
          <ImageSlider images={project.images} />
        </div>
      </div>

      {/* If project has a full app, show it below */}
      <div style={{marginTop:20}}>
        {projectId==='todo' && <TodoApp />}
        {projectId==='weather' && <WeatherApp />}
        {projectId==='expense' && <ExpenseTracker />}
      </div>
    </section>
  );
}

/* ImageSlider */
function ImageSlider({ images = [] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  function onTouchStart(e){ touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e){
    if (touchStartX.current==null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx>50) setIndex(i=>Math.max(0,i-1));
    else if (dx<-50) setIndex(i=>Math.min(images.length-1,i+1));
    touchStartX.current=null;
  }

  if (!images || images.length===0) return <div className="card">No images</div>;

  return (
    <div>
      <div className="slider" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="slides" style={{transform:`translateX(-${index*100}%)`}}>
          {images.map((s,i)=> <div className="slide" key={i}><img src={s} alt={'slide-'+i} /></div>)}
        </div>
        <div className="arrow left" onClick={()=> setIndex(i=> (i-1+images.length)%images.length)}>&lt;</div>
        <div className="arrow right" onClick={()=> setIndex(i=> (i+1)%images.length)}>&gt;</div>
      </div>
      <div className="dots">{images.map((_,i)=> <div key={i} className={'dot '+(i===index?'active':'')} onClick={()=> setIndex(i)}></div>)}</div>
    </div>
  );
}

/* Todo App - simple */
function TodoApp(){
  const [items,setItems]=useState(()=> {
    try{ return JSON.parse(localStorage.getItem('todo-items')||'[]') }catch(e){return []}
  });
  const [text,setText]=useState('');
  useEffect(()=> localStorage.setItem('todo-items', JSON.stringify(items)), [items]);
  function add(){ if(!text.trim()) return; setItems(s=>[{id:Date.now(),text:text.trim(),done:false},...s]); setText('');}
  function toggle(id){ setItems(s=> s.map(it=> it.id===id? {...it,done:!it.done}:it));}
  function remove(id){ setItems(s=> s.filter(it=> it.id!==id));}
  return (
    <div className="card" style={{marginTop:16}}>
      <h3 style={{margin:0}}>Todo App (Demo)</h3>
      <div style={{marginTop:10,display:'flex',gap:8}}>
        <input className="input" placeholder="New task" value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn" onClick={add}>Add</button>
      </div>
      <ul style={{marginTop:12}}>
        {items.map(i=>(
          <li key={i.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:8,borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
            <div>
              <input type="checkbox" checked={i.done} onChange={()=>toggle(i.id)} /> <span style={{textDecoration:i.done?'line-through':''}}>{i.text}</span>
            </div>
            <div><button className="btn ghost" onClick={()=>remove(i.id)}>Delete</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Weather App - demo (works without API key using fallback) */
function WeatherApp(){
  const [city,setCity]=useState('Karachi');
  const [data,setData]=useState(null);
  const API_KEY = ''; // <-- add your OpenWeather API key here for live data
  useEffect(()=> {
    if(!API_KEY){ // demo fallback
      setData({name:city,main:{temp:30,humidity:60},weather:[{description:'Clear sky'}]});
      return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`)
      .then(r=>r.json()).then(setData).catch(()=> setData(null));
  },[city]);
  return (
    <div className="card" style={{marginTop:16}}>
      <h3 style={{margin:0}}>Weather App (Demo)</h3>
      <div style={{marginTop:10,display:'flex',gap:8}}>
        <input className="input" value={city} onChange={e=>setCity(e.target.value)} />
        <button className="btn" onClick={()=>{ /* refetch handled by effect */ }}>Search</button>
      </div>
      {data? (
        <div style={{marginTop:12}}>
          <div style={{fontWeight:700}}>{data.name}</div>
          <div className="muted">Temp: {data.main.temp} °C — Humidity: {data.main.humidity}%</div>
          <div style={{marginTop:6}}>{data.weather[0].description}</div>
        </div>
      ): <div style={{marginTop:12}}>No data</div>}
    </div>
  );
}

/* Expense tracker - simple with canvas bar chart */
function ExpenseTracker(){
  const [items,setItems]=useState([]);
  const [text,setText]=useState('');
  const [amount,setAmount]=useState('');
  useEffect(()=> {
    const c = document.getElementById('expChart');
    if(!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0,0,c.width,c.height);
    const sums = items.reduce((acc,it)=>{
      const m = new Date(it.date).getMonth();
      acc[m] = (acc[m]||0)+Number(it.amount);
      return acc;
    },{});
    const vals = Array.from({length:12}).map((_,i)=> sums[i]||0);
    // simple bars
    const w = c.width, h=c.height;
    const max = Math.max(...vals,1);
    const bw = w/vals.length;
    vals.forEach((v,i)=>{
      const hh = (v/max)*(h-20);
      ctx.fillStyle = '#ff6a00';
      ctx.fillRect(i*bw+5, h-10-hh, bw-10, hh);
    });
  },[items]);
  function add(){
    if(!text||!amount) return;
    setItems(s=>[{id:Date.now(),text,amount:parseFloat(amount),date:new Date().toISOString()},...s]);
    setText(''); setAmount('');
  }
  function remove(id){ setItems(s=> s.filter(it=> it.id!==id));}
  return (
    <div className="card" style={{marginTop:16}}>
      <h3 style={{margin:0}}>Expense Tracker (Demo)</h3>
      <div style={{marginTop:10,display:'flex',gap:8}}>
        <input className="input" placeholder="Item" value={text} onChange={e=>setText(e.target.value)} />
        <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button className="btn" onClick={add}>Add</button>
      </div>
      <ul style={{marginTop:12}}>
        {items.map(it=>(
          <li key={it.id} style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
            <div>{it.text} — {it.amount}</div>
            <div><button className="btn ghost" onClick={()=>remove(it.id)}>Delete</button></div>
          </li>
        ))}
      </ul>
      <canvas id="expChart" width="800" height="160" style={{marginTop:12,width:'100%',height:160}}></canvas>
    </div>
  );
}
