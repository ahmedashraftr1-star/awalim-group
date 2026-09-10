/* ==========================================================================
   AWALIM — core behaviours (no dependencies, ~6KB).
   theme · pill nav · drawer · reveal/stagger · count-up · accordion ·
   filters · scroll-spy side index · multi-step brief form · year.
   Everything degrades: without JS the page is fully readable.
   ========================================================================== */
(function () {
  "use strict";
  /* Build nodes, never markup. Every string that reaches the DOM goes in as a
     text node, so no sanitiser stands between visitor input and a parser —
     which is what lets the CSP set `require-trusted-types-for 'script'`. */
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  var root = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- language ----------
     The page declares its own language; every runtime string picks the
     matching side of T(arabic, english) so the two mirrors never drift. */
  var EN = document.documentElement.lang === "en";
  var T = function (ar, en) { return EN ? en : ar; };
  window.AwalimT = T;

  /* ---------- theme: system default, saved choice wins ---------- */
  function applyTheme(t, save) {
    root.setAttribute("data-theme", t);
    if (save) { try { localStorage.setItem("awalim-theme", t); root.setAttribute("data-theme-saved", ""); } catch (_) {} }
    $$("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
      b.setAttribute("aria-label", t === "dark" ? T("التبديل إلى الوضع النهاري", "Switch to light mode") : T("التبديل إلى الوضع الليلي", "Switch to dark mode"));
    });
  }
  applyTheme(root.getAttribute("data-theme") || "light", false);
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
    say(next === "dark" ? T("الوضع الليلي", "Dark mode") : T("الوضع النهاري", "Light mode"));
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!root.hasAttribute("data-theme-saved")) applyTheme(e.matches ? "dark" : "light", false);
  });

  /* ---------- dynamic island: one surface for every live notification ---------- */
  var island = $("[data-island]"), islandTimer = null;
  var CHECK = "M20 6L9 17l-5-5";
  /* icons are our own path data, built as SVG nodes rather than parsed from a
     string, so this stays a sink-free file */
  var svgNode = function (d) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  };
  function say(text, icon, ms) {
    if (!island) return;
    $(".island__t", island).textContent = text;
    var ic = $(".island__ic", island);
    ic.replaceChildren(svgNode(icon || CHECK));
    island.classList.remove("is-on"); void island.offsetWidth;
    island.classList.add("is-on");
    clearTimeout(islandTimer);
    islandTimer = setTimeout(function () { island.classList.remove("is-on"); }, ms || 2600);
  }
  window.AwalimIsland = { say: say };
  document.addEventListener("awalim:notify", function (e) { say(e.detail.text, e.detail.icon, e.detail.ms); });

  /* ---------- service worker: instant repeat visits, offline fallback ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    addEventListener("load", function () {
      /* register() takes a TrustedScriptURL under require-trusted-types-for, and
         `trusted-types 'none'` would leave no way to make one — so the policy is
         named instead, and can mint exactly one URL and throw on everything
         else. The guarantee an attacker faces is unchanged: no attacker-chosen
         string can ever become a script URL. */
      var url = "/sw.js";
      try {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
          url = window.trustedTypes.createPolicy("awalim-sw", {
            createScriptURL: function (u) { if (u !== "/sw.js") throw new TypeError("only /sw.js"); return u; }
          }).createScriptURL("/sw.js");
        }
      } catch (e) { return; }
      navigator.serviceWorker.register(url).catch(function () {});
    });
  }

  /* ---------- pill nav shrink ---------- */
  var nav = $("[data-nav]");
  if (nav) {
    var stuck = null;
    var onNav = function () {
      var s = window.scrollY > 24;
      if (s !== stuck) { stuck = s; nav.setAttribute("data-stuck", s ? "true" : "false"); }
    };
    onNav();
    addEventListener("scroll", onNav, { passive: true });
  }

  /* ---------- drawer (focus-trapped) ---------- */
  var drawer = $("#drawer"), lastFocus = null;
  function focusables(el) {
    return $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', el).filter(function (n) { return n.offsetParent !== null; });
  }
  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute("data-open", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    $$("[data-drawer-open]").forEach(function (b) { b.setAttribute("aria-expanded", open ? "true" : "false"); });
    if (open) { lastFocus = document.activeElement; var f = focusables(drawer); if (f.length) f[0].focus(); }
    else if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-drawer-open]")) return setDrawer(true);
    if (e.target.closest("[data-drawer-close]")) return setDrawer(false);
    if (drawer && drawer.getAttribute("data-open") === "true" && e.target.closest(".drawer__nav a")) setDrawer(false);
  });
  document.addEventListener("keydown", function (e) {
    if (!drawer || drawer.getAttribute("data-open") !== "true") return;
    if (e.key === "Escape") return setDrawer(false);
    if (e.key !== "Tab") return;
    var f = focusables(drawer); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- reveal + stagger ---------- */
  $$("[data-stagger]").forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty("--i", String(i)); });
  });
  var rv = $$(".rv, [data-stagger]");
  if (reduced || !("IntersectionObserver" in window)) rv.forEach(function (el) { el.classList.add("in"); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up (skips the live cockpit numbers; motion.js owns those) ---------- */
  var counters = $$("[data-count]:not([data-count-live])");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0, dur = 1300, t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toLocaleString("en-US");
    };
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (reduced || !("IntersectionObserver" in window)) counters.forEach(function (el) { el.textContent = (+el.getAttribute("data-count")).toLocaleString("en-US"); });
    else {
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { cio.unobserve(en.target); runCount(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { el.textContent = "0"; cio.observe(el); });
    }
  }

  /* ---------- accordion: animated height, native <details> semantics kept ---------- */
  document.addEventListener("click", function (e) {
    var q = e.target.closest(".acc__q"); if (!q) return;
    var it = q.parentElement; e.preventDefault();
    if (it.open) {
      it.classList.remove("is-open");
      var a = $(".acc__a", it);
      var done = function () { it.open = false; a.removeEventListener("transitionend", done); };
      if (reduced) done(); else a.addEventListener("transitionend", done);
    } else {
      it.open = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () { it.classList.add("is-open"); }); });
    }
  });

  /* ---------- filters (works without JS: everything visible) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var grid = document.getElementById(group.getAttribute("data-filter-group")); if (!grid) return;
    var pills = $$("[data-filter]", group), live = $("[data-filter-count]", group), items = $$("[data-cat]", grid);
    function apply(v) {
      var shown = 0;
      items.forEach(function (t) {
        var ok = v === "all" || (" " + t.getAttribute("data-cat") + " ").indexOf(" " + v + " ") > -1;
        t.hidden = !ok; if (ok) shown++;
      });
      pills.forEach(function (p) { p.setAttribute("aria-pressed", p.getAttribute("data-filter") === v ? "true" : "false"); });
      if (live) live.textContent = EN ? shown + " of " + items.length : shown + " من " + items.length;
    }
    group.addEventListener("click", function (e) { var p = e.target.closest("[data-filter]"); if (p) apply(p.getAttribute("data-filter")); });
    apply("all");
  });

  /* ---------- scroll-spy side index with moving indicator ----------
     Midpoint rule: the current section is the last one whose top has crossed
     the viewport midpoint. Total order → no flicker inside tall sections. */
  $$("[data-spy]").forEach(function (rail) {
    var links = $$('a[href^="#"]', rail);
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); });
    var bar = $(".sideidx__bar", rail), cur = null;
    if (!links.length) return;
    function mark() {
      var mid = innerHeight * 0.45, best = -1;
      for (var i = 0; i < targets.length; i++) {
        if (!targets[i]) continue;
        var r = targets[i].getBoundingClientRect();
        if (r.top <= mid) best = i;
      }
      if (best === cur) return;
      cur = best;
      links.forEach(function (a, i) { a.setAttribute("aria-current", i === best ? "true" : "false"); });
      if (bar) {
        if (best < 0) { bar.style.blockSize = "0px"; return; }
        var a = links[best];
        bar.style.setProperty("--y", (a.offsetTop) + "px");
        bar.style.blockSize = a.offsetHeight + "px";
      }
    }
    var tick = false;
    var onS = function () { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; mark(); }); };
    addEventListener("scroll", onS, { passive: true });
    addEventListener("resize", onS, { passive: true });
    mark();
  });

  /* ---------- multi-step brief form ----------
     Nothing leaves the device: submit builds a WhatsApp / mailto URL. */
  var form = $("[data-msf]");
  if (form) {
    var steps = $$(".msf__step", form), labels = $$("[data-msf-label]", form);
    var prev = $("[data-msf-prev]", form), next = $("[data-msf-next]", form), submit = $("[data-msf-submit]", form), mail = $("[data-msf-mail]", form);
    var bar = $("[data-msf-bar]", form), live = $("[data-msf-live]", form), review = $("[data-msf-review]", form), summary = $("[data-msf-summary]", form), status = $("[data-msf-status]", form);
    var cur = 0, WA = "970593636136", MAIL = "hello@awalimgroup.com";

    function setErr(name, on) {
      var err = $('[data-err-for="' + name + '"]', form); if (err) err.hidden = !on;
      var f = form.elements[name]; var field = f && f.closest ? f.closest(".field") : null;
      if (field) field.classList.toggle("is-invalid", !!on);
    }
    function validate(i) {
      var ok = true;
      if (i === 0) { if (!form.querySelector('input[name="scope"]:checked')) { setErr("scope", true); ok = false; } else setErr("scope", false); }
      if (i === 2) { var m = form.elements.message; if (!m.value || m.value.trim().length < 20) { setErr("message", true); ok = false; } else setErr("message", false); }
      if (i === 3) {
        var n = form.elements.name, em = form.elements.email;
        if (!n.value || n.value.trim().length < 2) { setErr("name", true); ok = false; } else setErr("name", false);
        if (!em.value || !em.checkValidity()) { setErr("email", true); ok = false; } else setErr("email", false);
      }
      return ok;
    }
    function data() {
      var d = new FormData(form);
      return { scope: d.get("scope") || "—", budget: d.get("budget") || "—", timeline: d.get("timeline") || "—", message: d.get("message") || "—", company: d.get("company") || "—", name: d.get("name") || "—", email: d.get("email") || "—", phone: d.get("phone") || "—" };
    }
    function text() {
      var d = data();
      return EN
        ? ["New project request — awalimgroup.com", "", "Name: " + d.name, "Company: " + d.company, "Email: " + d.email, "WhatsApp: " + d.phone, "Project type: " + d.scope, "Budget: " + d.budget, "Start: " + d.timeline, "", "Details:", d.message].join("\n")
        : ["طلب مشروع جديد — awalimgroup.com", "", "الاسم: " + d.name, "الشركة: " + d.company, "البريد: " + d.email, "واتساب: " + d.phone, "نوع المشروع: " + d.scope, "الميزانية: " + d.budget, "البدء: " + d.timeline, "", "التفاصيل:", d.message].join("\n");
    }
    function renderSummary() {
      var d = data(), rows = EN
        ? [["Project type", d.scope], ["Budget", d.budget], ["Start", d.timeline], ["Company", d.company], ["Details", d.message]]
        : [["نوع المشروع", d.scope], ["الميزانية", d.budget], ["البدء", d.timeline], ["الشركة", d.company], ["التفاصيل", d.message]];
      /* what the visitor typed, as text nodes — the hand-rolled escape this
         replaced was correct, but correct-by-construction beats correct-so-far */
      summary.replaceChildren.apply(summary, rows.map(function (r) {
        var wrap = el("div");
        wrap.appendChild(el("dt", "", r[0]));
        wrap.appendChild(el("dd", "", String(r[1])));
        return wrap;
      }));
      review.hidden = false;
    }
    function go(i, initial) {
      steps[cur].hidden = true; steps[cur].classList.remove("is-enter");
      cur = i; steps[cur].hidden = false; if (!reduced) steps[cur].classList.add("is-enter");
      labels.forEach(function (l, k) { l.classList.toggle("is-on", k === cur); l.classList.toggle("is-done", k < cur); });
      bar.style.setProperty("--p", String((cur + 1) / steps.length));
      prev.hidden = cur === 0; next.hidden = cur === steps.length - 1; submit.hidden = cur !== steps.length - 1; mail.hidden = cur !== steps.length - 1;
      if (cur === steps.length - 1) renderSummary();
      live.textContent = EN ? "Step " + (cur + 1) + " of " + steps.length : "الخطوة " + (cur + 1) + " من " + steps.length;
      if (initial) return;                       // never move the page on load
      var first = $("input, textarea, select", steps[cur]); if (first) first.focus({ preventScroll: true });
      steps[cur].scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
    }
    next.addEventListener("click", function () { if (validate(cur)) go(cur + 1); });
    prev.addEventListener("click", function () { go(cur - 1); });
    form.addEventListener("input", function (e) { if (e.target.name) setErr(e.target.name, false); });
    form.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && cur < steps.length - 1) { e.preventDefault(); next.click(); } });
    mail.addEventListener("click", function (e) { if (!validate(3)) { e.preventDefault(); return; } mail.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent("طلب مشروع — " + data().name) + "&body=" + encodeURIComponent(text()); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(3)) return;
      /* explicit confirmation before anything leaves the page (section 6.10 security note) */
      if (!confirm(T("سيُفتح واتساب برسالة مُعبّأة بتفاصيل طلبك. هل تريد المتابعة؟", "WhatsApp will open with a message pre-filled with your request. Continue?"))) return;
      status.hidden = false; status.textContent = T("جارٍ فتح واتساب بتفاصيل طلبك…", "Opening WhatsApp with your request…");
      say(T("جارٍ فتح واتساب بتفاصيل طلبك", "Opening WhatsApp with your request"));
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(text()), "_blank", "noopener");
    });
    go(0, true);
  }

  /* ---------- copy-to-clipboard (press kit) ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var src = $(b.getAttribute("data-copy")); if (!src) return;
    var txt = src.textContent.trim();
    var done = function () {
      say(T("نُسخ", "Copied"));
      var label = $("span", b); if (!label) return;
      var old = label.textContent; label.textContent = T("نُسخ ✓", "Copied ✓");
      setTimeout(function () { label.textContent = old; }, 1600);
    };
    /* الاحتياطي يعمل حين يرفض الـAPI، لا حين يغيب فقط: على اتصال غير آمن أو
       بصلاحية حافظة مرفوضة، كان الوعد يُرفض ويبتلعه catch فارغ — فيُنقر الزرّ
       ولا يحدث شيء ولا تُقال كلمة. والفشل الصامت أسوأ من الفشل. */
    var legacy = function () {
      var ta = document.createElement("textarea");
      ta.value = txt; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.insetBlockStart = "-9999px"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(ta);
      if (ok) done(); else say(T("تعذّر النسخ — حدّد النصّ وانسخه يدوياً", "Copy failed — select the text and copy it"));
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(legacy);
    else legacy();
  });

  /* ---------- misc ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-scroll-top]")) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }
  });
})();
