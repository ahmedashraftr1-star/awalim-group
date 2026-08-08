/* ==========================================================================
   AWALIM GROUP — progressive enhancement
   No dependencies. Everything degrades gracefully without JS.
   ========================================================================== */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0A0B0D" : "#FAF9F6");
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-theme-toggle]");
    if (!t) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("awalim-theme", next); } catch (_) {}
    t.setAttribute("aria-label", next === "light" ? "التبديل إلى الوضع الليلي" : "التبديل إلى الوضع النهاري");
  });

  /* ---------- sticky header ---------- */
  var hdr = document.querySelector(".hdr");
  if (hdr) {
    var onScroll = function () {
      hdr.setAttribute("data-stuck", window.scrollY > 8 ? "true" : "false");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile drawer (focus-trapped) ---------- */
  var drawer = document.getElementById("drawer");
  var lastFocus = null;

  function focusables(el) {
    return Array.prototype.filter.call(
      el.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'),
      function (n) { return n.offsetParent !== null; }
    );
  }

  function setDrawer(open) {
    if (!drawer) return;
    drawer.setAttribute("data-open", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    document.querySelectorAll("[data-drawer-open]").forEach(function (b) {
      b.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (open) {
      lastFocus = document.activeElement;
      var f = focusables(drawer);
      if (f.length) f[0].focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-drawer-open]")) { setDrawer(true); return; }
    if (e.target.closest("[data-drawer-close]")) { setDrawer(false); return; }
    if (drawer && drawer.getAttribute("data-open") === "true" && e.target.closest(".drawer__nav a")) {
      setDrawer(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!drawer || drawer.getAttribute("data-open") !== "true") return;
    if (e.key === "Escape") { setDrawer(false); return; }
    if (e.key !== "Tab") return;
    var f = focusables(drawer);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll(".rv");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- count-up ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target;
          cio.unobserve(el);
          var target = parseFloat(el.getAttribute("data-count")) || 0;
          var dur = 1150, t0 = null;
          var step = function (ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("en-US");
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString("en-US");
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { el.textContent = "0"; cio.observe(el); });
    }
  }

  /* ---------- contact form → WhatsApp / mail (no backend required) ---------- */
  var form = document.getElementById("brief-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lines = [
        "طلب مشروع جديد — awalimgroup.com",
        "",
        "الاسم: " + (d.get("name") || "—"),
        "الشركة: " + (d.get("company") || "—"),
        "البريد: " + (d.get("email") || "—"),
        "نوع المشروع: " + (d.get("scope") || "—"),
        "الميزانية: " + (d.get("budget") || "—"),
        "",
        "التفاصيل:",
        (d.get("message") || "—")
      ];
      var text = encodeURIComponent(lines.join("\n"));
      var status = document.getElementById("brief-status");
      if (status) {
        status.hidden = false;
        status.textContent = "جارٍ فتح واتساب بتفاصيل طلبك…";
      }
      window.open("https://wa.me/970593636136?text=" + text, "_blank", "noopener");
    });
  }


  /* ---------- tile filtering (works without JS: everything visible) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var pills = group.querySelectorAll("[data-filter]");
    var gridId = group.getAttribute("data-filter-group");
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var live = group.querySelector("[data-filter-count]");
    var tiles = grid.querySelectorAll("[data-cat]");

    function apply(value) {
      var shown = 0;
      tiles.forEach(function (t) {
        var match = value === "all" || (" " + t.getAttribute("data-cat") + " ").indexOf(" " + value + " ") > -1;
        t.hidden = !match;
        if (match) shown++;
      });
      pills.forEach(function (p) {
        p.setAttribute("aria-pressed", p.getAttribute("data-filter") === value ? "true" : "false");
      });
      if (live) live.textContent = shown + " من " + tiles.length;
    }

    group.addEventListener("click", function (e) {
      var p = e.target.closest("[data-filter]");
      if (p) apply(p.getAttribute("data-filter"));
    });
    apply("all");
  });


  /* ---------- rail scroll-spy (reference highlights the current case) ---------- */
  var rail = document.querySelector("[data-spy-rail]");
  if (rail && "IntersectionObserver" in window) {
    var links = Array.prototype.slice.call(rail.querySelectorAll('a[href^="#"]'));
    var targets = links
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);

    if (targets.length) {
      var visible = new Map();
      var mark = function () {
        var best = null, bestRatio = 0;
        visible.forEach(function (ratio, id) {
          if (ratio > bestRatio) { bestRatio = ratio; best = id; }
        });
        links.forEach(function (a) {
          var on = best && a.getAttribute("href") === "#" + best;
          a.setAttribute("aria-current", on ? "true" : "false");
        });
      };
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) visible.set(en.target.id, en.intersectionRatio);
          else visible.delete(en.target.id);
        });
        mark();
      }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -55% 0px" });
      targets.forEach(function (t) { spy.observe(t); });
    }
  }

  /* ---------- current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
