import { esc, fill, join, seoTitle } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

const PRODUCT_META = {
  "smart-accountant": {
    category: "fintech",
    badgeAr: "معتمد IFRS · جاهز للعزل التام (Air-Gapped)",
    badgeEn: "IFRS ACCREDITED · AIR-GAPPED READY",
    domainAr: "أنظمة مالية ومحاسبة",
    domainEn: "Sovereign FinTech & ERP",
    icon: "📊"
  },
  "rahmacare": {
    category: "mesh",
    badgeAr: "شبكة هجينة P2P · صفرية التبعية للإنترنت",
    badgeEn: "P2P LORA MESH · ZERO INTERNET DEPENDENCY",
    domainAr: "رعاية صحية وشبكات طوارئ",
    domainEn: "Emergency Mesh & Health",
    icon: "🕊️"
  },
  "vibe-os": {
    category: "os-ai",
    badgeAr: "نظام تشغيل زجاجي سيادي · فيزياء نابضية حية",
    badgeEn: "GLASS MATRIX OS · MASS & MAGNETISM",
    domainAr: "أنظمة تشغيل وواجهات",
    domainEn: "Glass OS & Web Physics",
    icon: "⚡"
  },
  "ai-lab": {
    category: "os-ai",
    badgeAr: "استدلال محلي مشفر · حماية تامة من التسريب",
    badgeEn: "LOCAL LLM INFERENCE · ZERO DATA LEAK",
    domainAr: "ذكاء اصطناعي سيادي",
    domainEn: "Private AI & Local LLM",
    icon: "🧠"
  },
  "jameel-store": {
    category: "commerce",
    badgeAr: "تجارة فائقة السرعة · كاش غير متزامن",
    badgeEn: "SUB-MILLISECOND COMMERCE · ED25519 SIGNED",
    domainAr: "متاجر ومنصات تجارية",
    domainEn: "High-Velocity Commerce",
    icon: "🛍️"
  },
  "web-platforms": {
    category: "commerce",
    badgeAr: "منصات ويب سيادية · صفرية الديون البرمجية",
    badgeEn: "SOVEREIGN WEB ARCHITECTURE",
    domainAr: "منصات وبوابات رقمية",
    domainEn: "Sovereign Web Portals",
    icon: "🌐"
  },
  "brand-studio": {
    category: "commerce",
    badgeAr: "هوية رقمية قياسية · معايير آبل العالمية",
    badgeEn: "APPLE STANDARDS DESIGN SUITE",
    domainAr: "تصميم وهويات بصرية",
    domainEn: "Design & Brand Systems",
    icon: "🎨"
  }
};

