/* ==========================================================================
   AWALIM — motion layer (section 4 of the brief). No GSAP: a 40-line scrub
   engine gives every scroll-driven effect (parallax, pinned process,
   timeline fill, blueprint draw) an eased 0→1 progress, Lenis smooths the
   scroll, and the page-transition curtain + desktop cursor are dependency-
   free. Everything is gated by prefers-reduced-motion and cleaned up on
   pagehide.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- scrub engine ----------
     progress 0 when the element's TOP reaches viewport·startFrac,
     progress 1 when its BOTTOM reaches viewport·endFrac (ScrollTrigger's
     "top 80%" → "bottom 20%" semantics). Values are eased toward the target
     each frame so fast scrolls never jump. */
  var items = [], raf = null;
  function measure(it) {
    var r = it.el.getBoundingClientRect(), vh = innerHeight;
    var denom = r.height + vh * (it.s - it.e);
    return denom <= 0 ? 1 : Math.max(0, Math.min(1, (vh * it.s - r.top) / denom));
  }
  function frame() {
    var busy = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var d = it.target - it.cur;
      if (Math.abs(d) < 0.0008) { if (it.cur !== it.target) { it.cur = it.target; it.cb(it.cur); } continue; }
      it.cur += d * it.ease; it.cb(it.cur); busy = true;
    }
    raf = busy ? requestAnimationFrame(frame) : null;
  }
  function update() {
    for (var i = 0; i < items.length; i++) items[i].target = measure(items[i]);
    if (!raf) raf = requestAnimationFrame(frame);
  }
  var Scrub = {
    add: function (el, startFrac, endFrac, cb, smooth) {
      var it = { el: el, s: startFrac, e: endFrac, cb: cb, cur: -1, target: 0, ease: reduced ? 1 : 1 - Math.pow(0.001, 1 / (60 * (smooth || 0.4))) };
      items.push(it); it.target = measure(it); it.cur = it.target; cb(it.cur);
      return function () { items = items.filter(function (x) { return x !== it; }); };
    },
    update: update
  };
  window.AwalimScrub = Scrub;
  var ticking = false;
  var onScroll = function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });

  /* ---------- smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis === "function") {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    var loop = function (t) { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    lenis.on("scroll", onScroll);
    /* in-page anchors go through Lenis so the sticky nav's offset is respected */
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute("href").slice(1); if (!id) return;
      var el = document.getElementById(id); if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -100, duration: 1.1 });
      history.pushState(null, "", "#" + id);
    });
  }

  /* ---------- parallax (±40px) ---------- */
  if (!reduced) {
    $$("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax-amount")) || 40;
      Scrub.add(el, 1, 0, function (p) { el.style.setProperty("--py", (amt - p * 2 * amt).toFixed(1) + "px"); }, 0.5);
    });
  }

  /* ---------- pinned process (4.4) ---------- */
  $$("[data-process]").forEach(function (proc) {
    var panels = $$("[data-proc-panel]", proc), dots = $$("[data-proc-dot]", proc);
    var cur = $("[data-proc-cur]", proc), bar = $("[data-proc-bar]", proc), n = panels.length, on = 0;
    proc.style.setProperty("--n", String(n));
    if (matchMedia("(max-width: 899px)").matches) return;   // stacked on small screens
    var navH = 84;
    function set(p) {
      var i = Math.min(n - 1, Math.floor(p * n + 0.0001));
      if (bar) bar.style.setProperty("--p", String(p));
      if (i === on) return;
      on = i;
      panels.forEach(function (x, k) { x.classList.toggle("is-on", k === i); });
      dots.forEach(function (x, k) { x.classList.toggle("is-on", k === i); });
      if (cur) cur.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    }
    /* "top top+84" → "bottom bottom": progress is the sticky stage's travel through the runway */
    var tick = false;
    var fb = function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var r = proc.getBoundingClientRect(), total = r.height - innerHeight;
        set(Math.max(0, Math.min(1, (navH - r.top) / Math.max(1, total + navH))));
      });
    };
    addEventListener("scroll", fb, { passive: true }); addEventListener("resize", fb); fb();
  });

  /* ---------- hero choreography: copy lifts & fades, device settles flat ---------- */
  $$(".hero[data-hero]").forEach(function (hero) {
    if (reduced) return;
    var cur = 0, target = 0, hraf = null;
    var hloop = function () {
      cur += (target - cur) * 0.18;
      hero.style.setProperty("--hp", cur.toFixed(3));
      hraf = Math.abs(target - cur) > 0.002 ? requestAnimationFrame(hloop) : null;
    };
    var upd = function () {
      target = Math.max(0, Math.min(1, scrollY / (hero.offsetHeight * 0.9)));
      if (!hraf) hraf = requestAnimationFrame(hloop);
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  });

  /* ---------- product film: pinned chapters (works on every viewport) ---------- */
  $$("[data-film]").forEach(function (film) {
    var frames = $$("[data-film-frame]", film), caps = $$("[data-film-cap]", film), dots = $$("[data-film-dot]", film);
    var bar = $("[data-film-bar]", film), title = $("[data-film-title]", film), n = frames.length, on = 0;
    film.style.setProperty("--n", String(n));
    function set(p) {
      var i = Math.min(n - 1, Math.floor(p * n + 0.0001));
      if (bar) bar.style.setProperty("--p", String(p));
      if (i === on) return;
      on = i;
      frames.forEach(function (x, k) { x.classList.toggle("is-on", k === i); });
      caps.forEach(function (x, k) { x.classList.toggle("is-on", k === i); });
      dots.forEach(function (x, k) { x.classList.toggle("is-on", k === i); });
      if (title && dots[i]) title.textContent = dots[i].textContent;
    }
    var tick = false;
    var fb = function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var r = film.getBoundingClientRect(), total = r.height - innerHeight;
        set(Math.max(0, Math.min(1, -r.top / Math.max(1, total))));
      });
    };
    addEventListener("scroll", fb, { passive: true }); addEventListener("resize", fb); fb();
  });

  /* ---------- big-number moments scale in ---------- */
  $$("[data-moment]").forEach(function (m) {
    if (reduced) { m.style.setProperty("--m", "1"); return; }
    Scrub.add(m, 0.98, 0.45, function (p) { m.style.setProperty("--m", p.toFixed(3)); }, 0.35);
  });

  /* ---------- sticky product bar: visible only once it is actually stuck ---------- */
  $$("[data-subnav]").forEach(function (bar) {
    var on = null;
    var chk = function () {
      var s = bar.getBoundingClientRect().top <= 85;   // stuck right under the 84px global nav
      if (s !== on) { on = s; bar.classList.toggle("is-on", s); }
    };
    addEventListener("scroll", chk, { passive: true }); chk();
  });

  /* ---------- timeline fill (group page) ---------- */
  $$("[data-timeline]").forEach(function (tl) {
    if (reduced) { tl.style.setProperty("--p", "1"); return; }
    Scrub.add(tl, 0.7, 0.6, function (p) { tl.style.setProperty("--p", p.toFixed(3)); }, 0.4);
  });

  /* ---------- live cockpit: bars grow, tick draws, numbers count ---------- */
  $$("[data-cockpit]").forEach(function (c) {
    var bars = $$("[data-bars] i", c), tick = $(".cockpit__tick", c), nums = $$("[data-count-live]", c);
    bars.forEach(function (b, k) { b.style.setProperty("--k", String(k)); b.style.setProperty("--p", "0"); });
    if (tick) tick.style.setProperty("--tick", "30");
    nums.forEach(function (el) { el.textContent = "0"; });
    var played = false;
    function play() {
      if (played) return; played = true;
      bars.forEach(function (b) { b.style.setProperty("--p", "1"); });
      if (tick) tick.style.setProperty("--tick", "0");
      nums.forEach(function (el) {
        var target = +el.getAttribute("data-count"), t0 = null, dur = 1400;
        var step = function (ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * e).toLocaleString("en-US");
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
      /* keep it alive: nudge the bars every few seconds like real data (not while the ledger is mid-proposal) */
      if (!reduced) setInterval(function () {
        if (c.querySelector("[data-ledger-proposal]:not([hidden])")) return;
        bars.forEach(function (b) { b.style.setProperty("--p", String(0.82 + Math.random() * 0.18)); });
      }, 3200);
    }
    if (reduced) { bars.forEach(function (b) { b.style.setProperty("--p", "1"); }); if (tick) tick.style.setProperty("--tick", "0"); nums.forEach(function (el) { el.textContent = (+el.getAttribute("data-count")).toLocaleString("en-US"); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { play(); io.disconnect(); } }); }, { threshold: 0.35 });
    io.observe(c);
  });

  /* ---------- reading progress ---------- */
  var rb = $("[data-readbar]");
  if (rb) {
    var prose = $(".prose") || document.body;
    var upd = function () {
      var r = prose.getBoundingClientRect(), h = r.height - innerHeight * 0.6;
      rb.style.setProperty("--p", String(Math.max(0, Math.min(1, -r.top / Math.max(1, h)))));
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ---------- page transitions (4.8) ----------
     Cross-document View Transitions do this natively (motion.css). Where the
     browser lacks them, a curtain covers the exit and lifts on entry. */
  var curtain = $("[data-curtain]");
  var nativeVT = "onpagereveal" in window && CSS.supports && CSS.supports("view-transition-name: x");
  if (curtain && !reduced && !nativeVT) {
    if (sessionStorage.getItem("awalim-curtain") === "1") {
      sessionStorage.removeItem("awalim-curtain");
      curtain.classList.add("is-entering");
      curtain.addEventListener("animationend", function () { curtain.classList.remove("is-entering"); }, { once: true });
    }
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]"); if (!a) return;
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (a.getAttribute("href").charAt(0) === "#" || url.protocol === "mailto:" || url.protocol === "tel:") return;
      e.preventDefault();
      sessionStorage.setItem("awalim-curtain", "1");
      curtain.classList.add("is-leaving");
      setTimeout(function () { location.href = url.href; }, 400);
    });
    addEventListener("pageshow", function (e) { if (e.persisted) curtain.classList.remove("is-leaving"); });
  } else if (curtain) curtain.remove();

  /* ---------- glass: the specular sweep ----------
     The blur is CSS. This is the half that makes it read as a material rather
     than a filter: a highlight travels the surface in proportion to how fast
     the page is moving under it, and fades out the moment you stop. Two custom
     properties per frame on at most three elements, and the property they drive
     is a transform, so the compositor does the work and nothing repaints.
     Skipped entirely for reduced motion or reduced transparency — there is no
     material to respond to when the surface is solid. */
  var glassOff = reduced || matchMedia("(prefers-reduced-transparency: reduce)").matches;
  if (!glassOff) {
    var glassEls = $$(".pillnav .brand, .pillnav__links, .subnav");
    if (glassEls.length) {
      var gPrev = scrollY, gPos = 0, gEnergy = 0, gRaf = null, gIdle = 0;
      /* The material measures the machine it is running on.

         The cost is the sweep, and only the sweep. An earlier note here said it
         was spread evenly across the rim, the gradient and the sweep; that was
         wrong, and wrong in an instructive way — it came from one run per
         condition, and dropped-frame counts on this page swing between 2 and 12
         in the SAME condition. Comparing one run to another measures how busy
         the machine was, not the code.

         Re-measured paired and interleaved, two independent sets (9 rounds and
         15): full versus still is +3 dropped and worse in 8 of 8 rounds here,
         +2 and 13 of 15 there — small but real. Still versus off is a median of
         zero in both. So the rim and the gradient are not distinguishable from
         having no glass at all, and switching off the moving part is switching
         off the whole measurable cost. Which is what this does: the sweep
         watches its own first 48 frames and stands down on a device that is
         already missing them. The blur and the rim stay, because they are
         free. */
      var gSamples = [], gLast = 0, gGaveUp = false;
      var gDowngrade = function () {
        gGaveUp = true;
        for (var k = 0; k < glassEls.length; k++) {
          glassEls[k].style.setProperty("--spec-o", "0");
          glassEls[k].style.removeProperty("--spec");
        }
        /* One signal for every optional motion on the site, not for the glass
           alone: a device that cannot hold the frame for the sweep cannot hold
           it for the stack wave either, and two independent downgrade
           mechanisms would be two things to get out of step. */
        document.documentElement.setAttribute("data-motion", "lite");
      };
      var gTick = function () {
        var now = performance.now();
        if (gLast && gSamples.length < 48) {
          gSamples.push(now - gLast);
          if (gSamples.length === 48) {
            var sorted = gSamples.slice().sort(function (a, b) { return a - b; });
            /* p75 above 24ms means this device is already missing frames
               without any help from us */
            if (sorted[35] > 24) { gLast = now; gDowngrade(); return; }
          }
        }
        gLast = now;
        if (gGaveUp) return;
        var y = scrollY, dv = y - gPrev; gPrev = y;
        /* energy rises with speed and bleeds away on its own */
        gEnergy += (Math.min(Math.abs(dv) / 46, 1) - gEnergy) * 0.16;
        gPos = (gPos + dv * 0.0016) % 1;
        if (gPos < 0) gPos += 1;
        for (var i = 0; i < glassEls.length; i++) {
          glassEls[i].style.setProperty("--spec", gPos.toFixed(4));
          glassEls[i].style.setProperty("--spec-o", (gEnergy * 0.85).toFixed(3));
        }
        /* stop the loop once it has settled, restart on the next scroll */
        if (gEnergy < 0.004 && Math.abs(dv) < 0.5) {
          if (++gIdle > 12) { gRaf = null; return; }
        } else gIdle = 0;
        gRaf = requestAnimationFrame(gTick);
      };
      addEventListener("scroll", function () {
        if (gGaveUp) return;
        gIdle = 0;
        if (gRaf === null) gRaf = requestAnimationFrame(gTick);
      }, { passive: true });
    }
  }

  /* ---------- custom cursor (desktop only; native cursor stays) ---------- */
  var cur = $("[data-cursor-el]");
  if (cur && finePointer && !reduced) {
    var x = 0, y = 0, tx = 0, ty = 0, shown = false, rafId = null;
    var cloop = function () {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      cur.style.left = x + "px"; cur.style.top = y + "px";
      rafId = requestAnimationFrame(cloop);
    };
    addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; x = tx; y = ty; cur.classList.add("is-on"); cloop(); }
      var hot = e.target.closest && e.target.closest("a, button, [role=button], input, label, summary, .opt");
      cur.classList.toggle("is-hover", !!hot);
    }, { passive: true });
    addEventListener("pointerdown", function () { cur.classList.add("is-down"); });
    addEventListener("pointerup", function () { cur.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { cur.classList.remove("is-on"); shown = false; cancelAnimationFrame(rafId); });
  } else if (cur) cur.remove();

  /* ---------- cleanup on navigation ---------- */
  addEventListener("pagehide", function () { items = []; if (raf) cancelAnimationFrame(raf); if (lenis) lenis.destroy(); });
})();
