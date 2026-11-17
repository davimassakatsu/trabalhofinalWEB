// =============================================================
// Portifólio Davi Massakatsu — portfolio.js
// Versão: veja PORTFOLIO_VERSION abaixo e o CHANGELOG.md
// =============================================================

const PORTFOLIO_VERSION = '2.0.0';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Posição global do mouse (normalizada -1..1), usada por vários efeitos
const pointer = { x: 0, y: 0, px: window.innerWidth / 2, py: window.innerHeight / 2 };
window.addEventListener('pointermove', (e) => {
  pointer.px = e.clientX;
  pointer.py = e.clientY;
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });


// =============================================
// 0. VERSÃO — preenche os elementos [data-version]
// =============================================
document.querySelectorAll('[data-version]').forEach(el => {
  el.textContent = 'v' + PORTFOLIO_VERSION;
});


// =============================================
// 1. PRELOADER — contador 000 → 100 (uma vez por sessão)
// =============================================
(function initPreloader() {
  if (prefersReducedMotion) return;

  let seen = false;
  try { seen = sessionStorage.getItem('dm-preloaded') === '1'; } catch (e) { /* storage bloqueado */ }
  if (seen) return;
  try { sessionStorage.setItem('dm-preloaded', '1'); } catch (e) { /* ignore */ }

  const el = document.createElement('div');
  el.className = 'preloader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="preloader__inner">
      <span>// inicializando sistema</span>
      <div class="preloader__name">Portifólio Davi Massakatsu</div>
      <div class="preloader__bar"><span></span></div>
      <div class="preloader__row">
        <span>v${PORTFOLIO_VERSION}</span>
        <span class="preloader__count">000</span>
      </div>
    </div>`;
  document.body.appendChild(el);

  const bar = el.querySelector('.preloader__bar span');
  const count = el.querySelector('.preloader__count');
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    bar.style.setProperty('--load', eased);
    count.textContent = String(Math.round(eased * 100)).padStart(3, '0');
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.classList.add('done');
      setTimeout(() => el.remove(), 1100);
    }
  }
  requestAnimationFrame(tick);
})();


// =============================================
// 2. CANVAS — ESTRELAS COM PARALLAX + ESTRELAS CADENTES
// =============================================
(function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const STAR_COUNT = 170;
  let stars = [];
  let shooting = [];
  let dpr = 1;

  function createStar() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 0.8 + 0.2,               // profundidade (parallax)
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random(),
      delta: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      diamond: Math.random() > 0.93,
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawDiamond(x, y, size, alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#c8c8e8';
    ctx.beginPath();
    ctx.moveTo(x, y - size * 3);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x, y + size * 3);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  let ox = 0, oy = 0; // offset suavizado
  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ox += (pointer.x * 18 - ox) * 0.05;
    oy += (pointer.y * 18 - oy) * 0.05;
    const scrollShift = window.scrollY * 0.05;

    for (const s of stars) {
      s.alpha += s.delta;
      if (s.alpha >= 1 || s.alpha <= 0) s.delta *= -1;
      s.alpha = Math.max(0, Math.min(1, s.alpha));

      const h = window.innerHeight;
      const x = s.x - ox * s.z;
      const y = ((s.y - oy * s.z - scrollShift * s.z) % h + h) % h;

      if (s.diamond) {
        drawDiamond(x, y, s.radius * 0.8, s.alpha);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 232, ${s.alpha})`;
        ctx.fill();
      }
    }

    // estrela cadente ocasional
    if (Math.random() < 0.004 && shooting.length < 2) {
      shooting.push({
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.4,
        vx: 7 + Math.random() * 4,
        vy: 2.5 + Math.random() * 2,
        life: 1,
      });
    }
    shooting = shooting.filter(m => m.life > 0);
    for (const m of shooting) {
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 12, m.y - m.vy * 12);
      grad.addColorStop(0, `rgba(168, 159, 232, ${m.life})`);
      grad.addColorStop(1, 'rgba(168, 159, 232, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 12, m.y - m.vy * 12);
      ctx.stroke();
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.015;
    }

    requestAnimationFrame(animate);
  }

  resize();
  stars = Array.from({ length: STAR_COUNT }, createStar);

  if (prefersReducedMotion) {
    // um único quadro estático
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 200, 232, ${s.alpha})`;
      ctx.fill();
    }
  } else {
    animate();
  }

  window.addEventListener('resize', () => {
    resize();
    stars = Array.from({ length: STAR_COUNT }, createStar);
  });
})();


// =============================================
// 3. ORBE DE PARTÍCULAS 3D NO HERO (index)
//    Esfera de Fibonacci girando + anéis orbitais.
//    O mouse inclina a esfera e "empurra" as partículas.
// =============================================
(function initHeroOrb() {
  const canvas = document.getElementById('hero-orb');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let w = 0, h = 0, dpr = 1, radius = 0;

  const N = window.innerWidth < 640 ? 520 : 900;
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r, seed: Math.random() * Math.PI * 2 });
  }

  // partículas em anéis (como um "átomo" de dados)
  const rings = [
    { tiltX: 1.2, tiltZ: 0.3, r: 1.45, n: 140, speed: 0.25 },
    { tiltX: 1.9, tiltZ: -0.6, r: 1.75, n: 160, speed: -0.18 },
  ];

  function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radius = Math.min(w, h) * (w < 640 ? 0.36 : 0.3);
  }

  function rotate(p, ax, ay) {
    // rotação em Y
    let x = p.x * Math.cos(ay) - p.z * Math.sin(ay);
    let z = p.x * Math.sin(ay) + p.z * Math.cos(ay);
    // rotação em X
    let y = p.y * Math.cos(ax) - z * Math.sin(ax);
    z = p.y * Math.sin(ax) + z * Math.cos(ax);
    return { x, y, z };
  }

  let rotY = 0, tiltX = 0, tiltY = 0;
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  function frame(t) {
    requestAnimationFrame(frame);
    if (!visible) return;

    const time = t * 0.001;
    ctx.clearRect(0, 0, w, h);

    rotY += 0.0022;
    tiltX += (pointer.y * 0.35 - tiltX) * 0.04;
    tiltY += (pointer.x * 0.5 - tiltY) * 0.04;

    const cx = w / 2;
    const cy = h / 2;

    // halo central
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.6);
    halo.addColorStop(0, 'rgba(124, 111, 205, 0.22)');
    halo.addColorStop(0.5, 'rgba(91, 140, 255, 0.05)');
    halo.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // posição do mouse relativa ao hero, para "empurrar" partículas
    const rect = hero.getBoundingClientRect();
    const mx = pointer.px - rect.left;
    const my = pointer.py - rect.top;

    // esfera
    for (const p of points) {
      const breathing = 1 + Math.sin(time * 1.4 + p.seed) * 0.025;
      const q = rotate({ x: p.x * breathing, y: p.y * breathing, z: p.z * breathing }, tiltX, rotY + tiltY);
      const scale = 1.8 / (2.6 - q.z);
      let sx = cx + q.x * radius * scale;
      let sy = cy + q.y * radius * scale;

      const dx = sx - mx, dy = sy - my;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        const f = (1 - dist / 120) * 26;
        sx += (dx / (dist || 1)) * f;
        sy += (dy / (dist || 1)) * f;
      }

      const depth = (q.z + 1) / 2;         // 0 (atrás) → 1 (frente)
      const a = 0.12 + depth * 0.75;
      const size = 0.5 + depth * 1.3;
      ctx.fillStyle = depth > 0.75
        ? `rgba(240, 240, 255, ${a})`
        : depth > 0.4 ? `rgba(168, 159, 232, ${a})` : `rgba(124, 111, 205, ${a})`;
      ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
    }

    // anéis orbitais
    for (const ring of rings) {
      for (let i = 0; i < ring.n; i++) {
        const ang = (i / ring.n) * Math.PI * 2 + time * ring.speed;
        let p = { x: Math.cos(ang) * ring.r, y: 0, z: Math.sin(ang) * ring.r };
        // inclinação própria do anel
        const y1 = p.y * Math.cos(ring.tiltX) - p.z * Math.sin(ring.tiltX);
        const z1 = p.y * Math.sin(ring.tiltX) + p.z * Math.cos(ring.tiltX);
        const x2 = p.x * Math.cos(ring.tiltZ) - y1 * Math.sin(ring.tiltZ);
        const y2 = p.x * Math.sin(ring.tiltZ) + y1 * Math.cos(ring.tiltZ);
        const q = rotate({ x: x2, y: y2, z: z1 }, tiltX, tiltY);
        const scale = 1.8 / (2.9 - q.z * 0.6);
        const sx = cx + q.x * radius * scale;
        const sy = cy + q.y * radius * scale;
        const depth = (q.z / ring.r + 1) / 2;
        const lead = (i / ring.n) > 0.94;  // "cometa" brilhante no anel
        ctx.fillStyle = lead
          ? `rgba(240, 240, 255, ${0.6 + depth * 0.4})`
          : `rgba(91, 140, 255, ${0.08 + depth * 0.35})`;
        const size = lead ? 2.2 : 1;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    }
  }

  resize();
  window.addEventListener('resize', resize);
  if (prefersReducedMotion) {
    frame(0);
  } else {
    requestAnimationFrame(frame);
  }
})();


// =============================================
// 4. SPLIT TEXT — quebra títulos [data-split] em letras
// =============================================
(function initSplitText() {
  document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    let i = 0;
    text.split(' ').forEach((word, wi, arr) => {
      const wSpan = document.createElement('span');
      wSpan.className = 'word';
      wSpan.setAttribute('aria-hidden', 'true');
      for (const ch of word) {
        const c = document.createElement('span');
        c.className = 'char';
        c.textContent = ch;
        c.style.setProperty('--i', i++);
        wSpan.appendChild(c);
      }
      el.appendChild(wSpan);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('split');
  });
})();


// =============================================
// 5. SCRAMBLE TEXT — efeito "decodificando" em [data-scramble]
// =============================================
const scramble = (function () {
  const glyphs = '!<>-_\\/[]{}—=+*^?#01ABCDEFXZ';

  function run(el) {
    if (prefersReducedMotion || el.dataset.scrambling === '1') return;
    const final = el.dataset.scrambleText || el.textContent;
    el.dataset.scrambleText = final;
    el.dataset.scrambling = '1';
    let frame = 0;
    const total = Math.max(18, final.length * 2);

    function step() {
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const revealAt = (i / final.length) * total;
        if (final[i] === ' ' || frame >= revealAt + 6) out += final[i];
        else if (frame >= revealAt) out += glyphs[Math.floor(Math.random() * glyphs.length)];
        else out += final[i] === ' ' ? ' ' : ' ';
      }
      el.textContent = out;
      frame++;
      if (frame <= total + 6) requestAnimationFrame(step);
      else { el.textContent = final; el.dataset.scrambling = '0'; }
    }
    step();
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-scramble]').forEach(el => {
    io.observe(el);
    el.addEventListener('mouseenter', () => run(el));
  });

  return run;
})();


// =============================================
// 6. SCROLL REVEAL (com atraso escalonado via data-delay)
// =============================================
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  // Só marcamos como "pending" aqui — sem JS o conteúdo continua visível.
  targets.forEach(el => {
    el.classList.add('reveal-pending');
    if (el.dataset.delay) el.style.setProperty('--delay', el.dataset.delay + 's');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');
      observer.unobserve(el);
      // Ao terminar, remove as classes de reveal para liberar o transform (tilt)
      setTimeout(() => el.classList.remove('reveal', 'reveal-pending', 'visible'), 1300 + (parseFloat(el.dataset.delay) || 0) * 1000);
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();


// =============================================
// 7. NAV — link ativo, menu mobile, esconder ao rolar
// =============================================
(function initActiveNav() {
  const links = document.querySelectorAll('.nav__links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
})();

(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.querySelector('.nav__links');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

(function initScrollUI() {
  const nav = document.querySelector('.nav');
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', max > 0 ? y / max : 0);

    if (nav) {
      nav.classList.toggle('is-scrolled', y > 40);
      const menuOpen = document.querySelector('.nav__links.open');
      nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 300);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// =============================================
// 8. CURSOR CUSTOMIZADO + GLOW AMBIENTE (só desktop)
// =============================================
(function initCursor() {
  if (!finePointer || prefersReducedMotion) return;

  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  glow.setAttribute('aria-hidden', 'true');
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.prepend(glow);
  document.body.append(dot, ring);

  let rx = pointer.px, ry = pointer.py;

  window.addEventListener('pointermove', () => {
    document.body.classList.add('has-cursor');
    dot.style.transform = `translate(${pointer.px}px, ${pointer.py}px)`;
    glow.style.setProperty('--gx', pointer.px + 'px');
    glow.style.setProperty('--gy', pointer.py + 'px');
  }, { passive: true });

  document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));

  (function loop() {
    rx += (pointer.px - rx) * 0.18;
    ry += (pointer.py - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener('pointerover', (e) => {
    const target = e.target.closest('a, button, [data-cursor]');
    ring.classList.toggle('is-hover', !!target);
    if (target && target.dataset.cursor) ring.dataset.label = target.dataset.cursor;
    else delete ring.dataset.label;
  });
})();


// =============================================
// 9. BOTÕES MAGNÉTICOS
// =============================================
(function initMagnetic() {
  if (!finePointer || prefersReducedMotion) return;

  document.querySelectorAll('.btn, .nav__resume, .social-link, .version-badge').forEach(el => {
    el.classList.add('magnetic');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
})();


// =============================================
// 10. TILT 3D + SPOTLIGHT nos cards
// =============================================
(function initTilt() {
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  if (!finePointer || prefersReducedMotion) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const max = parseFloat(card.dataset.tilt) || 5;
    const mock = card.querySelector('.mock');
    const book = card.querySelector('.book');

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add('is-tilting');
      card.style.setProperty('--rx', (-ny * max).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (nx * max).toFixed(2) + 'deg');
      if (mock) {
        mock.style.setProperty('--px', (nx * 18).toFixed(1) + 'px');
        mock.style.setProperty('--py', (ny * 12).toFixed(1) + 'px');
      }
      if (book) {
        book.style.setProperty('--bry', (nx * 30).toFixed(1) + 'deg');
        book.style.setProperty('--brx', (-ny * 16).toFixed(1) + 'deg');
      }
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      if (mock) { mock.style.setProperty('--px', '0px'); mock.style.setProperty('--py', '0px'); }
      if (book) { book.style.setProperty('--bry', '0deg'); book.style.setProperty('--brx', '0deg'); }
    });
  });
})();


// =============================================
// 11. PROJETOS — "Ver detalhes", topografia VUE, equalizador FUJIFY
// =============================================
(function initProjects() {
  // Expandir/recolher destaques
  document.querySelectorAll('[data-expand]').forEach(btn => {
    const card = btn.closest('.xp-card');
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.label').textContent = open ? 'Fechar detalhes' : 'Ver detalhes';
    });
  });

  // Curvas de nível geradas para o mock da VUE
  document.querySelectorAll('svg.topo').forEach(svg => {
    const W = 600, H = 400;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    let paths = '';
    for (let k = 0; k < 14; k++) {
      const base = 30 + k * 26;
      const amp = 18 + (k % 4) * 8;
      const phase = k * 0.7;
      let d = `M -10 ${base}`;
      for (let x = 0; x <= W + 20; x += 20) {
        const y = base + Math.sin(x * 0.012 + phase) * amp + Math.sin(x * 0.031 + phase * 2) * (amp * 0.35);
        d += ` L ${x} ${y.toFixed(1)}`;
      }
      paths += `<path d="${d}"/>`;
    }
    svg.innerHTML = paths;
  });

  // Equalizador animado do FUJIFY (reage mais forte com o mouse em cima)
  document.querySelectorAll('.eq').forEach(eq => {
    const BARS = 28;
    const bars = Array.from({ length: BARS }, () => {
      const s = document.createElement('span');
      eq.appendChild(s);
      return s;
    });
    if (prefersReducedMotion) {
      bars.forEach((b, i) => b.style.setProperty('--h', (0.2 + Math.abs(Math.sin(i * 0.5)) * 0.6).toFixed(2)));
      return;
    }
    const card = eq.closest('.xp-card');
    let energy = 0.45;
    setInterval(() => {
      const target = card && card.matches(':hover') ? 1 : 0.45;
      energy += (target - energy) * 0.3;
      const t = performance.now() * 0.003;
      bars.forEach((b, i) => {
        const wave = Math.abs(Math.sin(t + i * 0.45)) * 0.6 + Math.random() * 0.4;
        b.style.setProperty('--h', (0.08 + wave * energy * 0.92).toFixed(2));
      });
    }, 140);
  });
})();


// =============================================
// 12. FILTRO DE PROJETOS (com animação de entrada)
// =============================================
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('filter-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-active');
      btn.setAttribute('aria-pressed', 'true');

      const cat = btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(card => {
        const show = cat === 'all' || card.dataset.category.split(' ').includes(cat);
        card.classList.toggle('is-filtered-out', !show);
        card.classList.remove('is-filtered-in');
        if (show) {
          void card.offsetWidth; // reinicia a animação
          card.classList.add('is-filtered-in');
        }
      });
    });
  });
})();


// =============================================
// 13. CONTADORES ANIMADOS [data-count]
// =============================================
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (prefersReducedMotion) { el.textContent = end + suffix; return; }
      const start = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + suffix;
        if (t < 1) requestAnimationFrame(step);
      })(start);
    });
  }, { threshold: 0.6 });

  els.forEach(el => io.observe(el));
})();


// =============================================
// 14. MARQUEE — duplica o conteúdo para o loop infinito
// =============================================
(function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach(track => {
    const clone = track.innerHTML;
    track.insertAdjacentHTML('beforeend', clone);
    Array.from(track.children).slice(track.children.length / 2)
      .forEach(el => el.setAttribute('aria-hidden', 'true'));
  });
})();


// =============================================
// 15. FORMULÁRIO DE CONTATO
// =============================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.style.color = type === 'success' ? '#6cde90' : '#e06c75';
    feedback.style.opacity = '1';
    setTimeout(() => {
      feedback.style.opacity = '0';
      setTimeout(() => { feedback.textContent = ''; }, 400);
    }, 4000);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('input-name').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const message = document.getElementById('input-message').value.trim();

    if (!name) return showFeedback('⚠ Por favor, informe seu nome.', 'error');
    if (!isValidEmail(email)) return showFeedback('⚠ Informe um e-mail válido.', 'error');
    if (message.length < 10) return showFeedback('⚠ Escreva uma mensagem com pelo menos 10 caracteres.', 'error');

    showFeedback(`✓ Mensagem enviada, ${name}! Retornarei em breve.`, 'success');
    form.reset();
  });
})();
