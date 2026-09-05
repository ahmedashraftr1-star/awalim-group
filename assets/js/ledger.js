/* ==========================================================================
   AWALIM — live ledger: the hero cockpit is a working double-entry demo.
   «صوِّر فاتورة» scans a sample invoice, proposes a journal entry whose
   debits and credits are summed for real, and «اعتمد» posts it — KPIs,
   bars and the last-entry row update from the state, not from copy.
   Loaded only on pages that render an interactive cockpit ([data-ledger]).
   ========================================================================== */
(function () {
  "use strict";
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString("en-US"); };
  var money = function (n) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var EN = document.documentElement.lang === "en";
  var T = function (ar, en) { return EN ? en : ar; };

  /* sample documents — vendors and amounts are illustrative; the accounting is real */
  var DOCS = EN ? {
    scan: [
      { vendor: "Power Company", account: "Electricity expense", net: 1000, vat: 150, src: "captured by camera", ref: "INV-EL-4471" },
      { vendor: "Office furniture supplier", account: "Furniture and equipment", net: 4200, vat: 630, src: "PDF from email", ref: "INV-FR-0932" },
      { vendor: "Telecom Company", account: "Telecom expense", net: 320, vat: 48, src: "captured by camera", ref: "INV-TC-1187" },
      { vendor: "Amana Press", account: "Printing expense", net: 760, vat: 114, src: "photo from WhatsApp", ref: "INV-PR-2210" }
    ],
    sale: [
      { vendor: "Client — Al-Sharq Store", account: "Sales revenue", net: 8500, vat: 1275, src: "sales invoice", ref: "SI-2026-0311" },
      { vendor: "Client — Al-Nour Clinic", account: "Service revenue", net: 2400, vat: 360, src: "service invoice", ref: "SI-2026-0312" },
      { vendor: "Client — Al-Rowad Office", account: "Sales revenue", net: 5100, vat: 765, src: "sales invoice", ref: "SI-2026-0313" }
    ]
  } : {
    scan: [
      { vendor: "شركة الكهرباء", account: "مصروف كهرباء", net: 1000, vat: 150, src: "التُقطت بالكاميرا", ref: "INV-EL-4471" },
      { vendor: "مورّد أثاث المكتب", account: "أثاث ومعدّات", net: 4200, vat: 630, src: "PDF من البريد", ref: "INV-FR-0932" },
      { vendor: "شركة الاتصالات", account: "مصروف اتصالات", net: 320, vat: 48, src: "التُقطت بالكاميرا", ref: "INV-TC-1187" },
      { vendor: "مطبعة الأمانة", account: "مصروف طباعة", net: 760, vat: 114, src: "صورة من واتساب", ref: "INV-PR-2210" }
    ],
    sale: [
      { vendor: "عميل — متجر الشرق", account: "إيراد مبيعات", net: 8500, vat: 1275, src: "فاتورة مبيعات", ref: "SI-2026-0311" },
      { vendor: "عميل — عيادة النور", account: "إيراد خدمات", net: 2400, vat: 360, src: "فاتورة خدمات", ref: "SI-2026-0312" },
      { vendor: "عميل — مكتب الرواد", account: "إيراد مبيعات", net: 5100, vat: 765, src: "فاتورة مبيعات", ref: "SI-2026-0313" }
    ]
  };

  /* build the journal lines for a document and check the balance for real */
  function journal(kind, d) {
    var gross = d.net + d.vat;
    var lines = kind === "scan"
      ? [{ a: d.account, dr: d.net }, { a: T("ضريبة القيمة المضافة — مدخلات", "VAT — input"), dr: d.vat }, { a: T("ذمم دائنة — ", "Accounts payable — ") + d.vendor, cr: gross }]
      : [{ a: T("ذمم مدينة — ", "Accounts receivable — ") + d.vendor, dr: gross }, { a: d.account, cr: d.net }, { a: T("ضريبة القيمة المضافة — مخرجات", "VAT — output"), cr: d.vat }];
    var dr = lines.reduce(function (s, l) { return s + (l.dr || 0); }, 0);
    var cr = lines.reduce(function (s, l) { return s + (l.cr || 0); }, 0);
    return { lines: lines, dr: dr, cr: cr, balanced: Math.abs(dr - cr) < 0.005 };
  }

  $$("[data-ledger]").forEach(function (c) {
    var st = { rev: 482900, exp: 311240, n: 2478, i: { scan: 0, sale: 0 }, bars: [38, 52, 44, 67, 58, 79, 71, 92] };
    var kpi = { rev: $('[data-k="rev"]', c), exp: $('[data-k="exp"]', c), net: $('[data-k="net"]', c) };
    var rows = $("[data-ledger-rows]", c), prop = $("[data-ledger-proposal]", c), live = $("[data-ledger-live]", c);
    var nEl = $("[data-ledger-n]", c), bars = $$("[data-bars] i", c);
    var busy = false, pending = null, timers = [];

    function say(t) { if (live) live.textContent = t; }
    function tween(el, from, to, plus) {
      if (reduced) { el.textContent = (plus ? "" : "") + fmt(to); return; }
      var t0 = null, dur = 900;
      el.classList.add("is-tick");
      var step = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(from + (to - from) * e);
        if (p < 1) requestAnimationFrame(step); else el.classList.remove("is-tick");
      };
      requestAnimationFrame(step);
    }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function propose(kind) {
      var list = DOCS[kind], d = list[st.i[kind] % list.length]; st.i[kind]++;
      var j = journal(kind, d);
      pending = { kind: kind, d: d, j: j };
      busy = true;
      rows.hidden = true;            // the proposal takes the rows' place, so the card barely grows
      prop.hidden = false;
      /* 1) scan: the document reveals line by line under a beam */
      var docLines = EN
        ? [["Document", d.ref], ["Party", d.vendor], ["Net", money(d.net)], ["VAT 15%", money(d.vat)], ["Total", money(d.net + d.vat)]]
        : [["المستند", d.ref], ["الطرف", d.vendor], ["الصافي", money(d.net)], ["الضريبة 15%", money(d.vat)], ["الإجمالي", money(d.net + d.vat)]];
      prop.innerHTML = '<div class="ledger__doc" aria-hidden="true">' + (reduced ? "" : '<span class="ledger__beam"></span>') +
        '<div class="ledger__doc-h" style="--i:0">' + (kind === "scan" ? T("يُستخرج من الصورة… ", "Extracting from the image… ") + d.src : T("فاتورة مبيعات… ", "Sales invoice… ") + d.src) + "</div>" +
        docLines.map(function (l, i) { return '<div class="ledger__doc-l" style="--i:' + (i + 1) + '"><span>' + l[0] + '</span><b class="mono" dir="ltr">' + l[1] + "</b></div>"; }).join("") + "</div>";
      say(T("جارٍ استخراج بيانات ", "Extracting data from ") + d.vendor);
      /* 2) then the proposed entry with a real balance check */
      var delay = reduced ? 0 : 300 + docLines.length * 260 + 500;
      timers.push(setTimeout(function () {
        var next = st.n + 1;
        prop.innerHTML =
          '<div class="ledger__je">' +
            '<div class="ledger__je-hd"><span>' + T("قيد مقترح · ", "Proposed entry · ") + '<bdi class="mono">#' + next + "</bdi></span>" +
            '<span class="chip ' + (j.balanced ? "chip--accent" : "") + '">' + (j.balanced ? T("متوازن ✓ ", "balanced ✓ ") : T("غير متوازن ✖ ", "unbalanced ✖ ")) + '<bdi class="mono">' + money(j.dr) + " = " + money(j.cr) + "</bdi></span></div>" +
            '<table class="ledger__t"><thead><tr><th scope="col">' + T("الحساب", "Account") + '</th><th scope="col">' + T("مدين", "Debit") + '</th><th scope="col">' + T("دائن", "Credit") + "</th></tr></thead><tbody>" +
            j.lines.map(function (l) { return "<tr><td>" + l.a + '</td><td class="num">' + (l.dr ? money(l.dr) : "") + '</td><td class="num">' + (l.cr ? money(l.cr) : "") + "</td></tr>"; }).join("") +
            '</tbody><tfoot><tr><td>' + T("المجموع", "Total") + '</td><td class="num">' + money(j.dr) + '</td><td class="num">' + money(j.cr) + "</td></tr></tfoot></table>" +
            '<div class="btn-row"><button class="btn btn--sm btn--primary" type="button" data-ledger-action="approve"><span>' + T("اعتمد ورحِّل", "Approve and post") + '</span></button><button class="btn btn--sm btn--ghost" type="button" data-ledger-action="discard"><span>' + T("تجاهل", "Discard") + '</span></button><span class="ledger__hint">' + T("القرار للإنسان — دائماً", "The decision stays human — always") + "</span></div>" +
          "</div>";
        say(T("قيد مقترح رقم ", "Proposed entry number ") + next + (j.balanced ? T(" متوازن: ", " balances: ") : T(" غير متوازن: ", " does not balance: ")) + money(j.dr) + T(" مقابل ", " against ") + money(j.cr));
        var b = $('[data-ledger-action="approve"]', prop); if (b) b.focus({ preventScroll: true });
        busy = false;
      }, delay));
    }

    function approve() {
      if (!pending || !pending.j.balanced) return;
      var d = pending.d, kind = pending.kind;
      st.n++;
      var oldRev = st.rev, oldExp = st.exp;
      if (kind === "scan") st.exp += d.net; else st.rev += d.net;
      tween(kpi.rev, oldRev, st.rev); tween(kpi.exp, oldExp, st.exp); tween(kpi.net, oldRev - oldExp, st.rev - st.exp);
      /* bars: shift the series and push the new period, scaled to the largest */
      var mag = Math.min(100, Math.max(30, Math.round((d.net / 9000) * 100)));
      st.bars.shift(); st.bars.push(mag);
      bars.forEach(function (b, i) { b.style.setProperty("--h", st.bars[i] + "%"); });
      /* rows: the first row is always «آخر قيد»; the posted document joins the history below it */
      var first = rows.firstElementChild;
      first.className = "cockpit__row is-new";
      first.innerHTML = "<span>" + T("آخر قيد · ", "Last entry · ") + "<span class=\"mono\" lang=\"en\">#<span data-ledger-n>" + st.n + "</span></span> · " + d.vendor + "</span><b class=\"cockpit__ok\">" + T("متوازن ✓", "balanced ✓") + "</b>";
      nEl = $("[data-ledger-n]", first);
      var hist = document.createElement("div");
      hist.className = "cockpit__row is-new";
      hist.innerHTML = "<span>" + (kind === "scan" ? T("فاتورة ", "Invoice ") : T("مبيعة ", "Sale ")) + d.vendor + " — " + d.src + "</span><b class=\"mono\">" + money(d.net + d.vat) + "</b>";
      rows.insertBefore(hist, first.nextElementSibling);
      while (rows.children.length > 3) rows.removeChild(rows.lastElementChild);
      say(EN
        ? "Entry number " + st.n + " posted. Revenue " + fmt(st.rev) + ", expenses " + fmt(st.exp) + ", net cash flow " + fmt(st.rev - st.exp)
        : "رُحِّل القيد رقم " + st.n + ". الإيرادات " + fmt(st.rev) + "، المصروفات " + fmt(st.exp) + "، صافي التدفّق " + fmt(st.rev - st.exp));
      document.dispatchEvent(new CustomEvent("awalim:notify", { detail: { text: T("قيد #" + st.n + " رُحِّل — متوازن ✓", "Entry #" + st.n + " posted — balanced ✓") } }));
      discard();
    }
    function discard() { clearTimers(); pending = null; busy = false; prop.hidden = true; prop.innerHTML = ""; rows.hidden = false; var b = $('[data-ledger-action="scan"]', c); if (b) b.focus({ preventScroll: true }); }

    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-ledger-action]"); if (!b) return;
      var a = b.getAttribute("data-ledger-action");
      if (a === "approve") return approve();
      if (a === "discard") return discard();
      if (busy) return;
      if (pending) discard();
      propose(a);
    });
  });
})();
