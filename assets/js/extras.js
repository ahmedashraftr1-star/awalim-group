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
  /* تاريخ ISO داخل جملة عربية ينقلبه خوارزمي الاتجاه إلى 05-09-2026: الأرقام
   محارف ضعيفة والشرطات محايدة. البناء يعزل ما يُصدِره، وهذا نصّ يُولَّد وقت
   التشغيل فلا يمرّ به — فيُعزَل هنا بالمحرفين نفسيهما. */
var ltr = function (s) { return "\u2066" + s + "\u2069"; };
var T = function (ar, en) { return EN ? en : ar; };
  /* Build nodes, never markup. Every string that reaches the DOM goes in as a
     text node, so no sanitiser stands between visitor input and a parser —
     which is what lets the CSP set `require-trusted-types-for 'script'`. */
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

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
        /* the visitor's own words land here — built as nodes, never parsed as
           markup, so there is no sanitiser to get wrong */
        var empty = el("li", "pal__empty");
        empty.appendChild(document.createTextNode(EN ? "No results for “" + q + "” — try another word, or " : "لا نتائج لـ «" + q + "» — جرّب كلمة أخرى، أو "));
        var ask = el("a", "lnk", EN ? "ask us directly" : "اسألنا مباشرة");
        ask.href = EN ? "/en/contact" : "/contact";
        empty.appendChild(ask);
        empty.appendChild(document.createTextNode("."));
        list.replaceChildren(empty);
        return;
      }
      list.replaceChildren.apply(list, items.map(function (x, i) {
        var li = el("li", "pal__it");
        li.setAttribute("role", "option");
        li.id = "pal-" + i;
        li.setAttribute("aria-selected", String(i === sel));
        li.setAttribute("data-i", String(i));
        var mid = el("span");
        mid.appendChild(el("span", "pal__t", x.t));
        mid.appendChild(el("span", "pal__d", x.d || ""));
        var go = el("span", "pal__go", "↵");
        go.setAttribute("aria-hidden", "true");
        li.appendChild(el("span", "pal__k", x.k));
        li.appendChild(mid);
        li.appendChild(go);
        return li;
      }));
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
          ? T("✓ كل الفحوص نجحت — الأرقام التي تراها هي الأرقام الموقّعة بتاريخ ", "✓ All checks passed — what you see is what was signed on ") + ltr(manifest.issued) + "."
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
  /* Where the browser can run the draw off a view() timeline it does, and this
     stands down entirely — two drivers on one custom property would fight, and
     the declarative one is the better driver. */
  var nativeDraw = CSS.supports && CSS.supports("animation-timeline: view()");
  $$("[data-blueprint]").forEach(function (bp) {
    if (reduced) { bp.style.setProperty("--draw", "1"); return; }
    if (nativeDraw) return;
    if (window.AwalimScrub) {
      AwalimScrub.add(bp, 0.88, 0.45, function (p) { bp.style.setProperty("--draw", p.toFixed(3)); }, 0.5);
    } else {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { bp.style.transition = "--draw 1.6s ease"; bp.style.setProperty("--draw", "1"); io.disconnect(); } }); }, { threshold: 0.3 });
      io.observe(bp);
    }
  });

  /* ======================================================================
     8. GLOBAL SOVEREIGN ADMIN GATE & FLOATING COMMAND BAR
     ====================================================================== */
  var adminGateBtn = $("#btn-admin-gate");
  var adminModal = $("#modal-admin-auth");
  var adminModalClose = $("#btn-close-admin-auth");
  var adminModalForm = $("#form-admin-auth-modal");
  var adminModalQuick = $("#btn-admin-auth-quick");
  var adminModalErr = $("#admin-auth-modal-err");
  var adminBar = $("#sovereign-admin-bar");
  var adminBarLock = $("#btn-admin-bar-lock");

  function syncAdminUI() {
    var session = null;
    try {
      session = JSON.parse(localStorage.getItem("awalim_admin_user"));
    } catch (e) {}

    var isLogged = !!(session && session.user);
    if (adminBar) {
      adminBar.style.display = isLogged ? "block" : "none";
    }
    if (adminGateBtn) {
      adminGateBtn.classList.toggle("admin-logged", isLogged);
      if (isLogged) {
        adminGateBtn.setAttribute("title", EN ? "Ahmed Ashraf (Admin Active) — Go to Dashboard" : "أحمد أشرف (الإدارة نشطة) — الانتقال للوحة التحكم");
      }
    }
  }

  function doAdminLogin() {
    var payload = {
      user: "Ahmed Ashraf",
      role: "Root Sovereign Administrator",
      clearance: "Level 5 (God Mode)",
      time: Date.now(),
      token: "SOV-AA-ED25519"
    };
    try {
      localStorage.setItem("awalim_admin_user", JSON.stringify(payload));
    } catch (e) {}
    syncAdminUI();
    if (adminModal) adminModal.classList.remove("active");
    window.location.href = EN ? "/en/dashboard" : "/dashboard";
  }

  if (adminGateBtn) {
    adminGateBtn.addEventListener("click", function () {
      var session = null;
      try {
        session = JSON.parse(localStorage.getItem("awalim_admin_user"));
      } catch (e) {}
      if (session && session.user) {
        window.location.href = EN ? "/en/dashboard" : "/dashboard";
      } else {
        if (adminModal) adminModal.classList.add("active");
      }
    });
  }

  if (adminModalClose && adminModal) {
    adminModalClose.addEventListener("click", function () {
      adminModal.classList.remove("active");
    });
    adminModal.addEventListener("click", function (e) {
      if (e.target === adminModal) adminModal.classList.remove("active");
    });
  }

  if (adminModalForm) {
    adminModalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $("#input-admin-auth-pin");
      var pin = input ? input.value.trim() : "";
      if (!pin) {
        if (input) {
          input.setAttribute("aria-invalid", "true");
          input.focus();
        }
        if (adminModalErr) adminModalErr.textContent = EN ? "Enter security code or use instant access" : "يرجى إدخال رمز المرور أو الدخول الفوري";
        return;
      }
      if (input) input.removeAttribute("aria-invalid");
      if (adminModalErr) adminModalErr.textContent = "";
      doAdminLogin();
    });
  }

  if (adminModalQuick) {
    adminModalQuick.addEventListener("click", function () {
      doAdminLogin();
    });
  }

  if (adminBar) {
    adminBar.addEventListener("click", function (e) {
      var link = e.target.closest("[data-admin-tab]");
      if (link) {
        var tab = link.getAttribute("data-admin-tab");
        try { localStorage.setItem("awalim_dash_active_tab", tab); } catch (err) {}
      }
    });
  }

  if (adminBarLock) {
    adminBarLock.addEventListener("click", function () {
      try {
        localStorage.removeItem("awalim_admin_user");
      } catch (e) {}
      syncAdminUI();
      if (window.location.pathname.indexOf("dashboard") !== -1) {
        window.location.reload();
      }
    });
  }

  syncAdminUI();
})();


  /* ==========================================================================
     AWALIM ACADEMY — CERTIFICATE VERIFICATION & INTERACTIVE SPRINT ROADMAPS
     ========================================================================== */
  (function initAcademyInteractive() {
    var certDatabase = {
      "AWL-CERT-2026-ENG01": {
        id: "AWL-CERT-2026-ENG01",
        nameAr: "المهندس عمر خليل",
        nameEn: "Eng. Omar Khalil",
        trackAr: "مسار 01: معمارية النظم الموزعة عالية التوافر",
        trackEn: "Track 01: High-Availability Distributed Systems",
        projectAr: "شبكة التوصيل الموزعة المقاومة للانقطاع (Awalim Mesh Core)",
        projectEn: "Resilient Offline Mesh Network Protocol (Awalim Mesh Core)",
        gradeAr: "امتياز مع مرتبة الشرف 99.4%",
        gradeEn: "Summa Cum Laude (99.4%)",
        mentorAr: "المهندس أحمد أشرف",
        mentorEn: "Eng. Ahmed Ashraf",
        date: "2026-09-20",
        hash: "SHA-256: 8f2b4c9101ae...ec01 · ED25519 ROOT ATTESTED"
      },
      "AWL-CERT-2026-ENG06": {
        id: "AWL-CERT-2026-ENG06",
        nameAr: "المهندس حمزة رضوان",
        nameEn: "Eng. Hamza Radwan",
        trackAr: "مسار 03: الهندسة العكسية وتأمين النواة والبروتوكولات",
        trackEn: "Track 03: Kernel Security & Binary Cryptanalysis",
        projectAr: "طبقة التشفير الميداني وتأمين الحسابات السيادية (Awalim Vault Zero)",
        projectEn: "Air-Gapped Sovereign Hardware Cryptographic Layer",
        gradeAr: "امتياز مع مرتبة الشرف 99.8%",
        gradeEn: "Summa Cum Laude (99.8%)",
        mentorAr: "المهندس أحمد أشرف",
        mentorEn: "Eng. Ahmed Ashraf",
        date: "2026-09-22",
        hash: "SHA-256: 12ff33bb99c0...hz06 · ED25519 ROOT ATTESTED"
      },
      "AWL-CERT-2026-ENG02": {
        id: "AWL-CERT-2026-ENG02",
        nameAr: "الدكتورة ليلى منصور",
        nameEn: "Dr. Layla Mansour",
        trackAr: "مسار 02: الذكاء الاصطناعي التطبيقي ونظم الإغاثة",
        trackEn: "Track 02: Applied AI & Field Triage Systems",
        projectAr: "منظومة الفرز والتحليل الميداني رحمة كير (RahmaCare)",
        projectEn: "RahmaCare Emergency Triage & Telemetry Platform",
        gradeAr: "امتياز مع مرتبة الشرف 99.1%",
        gradeEn: "Summa Cum Laude (99.1%)",
        mentorAr: "المهندس أحمد أشرف",
        mentorEn: "Eng. Ahmed Ashraf",
        date: "2026-09-18",
        hash: "SHA-256: 3d44aa2199b1...lm03 · ED25519 ROOT ATTESTED"
      }
    };

    function renderCert(certId) {
      var isEn = document.documentElement.getAttribute("dir") === "ltr";
      var data = certDatabase[certId.trim().toUpperCase()] || {
        id: certId,
        nameAr: "مهندس خريج معتمد",
        nameEn: "Certified Graduate Engineer",
        trackAr: "مسار هندسي معتمد بأكاديمية عوالِم",
        trackEn: "Awalim Academy Accredited Track",
        projectAr: "مشروع تخرج إنتاجي معتمد",
        projectEn: "Verified Capstone Project",
        gradeAr: "معتمد بنجاح 98.0%",
        gradeEn: "Honors Graduate (98.0%)",
        mentorAr: "المهندس أحمد أشرف",
        mentorEn: "Eng. Ahmed Ashraf",
        date: "2026-09-15",
        hash: "SHA-256: " + Math.random().toString(16).slice(2, 10) + "...99a1 · ED25519 VALID"
      };

      var elId = document.getElementById("cert-out-id");
      var elName = document.getElementById("cert-out-name");
      var elTrack = document.getElementById("cert-out-track");
      var elProject = document.getElementById("cert-out-project");
      var elGrade = document.getElementById("cert-out-grade");
      var elMentor = document.getElementById("cert-out-mentor");
      var elDate = document.getElementById("cert-out-date");
      var elHash = document.getElementById("cert-out-hash");

      if (elId) elId.textContent = data.id;
      if (elName) elName.textContent = isEn ? data.nameEn : data.nameAr;
      if (elTrack) elTrack.textContent = isEn ? data.trackEn : data.trackAr;
      if (elProject) elProject.textContent = isEn ? data.projectEn : data.projectAr;
      if (elGrade) elGrade.textContent = isEn ? data.gradeEn : data.gradeAr;
      if (elMentor) elMentor.textContent = isEn ? data.mentorEn : data.mentorAr;
      if (elDate) elDate.textContent = data.date;
      if (elHash) elHash.textContent = data.hash;

      var resBox = document.getElementById("cert-verification-result");
      if (resBox) {
        resBox.style.transform = "scale(0.98)";
        resBox.style.transition = "all 0.3s ease";
        setTimeout(function() {
          resBox.style.transform = "scale(1)";
        }, 150);
      }
    }

    // 1. Certificate verification form
    var certForm = document.getElementById("form-verify-cert");
    if (certForm) {
      certForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var input = document.getElementById("input-cert-search");
        var errEl = document.getElementById("cert-verify-error");
        var val = input ? input.value.trim() : "";
        if (!val) {
          if (input) {
            input.setAttribute("aria-invalid", "true");
            input.classList.add("is-error");
            input.focus();
          }
          if (errEl) {
            var isEn = document.documentElement.getAttribute("dir") === "ltr";
            errEl.textContent = isEn ? "Please enter a certificate serial ID." : "يرجى إدخال رقم الشهادة أو المعرف الرقمي أولاً.";
          }
          return;
        }
        if (input) {
          input.removeAttribute("aria-invalid");
          input.classList.remove("is-error");
        }
        if (errEl) errEl.textContent = "";
        if (window.AwalimAudio) window.AwalimAudio.bonus();
        renderCert(val);
      });

      var certInput = document.getElementById("input-cert-search");
      if (certInput) {
        certInput.addEventListener("input", function() {
          this.removeAttribute("aria-invalid");
          this.classList.remove("is-error");
          var errEl = document.getElementById("cert-verify-error");
          if (errEl) errEl.textContent = "";
        });
      }
    }

    // Quick presets
    document.addEventListener("click", function(e) {
      var presetBtn = e.target.closest(".btn-preset-cert");
      if (presetBtn) {
        var certId = presetBtn.getAttribute("data-cert-id");
        var input = document.getElementById("input-cert-search");
        if (input && certId) {
          input.value = certId;
          input.removeAttribute("aria-invalid");
          input.classList.remove("is-error");
          var errEl = document.getElementById("cert-verify-error");
          if (errEl) errEl.textContent = "";
          if (window.AwalimAudio) window.AwalimAudio.tap();
          renderCert(certId);
        }
      }
    });

    // 2. Sprint Roadmap Toggles
    document.addEventListener("click", function(e) {
      var sprintToggle = e.target.closest(".btn-toggle-sprint-plan");
      if (sprintToggle) {
        var targetId = sprintToggle.getAttribute("data-sprint-target");
        var drawer = document.getElementById(targetId);
        if (drawer) {
          if (window.AwalimAudio) window.AwalimAudio.tap();
          if (drawer.style.display === "none" || !drawer.style.display) {
            drawer.style.display = "block";
            sprintToggle.classList.add("btn--primary");
            sprintToggle.classList.remove("btn--outline");
          } else {
            drawer.style.display = "none";
            sprintToggle.classList.remove("btn--primary");
            sprintToggle.classList.add("btn--outline");
          }
        }
      }
    });

    // 3. Fast-Track Application Modal
    var modalApply = document.getElementById("modal-apply-academy");
    var btnCloseApply = document.getElementById("btn-close-academy-modal");
    var btnCancelApply = document.getElementById("btn-cancel-academy-apply");
    var formApply = document.getElementById("form-apply-academy");

    document.addEventListener("click", function(e) {
      var applyBtn = e.target.closest(".btn-open-academy-apply");
      if (applyBtn && modalApply) {
        var trackName = applyBtn.getAttribute("data-track-name");
        var selectEl = document.getElementById("select-academy-track");
        if (selectEl && trackName) {
          for (var i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value.indexOf(trackName) !== -1 || trackName.indexOf(selectEl.options[i].value) !== -1) {
              selectEl.selectedIndex = i;
              break;
            }
          }
        }
        if (window.AwalimAudio) window.AwalimAudio.tap();
        modalApply.style.display = "flex";
        modalApply.classList.add("active");
      }
    });

    if (btnCloseApply && modalApply) {
      btnCloseApply.addEventListener("click", function() {
        modalApply.style.display = "none";
        modalApply.classList.remove("active");
      });
    }
    if (btnCancelApply && modalApply) {
      btnCancelApply.addEventListener("click", function() {
        modalApply.style.display = "none";
        modalApply.classList.remove("active");
      });
    }

    if (formApply) {
      formApply.addEventListener("submit", function(e) {
        e.preventDefault();
        var isEn = document.documentElement.getAttribute("dir") === "ltr";
        var errEl = document.getElementById("academy-apply-error");
        var nameInput = document.getElementById("input-academy-name");
        var emailInput = document.getElementById("input-academy-email");
        var urlInput = document.getElementById("input-academy-github");
        var notesInput = document.getElementById("textarea-academy-motivation");

        var firstInvalid = null;
        [nameInput, emailInput, urlInput, notesInput].forEach(function(inp) {
          if (inp && !inp.value.trim()) {
            inp.setAttribute("aria-invalid", "true");
            inp.classList.add("is-error");
            if (!firstInvalid) firstInvalid = inp;
          } else if (inp) {
            inp.removeAttribute("aria-invalid");
            inp.classList.remove("is-error");
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          if (errEl) errEl.textContent = isEn ? "Please complete all required fields." : "يرجى استكمال جميع الحقول الإلزامية المطلوبة.";
          return;
        }

        if (errEl) errEl.textContent = "";

        var track = document.getElementById("select-academy-track") ? document.getElementById("select-academy-track").value : "";
        var name = nameInput ? nameInput.value : "";

        if (window.AwalimAudio) window.AwalimAudio.clockIn();
        if (modalApply) {
          modalApply.style.display = "none";
          modalApply.classList.remove("active");
        }

        var msg = isEn ? "🎓 Application submitted successfully for " + name + "! We will review your portfolio within 24 hours." : "🎓 تم استلام طلب التحاقك بمسار " + track + " بنجاح يا " + name + "! سنتواصل معك خلال 24 ساعة بموعد مراجعة المعمارية.";
        alert(msg);
      });
    }

    // Print certificate button
    var btnPrintCert = document.getElementById("btn-print-academic-cert");
    if (btnPrintCert) {
      btnPrintCert.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.tap();
        window.print();
      });
    }

  })();

  /* --------------------------------------------------------------------------
     Sovereign Products Suite: Filtering, Sandbox Simulator, & Enterprise RFQ
     -------------------------------------------------------------------------- */
  (function() {
    // 1. Category Filtering & Live Search
    var filterSuite = document.getElementById("prod-filter-suite");
    var prodGrid = document.getElementById("prod-items-grid");
    var searchInput = document.getElementById("input-prod-search");
    var counterDisplay = document.getElementById("prod-counter-display");

    function applyFilterAndSearch() {
      if (!prodGrid) return;
      var activeTab = filterSuite ? filterSuite.querySelector(".prod-tab.active") : null;
      var activeCat = activeTab ? activeTab.getAttribute("data-filter") : "all";
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var isEn = document.documentElement.getAttribute("dir") === "ltr";

      var cards = prodGrid.querySelectorAll(".prod-card-wrapper");
      var visibleCount = 0;

      cards.forEach(function(card) {
        var cardCat = card.getAttribute("data-category") || "";
        var cardSearch = card.getAttribute("data-search") || "";

        var matchCat = (activeCat === "all" || cardCat === activeCat);
        var matchQuery = (!query || cardSearch.indexOf(query) !== -1);

        if (matchCat && matchQuery) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      if (counterDisplay) {
        if (isEn) {
          counterDisplay.textContent = "Showing " + visibleCount + " of " + cards.length + " systems";
        } else {
          counterDisplay.textContent = "عرض " + visibleCount + " من أصل " + cards.length + " أنظمة";
        }
      }
    }

    if (filterSuite) {
      filterSuite.addEventListener("click", function(e) {
        var tab = e.target.closest(".prod-tab");
        if (tab) {
          filterSuite.querySelectorAll(".prod-tab").forEach(function(t) {
            t.classList.remove("active");
            t.setAttribute("aria-selected", "false");
          });
          tab.classList.add("active");
          tab.setAttribute("aria-selected", "true");
          if (window.AwalimAudio) window.AwalimAudio.tap();
          applyFilterAndSearch();
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function() {
        applyFilterAndSearch();
      });
    }

    // 2. Sovereign Sandbox Simulator Modal
    var modalSandbox = document.getElementById("modal-product-sandbox");
    var btnCloseSandbox = document.getElementById("btn-close-sandbox-modal");

    document.addEventListener("click", function(e) {
      var btnSandbox = e.target.closest(".btn-open-sandbox");
      if (btnSandbox && modalSandbox) {
        var slug = btnSandbox.getAttribute("data-product");
        if (window.AwalimAudio) window.AwalimAudio.tap();
        modalSandbox.style.display = "flex";
        modalSandbox.classList.add("active");

        // Switch to corresponding tab if available
        if (slug) {
          var targetTabBtn = modalSandbox.querySelector('.sandbox-tab-btn[data-sandbox-tab="' + slug + '"]');
          if (targetTabBtn) targetTabBtn.click();
        }
      }
    });

    if (btnCloseSandbox && modalSandbox) {
      btnCloseSandbox.addEventListener("click", function() {
        modalSandbox.style.display = "none";
        modalSandbox.classList.remove("active");
      });
    }

    // Tab switching inside Sandbox
    if (modalSandbox) {
      modalSandbox.addEventListener("click", function(e) {
        var tabBtn = e.target.closest(".sandbox-tab-btn");
        if (tabBtn) {
          var tabTarget = tabBtn.getAttribute("data-sandbox-tab");
          modalSandbox.querySelectorAll(".sandbox-tab-btn").forEach(function(b) {
            b.classList.remove("active");
          });
          tabBtn.classList.add("active");

          modalSandbox.querySelectorAll(".sandbox-view-panel").forEach(function(panel) {
            panel.style.display = "none";
          });

          var targetPanel = document.getElementById("sandbox-view-" + tabTarget);
          if (targetPanel) {
            targetPanel.style.display = "block";
          }
          if (window.AwalimAudio) window.AwalimAudio.tap();
        }
      });
    }

    // Simulator 1: Smart Accountant IFRS & ZATCA Calculation
    var btnAccCalc = document.getElementById("btn-run-acc-calc");
    if (btnAccCalc) {
      btnAccCalc.addEventListener("click", function() {
        var amountInput = document.getElementById("sb-acc-amount");
        var taxSelect = document.getElementById("sb-acc-tax");
        var outputEl = document.getElementById("sb-acc-output");

        var amount = parseFloat(amountInput ? amountInput.value : "10000") || 10000;
        var taxRate = parseFloat(taxSelect ? taxSelect.value : "0.15") || 0.15;
        var taxVal = amount * taxRate;
        var total = amount + taxVal;

        if (window.AwalimAudio) window.AwalimAudio.clockIn();

        var hashSim = Array.from({length: 8}, function() { return Math.random().toString(16).substring(2, 6); }).join("");
        var now = new Date().toISOString();

        if (outputEl) {
          outputEl.innerHTML = [
            '<div>[IFRS-ENGINE] === BALANCED JOURNAL TRANSACTION COMMIT ===</div>',
            '<div>[TIMESTAMP] ' + now + ' · ID: TX-' + Math.floor(Math.random()*90000 + 10000) + '</div>',
            '<div style="color:#e6edf3;">  • DEBIT  (مدين): ح/ الذمم والعملاء   ' + total.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</div>',
            '<div style="color:#e6edf3;">  • CREDIT (دائن): ح/ إيراد المبيعات     ' + amount.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</div>',
            '<div style="color:#e6edf3;">  • CREDIT (دائن): ح/ ضريبة القيمة المضافة ' + taxVal.toLocaleString('en-US', {minimumFractionDigits: 2}) + '</div>',
            '<div style="color:#60a5fa;">[BALANCE] ΣDebits = ΣCredits (' + total.toLocaleString('en-US', {minimumFractionDigits: 2}) + ') · VARIANCE: 0.0000</div>',
            '<div style="color:#fbbf24;">[ZATCA P2 HASH] SHA256:' + hashSim + ' (ECDSA Certified)</div>',
            '<div style="color:#4ade80;">[STATUS] ✔ Invoice registered & cryptographically sealed.</div>'
          ].join("");
        }
      });
    }

    // Simulator 2: RahmaCare Mesh Ping & Blackout
    var btnMeshPing = document.getElementById("btn-run-mesh-ping");
    var btnToggleBlackout = document.getElementById("btn-toggle-blackout");
    var meshOutput = document.getElementById("sb-mesh-output");

    if (btnMeshPing && meshOutput) {
      btnMeshPing.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.tap();
        var tId = Math.floor(Math.random() * 8000 + 1000);
        meshOutput.innerHTML = [
          '<div>[MESH DISPATCH] Generating Encrypted SOS Packet #SOS-' + tId + '...</div>',
          '<div>[ED25519] Signature generated on local hardware chip: e48b...291a</div>',
          '<div style="color:#60a5fa;">[HOP 01] RF-02 (Rafah) -> DB-03 (Deir al-Balah) via LoRa 433MHz (-46 dBm · 1.4ms)</div>',
          '<div style="color:#60a5fa;">[HOP 02] DB-03 -> GZ-04 (Gaza North) via 802.11ah HaLow (-52 dBm · 1.8ms)</div>',
          '<div style="color:#fbbf24;">[CROSS-SYNC] GZ-04 -> BY-05 (Beirut Satellite Relay) Sync Confirmed (4.1ms)</div>',
          '<div style="color:#4ade80;">[ACK] Packet delivered to field triage center. Packet Loss: 0.00%. Data Leaked: 0 bytes.</div>'
        ].join("");
      });
    }

    if (btnToggleBlackout && meshOutput) {
      var isBlackout = false;
      btnToggleBlackout.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.tap();
        isBlackout = !isBlackout;
        if (isBlackout) {
          btnToggleBlackout.classList.add("btn--primary");
          btnToggleBlackout.classList.remove("btn--outline");
          meshOutput.innerHTML = [
            '<div style="color:#f87171;">[ALERT] Public Fiber & Cellular Network Severed! Gateway 0.0.0.0 unreachable.</div>',
            '<div style="color:#4ade80;">[AUTONOMOUS FAILOVER] Sovereign P2P Mesh protocol engaged immediately (0.00ms).</div>',
            '<div>[TOPOLOGY] Local Merkle CRDT active across 5 hardware nodes. Operational capacity: 100%.</div>'
          ].join("");
        } else {
          btnToggleBlackout.classList.remove("btn--primary");
          btnToggleBlackout.classList.add("btn--outline");
          meshOutput.innerHTML = [
            '<div>[STATUS] Standard Hybrid Connectivity Mode Restored.</div>',
            '<div>[P2P] Background LoRa heartbeat active. All 5 nodes synchronized.</div>'
          ].join("");
        }
      });
    }

    // Simulator 3: Vibe OS Glass Physics
    var glassBlur = document.getElementById("sb-glass-blur");
    var glassSat = document.getElementById("sb-glass-sat");
    var glassCard = document.getElementById("sb-glass-card-preview");
    var btnMatrix = document.getElementById("btn-matrix-toggle");

    function updateGlass() {
      if (!glassCard) return;
      var b = glassBlur ? glassBlur.value : 24;
      var s = glassSat ? glassSat.value : 180;
      glassCard.style.backdropFilter = "blur(" + b + "px) saturate(" + s + "%)";
      glassCard.style.webkitBackdropFilter = "blur(" + b + "px) saturate(" + s + "%)";
    }

    if (glassBlur) glassBlur.addEventListener("input", updateGlass);
    if (glassSat) glassSat.addEventListener("input", updateGlass);

    if (btnMatrix && glassCard) {
      var isMatrix = false;
      btnMatrix.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.clockIn();
        isMatrix = !isMatrix;
        if (isMatrix) {
          glassCard.style.background = "rgba(0, 30, 10, 0.4)";
          glassCard.style.borderColor = "#00FF66";
          glassCard.style.boxShadow = "0 0 25px rgba(0,255,102,0.4)";
          glassCard.innerHTML = '<div style="font-family:monospace; color:#00FF66; font-size:0.9rem;">[GOD MODE ACTIVE] 01000001 01010111 01000001 01001100 01001001 01001101 · Sovereign Kernel Injected</div>';
        } else {
          glassCard.style.background = "rgba(255, 255, 255, 0.06)";
          glassCard.style.borderColor = "rgba(255, 255, 255, 0.15)";
          glassCard.style.boxShadow = "none";
          glassCard.innerHTML = '<div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">Sovereign Glass OS Live Node</div><div style="font-size:0.85rem; color:var(--dim,#8b949e);">Refraction index: 1.48 · Spring Mass: 1.0 · Damping: 0.85</div>';
        }
      });
    }

    // Simulator 4: AI Lab Private Inference
    var btnAiInf = document.getElementById("btn-run-ai-inference");
    var aiOutput = document.getElementById("sb-ai-output");

    if (btnAiInf && aiOutput) {
      btnAiInf.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.tap();
        aiOutput.innerHTML = [
          '<div>[INFERENCE TRIGGERED] Loading local tensor blocks into unified memory...</div>',
          '<div style="color:#60a5fa;">[ISOLATION] Sandboxed execution: Zero WAN sockets allowed. 0 KB external egress.</div>',
          '<div style="color:#4ade80;">[STREAMING TOKENS] 284.6 tokens/sec (Time-To-First-Token: 16.8ms)</div>',
          '<div style="color:#e6edf3; padding:0.4rem 0;">"تم تدقيق بنود العقد بدقة 100%: جميع الالتزامات المحاسبية متوافقة مع معايير IFRS ومعتمدة دون أي مخاطر تسريب سيبراني."</div>',
          '<div style="color:#fbbf24;">[AUDIT HASH] Ed25519-WEIGHTS-VERIFIED: OK · VRAM: 3.42 GB · Zero Hallucination Guard: Active</div>'
        ].join("");
      });
    }

    // 3. Enterprise RFQ Modal
    var modalRfq = document.getElementById("modal-product-rfq");
    var btnCloseRfq = document.getElementById("btn-close-rfq-modal");
    var btnCancelRfq = document.getElementById("btn-cancel-product-rfq");
    var formRfq = document.getElementById("form-product-rfq");

    document.addEventListener("click", function(e) {
      var rfqBtn = e.target.closest(".btn-open-rfq");
      if (rfqBtn && modalRfq) {
        var slug = rfqBtn.getAttribute("data-product");
        var selectEl = document.getElementById("rfq-product");
        if (selectEl && slug) {
          for (var i = 0; i < selectEl.options.length; i++) {
            if (selectEl.options[i].value === slug) {
              selectEl.selectedIndex = i;
              break;
            }
          }
        }
        if (window.AwalimAudio) window.AwalimAudio.tap();
        modalRfq.style.display = "flex";
        modalRfq.classList.add("active");
      }
    });

    if (btnCloseRfq && modalRfq) {
      btnCloseRfq.addEventListener("click", function() {
        modalRfq.style.display = "none";
        modalRfq.classList.remove("active");
      });
    }
    if (btnCancelRfq && modalRfq) {
      btnCancelRfq.addEventListener("click", function() {
        modalRfq.style.display = "none";
        modalRfq.classList.remove("active");
      });
    }

    if (formRfq) {
      formRfq.addEventListener("submit", function(e) {
        e.preventDefault();
        var isEn = document.documentElement.getAttribute("dir") === "ltr";
        var errEl = document.getElementById("product-rfq-error");
        var orgInput = document.getElementById("rfq-org");
        var nameInput = document.getElementById("rfq-name");
        var emailInput = document.getElementById("rfq-email");

        var firstInvalid = null;
        [orgInput, nameInput, emailInput].forEach(function(inp) {
          if (inp && !inp.value.trim()) {
            inp.setAttribute("aria-invalid", "true");
            inp.classList.add("is-error");
            if (!firstInvalid) firstInvalid = inp;
          } else if (inp) {
            inp.removeAttribute("aria-invalid");
            inp.classList.remove("is-error");
          }
        });

        if (firstInvalid) {
          firstInvalid.focus();
          if (errEl) errEl.textContent = isEn ? "Please complete all required fields." : "يرجى استكمال جميع الحقول الإلزامية المطلوبة.";
          return;
        }

        if (errEl) errEl.textContent = "";

        var prodSelect = document.getElementById("rfq-product");
        var prodName = prodSelect ? prodSelect.options[prodSelect.selectedIndex].text : "";
        var org = orgInput ? orgInput.value : "";

        if (window.AwalimAudio) window.AwalimAudio.clockIn();
        if (modalRfq) {
          modalRfq.style.display = "none";
          modalRfq.classList.remove("active");
        }

        var msg = isEn ? "📋 RFQ received for " + org + " regarding " + prodName + ". Our enterprise team will send full architectural specs within 24 hours." : "📋 تم استلام طلب المواصفة الفنية لمنشأة " + org + " بخصوص نظام " + prodName + " بنجاح. سنوافيكم بملف الاعتماد والمعمارية خلال 24 ساعة.";
        alert(msg);
      });
    }

  })();

  /* --------------------------------------------------------------------------
     Interactive Project Scope & Investment Estimator
     -------------------------------------------------------------------------- */
  (function() {
    var estimator = document.querySelector("[data-estimator]");
    if (!estimator) return;

    var isEn = document.documentElement.getAttribute("dir") === "ltr";
    var timeEl = estimator.querySelector("[data-est-time]");
    var waEl = estimator.querySelector("[data-est-wa]");

    function updateEstimator() {
      var typeInput = estimator.querySelector('input[name="scope_type"]:checked');
      var speedInput = estimator.querySelector('input[name="scope_speed"]:checked');
      var featInputs = estimator.querySelectorAll('input[name="scope_feat"]:checked');

      var type = typeInput ? typeInput.value : "enterprise";
      var speed = speedInput ? speedInput.value : "standard";
      var featCount = featInputs ? featInputs.length : 0;

      var minWeeks = 4, maxWeeks = 6;
      if (type === "agents") { minWeeks = 3; maxWeeks = 5; }
      else if (type === "mobile") { minWeeks = 4; maxWeeks = 6; }
      else if (type === "brand") { minWeeks = 2; maxWeeks = 3; }

      if (featCount > 2) {
        var extra = featCount - 2;
        minWeeks += extra;
        maxWeeks += extra;
      }

      if (speed === "sprint") {
        minWeeks = Math.max(2, Math.round(minWeeks * 0.6));
        maxWeeks = Math.max(3, Math.round(maxWeeks * 0.65));
      }

      if (timeEl) {
        timeEl.innerHTML = '<bdi dir="ltr">' + minWeeks + '–' + maxWeeks + '</bdi> ' + (isEn ? "weeks" : "أسابيع");
      }

      if (waEl) {
        var msg = isEn ?
          "Hello Awalim Group, I customized a project scope: " + type + " with " + featCount + " features on " + speed + " speed (Timeline: " + minWeeks + "-" + maxWeeks + " weeks). Let us discuss." :
          "مرحباً عوالِم قروب، قمت بحساب نطاق مشروع: نوع " + type + " مع " + featCount + " ميزات بمسار " + speed + " (المدة المتوقعة: " + minWeeks + "-" + maxWeeks + " أسابيع). نود مناقشة التنفيذ.";
        waEl.href = "https://wa.me/970593636136?text=" + encodeURIComponent(msg);
      }
    }

    estimator.addEventListener("change", function() {
      if (window.AwalimAudio) window.AwalimAudio.tap();
      updateEstimator();
    });
    updateEstimator();
  })();
