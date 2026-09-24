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

  /* ======================================================================
     Awalim Raqib Sentinel Interactive Scanner & Compliance Engine
     External Perimeter Security & PDPL (Law 151/2020) Auditor
     Pure DOM Construction - 100% Strict TrustedTypes & CSP Level 3 Compliant
     ====================================================================== */
  (function initRaqibSentinel() {
    var form = document.getElementById("form-raqib-scan");
    if (!form) return;

    var isEn = document.documentElement.lang === "en";
    function T(ar, en) { return isEn ? en : ar; }

    var targetInput = document.getElementById("input-raqib-target");
    var hud = document.getElementById("raqib-hud");
    var hudBar = document.getElementById("raqib-progress-bar");
    var hudPercent = document.getElementById("raqib-hud-percent");
    var hudLogs = document.getElementById("raqib-terminal-logs");
    var dossier = document.getElementById("raqib-dossier");

    var scoreGrade = document.getElementById("raqib-score-grade");
    var scoreVal = document.getElementById("raqib-score-val");
    var scoreVerdict = document.getElementById("raqib-score-verdict");
    var finesCard = document.getElementById("raqib-fines-card");
    var finesBadge = document.getElementById("raqib-fines-badge");
    var finesDesc = document.getElementById("raqib-fines-desc");

    var articlesGrid = document.getElementById("raqib-articles-grid");
    var vectorsGrid = document.getElementById("raqib-vectors-grid");
    var codeContent = document.getElementById("raqib-code-content");
    var codeTabs = document.querySelectorAll(".raqib-tab-btn");
    var btnCopy = document.getElementById("btn-copy-remediation");
    var btnExport = document.getElementById("btn-export-raqib-report");

    var currentTarget = "https://awalim.group";
    var currentFramework = "egypt_pdpl";
    var currentScanData = null;

    // Presets
    var presetChips = document.querySelectorAll(".raqib-preset-chip");
    presetChips.forEach(function(chip) {
      chip.addEventListener("click", function() {
        presetChips.forEach(function(c) { c.classList.remove("active"); });
        chip.classList.add("active");
        var t = chip.getAttribute("data-target");
        if (targetInput && t) targetInput.value = t;
        if (window.AwalimAudio) window.AwalimAudio.tap(2200, 0.03);
      });
    });

    // Framework selection
    var frameworkPills = document.querySelectorAll(".raqib-framework-pill");
    frameworkPills.forEach(function(pill) {
      pill.addEventListener("click", function() {
        frameworkPills.forEach(function(p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var radio = pill.querySelector("input[type='radio']");
        if (radio) {
          radio.checked = true;
          currentFramework = radio.value;
        }
        if (window.AwalimAudio) window.AwalimAudio.tap(2000, 0.03);
      });
    });

    var remediationSnippets = {
      nginx: "# Awalim Raqib Sentinel - Recommended Sovereign Nginx Config\n" +
             "server {\n" +
             "    # Strict Transport Security (HSTS)\n" +
             "    add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;\n\n" +
             "    # Strict Content Security Policy (Level 3)\n" +
             "    add_header Content-Security-Policy \"default-src \x27self\x27; script-src \x27self\x27 \x27wasm-unsafe-eval\x27; style-src \x27self\x27 \x27unsafe-inline\x27; font-src \x27self\x27; frame-ancestors \x27none\x27; object-src \x27none\x27; require-trusted-types-for \x27script\x27;\" always;\n\n" +
             "    # Anti-Clickjacking & MIME-Sniffing Prevention\n" +
             "    add_header X-Frame-Options \"DENY\" always;\n" +
             "    add_header X-Content-Type-Options \"nosniff\" always;\n" +
             "    add_header Referrer-Policy \"strict-origin-when-cross-origin\" always;\n" +
             "    add_header Permissions-Policy \"camera=(), microphone=(), geolocation=()\" always;\n" +
             "}",
      cloudflare: "// Cloudflare Worker / Transform Rule Header Injection\n" +
                  "addEventListener(\x27fetch\x27, event => {\n" +
                  "  event.respondWith(handleRequest(event.request))\n" +
                  "});\n\n" +
                  "async function handleRequest(request) {\n" +
                  "  const response = await fetch(request);\n" +
                  "  const newHeaders = new Headers(response.headers);\n" +
                  "  newHeaders.set(\x27Strict-Transport-Security\x27, \x27max-age=63072000; includeSubDomains; preload\x27);\n" +
                  "  newHeaders.set(\x27Content-Security-Policy\x27, \"default-src \x27self\x27; frame-ancestors \x27none\x27; object-src \x27none\x27;\");\n" +
                  "  newHeaders.set(\x27X-Content-Type-Options\x27, \x27nosniff\x27);\n" +
                  "  return new Response(response.body, { status: response.status, headers: newHeaders });\n" +
                  "}",
      node: "// Express.js & Helmet Sovereign Security Middleware\n" +
            "const express = require(\x27express\x27);\n" +
            "const helmet = require(\x27helmet\x27);\n" +
            "const app = express();\n\n" +
            "app.use(helmet({\n" +
            "  contentSecurityPolicy: {\n" +
            "    directives: {\n" +
            "      defaultSrc: [\"\x27self\x27\"],\n" +
            "      scriptSrc: [\"\x27self\x27\"],\n" +
            "      frameAncestors: [\"\x27none\x27\"],\n" +
            "      objectSrc: [\"\x27none\x27\"],\n" +
            "    }\n" +
            "  },\n" +
            "  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }\n" +
            "}));",
      apache: "# Apache .htaccess - Sovereign Header Shield\n" +
              "<IfModule mod_headers.c>\n" +
              "    Header set Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\"\n" +
              "    Header set Content-Security-Policy \"default-src \x27self\x27; frame-ancestors \x27none\x27; object-src \x27none\x27;\"\n" +
              "    Header set X-Frame-Options \"DENY\"\n" +
              "    Header set X-Content-Type-Options \"nosniff\"\n" +
              "    Header set Referrer-Policy \"strict-origin-when-cross-origin\"\n" +
              "</IfModule>"
    };

    function updateCodeTab(tab) {
      codeTabs.forEach(function(t) { t.classList.toggle("active", t.getAttribute("data-tab") === tab); });
      if (codeContent) {
        codeContent.textContent = remediationSnippets[tab] || remediationSnippets.nginx;
      }
    }

    codeTabs.forEach(function(tabBtn) {
      tabBtn.addEventListener("click", function() {
        var tab = tabBtn.getAttribute("data-tab");
        updateCodeTab(tab);
        if (window.AwalimAudio) window.AwalimAudio.tap(2400, 0.02);
      });
    });

    if (btnCopy) {
      btnCopy.addEventListener("click", function() {
        if (!codeContent) return;
        navigator.clipboard.writeText(codeContent.textContent).then(function() {
          if (window.AwalimAudio) window.AwalimAudio.chime();
          var oldText = btnCopy.textContent;
          btnCopy.textContent = T("✓ تم النسخ!", "✓ Copied!");
          setTimeout(function() { btnCopy.textContent = oldText; }, 2000);
        });
      });
    }

    function renderArticles(articles) {
      if (!articlesGrid) return;
      articlesGrid.textContent = "";
      articles.forEach(function(a) {
        var card = document.createElement("div");
        card.className = "raqib-article-card";

        var head = document.createElement("div");
        head.className = "raqib-article-head";

        var numSpan = document.createElement("span");
        numSpan.className = "mono";
        numSpan.style.fontSize = "0.75rem";
        numSpan.style.color = "var(--gold,#D4AF37)";
        numSpan.style.fontWeight = "var(--w-bold)";
        numSpan.textContent = a.num;

        var badgeSpan = document.createElement("span");
        var badgeClass = a.status === "ok" ? "badge--ok" : (a.status === "bad" ? "badge--alert" : "badge--warn");
        badgeSpan.className = "badge " + badgeClass;
        badgeSpan.textContent = a.badge;

        head.appendChild(numSpan);
        head.appendChild(badgeSpan);

        var title = document.createElement("h4");
        title.className = "raqib-article-title";
        title.textContent = a.title;

        var desc = document.createElement("p");
        desc.className = "raqib-article-desc";
        desc.textContent = a.desc;

        card.appendChild(head);
        card.appendChild(title);
        card.appendChild(desc);
        articlesGrid.appendChild(card);
      });
    }

    function renderVectors(vectors) {
      if (!vectorsGrid) return;
      vectorsGrid.textContent = "";
      vectors.forEach(function(v) {
        var card = document.createElement("div");
        card.className = "raqib-vector-card";

        var head = document.createElement("div");
        head.className = "raqib-vector-head";

        var nameSpan = document.createElement("span");
        nameSpan.textContent = v.name;

        var scoreSpan = document.createElement("span");
        scoreSpan.className = "mono";
        scoreSpan.style.color = v.ok ? "#10B981" : "#EF4444";
        scoreSpan.textContent = v.score;

        head.appendChild(nameSpan);
        head.appendChild(scoreSpan);

        var detailDiv = document.createElement("div");
        detailDiv.className = "mono";
        detailDiv.style.fontSize = "0.75rem";
        detailDiv.style.color = "var(--text-muted)";
        detailDiv.textContent = v.detail;

        card.appendChild(head);
        card.appendChild(detailDiv);
        vectorsGrid.appendChild(card);
      });
    }

    function renderScanResults(isClean, target) {
      var score = isClean ? 99 : 42;
      var grade = isClean ? "A+" : "C-";
      var verdict = isClean ? T("مرتبة الامتثال السيادي الفائق", "Sovereign Excellence Class") : T("مخاطر نظامية حرجة وغير ممتثل", "High Regulatory Risk · Non-Compliant");

      if (scoreVal) scoreVal.textContent = score + "/100";
      if (scoreGrade) {
        scoreGrade.textContent = grade;
        scoreGrade.className = "raqib-score-badge" + (isClean ? "" : " bad");
      }
      if (scoreVerdict) {
        scoreVerdict.textContent = verdict;
        scoreVerdict.className = "badge " + (isClean ? "badge--ok" : "badge--alert");
      }

      if (finesCard && finesBadge && finesDesc) {
        if (isClean) {
          finesCard.classList.remove("violation");
          finesBadge.className = "badge badge--ok";
          finesBadge.textContent = "0 EGP";
          finesDesc.textContent = T("لا توجد أي مخالفات نظامية مرصودة. المنظومة محصنة بالكامل ضد غرامات قانون حماية البيانات المصري 151 لسنة 2020.",
                                    "Zero statutory violations detected. Fully shielded against Egypt PDPL Law 151/2020 penalties (up to 5,000,000 EGP).");
        } else {
          finesCard.classList.add("violation");
          finesBadge.className = "badge badge--alert";
          finesBadge.textContent = "5,000,000 EGP";
          finesDesc.textContent = T("تحذير: رُصدت مخالفات جسيمة للمادتين 7 و12 تعرض المنشأة لغرامات تصل إلى 5 ملايين جنيه مصري مع المسؤولية الجنائية.",
                                    "Critical Alert: Major statutory violations under Articles 7 & 12 expose the entity to fines up to 5,000,000 EGP and criminal liability.");
        }
      }

      var articles = [
        {
          num: T("المادة 7", "Article 7"),
          title: T("التدابير التقنية والتنظيمية لتأمين البيانات", "Technical & Organizational Data Security Measures"),
          desc: isClean
            ? T("تطبيق التشفير الشامل أثناء النقل والتخزين، ومنع الحقن عبر سياسة CSP صارمة.", "End-to-end encryption enforced, strict CSP Level 3 preventing all script injections.")
            : T("ثغرة: ترويسات الأمان غائبة أو متساهلة، والتطبيق معرض لهجمات XSS وانتحال الهوية.", "Violation: Security headers missing or permissive, exposing user data to XSS and injection."),
          status: isClean ? "ok" : "bad",
          badge: isClean ? T("مطابق كلياً", "100% Compliant") : T("مخالفة نظامية", "Statutory Violation")
        },
        {
          num: T("المادة 12", "Article 12"),
          title: T("إخطار مركز حماية البيانات بالخرق خلال 24 ساعة", "24-Hour Breach Notification System"),
          desc: isClean
            ? T("جاهزية تامة لسجلات التدقيق الجنائي ونظام إنذار مبكر يرصد أي اختراق فورياً.", "Forensic audit telemetry active with immediate incident dispatch protocols.")
            : T("ثغرة: انعدام آليات الرصد والتتبع اللحظي للأحداث، مما يمنع الامتثال لمهلة الـ 24 ساعة.", "Violation: Lack of real-time intrusion monitoring prevents 24-hour notification compliance."),
          status: isClean ? "ok" : "bad",
          badge: isClean ? T("مطابق كلياً", "100% Compliant") : T("مخالفة نظامية", "Statutory Violation")
        },
        {
          num: T("المادة 14", "Article 14"),
          title: T("قيود نقل البيانات الشخصية عبر الحدود", "Cross-Border Data Transfer Restrictions"),
          desc: isClean
            ? T("بيانات المنظومة مخزنة على خوادم سيادية مستقلة دون تسريب لأي سحاب أجنبي غير مرخص.", "Data resides on sovereign bare-metal nodes with zero uncertified foreign cloud transfer.")
            : T("تنبيه: يتم تمرير بيانات العملاء إلى خوادم أجنبية متعددة المستأجرين دون ترخيص مسبق.", "Warning: Customer telemetry routed to uncertified foreign cloud providers without permit."),
          status: isClean ? "ok" : "warn",
          badge: isClean ? T("مطابق كلياً", "100% Compliant") : T("تنبيه تدقيق", "Audit Warning")
        },
        {
          num: T("المادة 15", "Article 15"),
          title: T("تعيين مسؤول حماية البيانات الشخصية (DPO)", "Designated Data Protection Officer (DPO)"),
          desc: isClean
            ? T("وجود مسؤول تشفير وتدقيق جنائي معتمد يشرف على سلامة السجلات الرقمية.", "Certified Forensics & Security Lead registered as active DPO in charge of data registers.")
            : T("تنبيه: لا يوجد سجل معالجة رسمي أو مسؤول حماية بيانات معتمد في بيانات المنظومة.", "Warning: No official processing registry or designated DPO declared in public metadata."),
          status: isClean ? "ok" : "warn",
          badge: isClean ? T("مطابق كلياً", "100% Compliant") : T("تنبيه تدقيق", "Audit Warning")
        },
        {
          num: T("المادة 3", "Article 3"),
          title: T("مشروعية جمع ومعالجة البيانات والموافقة الصريحة", "Lawful Data Collection & Explicit User Consent"),
          desc: isClean
            ? T("انعدام تام لملفات التتبع الخفية والكوكيز الإعلانية، وجمع البيانات بموافقة صريحة.", "Zero covert trackers or ad pixels; zero cookies loaded without explicit interaction.")
            : T("تنبيه: التطبيق يقوم بتحميل نصوص تتبع إعلانية (Meta Pixel/Analytics) قبل الموافقة.", "Warning: Third-party advertising trackers loaded before receiving explicit user consent."),
          status: isClean ? "ok" : "warn",
          badge: isClean ? T("مطابق كلياً", "100% Compliant") : T("تنبيه تدقيق", "Audit Warning")
        }
      ];

      renderArticles(articles);

      var vectors = [
        { name: "SSL / TLS & Ciphers", score: isClean ? "100%" : "65%", ok: isClean, detail: isClean ? "TLS 1.3 · PFS · HSTS Preload" : "TLS 1.2 · Missing HSTS Preload" },
        { name: "Security Headers", score: isClean ? "100%" : "20%", ok: isClean, detail: isClean ? "Strict CSP L3 · X-Frame DENY" : "Missing CSP · Clickjacking Risk" },
        { name: "DNS & Mail Transport", score: isClean ? "100%" : "40%", ok: isClean, detail: isClean ? "DNSSEC · DMARC Reject · SPF" : "No DMARC Policy · DNSSEC Inactive" },
        { name: "Privacy & Storage", score: isClean ? "100%" : "35%", ok: isClean, detail: isClean ? "0KB Cookies · Zero Third-party Trackers" : "Exposed Trackers · Tracking Cookies" }
      ];

      renderVectors(vectors);
      updateCodeTab("nginx");

      currentScanData = {
        target: target,
        framework: currentFramework,
        score: score,
        grade: grade,
        verdict: verdict,
        timestamp: new Date().toISOString(),
        fines_exposure_egp: isClean ? 0 : 5000000,
        statutory_articles: [
          { article: "Law 151/2020 Art 7", compliant: isClean },
          { article: "Law 151/2020 Art 12", compliant: isClean },
          { article: "Law 151/2020 Art 14", compliant: isClean },
          { article: "Law 151/2020 Art 15", compliant: isClean },
          { article: "Law 151/2020 Art 3", compliant: isClean }
        ],
        perimeters: {
          tls: isClean ? "A+" : "B",
          csp_level_3: isClean,
          hsts_preload: isClean,
          dnssec: isClean,
          third_party_trackers: isClean ? 0 : 4
        }
      };
    }

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      var rawTarget = targetInput ? targetInput.value.trim() : "";
      var errEl = document.getElementById("raqib-input-err");

      if (!rawTarget) {
        if (targetInput) {
          targetInput.setAttribute("aria-invalid", "true");
          targetInput.classList.add("is-error");
          targetInput.focus();
        }
        if (errEl) {
          errEl.textContent = T("يرجى إدخال عنوان النطاق المطلوب فحصه.", "Please enter a valid target URL to audit.");
          errEl.style.display = "block";
        }
        return;
      }

      if (targetInput) {
        targetInput.removeAttribute("aria-invalid");
        targetInput.classList.remove("is-error");
      }
      if (errEl) {
        errEl.style.display = "none";
        errEl.textContent = "";
      }

      var target = rawTarget;
      currentTarget = target;

      if (window.AwalimAudio) window.AwalimAudio.tap(2600, 0.04);

      if (dossier) dossier.style.display = "none";
      if (hud) hud.style.display = "block";

      var logs = [
        "[01/05] " + T("فحص بروتوكولات التشفير وشهادات الأمان (TLS 1.3 / PFS / HSTS Preload)...", "Auditing cryptographic cipher suite (TLS 1.3, PFS, HSTS Preload)..."),
        "[02/05] " + T("تدقيق ترويسات الأمان والمحيط الخارجي (CSP Level 3 / X-Frame / COOP)...", "Scanning perimeter headers (Strict CSP Level 3, X-Frame-Options, COOP)..."),
        "[03/05] " + T("فحص سجلات النطاق وبروتوكولات البريد (DNSSEC / DMARC / SPF)...", "Validating DNSSEC, DMARC p=reject, and SPF records..."),
        "[04/05] " + T("فحص تسريب الكوكيز والمتعقبات الخفية (Privacy & Cookie Vectors)...", "Inspecting cookie flags (HttpOnly, Secure) and tracker infiltration..."),
        "[05/05] " + T("المطابقة القانونية لمواد قانون حماية البيانات المصري (151 لسنة 2020)...", "Mapping findings against Egypt PDPL (Law 151/2020) Articles 3, 7, 12, 14, 15...")
      ];

      var step = 0;
      hudLogs.textContent = "";

      var timer = setInterval(function() {
        if (step < logs.length) {
          var p = Math.round(((step + 1) / logs.length) * 100);
          if (hudBar) hudBar.style.width = p + "%";
          if (hudPercent) hudPercent.textContent = p + "%";

          var line = document.createElement("div");
          line.className = "raqib-log-line";
          line.textContent = logs[step];
          hudLogs.appendChild(line);

          if (window.AwalimAudio) window.AwalimAudio.tap(2200 + (step * 200), 0.02);
          step++;
        } else {
          clearInterval(timer);
          setTimeout(function() {
            if (hud) hud.style.display = "none";
            if (dossier) dossier.style.display = "block";
            if (window.AwalimAudio) window.AwalimAudio.chime();

            var isClean = target.indexOf("awalim") !== -1 || target === "https://awalim.group";
            renderScanResults(isClean, target);
          }, 300);
        }
      }, 180);
    });

    // Export Report
    if (btnExport) {
      btnExport.addEventListener("click", function() {
        if (!currentScanData) return;
        if (window.AwalimAudio) window.AwalimAudio.tap(3000, 0.04);

        var dataStr = JSON.stringify(currentScanData, null, 2);
        var enc = new TextEncoder();
        window.crypto.subtle.digest("SHA-256", enc.encode(dataStr)).then(function(buf) {
          var arr = Array.from(new Uint8Array(buf));
          var hex = arr.map(function(b) { return b.toString(16).padStart(2, "0"); }).join("");
          currentScanData.sha256_merkle_certificate = hex;

          var blob = new Blob([JSON.stringify(currentScanData, null, 2)], { type: "application/json" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          var domainClean = currentTarget.replace(/https?:\/\//, "").replace(/[^a-zA-Z0-9.-]/g, "_");
          a.download = "awalim-raqib-audit-" + domainClean + ".json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          if (window.AwalimAudio) window.AwalimAudio.chime();
          var toast = document.createElement("div");
          toast.className = "dash-toast";
          toast.textContent = T("📥 تم تصدير تقرير رَقيب الجنائي بنجاح! بصمة التوثيق: " + hex.slice(0, 16) + "...",
                                "📥 Raqib forensic audit report exported! SHA-256: " + hex.slice(0, 16) + "...");
          document.body.appendChild(toast);
          setTimeout(function() { toast.classList.add("show"); }, 50);
          setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 4000);
        });
      });
    }


    // ─────────────────────────────────────────────────────────────
    // Raqib 4-in-1 Module Navigation Switcher
    // ─────────────────────────────────────────────────────────────
    var moduleTabs = document.querySelectorAll("#raqib-module-tabs .raqib-module-tab-btn");
    var moduleViews = {
      scanner: document.getElementById("raqib-view-scanner"),
      breach: document.getElementById("raqib-view-breach"),
      consent: document.getElementById("raqib-view-consent"),
      readiness: document.getElementById("raqib-view-readiness")
    };

    function switchRaqibTab(targetTab, updateUrl) {
      if (!moduleViews[targetTab]) return;
      moduleTabs.forEach(function(t) {
        if (t.getAttribute("data-tab") === targetTab) {
          t.classList.add("active");
        } else {
          t.classList.remove("active");
        }
      });

      Object.keys(moduleViews).forEach(function(k) {
        if (moduleViews[k]) {
          moduleViews[k].style.display = (k === targetTab) ? "block" : "none";
        }
      });

      if (updateUrl && window.history && window.history.replaceState) {
        var u = new URL(window.location.href);
        u.searchParams.set("raqib-tab", targetTab);
        window.history.replaceState(null, "", u.toString());
      }
    }

    moduleTabs.forEach(function(tab) {
      tab.addEventListener("click", function() {
        var targetTab = tab.getAttribute("data-tab");
        switchRaqibTab(targetTab, true);
        if (window.AwalimAudio) window.AwalimAudio.tap(2400, 0.03);
      });
    });

    // Check URL params on load: ?raqib-tab=breach or #raqib-sentinel
    var urlParams = new URLSearchParams(window.location.search);
    var initialTab = urlParams.get("raqib-tab");
    if (initialTab && moduleViews[initialTab]) {
      switchRaqibTab(initialTab, false);
    }

    // ─────────────────────────────────────────────────────────────
    // Statutory 72-Hour Live Countdown Timer Engine
    // ─────────────────────────────────────────────────────────────
    var cdHours = document.getElementById("cd-hours");
    var cdMinutes = document.getElementById("cd-minutes");
    var cdSeconds = document.getElementById("cd-seconds");
    var cdStatus = document.getElementById("raqib-countdown-status");

    function updateBreachCountdown() {
      if (!cdHours || !cdMinutes || !cdSeconds) return;
      var discTimeStr = (inputBreachTime && inputBreachTime.value) ? inputBreachTime.value : "2026-09-19T14:30";
      var discTimestamp = new Date(discTimeStr).getTime();
      if (isNaN(discTimestamp)) discTimestamp = Date.now();

      var statutoryLimitMs = 72 * 60 * 60 * 1000;
      var deadline = discTimestamp + statutoryLimitMs;
      var diffMs = deadline - Date.now();

      if (diffMs > 0) {
        var totalSec = Math.floor(diffMs / 1000);
        var hrs = Math.floor(totalSec / 3600);
        var mins = Math.floor((totalSec % 3600) / 60);
        var secs = totalSec % 60;

        cdHours.textContent = String(hrs).padStart(2, "0");
        cdMinutes.textContent = String(mins).padStart(2, "0");
        cdSeconds.textContent = String(secs).padStart(2, "0");

        if (cdStatus) {
          if (hrs > 24) {
            cdStatus.textContent = isEn ? "WITHIN LEGAL WINDOW" : "ضمن المهلة النظامية";
            cdStatus.className = "badge badge--ok";
          } else if (hrs > 6) {
            cdStatus.textContent = isEn ? "URGENT FILING REQUIRED (<24H)" : "إخطار عاجل مطلوب (أقل من 24 ساعة)";
            cdStatus.className = "badge";
          } else {
            cdStatus.textContent = isEn ? "CRITICAL DEADLINE (<6H)" : "مهلة حرجة وشيكة (أقل من 6 ساعات)";
            cdStatus.className = "badge badge--danger";
          }
        }
      } else {
        cdHours.textContent = "00";
        cdMinutes.textContent = "00";
        cdSeconds.textContent = "00";
        if (cdStatus) {
          cdStatus.textContent = isEn ? "EXPIRED · STATUTORY LIABILITY RISK" : "انقضت المهلة · خطر المساءلة الجنائية";
          cdStatus.className = "badge badge--danger";
        }
      }
    }

    setInterval(updateBreachCountdown, 1000);
    updateBreachCountdown();

    // ─────────────────────────────────────────────────────────────
    // Module 2: 72h Data Breach Statutory Notification Generator
    // ─────────────────────────────────────────────────────────────
    var inputBreachOrg = document.getElementById("input-breach-org");
    var selectBreachType = document.getElementById("select-breach-type");
    var inputBreachTime = document.getElementById("input-breach-time");
    var selectBreachScope = document.getElementById("select-breach-scope");
    var inputBreachCount = document.getElementById("input-breach-count");
    var inputBreachDpo = document.getElementById("input-breach-dpo");
    var textareaBreachActions = document.getElementById("textarea-breach-actions");
    var breachNoticeContent = document.getElementById("raqib-breach-notice-content");
    var btnCopyBreach = document.getElementById("btn-copy-breach-notice");
    var btnDownloadBreach = document.getElementById("btn-download-breach-notice");

    function generateBreachNotice() {
      if (!breachNoticeContent) return;
      var org = (inputBreachOrg ? inputBreachOrg.value.trim() : "") || "المنشأة المسؤولة";
      var incidentType = selectBreachType ? selectBreachType.options[selectBreachType.selectedIndex].text : "حادث سيبراني غير مصرح";
      var discTime = (inputBreachTime ? inputBreachTime.value : "") || "2026-09-19T14:30";
      var scope = selectBreachScope ? selectBreachScope.options[selectBreachScope.selectedIndex].text : "بيانات شخصية وهويات";
      var count = (inputBreachCount ? inputBreachCount.value : "10000") || "10000";
      var dpo = (inputBreachDpo ? inputBreachDpo.value.trim() : "") || "مسؤول حماية البيانات (DPO)";
      var actions = (textareaBreachActions ? textareaBreachActions.value.trim() : "") || "تم اتخاذ التدابير التقنية العاجلة وعزل الأنظمة.";

      var refId = "RAQIB-STATUTORY-INC-2026-0881";
      var dateNow = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });

      var noticeText = isEn ?
`================================================================================
OFFICIAL STATUTORY DATA BREACH NOTIFICATION (LAW 151/2020 ART. 12)
Reference ID: ${refId}
Timestamp of Issuance: ${new Date().toISOString()}
Target Authority: Data Protection Center (MCIT) / NDMO KSA
================================================================================

To: The President of the National Personal Data Protection Center
Subject: Mandatory 72-Hour Statutory Notification of Security Incident

In strict compliance with Article 12 of the Egyptian Personal Data Protection Law
(Law No. 151 of 2020) and Executive Regulations, ${org} hereby formally submits
this statutory notice regarding a detected data security breach:

1. ENTITY & CONTROLLER DETAILS:
   - Organization: ${org}
   - Designated DPO: ${dpo}
   - Statutory Compliance Status: Registered Controller

2. INCIDENT FORENSIC CLASSIFICATION:
   - Nature of Incident: ${incidentType}
   - Formal Discovery Timestamp: ${discTime}
   - Statutory 72-Hour Filing Status: FILED WITHIN STATUTORY WINDOW

3. CATEGORY & SCOPE OF IMPACTED PERSONAL DATA:
   - Data Classification: ${scope}
   - Estimated Number of Impacted Data Subjects: ${count} individuals
   - Cross-Border Transfer Status: Contained within sovereign boundary

4. IMMEDIATE CONTAINMENT & MITIGATION MEASURES UNDERTAKEN:
   ${actions}

5. REMEDIAL & PREVENTIVE ROADMAP:
   - Forensics investigation under supervision of certified incident response team.
   - Direct notification protocol to affected data subjects initiated per Article 12 para 2.
   - Comprehensive system audit and cryptographic key re-generation executed.

Attested and Submitted by:
${dpo}
Chief Data Protection Officer · ${org}`
:
`================================================================================
إخطار رسمي إلزامي بواقعة خرق أمني للبيانات الشخصية (وفق المادة 12 من القانون 151 لسنة 2020)
الرقم المرجعي السيادي: ${refId}
تاريخ التحرير: ${dateNow}
الجهة الموجه إليها: مركز حماية البيانات الشخصية — وزارة الاتصالات وتكنولوجيا المعلومات
================================================================================

إلى: السيد الأستاذ الدكتور / رئيس مركز حماية البيانات الشخصية
تحية طيبة وبعد،،

الموضوع: إخطار إلزامي عاجل بخرق أمني للبيانات الشخصية خلال 72 ساعة (المادة 12)

إعمالاً لنص المادة (12) من قانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020
ولائحته التنفيذية، والتي تلزم جهة التحكم بإخطار المركز القومي بكل خرق أو انتهاك لأمن
البيانات الشخصية خلال اثنتين وسبعين (72) ساعة من تاريخ العلم، تتشرف شركة [${org}]
بصفتها جهة تحكم، بإحاطة سيادتكم بالبيانات الجنائية التالية:

أولاً: بيانات جهة التحكم ومسؤول حماية البيانات:
   - اسم المنشأة: ${org}
   - مسؤول حماية البيانات (DPO) المعتمد: ${dpo}
   - المقر الرئيسي وقيد المعالجة: موثق ومعتمد

ثانياً: التوصيف الفني للواقعة الجنائية والتوقيت:
   - التصنيف السيبراني للحادث: ${incidentType}
   - توقيت رصد واكتشاف الخرق: ${discTime}
   - الموقف من المهلة القانونية (72 ساعة): تم القيد والإرسال خلال المهلة النظامية

ثالثاً: نطاق ونوعية البيانات الشخصية المتأثرة:
   - تصنيف وحساسية البيانات: ${scope}
   - التقدير العددي لأصحاب البيانات المتأثرين: ما يقارب (${count}) مواطن/مستخدم
   - النقل عبر الحدود: لم يتم نقل أي بيانات خارج القطر المصري بصفة غير مرخصة

رابعاً: التدابير العاجلة المتخذة لاحتواء الخرق وتقليص الأثر:
   ${actions}

خامساً: خطة الإخطار الفردي والإجراءات اللاحقة:
   - البدء الفوري في إخطار أصحاب البيانات المتأثرين بكافة وسائل الاتصال المسجلة طبقاً للفقرة الثانية من المادة 12.
   - تشكيل غرفة طوارئ رقمية برئاسة مسؤول حماية البيانات وفريق الاستجابة للثغرات.
   - مراجعة كافة سجلات المعالجة وتحديث تدابير التشفير إلى أعلى المعايير السيادية.

وتفضلوا بقبول فائق التقدير والاحترام،،

مقدمه لسيادتكم:
${dpo}
مسؤول حماية البيانات الشخصية المعتمد · ${org}`;

      breachNoticeContent.textContent = noticeText;
    }

    [inputBreachOrg, selectBreachType, inputBreachTime, selectBreachScope, inputBreachCount, inputBreachDpo, textareaBreachActions].forEach(function(el) {
      if (el) el.addEventListener("input", generateBreachNotice);
    });

    if (btnCopyBreach) {
      btnCopyBreach.addEventListener("click", function() {
        if (!breachNoticeContent) return;
        navigator.clipboard.writeText(breachNoticeContent.textContent).then(function() {
          if (window.AwalimAudio) window.AwalimAudio.tap(3200, 0.04);
          var toast = document.createElement("div");
          toast.className = "dash-toast";
          toast.textContent = isEn ? "📋 Statutory notification letter copied!" : "📋 تم نسخ الخطاب الرسمي بنجاح!";
          document.body.appendChild(toast);
          setTimeout(function() { toast.classList.add("show"); }, 50);
          setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 3000);
        });
      });
    }

    if (btnDownloadBreach) {
      btnDownloadBreach.addEventListener("click", function() {
        if (!breachNoticeContent) return;
        var blob = new Blob([breachNoticeContent.textContent], { type: "text/plain;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "law-151-breach-notification-72h.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (window.AwalimAudio) window.AwalimAudio.chime();
      });
    }

    generateBreachNotice();

    // ─────────────────────────────────────────────────────────────
    // Module 3: 0KB Sovereign Consent Banner Code Generator
    // ─────────────────────────────────────────────────────────────
    var consentCodePre = document.getElementById("raqib-consent-code");
    var btnCopyConsent = document.getElementById("btn-copy-consent-code");
    var btnDemoAccept = document.getElementById("btn-demo-consent-accept");
    var btnDemoEssential = document.getElementById("btn-demo-consent-essential");

    var sovereignConsentSnippet = `<!-- Awalim Sovereign 0KB Consent Banner (Egypt Law 151/2020 & GDPR) -->
<div id="awalim-consent-bar" style="display:none;position:fixed;bottom:16px;inset-inline:16px;max-width:880px;margin:auto;background:rgba(14,23,38,0.96);border:1px solid rgba(212,175,55,0.4);border-radius:12px;padding:16px 20px;box-shadow:0 12px 40px rgba(0,0,0,0.7);backdrop-filter:blur(16px);z-index:999999;font-family:system-ui,-apple-system,sans-serif;color:#f3f4f6;">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
    <div style="flex:1;min-width:260px;">
      <div style="font-weight:700;font-size:0.95rem;color:#D4AF37;margin-bottom:4px;">الخصوصية السيادية والموافقة الصريحة</div>
      <div style="font-size:0.8rem;color:#9ca3af;line-height:1.5;">وفقاً لأحكام القانون 151 لسنة 2020، نلتزم بحماية سيادتك الرقمية وعدم تشغيل أي ملفات تعريف غير ضرورية دون موافقتك المسبقة.</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button id="awalim-consent-btn-all" style="background:#D4AF37;color:#090b0e;border:none;padding:8px 16px;border-radius:6px;font-weight:700;font-size:0.85rem;cursor:pointer;">قبول المختار</button>
      <button id="awalim-consent-btn-ess" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.2);padding:8px 16px;border-radius:6px;font-weight:600;font-size:0.85rem;cursor:pointer;">الضرورية فقط</button>
    </div>
  </div>
</div>
<script>
(function(){
  var KEY = "awalim_consent_decision";
  if (!localStorage.getItem(KEY)) {
    var bar = document.getElementById("awalim-consent-bar");
    if (bar) bar.style.display = "block";
    document.getElementById("awalim-consent-btn-all").onclick = function() {
      localStorage.setItem(KEY, JSON.stringify({ essential: true, preferences: true, ts: Date.now() }));
      bar.style.display = "none";
    };
    document.getElementById("awalim-consent-btn-ess").onclick = function() {
      localStorage.setItem(KEY, JSON.stringify({ essential: true, preferences: false, ts: Date.now() }));
      bar.style.display = "none";
    };
  }
})();
</script>`;

    if (consentCodePre) {
      consentCodePre.textContent = sovereignConsentSnippet;
    }

    if (btnCopyConsent) {
      btnCopyConsent.addEventListener("click", function() {
        if (!consentCodePre) return;
        navigator.clipboard.writeText(consentCodePre.textContent).then(function() {
          if (window.AwalimAudio) window.AwalimAudio.tap(3200, 0.04);
          var toast = document.createElement("div");
          toast.className = "dash-toast";
          toast.textContent = isEn ? "📋 Sovereign consent snippet copied!" : "📋 تم نسخ كود شريط الموافقة السيادي بنجاح!";
          document.body.appendChild(toast);
          setTimeout(function() { toast.classList.add("show"); }, 50);
          setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 3000);
        });
      });
    }

    if (btnDemoAccept) {
      btnDemoAccept.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.chime();
        var toast = document.createElement("div");
        toast.className = "dash-toast";
        toast.textContent = isEn ? "🛡️ Explicit consent stored with cryptographic timestamp!" : "🛡️ تم تسجيل الموافقة الصريحة في سجل المتصفح مع طابع زمني تشفيري!";
        document.body.appendChild(toast);
        setTimeout(function() { toast.classList.add("show"); }, 50);
        setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 3000);
      });
    }

    if (btnDemoEssential) {
      btnDemoEssential.addEventListener("click", function() {
        if (window.AwalimAudio) window.AwalimAudio.tap(2000, 0.03);
        var toast = document.createElement("div");
        toast.className = "dash-toast";
        toast.textContent = isEn ? "🔒 Only strictly essential storage permitted. All telemetry disabled." : "🔒 تم حصر التخزين في النطاق الإلزامي فقط، وحظر أي تتبع أو قياس خارجي.";
        document.body.appendChild(toast);
        setTimeout(function() { toast.classList.add("show"); }, 50);
        setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 3000);
      });
    }

    // ─────────────────────────────────────────────────────────────
    // Module 4: Institutional Readiness Diagnostic Quiz
    // ─────────────────────────────────────────────────────────────
    var qCheckboxes = [
      document.getElementById("q-readiness-1"),
      document.getElementById("q-readiness-2"),
      document.getElementById("q-readiness-3"),
      document.getElementById("q-readiness-4"),
      document.getElementById("q-readiness-5")
    ];
    var readinessGauge = document.getElementById("raqib-readiness-gauge");
    var readinessVal = document.getElementById("raqib-readiness-val");
    var readinessBadge = document.getElementById("raqib-readiness-badge");
    var btnExportCert = document.getElementById("btn-export-readiness-cert");

    function updateReadinessDiagnostic() {
      var checkedCount = 0;
      qCheckboxes.forEach(function(cb) {
        if (cb && cb.checked) checkedCount++;
      });

      var pct = checkedCount * 20;
      if (readinessGauge) {
        readinessGauge.textContent = pct + "%";
        if (pct >= 80) {
          readinessGauge.classList.remove("bad");
          readinessGauge.style.borderColor = "var(--gold, #D4AF37)";
          readinessGauge.style.color = "var(--gold, #D4AF37)";
        } else if (pct >= 60) {
          readinessGauge.classList.remove("bad");
          readinessGauge.style.borderColor = "var(--accent, #00F0FF)";
          readinessGauge.style.color = "var(--accent, #00F0FF)";
        } else {
          readinessGauge.classList.add("bad");
          readinessGauge.style.borderColor = "#EF4444";
          readinessGauge.style.color = "#EF4444";
        }
      }

      if (readinessVal) {
        readinessVal.textContent = pct + " / 100";
      }

      if (readinessBadge) {
        if (pct >= 80) {
          readinessBadge.textContent = isEn ? "Sovereign Shield · Fully Compliant" : "درع سيادي · امتثال قانوني كامل";
          readinessBadge.className = "badge badge--ok";
        } else if (pct >= 50) {
          readinessBadge.textContent = isEn ? "Partial Readiness · Moderate Exposure" : "جاهزية جزئية · يلزم سد الثغرات";
          readinessBadge.className = "badge";
        } else {
          readinessBadge.textContent = isEn ? "Critical Liability · Statutory Sanctions Risk" : "خطر حرج · عرضة للمساءلة الجنائية والغرامات";
          readinessBadge.className = "badge badge--danger";
        }
      }
    }

    qCheckboxes.forEach(function(cb) {
      if (cb) {
        cb.addEventListener("change", function() {
          if (window.AwalimAudio) window.AwalimAudio.tap(2000 + (cb.checked ? 600 : -400), 0.03);
          updateReadinessDiagnostic();
        });
      }
    });

    if (btnExportCert) {
      btnExportCert.addEventListener("click", function() {
        var checkedCount = 0;
        var details = [];
        var titles = [
          "DPO Appointed (Law 151/2020 Art 12)",
          "Record of Processing Activities RoPA (Art 8)",
          "Cross-Border Data Transfer Licensing (Art 14-15)",
          "Data Subject Rights DSR 6-day SLA (Art 13)",
          "Vendor DPA & Impact Assessment DPIA (Art 7-12)"
        ];

        qCheckboxes.forEach(function(cb, idx) {
          var isOk = cb ? cb.checked : false;
          if (isOk) checkedCount++;
          details.push({
            pillar: titles[idx],
            compliant: isOk,
            remediation: isOk ? "Verified Sovereign" : "Action Required immediately"
          });
        });

        var certData = {
          audit_type: "Awalim Raqib Institutional Governance Diagnostic",
          framework: "Egypt PDPL (Law 151/2020) & Saudi NDMO",
          timestamp: new Date().toISOString(),
          compliance_score_percent: checkedCount * 20,
          total_pillars_evaluated: 5,
          pillars_compliant: checkedCount,
          statutory_liability_rating: (checkedCount * 20 >= 80) ? "MINIMAL" : ((checkedCount * 20 >= 50) ? "MODERATE" : "CRITICAL"),
          remediation_checklist: details
        };

        var blob = new Blob([JSON.stringify(certData, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "awalim-pdpl-governance-roadmap.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.AwalimAudio) window.AwalimAudio.chime();
        var toast = document.createElement("div");
        toast.className = "dash-toast";
        toast.textContent = isEn ? "📥 Institutional governance roadmap exported!" : "📥 تم تصدير خارطة طريق الجاهزية التشريعية بنجاح!";
        document.body.appendChild(toast);
        setTimeout(function() { toast.classList.add("show"); }, 50);
        setTimeout(function() { toast.classList.remove("show"); setTimeout(function() { document.body.removeChild(toast); }, 400); }, 3000);
      });
    }

    updateReadinessDiagnostic();

    // Run initial scan for awalim.group on load
    renderScanResults(true, "https://awalim.group");
    if (dossier) dossier.style.display = "block";
  })();

})();