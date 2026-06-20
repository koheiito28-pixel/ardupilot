/* =====================================================================
   動く用語集 — main.js
   各用語を「実際に動かす」ためのインタラクション群（依存ライブラリなし）
   ===================================================================== */
(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine   = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------------- Preloader（Loader / Preloader）---------------- */
  function runPreloader() {
    const pre = $("#preloader"), counter = $("#preloaderCounter"), bar = $("#preloaderBar");
    if (!pre) return;
    let v = 0;
    const dur = reduce ? 200 : 1100, start = performance.now();
    (function tick(now) {
      const p = clamp((now - start) / dur, 0, 1);
      v = Math.round(p * 100);
      counter.textContent = v;
      bar.style.width = v + "%";
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => { pre.classList.add("is-done"); document.body.classList.add("is-loaded"); }, 200);
    })(start);
  }
  // 戻ってきても再生できるように
  $("[data-replay-loader]")?.addEventListener("click", () => {
    const pre = $("#preloader"); pre.classList.remove("is-done"); runPreloader();
  });

  /* ---------------- Custom Cursor / Spotlight ---------------- */
  function initCursor() {
    if (!fine) return;
    const ring = $("#cursor"), dot = $("#cursorDot");
    let rx = innerWidth / 2, ry = innerHeight / 2, dx = rx, dy = ry, tx = rx, ty = ry;
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`; });
    (function loop() {
      rx = lerp(rx, tx, 0.18); ry = lerp(ry, ty, 0.18);
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hov = "a,button,.term,.brand,[data-tilt],[data-magnetic]";
    document.addEventListener("pointerover", e => { if (e.target.closest(hov)) ring.classList.add("is-hover"); });
    document.addEventListener("pointerout",  e => { if (e.target.closest(hov)) ring.classList.remove("is-hover"); });
    $$("[data-cursor-zone]").forEach(z => {
      z.addEventListener("pointerenter", () => ring.classList.add("is-zoom"));
      z.addEventListener("pointerleave", () => ring.classList.remove("is-zoom"));
    });
  }

  /* ---------------- Scroll: Progress / Parallax / nav ---------------- */
  function initScroll() {
    const prog = $("#progressBar"), mini = $("#miniProgress"), nav = $("#nav");
    const parallax = $$("[data-parallax]");
    const sdaFills = $$(".demo__sda-fill, .demo__sda");
    let ticking = false;
    function onScroll() {
      const st = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? st / h : 0;
      if (prog) prog.style.width = (p * 100) + "%";
      if (mini) mini.style.width = (p * 100) + "%";
      nav?.classList.toggle("is-scrolled", st > 30);
      parallax.forEach(el => {
        const sp = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${st * sp}px, 0)`;
      });
      ticking = false;
    }
    addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();
  }

  /* ---------------- Reveal + Stagger（Fade-in / Reveal / Stagger）---------------- */
  function initReveal() {
    // stagger 遅延を付与
    $$("[data-stagger]").forEach(group => {
      $$("[data-reveal]", group).forEach((el, i) => el.style.setProperty("--d", (i * 70) + "ms"));
    });
    if (reduce || !("IntersectionObserver" in window)) {
      $$("[data-reveal]").forEach(el => el.classList.add("is-revealed"));
      $$("[data-split]").forEach(el => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseInt(e.target.dataset.revealDelay || 0, 10);
          setTimeout(() => e.target.classList.add("is-revealed"), d);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    $$("[data-reveal]").forEach(el => io.observe(el));

    // demo 内の scroll-driven fill とテキストreveal
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-revealed"); const f = $(".demo__sda-fill", e.target); }
      });
    }, { threshold: 0.4 });
    $$(".term").forEach(t => io2.observe(t));
  }

  /* ---------------- Text Split / Char Animation ---------------- */
  function initSplit() {
    $$("[data-split]").forEach(el => {
      const text = el.textContent;
      el.textContent = "";
      el.setAttribute("aria-label", text);
      [...text].forEach((ch, i) => {
        const span = document.createElement("span");
        span.setAttribute("data-char", "");
        span.setAttribute("aria-hidden", "true");
        span.textContent = ch === " " ? " " : ch;
        span.style.animationDelay = (i * 45) + "ms";
        el.appendChild(span);
      });
    });
    if (reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    $$("[data-split]").forEach(el => io.observe(el));
  }

  /* ---------------- Counter / Number Roll ---------------- */
  function initCounters() {
    const animate = el => {
      const target = parseFloat(el.dataset.counter), suffix = el.dataset.suffix || "";
      const dur = reduce ? 200 : 1500, start = performance.now();
      (function tick(now) {
        const p = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    };
    if (!("IntersectionObserver" in window)) { $$("[data-counter]").forEach(animate); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$("[data-counter]").forEach(el => io.observe(el));
  }

  /* ---------------- Magnetic Button ---------------- */
  function initMagnetic() {
    if (!fine) return;
    $$("[data-magnetic]").forEach(el => {
      const strength = 0.4;
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------- Tilt / 3D Hover ---------------- */
  function initTilt() {
    if (!fine) return;
    $$("[data-tilt]").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------- Accordion ---------------- */
  function initAccordion() {
    $$("[data-accordion]").forEach(btn => {
      btn.addEventListener("click", () => {
        const acc = btn.parentElement, panel = $(".accordion__a", acc);
        const open = acc.classList.toggle("is-open");
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0";
      });
    });
  }

  /* ---------------- Smooth anchor scroll（Smooth Scroll の体験）---------------- */
  function initAnchors() {
    $$("[data-scrollto]").forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        if (!id || !id.startsWith("#")) return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
  }

  /* ---------------- Theme toggle（Dark Mode）---------------- */
  function initTheme() {
    $$("[data-theme-toggle]").forEach(btn => btn.addEventListener("click", () => {
      const cur = document.body.dataset.theme;
      document.body.dataset.theme = cur === "dark" ? "light" : "dark";
      toast(cur === "dark" ? "Light Mode に切替" : "Dark Mode に切替");
    }));
  }

  /* ---------------- Pinned + Horizontal Scroll ---------------- */
  function initPin() {
    const wrap = $("#pinwrap"), track = $("#pinTrack");
    if (!wrap || !track) return;
    function update() {
      const r = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - innerHeight;
      const p = clamp(-r.top / total, 0, 1);
      const dist = track.scrollWidth - innerWidth + 80;
      track.style.transform = `translate3d(${-p * Math.max(dist, 0)}px,0,0)`;
    }
    addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------------- Scrollytelling / Storytelling ---------------- */
  function initStory() {
    const steps = $$(".story__step"), cap = $("#storyCaption"), visual = $("#storyVisual");
    if (!steps.length) return;
    const layers = $$(".story__layer", visual);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          steps.forEach(s => s.classList.remove("is-active"));
          e.target.classList.add("is-active");
          if (cap) cap.textContent = e.target.dataset.story;
        }
      });
    }, { threshold: [0.5] });
    steps.forEach(s => io.observe(s));
    // Depth Layer：スクロールでレイヤーを別速度に
    addEventListener("scroll", () => requestAnimationFrame(() => {
      const r = visual.getBoundingClientRect();
      const off = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      layers[0] && (layers[0].style.transform = `translateY(${off * 60}px)`);
      layers[1] && (layers[1].style.transform = `translateY(${off * -40}px)`);
      layers[2] && (layers[2].style.transform = `translateY(${off * 80}px)`);
    }), { passive: true });
  }

  /* ---------------- Particle ---------------- */
  function initParticles() {
    $$("[data-particles]").forEach(box => {
      for (let i = 0; i < 16; i++) {
        const p = document.createElement("span");
        p.className = "demo__particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        const dur = 3 + Math.random() * 4;
        p.style.animation = `plxFloat ${dur}s ease-in-out ${Math.random() * 2}s infinite`;
        box.appendChild(p);
      }
    });
  }

  /* ---------------- Spotlight follow ---------------- */
  function initSpotlight() {
    $$("[data-spotlight]").forEach(z => {
      z.addEventListener("pointermove", e => {
        const r = z.getBoundingClientRect();
        z.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        z.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    });
  }

  /* ---------------- Micro interactions ---------------- */
  function initMicro() {
    $("[data-like]")?.addEventListener("click", e => e.currentTarget.classList.toggle("is-liked"));
    $("[data-spring]")?.addEventListener("click", e => {
      const b = e.currentTarget; b.classList.remove("is-bounce"); void b.offsetWidth; b.classList.add("is-bounce");
    });
    // Ripple / Distortion
    $$("[data-ripple]").forEach(z => z.addEventListener("pointermove", e => {
      if (Math.random() > 0.12) return;
      const r = z.getBoundingClientRect();
      const w = document.createElement("span"); w.className = "ripple-wave";
      w.style.left = (e.clientX - r.left) + "px"; w.style.top = (e.clientY - r.top) + "px";
      z.appendChild(w); setTimeout(() => w.remove(), 800);
    }));
  }

  /* ---------------- Inertia / Momentum drag ---------------- */
  function initInertia() {
    $$("[data-inertia]").forEach(zone => {
      const ball = $(".inertia-ball", zone);
      if (!ball) return;
      let dragging = false, x = 0, lastX = 0, vx = 0, px = 0, raf;
      const maxX = () => (zone.clientWidth - ball.offsetWidth) / 2 - 8;
      zone.addEventListener("pointerdown", e => {
        dragging = true; px = e.clientX; lastX = x; cancelAnimationFrame(raf); zone.setPointerCapture(e.pointerId);
      });
      zone.addEventListener("pointermove", e => {
        if (!dragging) return;
        const nx = clamp(lastX + (e.clientX - px), -maxX(), maxX());
        vx = nx - x; x = nx; ball.style.transform = `translateX(${x}px)`;
      });
      const release = () => {
        if (!dragging) return; dragging = false;
        (function glide() {
          vx *= 0.92; x = clamp(x + vx, -maxX(), maxX());
          if (Math.abs(x) >= maxX()) vx *= -0.4;
          ball.style.transform = `translateX(${x}px)`;
          if (Math.abs(vx) > 0.3) raf = requestAnimationFrame(glide);
        })();
      };
      zone.addEventListener("pointerup", release);
      zone.addEventListener("pointercancel", release);
    });
  }

  /* ---------------- Toast / Snackbar ---------------- */
  function toast(msg) {
    const wrap = $("#toastWrap"); if (!wrap) return;
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("is-show"));
    setTimeout(() => { t.classList.remove("is-show"); setTimeout(() => t.remove(), 400); }, 2600);
  }
  $("[data-toast]")?.addEventListener("click", () => toast("通知がスッと出ました"));

  /* ---------------- Page Transition ---------------- */
  $("[data-pagetrans]")?.addEventListener("click", () => {
    const o = $("#ptOverlay"); o.classList.remove("is-in"); void o.offsetWidth; o.classList.add("is-in");
    setTimeout(() => toast("ページ遷移を演出しました"), 550);
  });

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    runPreloader();
    initCursor();
    initScroll();
    initSplit();
    initReveal();
    initCounters();
    initMagnetic();
    initTilt();
    initAccordion();
    initAnchors();
    initTheme();
    initPin();
    initStory();
    initParticles();
    initSpotlight();
    initMicro();
    initInertia();
  });
})();
