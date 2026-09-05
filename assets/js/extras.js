/* ==========================================================================
   AWALIM — extras: the site behaving like a system.
   · ⌘K command palette (Arabic-normalised search over a build-time index)
   · signed-numbers verification (SHA-256 + Ed25519 via WebCrypto)
   · self-audit: live Web Vitals / contrast / RTL readouts from THIS browser
   · pointer tilt on devices · cursor labels · scroll tint · blueprint draw
   No dependencies. ~9KB. Everything respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EN = document.documentElement.lang === "en";
  var T = function (ar, en) { return EN ? en : ar; };

  /* ======================================================================
     1. COMMAND PALETTE
     ====================================================================== */
  var norm = function (s) {
    return String(s).replace(/[ً-ْٰـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  };
  var pal = $("[data-palette]");
  if (pal) {
    var input = $("[data-pal-input]", pal), list = $("[data-pal-list]", pal);
    var index = null, loading = null, sel = 0, items = [], lastFocus = null;
    var COMMANDS = [
      { t: T("تبديل الوضع الليلي / النهاري", "Toggle dark / light mode"), d: T("أمر", "command"), k: T("أمر", "command"), s: "تبديل الوضع الليلي النهاري dark light theme toggle", run: function () { var b = $("[data-theme-toggle]"); if (b) b.click(); } },
      { t: T("افتح واتساب", "Open WhatsApp"), d: T("محادثة مباشرة", "Direct chat"), k: T("أمر", "command"), s: "واتساب whatsapp contact", run: function () { open("https://wa.me/970593636136", "_blank", "noopener"); } },
      { t: T("انسخ رابط هذه الصفحة", "Copy this page's link"), d: location.href.replace(/^https?:\/\//, ""), k: T("أمر", "command"), s: "انسخ رابط copy link", run: function () { try { navigator.clipboard.writeText(location.href); document.dispatchEvent(new CustomEvent("awalim:notify", { detail: { text: T("نُسخ الرابط", "Link copied") } })); } catch (_) {} } }
    ];
    function load() {
      if (index) return Promise.resolve(index);
      if (loading) return loading;
      loading = fetch(EN ? "/en/search.json" : "/search.json").then(function (r) { return r.json(); }).then(function (j) { index = j; return j; }).catch(function () { index = []; return index; });
      return loading;
    }
    function score(it, q, toks) {
      var t = norm(it.t), s = it.s || norm(it.t + " " + it.d);
      if (!toks.every(function (w) { return s.indexOf(w) > -1; })) return 0;
      if (t.indexOf(q) === 0) return 4;
      if (t.indexOf(q) > -1) return 3;
      if (toks.every(function (w) { return t.indexOf(w) > -1; })) return 2;
      return 1;
    }
    function render(q) {
      var qn = norm(q), toks = qn.split(" ").filter(Boolean);
      var pool = (index || []).concat(COMMANDS);
      items = !toks.length
        ? pool.filter(function (x) { return x.k === "صفحة" || x.k === "page"; }).slice(0, 9).concat(COMMANDS)
        : pool.map(function (x) { return { x: x, s: score(x, qn, toks) }; }).filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 12).map(function (r) { return r.x; });
      sel = 0;
      if (!items.length) {
        list.innerHTML = EN
          ? '<li class="pal__empty">No results for “' + q.replace(/[<>&]/g, "") + '” — try another word, or <a class="lnk" href="/en/contact">ask us directly</a>.</li>'
          : '<li class="pal__empty">لا نتائج لـ «' + q.replace(/[<>&]/g, "") + '» — جرّب كلمة أخرى، أو <a class="lnk" href="/contact">اسألنا مباشرة</a>.</li>';
        return;
      }
      list.innerHTML = items.map(function (x, i) {
        return '<li class="pal__it" role="option" id="pal-' + i + '" aria-selected="' + (i === sel) + '" data-i="' + i + '"><span class="pal__k">' + x.k + '</span><span><span class="pal__t">' + x.t + '</span><span class="pal__d">' + (x.d || "") + '</span></span><span class="pal__go" aria-hidden="true">↵</span></li>';
      }).join("");
      input.setAttribute("aria-activedescendant", "pal-0");
    }
    function setSel(i) {
      if (!items.length) return;
      sel = (i + items.length) % items.length;
      $$(".pal__it", list).forEach(function (li, k) { li.setAttribute("aria-selected", String(k === sel)); });
      var li = $("#pal-" + sel); if (li) li.scrollIntoView({ block: "nearest" });
      input.setAttribute("aria-activedescendant", "pal-" + sel);
    }
    function go(i) {
      var x = items[i]; if (!x) return;
      close();
      if (x.run) return x.run();
      if (x.u.indexOf("/#") === 0 && location.pathname === "/") { var el = document.getElementById(x.u.slice(2)); if (el) { el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); return; } }
      location.href = x.u;
    }
    function openPal() {
      if (!pal.hidden) return;
      lastFocus = document.activeElement;
      pal.hidden = false; document.body.classList.add("pal-open");
      input.value = ""; render(""); load().then(function () { render(input.value); });
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      if (pal.hidden) return;
      pal.hidden = true; document.body.classList.remove("pal-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K" || e.code === "KeyK")) { e.preventDefault(); pal.hidden ? openPal() : close(); return; }
      if (pal.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSel(sel - 1); }
      else if (e.key === "Enter") { e.preventDefault(); go(sel); }
      else if (e.key === "Tab") { e.preventDefault(); setSel(sel + (e.shiftKey ? -1 : 1)); }
    });
    input.addEventListener("input", function () { render(input.value); });
    list.addEventListener("click", function (e) { var li = e.target.closest(".pal__it"); if (li) go(+li.getAttribute("data-i")); });
    list.addEventListener("mousemove", function (e) { var li = e.target.closest(".pal__it"); if (li) setSel(+li.getAttribute("data-i")); });
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-palette-open]")) { e.preventDefault(); openPal(); }
      else if (e.target.closest("[data-palette-close]")) close();
    });
    /* warm the index on idle so the first ⌘K is instant */
    if (window.requestIdleCallback) requestIdleCallback(function () { load(); }, { timeout: 2500 }); else setTimeout(load, 1500);
  }

  /* ======================================================================
     2. SIGNED NUMBERS — verify in the visitor's browser
     ====================================================================== */
  var b64 = function (s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
  var hex = function (buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); };
  $$("[data-verify]").forEach(function (box) {
    var btn = $("[data-verify-run]", box), panel = $(".verify__panel", box), out = $("[data-verify-out]", box), ran = false;
    var mark = function (k, st, d) { var li = $('[data-check="' + k + '"]', box); if (!li) return; li.classList.remove("is-run", "is-ok", "is-fail"); if (st) li.classList.add("is-" + st); if (d !== undefined) { var dd = $(".verify__d", li); if (dd) dd.textContent = d; } };
    function run() {
      if (ran) return; ran = true;
      ["hash", "sig", "key", "dom"].forEach(function (k) { mark(k, "run"); });
      out.textContent = T("جارٍ التحقّق في متصفّحك…", "Verifying in your browser…");
      var manifest, payloadBytes;
      fetch("/verify/stats.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (m) {
        manifest = m; payloadBytes = new TextEncoder().encode(m.payload);
        return crypto.subtle.digest("SHA-256", payloadBytes);
      }).then(function (h) {
        var ok = hex(h) === manifest.sha256; mark("hash", ok ? "ok" : "fail", "SHA-256 · " + hex(h).slice(0, 10) + "…");
        if (!ok) throw new Error("hash");
        var pub = box.getAttribute("data-pubkey");
        mark("key", pub === manifest.publicKey ? "ok" : "fail", pub === manifest.publicKey ? T("المفتاح في مصدر الصفحة = المفتاح في الملف", "Key in page source = key in file") : T("المفتاح مختلف!", "Key mismatch!"));
        if (!(crypto.subtle && crypto.subtle.importKey)) throw new Error("nocrypto");
        return crypto.subtle.importKey("raw", b64(manifest.publicKey), { name: "Ed25519" }, false, ["verify"]).catch(function () { throw new Error("noed25519"); });
      }).then(function (key) {
        return crypto.subtle.verify({ name: "Ed25519" }, key, b64(manifest.signature), payloadBytes);
      }).then(function (valid) {
        mark("sig", valid ? "ok" : "fail", valid ? "Ed25519 · WebCrypto ✓" : T("توقيع غير صالح", "Invalid signature"));
        /* 4th check: what the page shows equals what was signed */
        var signed = JSON.parse(manifest.payload).stats, mism = [], seen = 0;
        $$("[data-stat]").forEach(function (el) {
          var k = el.getAttribute("data-stat"); if (!(k in signed)) return;
          /* the count-up is cosmetic: the number the page renders is data-count's target */
          var cnt = el.querySelector("[data-count]");
          var shown = cnt ? parseInt(cnt.getAttribute("data-count"), 10) : parseInt(((el.querySelector(".num") || el).textContent || "").replace(/[^\d]/g, ""), 10);
          seen++; if (shown !== signed[k]) mism.push(k + ": " + shown + " ≠ " + signed[k]);
        });
        mark("dom", mism.length ? "fail" : "ok", mism.length ? mism.join(" · ") : seen + T(" أرقام مطابقة", " numbers match"));
        out.textContent = valid && !mism.length
          ? T("✓ كل الفحوص نجحت — الأرقام التي تراها هي الأرقام الموقّعة بتاريخ ", "✓ All checks passed — what you see is what was signed on ") + manifest.issued + "."
          : T("✖ فشل فحص — انظر أعلاه.", "✖ A check failed — see above.");
        if (valid && !mism.length) document.dispatchEvent(new CustomEvent("awalim:notify", { detail: { text: T("الأرقام موقّعة — تحقّق تمّ في متصفّحك", "Numbers verified — checked in your browser") } }));
      }).catch(function (e) {
        var msg = (EN
          ? { hash: "The hash does not match — the payload changed after signing.", nocrypto: "Your browser does not provide WebCrypto.", noed25519: "Your browser does not support Ed25519 in WebCrypto yet — verify with the command shown on /verify." }
          : { hash: "الهاش لا يطابق — الحمولة تغيّرت بعد التوقيع.", nocrypto: "متصفّحك لا يوفّر WebCrypto.", noed25519: "متصفّحك لا يدعم Ed25519 في WebCrypto بعد — تحقّق بالأمر المكتوب في صفحة /verify." }
        )[e.message] || T("تعذّر التحقّق: ", "Verification failed: ") + e.message;
        ["sig", "dom"].forEach(function (k) { var li = $('[data-check="' + k + '"]', box); if (li && li.classList.contains("is-run")) mark(k, "fail", "—"); });
        out.textContent = msg;
      });
    }
    btn.addEventListener("click", function () {
      var open = panel.hidden; panel.hidden = !open; btn.setAttribute("aria-expanded", String(open));
      if (open) run();
    });
    if (box.hasAttribute("data-verify-auto")) { panel.hidden = false; btn.setAttribute("aria-expanded", "true"); run(); }
  });

  /* ======================================================================
     3. SELF-AUDIT — live measurements from THIS browser
     ====================================================================== */
  var readouts = $$("[data-audit]");
  if (readouts.length) {
    var m = { lcp: null, cls: 0, inp: null };
    var fmtMs = function (ms) { return ms >= 1000 ? (ms / 1000).toFixed(2) + "s" : Math.round(ms) + "ms"; };
    var set = function (k, txt, grade) {
      $$('[data-audit="' + k + '"]').forEach(function (el) {
        var b = el.querySelector("b") || el; b.textContent = txt;
        el.classList.remove("is-good", "is-meh", "is-bad"); if (grade) el.classList.add("is-" + grade);
      });
    };
    var grade = function (v, good, meh) { return v <= good ? "good" : v <= meh ? "meh" : "bad"; };
    var paint = function () {
      if (m.lcp !== null) set("lcp", fmtMs(m.lcp), grade(m.lcp, 2500, 4000));
      set("cls", m.cls.toFixed(3), grade(m.cls, 0.1, 0.25));
      if (m.inp !== null) set("inp", fmtMs(m.inp), grade(m.inp, 200, 500)); else set("inp", T("بانتظار تفاعل", "awaiting input"), null);
      try {
        var res = performance.getEntriesByType("resource"), nav = performance.getEntriesByType("navigation")[0];
        var bytes = res.reduce(function (a, r) { return a + (r.transferSize || 0); }, 0) + (nav ? nav.transferSize || 0 : 0);
        if (bytes) set("weight", Math.round(bytes / 1024) + " KB", grade(bytes, 600 * 1024, 1200 * 1024));
      } catch (_) {}
    };
    try {
      new PerformanceObserver(function (l) { var e = l.getEntries().pop(); if (e) { m.lcp = e.startTime; paint(); } }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (!e.hadRecentInput) m.cls += e.value; }); paint(); }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(function (l) { l.getEntries().forEach(function (e) { if (e.interactionId && (m.inp === null || e.duration > m.inp)) m.inp = e.duration; }); paint(); }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    } catch (_) {}
    /* static-ish checks */
    var cs = getComputedStyle(document.documentElement);
    var toRgb = function (h) { h = h.trim().replace("#", ""); return [0, 2, 4].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; }); };
    var lum = function (c) { var a = c.map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
    var ratio = function (f, b) { var x = lum(toRgb(f)), y = lum(toRgb(b)); return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)); };
    var contrast = function () {
      try {
        var t = ratio(cs.getPropertyValue("--text"), cs.getPropertyValue("--bg")), mu = ratio(cs.getPropertyValue("--text-muted"), cs.getPropertyValue("--bg"));
        set("contrast", t.toFixed(1) + ":1 · " + mu.toFixed(1) + ":1", mu >= 4.5 ? "good" : "bad");
      } catch (_) {}
    };
    contrast();
    new MutationObserver(function () { cs = getComputedStyle(document.documentElement); contrast(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    (function () {
      var hs = $$("h1,h2,h3,h4,h5,h6"), last = 0, ok = true;
      hs.forEach(function (h) { var l = +h.tagName[1]; if (last && l > last + 1) ok = false; last = l; });
      set("headings", ok ? hs.length + T(" عناوين متسلسلة ✓", " headings in order ✓") : T("قفزة في المستويات", "level skipped"), ok ? "good" : "bad");
      var d = document.documentElement;
      var okDir = (d.dir === "rtl" && d.lang === "ar") || (d.dir === "ltr" && d.lang === "en");
      set("rtl", okDir ? "dir=" + d.dir + " · lang=" + d.lang + " ✓" : "✖", okDir ? "good" : "bad");
      set("digits", T("0123 لاتينية · جدولية", "0123 Latin · tabular"), "good");
    })();
    paint();
    document.addEventListener("visibilitychange", paint);
    addEventListener("pagehide", paint);
    $$(".live--static").forEach(function (el) { el.classList.add("is-static"); });
  }

  /* ======================================================================
     4. POINTER TILT (desktop) — the device leans toward the cursor
     ====================================================================== */
  if (fine && !reduced) {
    $$("[data-tilt]").forEach(function (box) {
      var dev = $(".dev", box); if (!dev) return;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, on = false;
      var loop = function () {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
        dev.style.setProperty("--tx", cx.toFixed(2) + "deg"); dev.style.setProperty("--ty", cy.toFixed(2) + "deg");
        if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || on) raf = requestAnimationFrame(loop); else raf = null;
      };
      box.addEventListener("pointermove", function (e) {
        var r = box.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
        tx = nx * 9; ty = -ny * 7; on = true; if (!raf) loop();
      });
      box.addEventListener("pointerleave", function () { tx = 0; ty = 0; on = false; if (!raf) loop(); });
    });
  }

  /* ---------- magnetic primary buttons (desktop) ---------- */
  if (fine && !reduced) {
    $$(".btn--primary, .btn--accent").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) * 0.22, dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        b.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ======================================================================
     5. CURSOR LABELS — the cursor says what a hover will do
     ====================================================================== */
  var cur = $("[data-cursor-el]"), lab = cur && $(".cursor__l", cur);
  if (cur && lab && fine && !reduced) {
    addEventListener("pointermove", function (e) {
      var t = e.target.closest && e.target.closest("[data-cursor]");
      if (t) { lab.textContent = t.getAttribute("data-cursor"); cur.classList.add("is-label"); }
      else cur.classList.remove("is-label");
    }, { passive: true });
  }

  /* ======================================================================
     6. SCROLL TINT — the ground leans toward the active card's theme
     ====================================================================== */
  var cards = $$(".hcard[data-theme-card]");
  if (cards.length && !reduced && "IntersectionObserver" in window) {
    var active = new Map();
    var apply = function () {
      var best = null, bestR = 0;
      active.forEach(function (r, el) { if (r > bestR) { bestR = r; best = el; } });
      if (best) document.documentElement.style.setProperty("--tint", getComputedStyle(best).getPropertyValue("--card-bg"));
      else document.documentElement.style.removeProperty("--tint");
    };
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.intersectionRatio > 0.35) active.set(en.target, en.intersectionRatio); else active.delete(en.target); });
      apply();
    }, { threshold: [0, 0.35, 0.6, 0.9] });
    cards.forEach(function (c) { tio.observe(c); });
  }

  /* ======================================================================
     7. BLUEPRINT — draws itself as it scrolls into view
     ====================================================================== */
  $$("[data-blueprint]").forEach(function (bp) {
    if (reduced) { bp.style.setProperty("--draw", "1"); return; }
    if (window.AwalimScrub) {
      AwalimScrub.add(bp, 0.88, 0.45, function (p) { bp.style.setProperty("--draw", p.toFixed(3)); }, 0.5);
    } else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { bp.style.transition = "--draw 1.6s ease"; bp.style.setProperty("--draw", "1"); io.disconnect(); } }); }, { threshold: 0.3 });
      io.observe(bp);
    }
  });
})();
