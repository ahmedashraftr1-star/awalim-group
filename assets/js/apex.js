/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  AWALIM SOVEREIGN APEX ENGINE — Apple Silicon / visionOS Pro     ║
 * ║  Currency Engine · 60fps Demo Viewer · Comms Hub · Web Audio    ║
 * ║  Awalim Group x Ahmed Ashraf                                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function () {
  'use strict';
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          const v = attrs[k];
          if (k === 'className') el.className = v;
          else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
          else el.setAttribute(k, v);
        }
      }
    }
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c == null) continue;
      if (Array.isArray(c)) {
        for (let j = 0; j < c.length; j++) {
          const item = c[j];
          if (item == null) continue;
          if (typeof item === 'string' || typeof item === 'number') el.appendChild(document.createTextNode(String(item)));
          else if (item instanceof Node) el.appendChild(item);
        }
      } else if (typeof c === 'string' || typeof c === 'number') {
        el.appendChild(document.createTextNode(String(c)));
      } else if (c instanceof Node) {
        el.appendChild(c);
      }
    }
    return el;
  }


  const isEn = document.documentElement.lang === 'en' || window.location.pathname.startsWith('/en');

  // 1. APPLE AUDIO SUITE (Web Audio API Synthesizer — 0KB Network Assets)
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTap() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  function playChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Apple Glass Chime)
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.35);
      });
    } catch (e) {}
  }

  window.AppleSuite = { playTap, playChime };

  // 2. SOVEREIGN MULTI-CURRENCY ENGINE
  const RATES = {
    USD: { rate: 1.0,  symbol: '$',   name: 'USD ($)',   nameLocal: isEn ? 'US Dollar' : 'دولار أمريكي' },
    SAR: { rate: 3.75, symbol: 'ر.س', name: 'SAR (ر.س)', nameLocal: isEn ? 'Saudi Riyal' : 'ريال سعودي' },
    AED: { rate: 3.67, symbol: 'د.إ', name: 'AED (د.إ)', nameLocal: isEn ? 'UAE Dirham' : 'درهم إماراتي' },
    USDT: { rate: 1.0, symbol: '₮',   name: 'USDT (₮)',  nameLocal: isEn ? 'Tether USD' : 'تيذر رقمي' }
  };

  const CURR_KEY = 'awalim_selected_currency';
  let currentCurrency = 'USD';
  try {
    const saved = localStorage.getItem(CURR_KEY);
    if (saved && RATES[saved]) currentCurrency = saved;
  } catch (e) {}

  function convert(usdAmount) {
    const info = RATES[currentCurrency] || RATES.USD;
    const converted = Math.round(usdAmount * info.rate);
    return {
      amount: converted.toLocaleString('en-US'),
      symbol: info.symbol,
      formatted: converted.toLocaleString('en-US') + ' ' + info.symbol
    };
  }

  function applyCurrency(curr) {
    if (!RATES[curr]) return;
    currentCurrency = curr;
    try {
      localStorage.setItem(CURR_KEY, curr);
    } catch (e) {}

    const label = document.getElementById('sovNavCurrLabel');
    if (label) label.textContent = RATES[curr].symbol;

    document.querySelectorAll('.sov-curr-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.curr === curr);
    });

    const info = RATES[curr];

    document.querySelectorAll('[data-base-price]').forEach(el => {
      const base = parseFloat(el.dataset.basePrice);
      if (!isNaN(base)) {
        el.textContent = convert(base).amount;
      }
    });

    document.querySelectorAll('.sov-curr-sym').forEach(el => {
      el.textContent = info.symbol;
    });

    playTap();
  }

  window.SovereignCurrency = {
    set: applyCurrency,
    get: () => currentCurrency,
    convert: convert,
    rates: RATES
  };

  function mountCurrencyInNav() {
    const actContainer = document.querySelector('.pillnav__act');
    if (!actContainer || document.getElementById('sovNavCurrencyWrap')) return;

    try {
      const wrap = document.createElement('div');
      wrap.id = 'sovNavCurrencyWrap';
      wrap.className = 'sov-currency-wrap';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sov-currency-btn';
      btn.id = 'sovNavCurrencyBtn';
      btn.setAttribute('aria-label', isEn ? 'Switch Currency' : 'تبديل العملة');
      btn.title = isEn ? 'Select display currency' : 'اختر عملة العرض';

      const spIcon = document.createElement('span');
      spIcon.className = 'sov-curr-icon';
      spIcon.textContent = '💱';

      const spLabel = document.createElement('span');
      spLabel.id = 'sovNavCurrLabel';
      spLabel.textContent = (RATES[currentCurrency] && RATES[currentCurrency].symbol) || '$';

      const spCaret = document.createElement('span');
      spCaret.className = 'sov-curr-caret';
      spCaret.textContent = '▼';

      btn.appendChild(spIcon);
      btn.appendChild(spLabel);
      btn.appendChild(spCaret);
      wrap.appendChild(btn);

      const drop = document.createElement('div');
      drop.className = 'sov-currency-dropdown';
      drop.id = 'sovNavCurrencyDropdown';

      ['USD', 'SAR', 'AED', 'USDT'].forEach(c => {
        const opt = document.createElement('div');
        opt.className = 'sov-curr-opt' + (currentCurrency === c ? ' active' : '');
        opt.setAttribute('data-curr', c);
        const str = document.createElement('strong');
        str.textContent = c + (RATES[c] ? ' (' + RATES[c].symbol + ')' : '');
        const sp = document.createElement('span');
        sp.textContent = RATES[c] ? RATES[c].nameLocal : '';
        opt.appendChild(str);
        opt.appendChild(sp);
        drop.appendChild(opt);
      });

      wrap.appendChild(drop);
      actContainer.insertBefore(wrap, actContainer.firstChild);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drop.classList.toggle('open');
        playTap();
      });

      document.addEventListener('click', (e) => {
        if (drop && !drop.contains(e.target) && e.target !== btn) {
          drop.classList.remove('open');
        }
      });

      drop.querySelectorAll('.sov-curr-opt').forEach(opt => {
        opt.addEventListener('click', () => {
          const c = opt.dataset.curr;
          applyCurrency(c);
          drop.classList.remove('open');
        });
      });
    } catch(err) {
      console.warn('Currency mount bypassed:', err);
    }
  }

  // 3. INTERACTIVE 60FPS VISIONOS DEMO VIEWPORT
  const DEMO_MODELS = {
    rahmacare: {
      title: isEn ? 'RahmaCare — AI Triage & Sovereign EHR' : 'رحمة كير — الرعاية الطبية تحت الحصار',
      url: 'https://rahmacare.awalim.io/live-ehr',
      color: '#00BD7D',
      badge: isEn ? 'Merkle Offline Sync Active' : 'تشفير Merkle بدون إنترنت نشط',
      metrics: isEn ? [
        { num: '1,420', label: 'Active Patients Today' },
        { num: '99.8%', label: 'AI Clinical Triage' },
        { num: '14ms', label: 'EHR Record Retrieval' },
        { num: '100%', label: 'Sovereign Merkle Security' }
      ] : [
        { num: '1,420', label: 'مريض نشط اليوم' },
        { num: '99.8%', label: 'دقة الفرز السريري AI' },
        { num: '14ms', label: 'استرجاع السجلات EHR' },
        { num: '100%', label: 'تشفير Merkle السيادي' }
      ],
      chartTitle: isEn ? 'Real-Time ER Flow & Bed Allocation' : 'معدل تدفق الحالات الطارئة وتوزيع الأسرة اللحظي',
      bars: [35, 60, 45, 80, 95, 65, 50, 75, 90, 85, 40, 70],
      actions: isEn ? `
        <div class="sov-demo-actions">
          <a href="https://wa.me/970593636136?text=I%20request%20licensing%20for%20RahmaCare" target="_blank" rel="noopener" class="btn btn--primary">
            <span>Request System License ($599)</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>Simulate Real-time Triage</span>
          </button>
        </div>
      ` : `
        <div class="sov-demo-actions">
          <a href="https://wa.me/970593636136?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D8%B1%D8%AE%D9%8A%D8%B5%20%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9%20RahmaCare" target="_blank" rel="noopener" class="btn btn--primary">
            <span>طلب ترخيص المنظومة الطبية ($599)</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>محاكاة فرز سريري لحظي</span>
          </button>
        </div>
      `
    },
    accountant: {
      title: isEn ? 'Smart Accountant — Double-Entry Engine' : 'نظام Smart Accountant IFRS المالي السحابي',
      url: 'https://ledger.awalim.io/ifrs-live',
      color: '#00BD7D',
      badge: 'ZATCA Phase 2 & IFRS Compliant',
      metrics: isEn ? [
        { num: '$842,500', label: 'Cash Flow Recorded' },
        { num: '0.00%', label: 'Ledger Discrepancy' },
        { num: '1,280', label: 'Verified Invoices' },
        { num: 'IFRS 16', label: 'Standard Adherence' }
      ] : [
        { num: '$842,500', label: 'إجمالي التدفقات النقدية' },
        { num: '0.00%', label: 'نسبة التباين المحاسبي' },
        { num: '1,280', label: 'فاتورة إلكترونية معتمدة' },
        { num: 'IFRS 16', label: 'مطابقة المعايير الدولية' }
      ],
      chartTitle: isEn ? 'Balance Sheet & Quarterly Liquidity Ratio' : 'الميزانية العمومية والسيولة النقدية الربع سنوية',
      bars: [45, 55, 65, 50, 70, 85, 90, 80, 95, 100, 88, 92],
      actions: isEn ? `
        <div class="sov-demo-actions">
          <a href="https://wa.me/970593636136?text=I%20request%20licensing%20for%20Smart%20Accountant" target="_blank" rel="noopener" class="btn btn--primary">
            <span>Request Accounting License ($499)</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>Generate Verified Ledger Entry</span>
          </button>
        </div>
      ` : `
        <div class="sov-demo-actions">
          <a href="https://wa.me/970593636136?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D8%B1%D8%AE%D9%8A%D8%B5%20Smart%20Accountant" target="_blank" rel="noopener" class="btn btn--primary">
            <span>طلب ترخيص النظام المحاسبي ($499)</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>إصدار فاتورة تجريبية معتمدة</span>
          </button>
        </div>
      `
    },
    vibe: {
      title: isEn ? 'Vibe OS 4.0 — Sovereign Browser Desktop' : 'نظام Vibe OS 4.0 السيادي داخل المتصفح',
      url: 'https://vibe.awalim.io/os-demo',
      color: '#00BD7D',
      badge: '60fps Glass · 0 External Dependencies',
      metrics: isEn ? [
        { num: '60 FPS', label: 'Native Rendering Rate' },
        { num: '< 15MB', label: 'Total Memory Footprint' },
        { num: '14 Wings', label: 'Command Control Wings' },
        { num: 'Apple Pro', label: 'Sovereign Architecture' }
      ] : [
        { num: '60 FPS', label: 'معدل الإطارات الفعلي' },
        { num: '< 15MB', label: 'استهلاك الذاكرة الكلي' },
        { num: '14 Wings', label: 'أجنحة التحكم والمراقبة' },
        { num: 'Apple Pro', label: 'معمارية التصميم' }
      ],
      chartTitle: isEn ? 'Memory Consumption & Processing Speed' : 'استهلاك الذاكرة وسرعة المعالجة على شرائح Apple Silicon',
      bars: [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90],
      actions: isEn ? `
        <div class="sov-demo-actions">
          <a href="/dashboard" class="btn btn--primary">
            <span>Launch Central Control Dashboard</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>Benchmark 60fps Glass Engine</span>
          </button>
        </div>
      ` : `
        <div class="sov-demo-actions">
          <a href="/dashboard" class="btn btn--primary">
            <span>فتح لوحة التحكم المركزية الـ 14 جناحاً</span>
          </a>
          <button type="button" class="btn btn--ghost js-chime-btn">
            <span>اختبار أداء المعالج 60fps</span>
          </button>
        </div>
      `
    }
  };

  let activeDemo = 'rahmacare';

  function mountDemoModal() {
    if (document.getElementById('sovDemoOverlay')) return;

    const overlay = h('div', { id: 'sovDemoOverlay', className: 'sov-demo-modal-overlay', role: 'dialog', 'aria-modal': 'true' },
      h('div', { className: 'sov-demo-window' },
        h('div', { className: 'sov-demo-topbar' },
          h('div', { className: 'sov-demo-controls' },
            h('span', { className: 'sov-demo-dot close', id: 'sovDemoCloseDot', title: isEn ? 'Close' : 'إغلاق' }),
            h('span', { className: 'sov-demo-dot minimize', title: isEn ? 'Minimize' : 'تصغير' }),
            h('span', { className: 'sov-demo-dot maximize', title: isEn ? 'Maximize' : 'تكبير' })
          ),
          h('div', { className: 'sov-demo-urlbar' },
            h('span', { className: 'sov-demo-url-lock' }, '🔒'),
            h('span', { id: 'sovDemoUrl' }, 'https://awalim.io/live-demo')
          ),
          h('button', { type: 'button', className: 'sov-demo-btn-close', id: 'sovDemoCloseBtn', 'aria-label': isEn ? 'Close Demo' : 'إغلاق العرض' }, '✕')
        ),
        h('div', { className: 'sov-demo-tabs' },
          h('button', { type: 'button', className: 'sov-demo-tab active', 'data-tab': 'rahmacare' }, isEn ? 'RahmaCare (Medical)' : 'رحمة كير (طبي)'),
          h('button', { type: 'button', className: 'sov-demo-tab', 'data-tab': 'accountant' }, isEn ? 'Smart Accountant (IFRS)' : 'محاسب ذكي (IFRS)'),
          h('button', { type: 'button', className: 'sov-demo-tab', 'data-tab': 'vibe' }, isEn ? 'Vibe OS 4.0' : 'Vibe OS 4.0')
        ),
        h('div', { className: 'sov-demo-body', id: 'sovDemoBody' })
      )
    );

    document.body.appendChild(overlay);

    function closeDemo() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      playTap();
    }

    document.getElementById('sovDemoCloseBtn')?.addEventListener('click', closeDemo);
    document.getElementById('sovDemoCloseDot')?.addEventListener('click', closeDemo);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDemo();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeDemo();
      }
    });

    overlay.querySelectorAll('.sov-demo-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        openDemo(target);
      });
    });

    overlay.addEventListener('click', (e) => {
      if (e.target.closest('.js-chime-btn')) {
        playChime();
        const btn = e.target.closest('.js-chime-btn');
        btn.classList.add('active');
        setTimeout(() => { btn.classList.remove('active'); }, 150);
      }
    });
  }

  function openDemo(key) {
    mountDemoModal();
    const demoKey = DEMO_MODELS[key] ? key : 'rahmacare';
    activeDemo = demoKey;
    const demo = DEMO_MODELS[demoKey];

    const overlay = document.getElementById('sovDemoOverlay');
    const urlEl = document.getElementById('sovDemoUrl');
    const bodyEl = document.getElementById('sovDemoBody');

    if (urlEl) urlEl.textContent = demo.url;

    overlay.querySelectorAll('.sov-demo-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === demoKey);
    });

    const liveText = isEn ? 'Live 60fps Broadcast' : 'بث حي ومباشر 60fps';
    const liveIndicator = isEn ? 'Live Performance Telemetry' : 'مؤشر الأداء اللحظي';

    const statBoxes = demo.metrics.map(m =>
      h('div', { className: 'sov-demo-stat-box' },
        h('div', { className: 'sov-demo-stat-val' }, m.num),
        h('div', { className: 'sov-demo-stat-lbl' }, m.label)
      )
    );

    const chartBars = demo.bars.map(barH =>
      h('div', { className: 'sov-demo-chart-bar', 'data-h': String(barH), title: barH + '%' })
    );

    let actionsEl;
    if (demoKey === 'rahmacare') {
      actionsEl = h('div', { className: 'sov-demo-actions' },
        h('a', { href: 'https://wa.me/970593636136?text=' + encodeURIComponent(isEn ? 'I request licensing for RahmaCare' : 'أرغب في ترخيص منظومة RahmaCare'), target: '_blank', rel: 'noopener', className: 'btn btn--primary' },
          h('span', null, isEn ? 'Request System License ()' : 'طلب ترخيص المنظومة الطبية ()')
        ),
        h('button', { type: 'button', className: 'btn btn--ghost js-chime-btn' },
          h('span', null, isEn ? 'Simulate Real-time Triage' : 'محاكاة فرز سريري لحظي')
        )
      );
    } else if (demoKey === 'accountant') {
      actionsEl = h('div', { className: 'sov-demo-actions' },
        h('a', { href: 'https://wa.me/970593636136?text=' + encodeURIComponent(isEn ? 'I request licensing for Smart Accountant' : 'أرغب في ترخيص Smart Accountant'), target: '_blank', rel: 'noopener', className: 'btn btn--primary' },
          h('span', null, isEn ? 'Request Accounting License ()' : 'طلب ترخيص النظام المحاسبي ()')
        ),
        h('button', { type: 'button', className: 'btn btn--ghost js-chime-btn' },
          h('span', null, isEn ? 'Generate Verified Ledger Entry' : 'إصدار فاتورة تجريبية معتمدة')
        )
      );
    } else {
      actionsEl = h('div', { className: 'sov-demo-actions' },
        h('a', { href: '/dashboard', className: 'btn btn--primary' },
          h('span', null, isEn ? 'Launch Central Control Dashboard' : 'فتح لوحة التحكم المركزية الـ 14 جناحاً')
        ),
        h('button', { type: 'button', className: 'btn btn--ghost js-chime-btn' },
          h('span', null, isEn ? 'Benchmark 60fps Glass Engine' : 'اختبار أداء المعالج 60fps')
        )
      );
    }

    bodyEl.textContent = '';
    bodyEl.appendChild(
      h('div', null,
        h('div', { className: 'sov-demo-header-row' },
          h('div', null,
            h('span', { className: 'sov-demo-badge sov-demo-badge-accent' }, demo.badge),
            h('h3', { className: 'sov-demo-title-txt' }, demo.title)
          ),
          h('div', { className: 'sov-demo-live-tag' },
            h('span', { className: 'sov-demo-live-dot' }),
            ' ' + liveText
          )
        ),
        h('div', { className: 'sov-demo-metric-grid' }, statBoxes),
        h('div', { className: 'sov-demo-chart-mock' },
          h('div', { className: 'sov-demo-chart-header' },
            h('span', { className: 'sov-demo-chart-title' }, demo.chartTitle),
            h('span', { className: 'sov-demo-chart-sub' }, liveIndicator)
          ),
          h('div', { className: 'sov-demo-chart-bars' }, chartBars)
        ),
        actionsEl
      )
    );

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    playTap();
  }

  function mountCommsUI() {
    if (document.getElementById('sovereignCommsTrigger')) return;

    const commsTitle = isEn ? 'Connect with Ahmed Ashraf' : 'تواصل مع أحمد أشرف';
    const commsSub = isEn ? 'Online now for consultation' : 'متاح الآن للاستشارة';

    const trigger = h('div', { id: 'sovereignCommsTrigger', className: 'sovereign-comms-trigger', role: 'button', 'aria-label': commsTitle },
      h('div', { className: 'comms-trigger-avatar-wrap' },
        h('img', { src: '/assets/img/ahmed-personal.webp', alt: 'Ahmed Ashraf', className: 'comms-trigger-avatar' }),
        h('span', { className: 'comms-trigger-status', title: commsSub })
      ),
      h('div', { className: 'comms-trigger-text' },
        h('span', { className: 'comms-trigger-name' }, commsTitle),
        h('span', { className: 'comms-trigger-sub' },
          h('span', { className: 'comms-live-dot' }),
          ' ' + commsSub
        )
      ),
      h('span', { className: 'comms-trigger-badge' }, '1')
    );

    const modalSub = isEn ? 'Direct Line · Founder & Chief Architect' : 'قناة التوجيه المباشر · المؤسس والمعماري';
    const quickTitle = isEn ? 'Quick Inquiries:' : 'مواضيع سريعة:';
    const chip1 = isEn ? 'System Architecture' : 'معمارية النظم';
    const chip2 = isEn ? 'Enterprise Licensing' : 'ترخيص الشركات';
    const chip3 = isEn ? 'Direct WhatsApp' : 'واتساب مباشر';
    const placeholder = isEn ? 'Write your message to Ahmed Ashraf...' : 'اكتب استفسارك أو تفاصيل مشروعك هنا...';
    const sendBtnLbl = isEn ? 'Send' : 'إرسال';

    const modal = h('div', { id: 'sovereignCommsModal', className: 'sovereign-comms-modal' },
      h('div', { className: 'comms-header' },
        h('div', { className: 'comms-header-info' },
          h('img', { src: '/assets/img/ahmed-personal.webp', alt: 'Ahmed Ashraf', className: 'comms-header-avatar' }),
          h('div', null,
            h('div', { className: 'comms-header-title' }, 'أحمد أشرف · Ahmed Ashraf'),
            h('div', { className: 'comms-header-sub' }, modalSub)
          )
        ),
        h('button', { type: 'button', className: 'comms-close-btn', id: 'sovereignCommsClose', 'aria-label': isEn ? 'Close' : 'إغلاق' }, '✕')
      ),
      h('div', { className: 'comms-body', id: 'sovereignCommsMsgs' },
        h('div', { className: 'comms-msg founder' },
          isEn ? 'Welcome! I am Ahmed Ashraf, Chief Architect at Awalim Group. How can we accelerate your enterprise architecture today?' : 'أهلاً بك! أنا أحمد أشرف، المعماري التقني ومؤسس مجموعة عوالِم. يسعدني مناقشة متطلبات مشروعك، بنية أنظمتك السحابية، أو ترخيص حلولنا السيادية مباشرة.'
        )
      ),
      h('div', { className: 'comms-chips-wrap' },
        h('span', { className: 'comms-chips-title' }, quickTitle),
        h('button', { type: 'button', className: 'comms-quick-chip', 'data-text': chip1 }, chip1),
        h('button', { type: 'button', className: 'comms-quick-chip', 'data-text': chip2 }, chip2),
        h('a', { href: 'https://wa.me/970593636136', target: '_blank', rel: 'noopener', className: 'comms-quick-chip comms-chip-wa' }, chip3 + ' ↗')
      ),
      h('div', { className: 'comms-footer' },
        h('input', { type: 'text', className: 'comms-input', id: 'commsInput', placeholder: placeholder }),
        h('button', { type: 'button', className: 'comms-send-btn', id: 'commsSendBtn' }, sendBtnLbl)
      )
    );

    document.body.appendChild(trigger);
    document.body.appendChild(modal);

    trigger.addEventListener('click', () => {
      modal.classList.toggle('open');
      playTap();
      if (modal.classList.contains('open')) {
        document.getElementById('commsInput')?.focus();
      }
    });

    document.getElementById('sovereignCommsClose')?.addEventListener('click', () => {
      modal.classList.remove('open');
      playTap();
    });

    modal.querySelectorAll('.comms-quick-chip[data-text]').forEach(chip => {
      chip.addEventListener('click', () => {
        const inp = document.getElementById('commsInput');
        if (inp) {
          inp.value = chip.dataset.text;
          inp.focus();
        }
      });
    });

    const sendMsg = () => {
      const input = document.getElementById('commsInput');
      const text = input?.value.trim();
      if (!text) return;

      const msgs = document.getElementById('sovereignCommsMsgs');
      const uMsg = document.createElement('div');
      uMsg.className = 'comms-msg user';
      uMsg.textContent = text;
      msgs.appendChild(uMsg);

      input.value = '';
      playTap();
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(() => {
        const rMsg = document.createElement('div');
        rMsg.className = 'comms-msg founder';
        rMsg.textContent = isEn 
          ? 'Message received! You can also reach me directly on my private WhatsApp: '
          : 'وصلت رسالتك يا أستاذي الكريم! يمكنك أيضاً إرسال تفاصيل مشروعك مباشرة إلى واتساب الشخصي: ';
        const waLink = h('a', {
          href: 'https://wa.me/970593636136?text=' + encodeURIComponent(text),
          target: '_blank',
          rel: 'noopener',
          className: 'comms-wa-link'
        }, isEn ? 'Click here to open WhatsApp' : 'اضغط هنا للتحويل الفوري لواتساب');
        rMsg.appendChild(waLink);
        msgs.appendChild(rMsg);
        playChime();
        msgs.scrollTop = msgs.scrollHeight;
      }, 700);
    };

    document.getElementById('commsSendBtn')?.addEventListener('click', sendMsg);
    document.getElementById('commsInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMsg();
    });
  }

  // 5. LIQUID GLASS MOUSE SPOTLIGHT (visionOS)
  function initMouseSpotlights() {
    window.addEventListener('pointermove', (e) => {
      const cards = document.querySelectorAll('.card, .brief-pod, .bento-card, .hero__dev, .bento__card');
      cards.forEach(c => {
        const rect = c.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          c.style.setProperty('--mouse-x', x + 'px');
          c.style.setProperty('--mouse-y', y + 'px');
        }
      });
    }, { passive: true });
  }

  // 6. GLOBAL EVENT DELEGATION (CSP-Proof & Dynamic)
  function initGlobalDelegation() {
    document.addEventListener('click', (e) => {
      // 1. Demo triggers
      const demoBtn = e.target.closest('[data-demo-target], .btn-demo-trigger');
      if (demoBtn) {
        e.preventDefault();
        let target = demoBtn.dataset.demoTarget;
        if (!target) {
          const txt = demoBtn.textContent.toLowerCase();
          if (txt.includes('vibe')) target = 'vibe';
          else if (txt.includes('accountant') || txt.includes('محاسب')) target = 'accountant';
          else target = 'rahmacare';
        }
        openDemo(target);
        return;
      }

      // 2. Tactile tap audio on buttons & links
      if (e.target.closest('.btn, .icon-btn, .pillnav__links a, .sov-currency-btn, .comms-quick-chip')) {
        playTap();
      }
    });
  }

  // 7. INITIALIZE ON DOM READY
  function init() {
    mountCurrencyInNav();
    mountCommsUI();
    initMouseSpotlights();
    initGlobalDelegation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Redundant mount triggers in case of async hydration
  setTimeout(init, 200);
  setTimeout(init, 800);

})();
