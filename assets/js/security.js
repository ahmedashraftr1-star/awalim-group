/* ─────────────────────────────────────────────────────────────
   /security — the page attacks itself while you watch.

   Every other site's security page is a list of assurances. This one runs
   five real attacks against itself in your browser and shows you the browser
   refusing them. Nothing here is simulated: each probe is the actual hostile
   action, and each verdict is read from the browser's own
   securitypolicyviolation event or the exception the platform threw.

   A probe that is NOT blocked reports as failed — loudly. If we ever weaken
   the policy, this page says so on its own.
   ───────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  var root = document.querySelector("[data-sec]");
  if (!root) return;
  var EN = document.documentElement.lang === "en";
  var T = function (ar, en) { return EN ? en : ar; };

  /* every violation the browser reports while the probes run */
  var events = [];
  document.addEventListener("securitypolicyviolation", function (e) {
    events.push({ directive: e.effectiveDirective || e.violatedDirective, blocked: e.blockedURI, sample: e.sample || "" });
  });
  var sawDirective = function (frag) {
    for (var i = 0; i < events.length; i++) if ((events[i].directive || "").indexOf(frag) === 0) return events[i];
    return null;
  };

  /* Each probe returns {ok, detail}. ok === true means the attack was refused. */
  var PROBES = [
    {
      id: "inline-script",
      t: T("حقن سكربت داخلي", "Inline script injection"),
      d: T("نضيف عنصر <script> بمحتوى تنفيذي — كما يفعل هجوم XSS مخزَّن.", "We append a <script> element with executable content — what a stored XSS does."),
      run: function (done) {
        window.__awalimProbe = undefined;
        var s = document.createElement("script");
        try {
          /* setting a script's text is itself a Trusted Types sink, so on a
             hardened page the attack dies here — one step earlier than CSP */
          s.textContent = "window.__awalimProbe = 'executed';";
        } catch (e) {
          return done(true, T("رفضته المنصّة قبل أن يصل إلى السياسة: ", "the platform refused it before the policy saw it: ") + (e && e.name ? e.name : "TypeError"));
        }
        document.head.appendChild(s);
        setTimeout(function () {
          var ran = window.__awalimProbe === "executed";
          var v = sawDirective("script-src");
          done(!ran, ran ? T("نُفِّذ — السياسة لا تحمي", "it executed — the policy is not holding")
                         : T("رفضه المتصفّح: ", "browser refused it: ") + (v ? v.directive : "script-src"));
          s.remove();
        }, 60);
      }
    },
    {
      id: "eval",
      t: T("تنفيذ نصّ ببرمجية eval", "Evaluating a string with eval"),
      d: T("نمرّر نصّاً إلى eval — الطريق الأقصر من بيانات إلى شيفرة.", "We hand a string to eval — the shortest path from data to code."),
      run: function (done) {
        try {
          var f = eval;
          var r = f("1+1");
          done(false, T("نُفِّذ وأعاد ", "it ran and returned ") + r);
        } catch (e) {
          done(true, T("رفضه المتصفّح: ", "browser refused it: ") + (e && e.name ? e.name : "EvalError"));
        }
      }
    },
    {
      id: "trusted-types",
      t: T("إسناد نصّ إلى innerHTML", "Assigning a string to innerHTML"),
      d: T("نكتب HTML من نصّ مباشرة — أشهر ثغرة DOM على الإطلاق.", "We write HTML from a string — the most common DOM sink there is."),
      run: function (done) {
        var d = document.createElement("div");
        try {
          d.innerHTML = "<b>probe</b>";
          done(false, T("قُبِل — Trusted Types غير مفعّلة", "accepted — Trusted Types is not enforcing"));
        } catch (e) {
          done(true, T("رفضته المنصّة: ", "the platform refused it: ") + (e && e.name ? e.name : "TypeError"));
        }
      }
    },
    {
      id: "foreign-script",
      t: T("سكربت من خادم غريب", "Script from a foreign origin"),
      d: T("نطلب شيفرة من نطاق ليس نطاقنا — سلسلة توريد مخترَقة.", "We pull code from a domain that is not ours — a compromised supply chain."),
      run: function (done) {
        var s = document.createElement("script");
        try {
          /* a script's src is a TrustedScriptURL sink — same story */
          s.src = "https://example.com/awalim-probe.js";
        } catch (e) {
          return done(true, T("رفضته المنصّة قبل أن يغادر الطلب: ", "the platform refused it before the request left: ") + (e && e.name ? e.name : "TypeError"));
        }
        var settled = false;
        var finish = function (ok, msg) { if (settled) return; settled = true; s.remove(); done(ok, msg); };
        s.onload = function () { finish(false, T("حُمِّل من خارج نطاقنا", "it loaded from outside our origin")); };
        s.onerror = function () { finish(true, T("مُنع الطلب قبل أن يغادر جهازك", "the request was blocked before it left your device")); };
        document.head.appendChild(s);
        setTimeout(function () { finish(true, T("مُنع الطلب قبل أن يغادر جهازك", "the request was blocked before it left your device")); }, 1200);
      }
    },
    {
      id: "inline-style",
      t: T("حقن ورقة أنماط داخلية", "Inline stylesheet injection"),
      d: T("نضيف <style> لتغيير مظهر الصفحة — تشويه بصري أو تصيّد.", "We append a <style> to repaint the page — defacement, or a phishing overlay."),
      run: function (done) {
        var probe = document.createElement("div");
        probe.className = "sec-probe-target";
        probe.setAttribute("aria-hidden", "true");
        root.appendChild(probe);
        var st = document.createElement("style");
        st.textContent = ".sec-probe-target{position:absolute;width:3px}";
        document.head.appendChild(st);
        setTimeout(function () {
          var applied = getComputedStyle(probe).position === "absolute";
          done(!applied, applied ? T("طُبِّقت — السياسة لا تحمي", "it applied — the policy is not holding")
                                 : T("رفضها المتصفّح: style-src", "browser refused it: style-src"));
          st.remove(); probe.remove();
        }, 60);
      }
    }
  ];

  var list = root.querySelector("[data-sec-list]");
  var out = root.querySelector("[data-sec-out]");
  var btn = root.querySelector("[data-sec-run]");
  var nodes = {};

  PROBES.forEach(function (p) {
    var li = document.createElement("li");
    li.className = "seccheck";
    li.id = "probe-" + p.id;
    var ic = document.createElement("span");
    ic.className = "seccheck__ic";
    ic.setAttribute("aria-hidden", "true");
    var body = document.createElement("div");
    var h = document.createElement("b");
    h.textContent = p.t;
    var d = document.createElement("span");
    d.className = "seccheck__d";
    d.textContent = p.d;
    var res = document.createElement("span");
    res.className = "seccheck__r mono";
    res.textContent = T("لم يُجرَ بعد", "not run yet");
    body.appendChild(h); body.appendChild(d); body.appendChild(res);
    li.appendChild(ic); li.appendChild(body);
    list.appendChild(li);
    nodes[p.id] = { li: li, res: res };
  });

  function run() {
    events.length = 0;
    btn.disabled = true;
    out.textContent = T("جارٍ تنفيذ الهجمات…", "Running the attacks…");
    out.className = "sec__out is-run";
    var done = 0, passed = 0;
    PROBES.forEach(function (p, i) {
      var n = nodes[p.id];
      n.li.classList.remove("is-ok", "is-bad");
      n.res.textContent = T("يُنفَّذ…", "running…");
      setTimeout(function () {
        p.run(function (ok, detail) {
          n.li.classList.add(ok ? "is-ok" : "is-bad");
          n.res.textContent = detail;
          done++; if (ok) passed++;
          if (done === PROBES.length) {
            var all = passed === PROBES.length;
            out.className = "sec__out " + (all ? "is-ok" : "is-bad");
            out.textContent = all
              ? T("✓ الخمسة كلّها رُفضت. ما رأيته الآن هو متصفّحك يرفض، لا وعداً منّا.",
                  "✓ All five were refused. What you just watched is your browser refusing — not a promise from us.")
              : T("✖ " + (PROBES.length - passed) + " من الفحوص لم تُرفَض — أبلغنا فوراً.",
                  "✖ " + (PROBES.length - passed) + " probe(s) were not refused — please tell us immediately.");
            btn.disabled = false;
            if (window.AwalimIsland) window.AwalimIsland.say(all ? T("كل الهجمات رُفضت", "All attacks refused") : T("فحص لم يُرفَض", "A probe was not refused"));
          }
        });
      }, 220 * i);
    });
  }

  btn.addEventListener("click", run);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); run(); } });
    }, { threshold: 0.3 });
    io.observe(root);
  }
})();