function renderSandboxModal(isEn, t, products) {
  return `
    <!-- Sovereign Systems Sandbox Modal (WCAG AAA & CSP-Safe) -->
    <div class="dash-modal-overlay hidden" id="modal-product-sandbox" role="dialog" aria-modal="true" aria-labelledby="modal-sandbox-title">
      <div class="dash-modal dash-modal-lg">
        <div class="dash-modal-header">
          <div class="dash-modal-title-wrap">
            <span class="dash-modal-icon">⚡</span>
            <h3 class="dash-modal-title" id="modal-sandbox-title">
              ${t("محاكي الأنظمة السيادية المباشر (Multi-Expert Sandbox)", "Sovereign Systems Multi-Expert Live Sandbox")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-sandbox-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <div class="sandbox-tabs-nav" role="tablist" aria-label="${t("اختيار نظام للمحاكاة", "Select System Sandbox")}">
          <button type="button" class="sandbox-tab-btn active" data-sandbox-tab="smart-accountant">📊 ${t("محاسب ذكي (ZATCA P2)", "Smart Accountant")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="rahmacare">🕊️ ${t("RahmaCare (RF Mesh)", "RahmaCare Mesh")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="vibe-os">⚡ ${t("Vibe OS (Physics Engine)", "Vibe OS Physics")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="ai-lab">🧠 ${t("AI Lab (Local LLM)", "AI Lab Engine")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="jameel-store">🛍️ ${t("Jameel Store", "Jameel Store")}</button>
        </div>

        <div class="dash-modal-scroll">
          <!-- 1. Smart Accountant Simulator (ZATCA Phase 2 & IFRS 15) -->
          <div class="sandbox-view-panel" id="sandbox-view-smart-accountant">
            <div class="sb-intro-text">
              ${t("محاكاة محرك القيد المزدوج IFRS 15 مع توليد حزمة TLV الثنائية المشفرة المعتمدة لدى هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2):", "Live simulation of IFRS 15 double-entry engine and authentic binary TLV Base64 packing conforming to Saudi ZATCA Phase 2:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-acc-amount">${t("قيمة الفاتورة الأساسية", "Invoice Amount (Pre-Tax)")}</label>
                <input type="number" id="sb-acc-amount" value="10000" min="100" step="100">
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-acc-tax">${t("نسبة الضريبة والدولة", "Tax Authority & Rate")}</label>
                <select id="sb-acc-tax">
                  <option value="0.15">${t("15% — المملكة العربية السعودية (ZATCA)", "15% — Kingdom of Saudi Arabia (ZATCA)")}</option>
                  <option value="0.14">${t("14% — جمهورية مصر العربية (ETA)", "14% — Arab Republic of Egypt (ETA)")}</option>
                  <option value="0.05">${t("5% — دولة الإمارات العربية المتحدة (FTA)", "5% — United Arab Emirates (FTA)")}</option>
                </select>
              </div>
            </div>

            <div class="sb-action-row">
              <button type="button" class="btn btn--primary btn--sm sb-action-full" id="btn-run-acc-calc">
                <span>⚡</span>
                <span>${t("ترحيل القيد المحاسبي وتوليد حزمة TLV والختم التشفيري", "Commit IFRS Ledger & Generate ZATCA Phase 2 TLV QR")}</span>
              </button>
            </div>

            <div class="sb-zatca-split" id="sb-acc-split">
              <div class="sandbox-terminal-view" id="sb-acc-output">
                <div>[IFRS-ENGINE] Ready. Awaiting ledger commit...</div>
                <div>[STATUS] Balanced Ledger Architecture verified (IFRS 15 Compliant).</div>
              </div>
              <div class="sb-qr-box" id="sb-acc-qr-container">
                <div class="sb-badge-zatca">ZATCA P2</div>
                <div id="sb-acc-qr-svg-wrap">
                  <!-- Generated Mathematical SVG QR matrix -->
                </div>
                <div class="sb-qr-caption">SHA-256 + ECDSA</div>
              </div>
            </div>
          </div>

          <!-- 2. RahmaCare Mesh Simulator (Friis Path Loss & LoRa SX1262) -->
          <div class="sandbox-view-panel hidden" id="sandbox-view-rahmacare">
            <div class="sb-intro-text">
              ${t("محاكاة ميزانية الوصلة اللاسلكية (RF Link Budget) ومعادلة فريس لشبكة LoRa P2P الطبية المستقلة تماماً عن الإنترنت:", "Physical RF Link Budget and Friis Path Loss calculation for off-grid RahmaCare P2P medical triage mesh:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-mesh-dist">
                  ${t("المسافة بين العقدتين:", "Node Distance:")} <strong id="sb-mesh-dist-val">8.5 km</strong>
                </label>
                <input type="range" id="sb-mesh-dist" min="1" max="25" step="0.5" value="8.5">
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-mesh-sf">${t("عامل التوسع والحساسية (Spreading Factor)", "Spreading Factor & Sensitivity")}</label>
                <select id="sb-mesh-sf">
                  <option value="12">${t("SF12 — أقصى مدى (-148 dBm · 0.29 kbps)", "SF12 — Ultra Long Range (-148 dBm)")}</option>
                  <option value="9">${t("SF9 — متوازن (-130 dBm · 1.76 kbps)", "SF9 — Balanced (-130 dBm)")}</option>
                  <option value="7">${t("SF7 — سرعة عالية (-123 dBm · 5.47 kbps)", "SF7 — High Speed (-123 dBm)")}</option>
                </select>
              </div>
            </div>

            <div class="sb-rf-grid">
              <div class="sb-rf-card">
                <div class="sb-rf-lbl">${t("فقد المسار (FSPL)", "Free Space Loss")}</div>
                <div class="sb-rf-val" id="sb-rf-fspl">103.8 dB</div>
              </div>
              <div class="sb-rf-card">
                <div class="sb-rf-lbl">${t("القدرة المستقبلة", "Received Power (Prx)")}</div>
                <div class="sb-rf-val" id="sb-rf-prx">-80.8 dBm</div>
              </div>
              <div class="sb-rf-card">
                <div class="sb-rf-lbl">${t("هامش الاتصال (Margin)", "Link Margin")}</div>
                <div class="sb-rf-val color-green" id="sb-rf-margin">+67.2 dB</div>
              </div>
              <div class="sb-rf-card">
                <div class="sb-rf-lbl">${t("زمن البث في الهواء", "Packet Airtime (Tair)")}</div>
                <div class="sb-rf-val" id="sb-rf-airtime">782.3 ms</div>
              </div>
            </div>

            <div class="sb-flex-row">
              <button type="button" class="btn btn--primary btn--sm" id="btn-run-mesh-ping">
                <span>🕊️</span>
                <span>${t("إرسال نداء فرز طبي مشفر (Ed25519 SOS)", "Dispatch Encrypted SOS Packet")}</span>
              </button>
              <button type="button" class="btn btn--outline btn--sm" id="btn-toggle-blackout">
                <span>📡</span>
                <span>${t("محاكاة انقطاع الإنترنت التام", "Simulate Total Blackout")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-mesh-output">
              <div>[MESH] 5 Nodes active: RF-02 (Rafah) · KH-01 · DB-03 · GZ-04 · BY-05.</div>
              <div>[RADIO] Semtech SX1262 LoRa 433MHz active. Standby...</div>
            </div>
          </div>

          <!-- 3. Vibe OS 4.0 Simulator (Damped Harmonic Oscillator Physics) -->
          <div class="sandbox-view-panel hidden" id="sandbox-view-vibe-os">
            <div class="sb-intro-text">
              ${t("محاكاة حقيقية لفيزياء الميكانيكا الكلاسيكية (Damped Harmonic Oscillator: m·x'' + c·x' + k·x = 0) لنافذة Sovereign Glass:", "Newtonian spring mechanics simulation (Damped Harmonic Oscillator) powering Sovereign Glass OS:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-spring-mass">
                  ${t("الكتلة (Mass m):", "Mass (m):")} <strong id="sb-spring-mass-val">1.0 kg</strong>
                </label>
                <input type="range" id="sb-spring-mass" min="0.5" max="3.0" step="0.1" value="1.0">
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-spring-stiff">
                  ${t("معامل الصلابة (Stiffness k):", "Stiffness (k):")} <strong id="sb-spring-stiff-val">160 N/m</strong>
                </label>
                <input type="range" id="sb-spring-stiff" min="50" max="300" step="10" value="160">
              </div>
            </div>

            <div class="sb-telemetry-row">
              <div>${t("نسبة التخميد:", "Damping Ratio:")} <strong id="sb-spring-zeta">0.79</strong></div>
              <div>${t("التردد الطبيعي:", "Natural Freq:")} <strong id="sb-spring-omega">12.6 rad/s</strong></div>
              <div>${t("الحالة:", "Dynamic State:")} <strong id="sb-spring-state" class="color-green">Underdamped (Fluid Bounce)</strong></div>
            </div>

            <div class="sb-spring-stage" id="sb-spring-stage">
              <div class="sb-spring-card" id="sb-spring-card">
                <div class="font-bold">Sovereign Glass OS Node</div>
                <div class="color-dim text-sm">Apple Silicon Accelerated · Spring-Damper Kernel</div>
              </div>
            </div>

            <div class="sb-flex-row">
              <button type="button" class="btn btn--primary btn--sm" id="btn-spring-deflect">
                <span>🧲</span>
                <span>${t("سحب وإفلات النابض (Deflect & Release 120px)", "Deflect & Release Spring (120px)")}</span>
              </button>
              <button type="button" class="btn btn--outline btn--sm" id="btn-matrix-toggle">
                <span>💻</span>
                <span>${t("بروتوكول GOD MODE (Matrix Stream)", "Activate GOD MODE Protocol")}</span>
              </button>
            </div>
          </div>

          <!-- 4. AI Lab Simulator (Local LLM Zero-Egress Benchmark) -->
          <div class="sandbox-view-panel hidden" id="sandbox-view-ai-lab">
            <div class="sb-intro-text">
              ${t("فحص سرعة استدلال نماذج الذكاء الاصطناعي السيادية المعزولة محلياً مع تدقيق منع خروج أي بايت عبر الشبكة (Zero-Egress):", "Benchmark local sovereign LLM inference throughput and memory allocation with verified zero WAN socket egress:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-ai-model">${t("حجم النموذج السيادي المحلي", "Local Sovereign Model Tier")}</label>
                <select id="sb-ai-model">
                  <option value="7b">Sovereign-7B-Instruct (Q4_K_M · 4.3GB VRAM)</option>
                  <option value="14b" selected>Sovereign-14B-DeepSeek (Q4_K_M · 8.8GB VRAM)</option>
                  <option value="32b">Sovereign-32B-Apex (Q4_K_M · 19.5GB VRAM)</option>
                </select>
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-ai-prompt">${t("المهمة الاستدلالية", "Reasoning Benchmark Task")}</label>
                <select id="sb-ai-prompt">
                  <option value="ifrs">${t("تدقيق قيد محاسبي معقد حسب IFRS 15", "IFRS 15 Complex Contract Audit")}</option>
                  <option value="triage">${t("بروتوكول فرز حالات الإصابات الجماعية", "Mass Casualty Clinical Protocol")}</option>
                  <option value="kernel">${t("توليد شيفرة نواة سيادية بدون تبعيات", "Zero-Dependency Kernel Synthesis")}</option>
                </select>
              </div>
            </div>

            <div class="sb-action-row">
              <button type="button" class="btn btn--primary btn--sm sb-action-full" id="btn-run-ai-inference">
                <span>🧠</span>
                <span>${t("تشغيل استدلال النموذج وتدقيق العزل (Private Inference Benchmark)", "Run Local Private Inference Benchmark")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-ai-output">
              <div>[MODEL] Sovereign-14B-DeepSeek-Q4_K_M loaded into Unified GPU Memory.</div>
              <div>[SECURITY AUDIT] Zero-Egress Sandbox Enforced. Sockets: 0. Awaiting prompt...</div>
            </div>
          </div>

          <!-- 5. Jameel Store Simulator (Headless Edge Commerce) -->
          <div class="sandbox-view-panel hidden" id="sandbox-view-jameel-store">
            <div class="sb-intro-text">
              ${t("محاكاة استجابة المتجر فائق السرعة عبر API بدون رأس مع توقيع المعاملات محلياً بشريحة Ed25519:", "Live simulation of headless commerce API latency and local Ed25519 transaction signing:")}
            </div>

            <div class="sb-action-row">
              <button type="button" class="btn btn--primary btn--sm sb-action-full" id="btn-run-store-bench">
                <span>⚡</span>
                <span>${t("اختبار سرعة استجابة واجهات الشراء والسلة", "Benchmark Sub-Millisecond Checkout")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-store-output">
              <div>GET /api/v1/products?limit=100 -> 200 OK (2.4ms) [CACHE: HIT]</div>
              <div>POST /api/v1/checkout/session -> 201 Created (4.6ms) [ED25519 SIGNED]</div>
              <div>Cart calculation verified with 0 cloud roundtrips.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enterprise RFQ & Custom Deployment Modal (WCAG AAA & CSP-Safe) -->
    <div class="dash-modal-overlay hidden" id="modal-product-rfq" role="dialog" aria-modal="true" aria-labelledby="modal-rfq-title">
      <div class="dash-modal dash-modal-md">
        <div class="dash-modal-header">
          <div class="dash-modal-title-wrap">
            <span class="dash-modal-icon">📋</span>
            <h3 class="dash-modal-title" id="modal-rfq-title">
              ${t("طلب مواصفة فنية واعتماد تجاري", "Enterprise RFQ & Technical Accreditation")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-rfq-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-product-rfq" class="dash-modal-scroll" aria-label="${t("نموذج طلب مواصفة فنية للمنتجات", "Product Technical Specification Request Form")}">
          <div id="product-rfq-error" role="alert" aria-live="polite" class="color-red font-bold text-sm mb-2"></div>

          <div class="dash-grid-2">
            <div>
              <label for="rfq-org" class="dash-lbl">
                ${t("اسم المنشأة أو المؤسسة *", "Organization Name *")}
              </label>
              <input type="text" id="rfq-org" name="org" autocomplete="organization" required aria-required="true" class="dash-input">
            </div>
            <div>
              <label for="rfq-name" class="dash-lbl">
                ${t("اسم المسؤول التقني *", "Technical Lead Name *")}
              </label>
              <input type="text" id="rfq-name" name="name" autocomplete="name" required aria-required="true" class="dash-input">
            </div>
          </div>

          <div class="dash-form-group">
            <label for="rfq-email" class="dash-lbl">
              ${t("البريد الإلكتروني المؤسسي *", "Corporate Email *")}
            </label>
            <input type="email" id="rfq-email" name="email" autocomplete="email" required aria-required="true" class="dash-input">
          </div>

          <div class="dash-grid-2">
            <div>
              <label for="rfq-product" class="dash-lbl">
                ${t("النظام المستهدف", "Target System")}
              </label>
              <select id="rfq-product" name="product" autocomplete="off" class="dash-select">
                ${products.map((p) => `<option value="${p.slug}">${esc(p.title)} (${esc(p.kind)})</option>`).join("")}
              </select>
            </div>
            <div>
              <label for="rfq-topology" class="dash-lbl">
                ${t("طوبولوجيا النشر المقترحة", "Deployment Topology")}
              </label>
              <select id="rfq-topology" name="topology" autocomplete="off" class="dash-select">
                <option value="on-prem">${t("نشر سيادي معزول محلياً (Air-Gapped On-Prem)", "Air-Gapped Sovereign On-Prem")}</option>
                <option value="p2p-mesh">${t("شبكة لا مركزية هجينة (P2P Mesh Network)", "P2P Decentralized Mesh")}</option>
                <option value="hybrid-cloud">${t("سحابة سيادية خاصة (Dedicated Sovereign Cloud)", "Dedicated Sovereign Cloud")}</option>
              </select>
            </div>
          </div>

          <div class="dash-form-group">
            <label for="rfq-notes" class="dash-lbl">
              ${t("المتطلبات التشغيلية والتوافق النظامي", "Operational & Compliance Requirements")}
            </label>
            <textarea id="rfq-notes" name="notes" rows="3" autocomplete="off" placeholder="${t("مثال: اشتراطات هيئة الزكاة والضريبة، التوافق مع معايير الأمان السيبراني، عدد المستخدمين المتوقع...", "e.g. Compliance with local data regulations, expected concurrency, custom integrations...")}" class="dash-textarea"></textarea>
          </div>

          <div class="dash-actions-row">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-product-rfq">
              ${t("إلغاء", "Cancel")}
            </button>
            <button type="submit" class="btn btn--primary btn--sm" id="btn-submit-product-rfq">
              ${t("إرسال طلب المواصفة والاعتماد", "Submit RFQ & Request Specs")}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function renderIndex(ctx) {
  const { site, stats, themes, pages, products } = ctx;
  const p = pages.products;
  const isEn = ctx.locale === "en";
  const t = (ar, en) => (isEn ? en : ar);

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(t("المنتجات", "Products"), "SYS INDEX · ZERO DEBT PLATFORMS", "rv")}
        <h1 class="d-hero rv" style="--i:1">${p.h}</h1>
        <p class="lede rv" style="--i:2">${p.lede}</p>

        <!-- Sovereign System Metrics Strip -->
        <div class="prod-metrics-strip rv" style="--i:3">
          <div>
            <div class="prod-metric-lbl">${t("الأنظمة المطورة", "Built Systems")}</div>
            <div class="prod-metric-val color-cyan">7 ${t("أنظمة سيادية", "Sovereign")}</div>
          </div>
          <div>
            <div class="prod-metric-lbl">${t("الصمود دون إنترنت", "Offline Resilience")}</div>
            <div class="prod-metric-val color-green">100% Mesh</div>
          </div>
          <div>
            <div class="prod-metric-lbl">${t("تسريب البيانات الخارجية", "Data Leakage")}</div>
            <div class="prod-metric-val color-blue">0.00% Zero-Leak</div>
          </div>
          <div>
            <div class="prod-metric-lbl">${t("التدقيق والاعتماد", "Certification")}</div>
            <div class="prod-metric-val color-gold">Ed25519 + IFRS</div>
          </div>
        </div>
      </div>
    </section>`,

    `<!-- Interactive Filter & Live Search Bar -->
    <div class="prod-filter-bar wrap wrap--wide rv" id="prod-filter-suite" style="--i:3">
      <div class="prod-filter-tabs" role="tablist" aria-label="${t("تصفية الأنظمة والمنتجات", "Filter Systems & Products")}">
        <button type="button" class="prod-tab is-active active" data-filter="all" role="tab" aria-selected="true" aria-pressed="true">
          ${t("الكل", "All")} <span class="prod-tab-badge">7</span>
        </button>
        <button type="button" class="prod-tab" data-filter="fintech" role="tab" aria-selected="false" aria-pressed="false">
          ${t("الأنظمة المالية والمحاسبية", "FinTech & ERP")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="mesh" role="tab" aria-selected="false" aria-pressed="false">
          ${t("الصحة وشبكات الطوارئ", "Health & Mesh")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="os-ai" role="tab" aria-selected="false" aria-pressed="false">
          ${t("أنظمة التشغيل والذكاء", "OS & Private AI")} <span class="prod-tab-badge">2</span>
        </button>
        <button type="button" class="prod-tab" data-filter="commerce" role="tab" aria-selected="false" aria-pressed="false">
          ${t("المتاجر والهوية الرقمية", "Commerce & Studio")} <span class="prod-tab-badge">3</span>
        </button>
      </div>

      <div class="prod-search-wrapper">
        <label for="input-prod-search" class="sr-only">${t("بحث فوري في مواصفات الأنظمة", "Instant search in system specifications")}</label>
        <div class="prod-search-box">
          <span class="prod-search-icon" aria-hidden="true">🔍</span>
          <input type="search" id="input-prod-search" class="prod-search-input" autocomplete="off" placeholder="${t("ابحث في الأنظمة، التقنيات، أو المعايير (مثلاً: IFRS, P2P, AI, Glass)...", "Search systems, tech, or standards (e.g. IFRS, P2P, AI, Glass)...")}">
          <span class="prod-count-pill" id="prod-counter-display">${t("عرض 7 من 7 أنظمة", "Showing 7 of 7 systems")}</span>
        </div>
      </div>
    </div>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="hcards hcards--grid" id="prod-items-grid">
          ${products.map((x, i) => {
            const meta = PRODUCT_META[x.slug] || { category: "commerce", badgeAr: "نظام سيادي", badgeEn: "Sovereign System", icon: "⚡" };
            const cardMarkup = C.heroCard({
              ...x,
              themes,
              href: `/products/${x.slug}`,
              image: x.image,
              alt: x.title,
              metric: { platform: x.tags[0], standard: x.tags[1], honor: x.kind },
              ctaLabel: t("استعرض", "Explore"),
              stats,
              lazy: i > 0,
              tags: x.tags,
              level: 2
            });

            const searchTokens = [
              x.slug,
              x.title,
              x.headline,
              x.summary,
              ...(x.tags || []),
              isEn ? meta.domainEn : meta.domainAr
            ].join(" ").toLowerCase();

            return `
              <div class="prod-card-wrapper" data-category="${meta.category}" data-search="${esc(searchTokens)}">
                <div class="prod-card-topbar">
                  <span class="prod-card-domain">${esc(isEn ? meta.domainEn : meta.domainAr)}</span>
                  <span class="prod-card-icon">${meta.icon}</span>
                </div>
                ${cardMarkup}
                <div class="prod-card-actions">
                  <button type="button" class="btn btn--outline btn--sm btn-open-sandbox" data-product="${x.slug}">
                    <span>⚡</span>
                    <span>${t("تشغيل المحاكي المباشر", "Live Sandbox")}</span>
                  </button>
                  <button type="button" class="btn btn--outline btn--sm btn-open-rfq" data-product="${x.slug}" data-product-title="${esc(x.title)}">
                    <span>📋</span>
                    <span>${t("طلب مواصفة واعتماد", "Enterprise RFQ")}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>`,

    C.ctaBand({
      title: t("تحتاج نظاماً سيادياً بمواصفات خاصة؟", "Need a custom sovereign system?"),
      lede: t("نبني أنظمة مغلقة، معزولة تماماً عن السحابة العامة، أو شبكات هجينة صامدة مع حقوق ملكية فكرية مطلقة لمنشأتك.", "We engineer air-gapped, zero-dependency platforms with full intellectual property ownership for your organization."),
      primary: { label: t("ابدأ دراسة مشروعك", "Initiate Architecture Study"), href: "/contact" },
      secondary: { label: t("استعرض الخدمات الهندسية", "Explore Engineering Services"), href: "/services" },
      site,
      rv: 8
    }),

    renderSandboxModal(isEn, t, products)
  ]);

  return {
    path: "/products",
    html: page({
      site,
      seo: { ...p.seo, path: "/products", ogImage: "/assets/img/og/products.png" },
      active: "products",
      body,
      schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "المنتجات", path: "/products" }])],
      bodyClass: "page-products"
    })
  };
}

/* /products/[slug] — the rich product template (section 6.5) */
export function renderProduct(ctx, p) {
  const { site, stats, themes, cases } = ctx;
  const t = themes[p.theme] || themes.blue;
  const relatedCase = p.caseSlug ? cases.find((c) => c.slug === p.caseSlug) : null;
  const heroMedia = p.device === "cockpit" ? C.cockpit({ tilt: true, live: true, cls: "hero__dev" }) : p.mock ? C.device({ kind: p.device, inner: C.mockScreen(p.mock), alt: p.headline, tilt: true, label: p.title }) : p.image ? C.device({ kind: p.device, src: p.image, alt: p.title, tilt: true, lazy: false, label: p.title }) : "";
  const toc = [
    { id: "features", label: "المزايا" },
    ...(p.modules && p.modules.length ? [{ id: "modules", label: "الوحدات" }] : []),
    ...(p.countries && p.countries.length ? [{ id: "countries", label: "حزم الدول" }] : []),
    { id: "usecases", label: "لمن هو" },
    { id: "proof", label: "الدليل" },
    { id: "architecture", label: "البنية" }
  ];

  const body = join([
    `<section class="hero hero--product themed${t.ink ? " hero--ink" : ""}" style="${C.themeStyle(t)};view-transition-name:vt-${p.slug};view-transition-class:vt-card" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          <nav class="crumbs rv" aria-label="مسار التنقّل"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="/products">المنتجات</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
          <div class="chero__eyebrow rv" style="--i:1">${C.syscode(p.code, p.status)}<span class="chero__kind">${esc(p.kind)}</span></div>
          <h1 class="d-hero rv" style="--i:2">${esc(p.title)}</h1>
          <p class="lede rv" style="--i:3">${p.headline}</p>
          <div class="chips rv" style="--i:4">${p.tags.map((x) => `<span class="chip chip--card">${esc(x)}</span>`).join("")}</div>
          <div class="btn-row rv" style="--i:5">
            ${C.btn({ href: "/contact", label: p.cta ? p.cta.label : "اطلب ترخيص المنظومة", kind: "primary" })}
            ${relatedCase ? C.btn({ href: `/work/${relatedCase.slug}`, label: "دراسة الحالة", kind: "ghost", arrow: true }) : C.btn({ href: "/work", label: "كل الأعمال", kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${heroMedia}</div>
      </div>
    </section>`,

    C.subnav({ title: p.title, code: p.code, status: p.status, cta: p.cta ? p.cta.label : "طلب عرض", href: "/contact", secondary: relatedCase ? { href: `/work/${relatedCase.slug}`, label: "دراسة الحالة" } : null }),
    p.film ? C.film(p.film) : "",
    p.moments ? C.moments(p.moments, stats) : "",

    /* drawn only where the drawing is true — this flow is the live demo's own
       sequence, not an illustration invented for the page */
    p.flow ? `<section class="sec sec--alt" id="flow">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: p.flow.eyebrow, eyebrowEn: "THE PATH", h: p.flow.h, lede: p.flow.lede })}
        ${C.flow({ steps: p.flow.steps, label: p.flow.h })}
      </div>
    </section>` : "",

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "في هذه الصفحة", items: [...(p.film ? [{ id: "film", label: "كيف يعمل" }] : []), ...toc] }], "فهرس المنتج")}
          <div class="indexed__col">

            <div class="case__sec" id="features">
              ${C.sectionHead({ eyebrowAr: "المزايا", eyebrowEn: "FEATURES", h: "ما الذي يفعله فعلاً" })}
              ${C.featureList(p.features, 2)}
            </div>

            ${p.modules && p.modules.length ? `
            <div class="case__sec" id="modules">
              ${C.sectionHead({ eyebrowAr: "الوحدات", eyebrowEn: "MODULES", h: `${p.modules.length} وحدات جاهزة` })}
              <div class="tbl-wrap rv" tabindex="0" role="region" aria-labelledby="mod-cap">
                <table class="tbl">
                  <caption class="sr-only" id="mod-cap">جدول وحدات ${esc(p.title)} وما تشمله كل وحدة</caption>
                  <thead><tr><th scope="col">الوحدة</th><th scope="col">ما تشمله</th></tr></thead>
                  <tbody>${p.modules.map(([m, d]) => `<tr><td>${esc(m)}</td><td>${esc(d)}</td></tr>`).join("")}</tbody>
                </table>
              </div>
            </div>` : ""}

            ${p.countries && p.countries.length ? `
            <div class="case__sec" id="countries">
              ${C.sectionHead({ eyebrowAr: "حزم الدول", eyebrowEn: "COUNTRY PACKS", h: `${p.countries.length} حزم دول`, lede: p.countriesNote || "" })}
              <div class="packs rv" data-stagger>${p.countries.map((c) => `<span class="pack">${esc(c)}</span>`).join("")}</div>
            </div>` : ""}

            <div class="case__sec" id="usecases">
              ${C.sectionHead({ eyebrowAr: "لمن هو", eyebrowEn: "USE CASES", h: "من يستفيد منه" })}
              <div class="ucases rv" data-stagger>${(p.useCases || []).map((u, i) => `<article class="ucase"><span class="ucase__n mono">0${i + 1}</span><h3>${u.t}</h3><p>${u.d}</p></article>`).join("")}</div>
            </div>

            <div class="case__sec" id="proof">
              ${C.sectionHead({ eyebrowAr: "الدليل", eyebrowEn: "PROOF", h: "أرقام لا صفات" })}
              <div class="impact rv" data-stagger>${(p.proof || []).map((x) => C.impactTile(x.stat ? x : x.text !== undefined ? x : { n: x.n, prefix: x.prefix || "", suffix: x.suffix || "", label: x.label }, stats)).join("")}</div>
              ${p.testimonial ? `<blockquote class="quote quote--pull rv"><p>${p.testimonial.text}</p><footer>— ${esc(p.testimonial.name)}</footer></blockquote>` : ""}
            </div>

            <div class="case__sec" id="architecture">
              ${C.sectionHead({ eyebrowAr: "البنية التقنية", eyebrowEn: "ARCHITECTURE", h: "كيف بُني" })}
              <ul class="bullets rv" data-stagger>${(p.architecture || []).map((a) => `<li>${a}</li>`).join("")}</ul>
              ${relatedCase ? C.nextCard(relatedCase, themes, "دراسة الحالة") : ""}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: p.cta ? p.cta.label : "جرّب النظام", lede: p.cta ? p.cta.sub : "عرض تقديمي مباشر", primary: { href: "/contact", label: p.cta ? p.cta.label : "اطلب عرضاً", kind: "primary" }, site })
  ]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    brand: { "@type": "Brand", name: site.brand.latin },
    sku: p.code,
    category: p.kind,
    url: `${site.brand.url}/products/${p.slug}`,
    ...(p.image ? { image: `${site.brand.url}${p.image}` } : {})
  };

  return {
    path: `/products/${p.slug}`,
    html: page({
      site,
      seo: { title: seoTitle(p.title, p.headline, "عوالِم قروب"), description: p.summary, path: `/products/${p.slug}`, ogImage: `/assets/img/og/products-${p.slug}.png`, type: "product" },
      active: "products",
      body,
      schema: [productSchema, breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "المنتجات", path: "/products" }, { name: p.title, path: `/products/${p.slug}` }])],
      bodyClass: "page-product"
    })
  };
}
