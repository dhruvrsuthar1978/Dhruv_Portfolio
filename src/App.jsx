import { useEffect, useRef } from 'react';
import './style.css';

function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let nodes = [];
    let frameId;
    let pointer = null;
    let pointerTarget = null;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.max(30, Math.min(100, Math.round((width * height) / 30000)));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - 0.5) * 0.24, vy: (Math.random() - 0.5) * 0.24, radius: 1.5 + Math.random() * 2 }));
      if (reducedMotion) draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      if (pointerTarget) {
        if (!pointer) pointer = { ...pointerTarget };
        pointer.x += (pointerTarget.x - pointer.x) * 0.18;
        pointer.y += (pointerTarget.y - pointer.y) * 0.18;
      }
      nodes.forEach((node) => {
        if (!reducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (pointer) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance > 0 && distance < 190) {
              const pull = (1 - distance / 190) * 0.42;
              node.x += (dx / distance) * pull;
              node.y += (dy / distance) * pull;
            }
          }
          if (node.x < -12) node.x = width + 12;
          if (node.x > width + 12) node.x = -12;
          if (node.y < -12) node.y = height + 12;
          if (node.y > height + 12) node.y = -12;
        }
      });
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance < 165) {
            context.beginPath();
            context.moveTo(nodes[i].x, nodes[i].y);
            context.lineTo(nodes[j].x, nodes[j].y);
            context.strokeStyle = `rgba(133, 88, 236, ${(1 - distance / 165) * 0.17})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }
      if (pointer) {
        nodes.forEach((node) => {
          const distance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
          if (distance < 190) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(pointer.x, pointer.y);
            context.strokeStyle = `rgba(133, 88, 236, ${(1 - distance / 190) * 0.36})`;
            context.lineWidth = 1;
            context.stroke();
          }
        });
        context.beginPath();
        context.arc(pointer.x, pointer.y, 7, 0, Math.PI * 2);
        context.strokeStyle = 'rgba(133, 88, 236, 0.22)';
        context.lineWidth = 1;
        context.stroke();
      }
      nodes.forEach((node) => {
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(133, 88, 236, 0.38)';
        context.fill();
      });
      if (pointer) {
        context.beginPath();
        context.arc(pointer.x, pointer.y, 2.5, 0, Math.PI * 2);
        context.fillStyle = 'rgba(133, 88, 236, 0.8)';
        context.fill();
      }
      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event) => {
      pointerTarget = { x: event.clientX, y: event.clientY };
      if (!pointer) pointer = { ...pointerTarget };
      if (reducedMotion) draw();
    };
    const clearPointer = (event) => {
      if (event.relatedTarget !== null) return;
      pointerTarget = null;
      pointer = null;
      if (reducedMotion) draw();
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', clearPointer);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', clearPointer);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" aria-hidden="true" />;
}
export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NetworkBackground />
      <div className="site-content">
      <header className="wrap topbar">
        <a className="brand" href="#home">Dhruv Suthar<span style={{ color: 'var(--lime)' }}> · </span>PORTFOLIO</a>
        <nav className="nav" aria-label="Main navigation">
          <a href="#work">Work</a><a href="#about">About</a><a href="#skills">Skills</a>
          <a className="contact" href="#contact">Let’s talk ↗</a>
          <a className="social-link" href="https://github.com/dhruvrsuthar1978" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="social-link" href="https://www.linkedin.com/in/dhruv-suthar-ai/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </nav>
      </header>
      <main id="home">
        <section className="wrap hero">
          <div className="hero-copy"><div className="eyebrow"><i className="pulse"></i> AI / SOFTWARE DEVELOPER · MUMBAI</div>
            <h1>Building<br />systems with<br /><span>intelligence.</span></h1>
            <p className="intro">I’m Dhruv, a software developer focused on AI-powered products, secure data workflows, and backend systems that solve real problems.</p>
            <div className="actions"><a className="button" href="#work">Explore my work ↓</a><a className="text-link" href="Dhruv_Suthar_Resume.pdf" download>DOWNLOAD RESUME ↗</a></div>
          </div>
          <div className="hero-art" aria-label="Abstract orbital system graphic">
            <div className="orbit"></div><div className="orbit two"></div>
            <div className="core"><div className="core-inner"><strong>DS</strong><small>BUILD · LEARN · SHIP</small></div></div>
            <i className="sat"></i><i className="sat blue"></i><div className="art-caption">DHRUV SUTHAR · AI / SOFTWARE</div>
          </div>
        </section>
        <div className="ticker">RAG SYSTEMS <span>✳</span> FINTECH <span>✳</span> MULTI-AGENT AI <span>✳</span> SECURE BACKENDS <span>✳</span> DATA PRODUCTS <span>✳</span> RAG SYSTEMS <span>✳</span> FINTECH</div>

        <section className="section wrap" id="work"><div className="section-head reveal"><div><div className="label">01 / SELECTED WORK</div><h2>Ideas made<br />useful.</h2></div><p>A few things I’ve built at the intersection of AI, thoughtful engineering, and practical utility.</p></div>
          <div className="projects">
            <article className="project reveal"><div className="project-copy"><span className="project-no">01 / LEGAL TECH + APPLIED AI</span><h3>LEGALYZE</h3><p>An AI contract intelligence platform using RAG and NLP to extract clauses, flag risky terms, and simplify legal language. Risk scoring, alternative clause suggestions, and digital signatures support a complete review flow, cutting manual contract review time by 90%.</p><div className="tags"><span>RAG + NLP</span><span>FASTAPI</span><span>REACT</span><span>MONGODB</span><span>AWS S3</span><span>SHA-256 / RSA</span></div><a className="project-link" href="https://github.com/dhruvrsuthar1978?tab=repositories" target="_blank" rel="noreferrer">EXPLORE PROJECTS ON GITHUB &#8599;</a></div><div className="visual legalize"><div className="ui-card"><div className="ui-top"><i></i><i></i><i></i></div><div className="ui-line short"></div><div className="ui-line mid"></div><div className="ui-line lime"></div><div className="ui-line blue"></div><div className="ui-line short"></div></div></div></article>
            <article className="project reveal"><div className="project-copy"><span className="project-no">02 — EXPLORATORY DATA / AI</span><h3>ANALYTICA</h3><p>A full-stack CSV studio that profiles columns, missing values, and data quality on upload. Its interactive Chart Studio suggests visualizations, while natural-language Q&amp;A uses Groq/Llama 3 with a local inference fallback.</p><div className="tags"><span>REACT + VITE</span><span>EXPRESS</span><span>GROQ / LLAMA 3</span><span>RECHARTS</span><span>CSRF + RATE LIMITING</span></div><a className="project-link" href="https://github.com/dhruvrsuthar1978/AI-Data-Analytics" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a></div><div className="visual analytics"><div className="ui-card"><div className="ui-top"><i></i><i></i><i></i></div><div className="ui-line mid"></div><div className="chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></article>
            <article className="project reveal"><div className="project-copy"><span className="project-no">03 — NLP / MULTI-AGENT SYSTEMS</span><h3>JURIX</h3><p>A multi-agent courtroom simulation for legal education. An OCR and NLP pipeline turns legal documents into structured case data for prosecutor, defense, and judge agents; presented at Avishkar.</p><div className="tags"><span>OCR</span><span>NLP</span><span>MULTI-AGENT AI</span><span>AVISHKAR</span></div><a className="project-link" href="https://github.com/0Ankit0-0/Jurix" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a></div><div className="visual jurix"><div className="ui-card"><div className="ui-top"><i></i><i></i><i></i></div><div className="agent-row"><div className="agent">PROSECUTOR</div><div className="agent">JUDGE</div><div className="agent">DEFENSE</div></div><div className="ui-line lime"></div><div className="ui-line mid"></div><div className="ui-line short"></div></div></div></article>
          </div>
        </section>

        <section className="section wrap" id="about"><div className="about-grid"><div className="reveal"><div className="label">02 / A LITTLE ABOUT ME</div><h2 className="about-title">Curious by<br />default.</h2></div><div className="reveal"><p className="about-copy">I’m a computer science graduate and part-time MCA student specializing in AI and Machine Learning. I enjoy taking an idea from a rough prototype to a reliable product—working across backend engineering, applied AI, and the details that make software safe to use.<br /><br />At NStechX, I helped build transaction reconciliation and fraud-risk systems for banking workflows. Outside work, I keep experimenting with ways to make complex tools feel simple.</p><div className="stat-row"><div className="stat"><strong>90–92%</strong><small>reconciliation accuracy gain</small></div><div className="stat"><strong>85–95%</strong><small>manual review reduction</small></div><div className="stat"><strong>5K</strong><small>UPI transactions supported</small></div></div></div></div>
          <div className="experience reveal"><div className="job"><div><strong>Software Development Intern · Founding Intern</strong><p>NStechX India Pvt. Ltd. · Mumbai</p></div><time>NOV 2025 — FEB 2026</time></div><ul className="job-points"><li>Built and deployed ATM and IMPS reconciliation systems for high-volume financial transactions, improving matching accuracy by 90-92%.</li><li>Designed and shipped an end-to-end Fraud Risk Management prototype with a backend anomaly-detection pipeline and review dashboard, reducing manual review time and false positives by 85-95%.</li><li>Enhanced UPI reconciliation accuracy and workflows to support 5,000 transactions.</li><li>Contributed to AWS deployment of transaction-processing services and presented product prototypes directly to banking stakeholders.</li></ul></div>
        </section>

        <section className="section wrap" id="skills"><div className="section-head reveal"><div><div className="label">03 / THE TOOLKIT</div><h2>Tools for<br />the work.</h2></div><p>A growing set of technologies I use to shape, build, and ship useful software.</p></div><div className="skill-grid reveal"><article className="skill-card"><h3>AI / ML</h3><p>RAG · Multi-Agent Systems · Prompt Engineering · Gemini AI · Vertex AI · OpenAI · OpenRouter · Ollama</p></article><article className="skill-card"><h3>Backend / Data</h3><p>Python · FastAPI · Node.js · MongoDB · PostgreSQL · REST APIs · SQLAlchemy · Postman</p></article><article className="skill-card"><h3>Cloud / Delivery</h3><p>AWS · Git · GitHub Actions · Vercel · Render · CI/CD</p></article><article className="skill-card"><h3>ML Frameworks</h3><p>PyTorch · Scikit-learn · Hugging Face Transformers · spaCy</p></article><article className="skill-card"><h3>Applied Computing</h3><p>NLP · OpenCV · OCR · Workflow Automation</p></article><article className="skill-card"><h3>Frontend</h3><p>React · Vite · Recharts · Framer Motion · HTML · CSS · JavaScript</p></article></div>
          <div className="education reveal"><article className="edu"><small>2026 — 2028 · ONGOING</small><br /><strong>Master of Computer Applications</strong><p>AI &amp; Machine Learning · D. Y. Patil University, Mumbai · Part-time</p></article><article className="edu"><small>COMPLETED MAY 2026</small><br /><strong>BSc Computer Science · CGPA 8.55 / 10</strong><p>Shree L.R. Tiwari Degree College of Arts, Commerce &amp; Science · Mira Road, Mumbai</p></article></div>
        </section>

        <section className="wrap section leadership"><div className="label">04 / BEYOND THE BUILD</div><h2 className="leadership-title">Good work takes a team.</h2><div className="lead-row reveal"><div className="lead"><b>CS Department Representative · Carpediem 2026</b><span>PR, coordination, and execution · Best PR Trophy</span></div><div className="lead"><b>Core Committee · TechNova 2k25</b><span>Technical event coordination and logistics</span></div><div className="lead"><b>Technical Team · Youth Festival 2024</b><span>Sound systems, stage setup, and coordination</span></div></div></section>

        <section className="contact-section" id="contact"><div className="wrap contact-inner"><div><div className="label">HAVE SOMETHING IN MIND?</div><h2>Let’s build<br />something good.</h2><p>Open to conversations about software, AI, and opportunities to make an impact.</p></div><a className="contact-button" href="https://mail.google.com/mail/?view=cm&fs=1&to=dhruvrsuthar1978%40gmail.com" target="_blank" rel="noreferrer">SAY HELLO ↗ &nbsp; dhruvrsuthar1978@gmail.com</a></div></section>
      </main>
      <footer className="wrap footer"><span>© 2026 Dhruv Suthar</span><span>MUMBAI, INDIA · BUILT WITH CURIOSITY</span><a href="#home">BACK TO TOP ↑</a></footer>
      </div>
    </>
  );
}