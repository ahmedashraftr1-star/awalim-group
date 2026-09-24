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
    badgeAr: "تجارة بدون رأس (Headless) · تحميل فائق السرعة",
    badgeEn: "HEADLESS COMMERCE · INSTANT CHECKOUT",
    domainAr: "تجارة إلكترونية سيادية",
    domainEn: "Sovereign Headless Commerce",
    icon: "🛍️"
  },
  "web-platforms": {
    category: "commerce",
    badgeAr: "بنية ويب مؤسسية · صفر اعتماديات تشغيلية",
    badgeEn: "ENTERPRISE WEB CORE · ZERO RUNTIME OVERHEAD",
    domainAr: "منصات الويب المؤسسية",
    domainEn: "Enterprise Web Platforms",
    icon: "🌐"
  },
  "brand-studio": {
    category: "commerce",
    badgeAr: "هندسة الهوية الرقمية · محرك متجهات SVG حي",
    badgeEn: "IDENTITY ENGINEERING · DYNAMIC SVG ENGINE",
    domainAr: "استوديو الهوية الرقمية",
    domainEn: "Digital Brand Studio",
    icon: "🎨"
  }
};

function renderModals(t, products, isEn) {
  return `
    <!-- Sovereign Systems Sandbox Modal -->
    <div class="dash-modal-overlay" id="modal-product-sandbox" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-sandbox-title">
      <div class="dash-modal" style="max-width:720px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">⚡</span>
            <h3 class="dash-modal-title" id="modal-sandbox-title" style="margin:0; font-size:1.15rem; font-weight:700;">
              ${t("محاكي الأنظمة السيادية المباشر (Live Sandbox)", "Sovereign Systems Live Sandbox")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-sandbox-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <div class="sandbox-tabs-nav" role="tablist" aria-label="${t("اختيار نظام للمحاكاة", "Select System Sandbox")}">
          <button type="button" class="sandbox-tab-btn active" data-sandbox-tab="smart-accountant">📊 ${t("محاسب ذكي (ZATCA)", "Smart Accountant")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="rahmacare">🕊️ ${t("RahmaCare (Mesh P2P)", "RahmaCare Mesh")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="vibe-os">⚡ ${t("Vibe OS (Glass OS)", "Vibe OS 4.0")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="ai-lab">🧠 ${t("AI Lab (Local LLM)", "AI Lab Engine")}</button>
          <button type="button" class="sandbox-tab-btn" data-sandbox-tab="jameel-store">🛍️ ${t("Jameel Store", "Jameel Store")}</button>
        </div>

        <div style="padding:1.5rem; max-height:calc(85vh - 120px); overflow-y:auto;">
          <!-- 1. Smart Accountant Simulator -->
          <div class="sandbox-view-panel" id="sandbox-view-smart-accountant">
            <div style="margin-bottom:1rem; font-size:0.9rem; color:var(--dim,#8b949e);">
              ${t("محاكاة فورية لمحرك القيد المزدوج IFRS والختم التشفيري للفاتورة الإلكترونية (ZATCA Phase 2):", "Live simulation of IFRS double-entry engine & cryptographic ZATCA Phase 2 hash signing:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-acc-amount">${t("قيمة الفاتورة (ر.س / EGP)", "Invoice Amount")}</label>
                <input type="number" id="sb-acc-amount" value="10000" min="100" step="100">
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-acc-tax">${t("نسبة الضريبة", "Tax Rate")}</label>
                <select id="sb-acc-tax">
                  <option value="0.15">${t("15% — المملكة العربية السعودية (ZATCA)", "15% — Kingdom of Saudi Arabia (ZATCA)")}</option>
                  <option value="0.14">${t("14% — جمهورية مصر العربية (ETA)", "14% — Arab Republic of Egypt (ETA)")}</option>
                  <option value="0.05">${t("5% — دولة الإمارات العربية المتحدة", "5% — United Arab Emirates (FTA)")}</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <button type="button" class="btn btn--primary btn--sm" id="btn-run-acc-calc" style="width:100%; justify-content:center;">
                <span>⚡</span>
                <span>${t("ترحيل القيد وتوليد الختم التشفيري", "Commit Journal & Generate Cryptographic Stamp")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-acc-output">
              <div>[IFRS-ENGINE] Ready. Awaiting commit...</div>
              <div>[STATUS] Balanced Ledger Verified (Debits = Credits).</div>
            </div>
          </div>

          <!-- 2. RahmaCare Mesh Simulator -->
          <div class="sandbox-view-panel" id="sandbox-view-rahmacare" style="display:none;">
            <div style="margin-bottom:1rem; font-size:0.9rem; color:var(--dim,#8b949e);">
              ${t("محاكاة شبكة الطوارئ الميدانية P2P عبر موجات LoRa دون الحاجة إلى اتصال بالإنترنت:", "Live simulation of RahmaCare P2P LoRa mesh routing without internet connectivity:")}
            </div>

            <div style="display:flex; gap:0.5rem; margin-bottom:1rem; flex-wrap:wrap;">
              <button type="button" class="btn btn--primary btn--sm" id="btn-run-mesh-ping">
                <span>🕊️</span>
                <span>${t("إرسال نداء فرز طبي مشفر", "Dispatch Encrypted Triage Packet")}</span>
              </button>
              <button type="button" class="btn btn--outline btn--sm" id="btn-toggle-blackout">
                <span>📡</span>
                <span>${t("محاكاة انقطاع الإنترنت التام", "Simulate Total Blackout")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-mesh-output">
              <div>[MESH] 5 Nodes active: RF-02 (Rafah) · KH-01 · DB-03 · GZ-04 · BY-05.</div>
              <div>[RADIO] LoRa SX1262 433MHz active. Standby...</div>
            </div>
          </div>

          <!-- 3. Vibe OS 4.0 Simulator -->
          <div class="sandbox-view-panel" id="sandbox-view-vibe-os" style="display:none;">
            <div style="margin-bottom:1rem; font-size:0.9rem; color:var(--dim,#8b949e);">
              ${t("محاكي فيزياء الزجاج السيادي ومعامل الانكسار لبيئة Vibe OS 4.0:", "Live simulation of Sovereign Glass refraction and spring mechanics in Vibe OS 4.0:")}
            </div>

            <div class="sandbox-calc-grid">
              <div class="sandbox-calc-box">
                <label for="sb-glass-blur">${t("شدة التغبيش (Blur px)", "Glass Blur (px)")}</label>
                <input type="range" id="sb-glass-blur" min="5" max="50" value="24">
              </div>
              <div class="sandbox-calc-box">
                <label for="sb-glass-sat">${t("التشبع اللوني (Saturation %)", "Color Saturation (%)")}</label>
                <input type="range" id="sb-glass-sat" min="100" max="250" value="180">
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <button type="button" class="btn btn--outline btn--sm" id="btn-matrix-toggle" style="width:100%; justify-content:center;">
                <span>💻</span>
                <span>${t("تشغيل بروتوكول GOD MODE (Matrix Stream)", "Activate GOD MODE Protocol (Matrix Stream)")}</span>
              </button>
            </div>

            <div id="sb-glass-card-preview" style="padding:1.5rem; border-radius:16px; background:rgba(255,255,255,0.06); backdrop-filter:blur(24px) saturate(180%); border:1px solid rgba(255,255,255,0.15); transition:all 0.2s ease;">
              <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.25rem;">Sovereign Glass OS Live Node</div>
              <div style="font-size:0.85rem; color:var(--dim,#8b949e);">Refraction index: 1.48 · Spring Mass: 1.0 · Damping: 0.85</div>
            </div>
          </div>

          <!-- 4. AI Lab Simulator -->
          <div class="sandbox-view-panel" id="sandbox-view-ai-lab" style="display:none;">
            <div style="margin-bottom:1rem; font-size:0.9rem; color:var(--dim,#8b949e);">
              ${t("فحص سرعة استدلال نماذج الذكاء الاصطناعي السيادية المعزولة دون اتصال خارجي:", "Benchmark local sovereign LLM inference speed with zero external network egress:")}
            </div>

            <div style="margin-bottom:1rem;">
              <button type="button" class="btn btn--primary btn--sm" id="btn-run-ai-inference" style="width:100%; justify-content:center;">
                <span>🧠</span>
                <span>${t("تشغيل استدلال النموذج المحلي (Private Inference Benchmark)", "Run Local Private Inference Benchmark")}</span>
              </button>
            </div>

            <div class="sandbox-terminal-view" id="sb-ai-output">
              <div>[MODEL] Sovereign-DeepSeek-R1-Q4_K_M (7.2GB local weights)</div>
              <div>[AUDIT] Zero-Egress Sandbox Enforced. Awaiting prompt...</div>
            </div>
          </div>

          <!-- 5. Jameel Store Simulator -->
          <div class="sandbox-view-panel" id="sandbox-view-jameel-store" style="display:none;">
            <div style="margin-bottom:1rem; font-size:0.9rem; color:var(--dim,#8b949e);">
              ${t("محاكاة استجابة المتجر فائق السرعة عبر API بدون رأس (Headless API):", "Live simulation of headless commerce API latency and offline caching:")}
            </div>

            <div class="sandbox-terminal-view">
              <div>GET /api/v1/products?limit=100 -> 200 OK (3.8ms) [CACHE: HIT]</div>
              <div>POST /api/v1/checkout/session -> 201 Created (12.4ms) [ED25519 SIGNED]</div>
              <div>Cart calculation verified with 0 roundtrips.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enterprise RFQ & Custom Deployment Modal -->
    <div class="dash-modal-overlay" id="modal-product-rfq" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-rfq-title">
      <div class="dash-modal" style="max-width:580px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">📋</span>
            <h3 class="dash-modal-title" id="modal-rfq-title" style="margin:0; font-size:1.15rem; font-weight:700;">
              ${t("طلب مواصفة فنية واعتماد تجاري", "Enterprise RFQ & Technical Accreditation")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-rfq-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-product-rfq" aria-label="${t("نموذج طلب مواصفة فنية للمنتجات", "Product Technical Specification Request Form")}" style="padding:1.25rem;">
          <div id="product-rfq-error" role="alert" aria-live="polite" style="color:#f87171; font-size:0.85rem; margin-bottom:0.75rem; font-weight:600;"></div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
            <div>
              <label for="rfq-org" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
                ${t("اسم المنشأة أو المؤسسة *", "Organization Name *")}
              </label>
              <input type="text" id="rfq-org" name="org" autocomplete="organization" required aria-required="true" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff;">
            </div>
            <div>
              <label for="rfq-name" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
                ${t("اسم المسؤول التقني *", "Technical Lead Name *")}
              </label>
              <input type="text" id="rfq-name" name="name" autocomplete="name" required aria-required="true" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff;">
            </div>
          </div>

          <div style="margin-bottom:0.75rem;">
            <label for="rfq-email" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
              ${t("البريد الإلكتروني المؤسسي *", "Corporate Email *")}
            </label>
            <input type="email" id="rfq-email" name="email" autocomplete="email" required aria-required="true" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff;">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
            <div>
              <label for="rfq-product" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
                ${t("النظام المستهدف", "Target System")}
              </label>
              <select id="rfq-product" name="product" autocomplete="off" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff;">
                ${products.map((p) => `<option value="${p.slug}">${esc(p.title)} (${esc(p.kind)})</option>`).join("")}
              </select>
            </div>
            <div>
              <label for="rfq-topology" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
                ${t("طوبولوجيا النشر المقترحة", "Deployment Topology")}
              </label>
              <select id="rfq-topology" name="topology" autocomplete="off" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff;">
                <option value="on-prem">${t("نشر سيادي معزول محلياً (Air-Gapped On-Prem)", "Air-Gapped Sovereign On-Prem")}</option>
                <option value="p2p-mesh">${t("شبكة لا مركزية هجينة (P2P Mesh Network)", "P2P Decentralized Mesh")}</option>
                <option value="hybrid-cloud">${t("سحابة سيادية خاصة (Dedicated Sovereign Cloud)", "Dedicated Sovereign Cloud")}</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom:1.25rem;">
            <label for="rfq-notes" style="display:block; font-size:0.82rem; margin-bottom:0.35rem; color:var(--dim,#8b949e);">
              ${t("المتطلبات التشغيلية والتوافق النظامي", "Operational & Compliance Requirements")}
            </label>
            <textarea id="rfq-notes" name="notes" rows="3" autocomplete="off" placeholder="${t("مثال: اشتراطات هيئة الزكاة والضريبة، التوافق مع معايير الأمان السيبراني، عدد المستخدمين المتوقع...", "e.g. Compliance with local data regulations, expected concurrency, custom integrations...")}" style="width:100%; padding:0.5rem 0.75rem; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff; font-family:inherit;"></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
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
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-top:2rem; padding:1.25rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:16px;" class="rv" style="--i:3">
          <div>
            <div style="font-size:0.75rem; color:var(--dim,#8b949e); ">${t("الأنظمة المطورة", "Built Systems")}</div>
            <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono, monospace); color:var(--accent,#00F0FF);">7 ${t("أنظمة سيادية", "Sovereign")}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--dim,#8b949e); ">${t("الصمود دون إنترنت", "Offline Resilience")}</div>
            <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono, monospace); color:#4ade80;">100% Mesh</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--dim,#8b949e); ">${t("تسريب البيانات الخارجية", "Data Leakage")}</div>
            <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono, monospace); color:#60a5fa;">0.00% Zero-Leak</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--dim,#8b949e); ">${t("التدقيق والاعتماد", "Certification")}</div>
            <div style="font-size:1.5rem; font-weight:800; font-family:var(--font-mono, monospace); color:#fbbf24;">Ed25519 + IFRS</div>
          </div>
        </div>
      </div>
    </section>`,

    `<!-- Interactive Filter & Live Search Bar -->
    <div class="prod-filter-bar wrap wrap--wide rv" id="prod-filter-suite" style="--i:3">
      <div class="prod-filter-tabs" role="tablist" aria-label="${t("تصفية الأنظمة والمنتجات", "Filter Systems & Products")}">
        <button type="button" class="prod-tab active" data-filter="all" role="tab" aria-selected="true">
          ${t("الكل", "All")} <span class="prod-tab-badge">7</span>
        </button>
        <button type="button" class="prod-tab" data-filter="fintech" role="tab" aria-selected="false">
          ${t("الأنظمة المالية والمحاسبية", "FinTech & ERP")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="mesh" role="tab" aria-selected="false">
          ${t("الصحة وشبكات الطوارئ", "Health & Mesh")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="os-ai" role="tab" aria-selected="false">
          ${t("أنظمة التشغيل والذكاء", "OS & Private AI")} <span class="prod-tab-badge">2</span>
        </button>
        <button type="button" class="prod-tab" data-filter="commerce" role="tab" aria-selected="false">
          ${t("المتاجر والهوية الرقمية", "Commerce & Studio")} <span class="prod-tab-badge">3</span>
        </button>
      </div>

      <div class="prod-search-wrapper">
        <label for="input-prod-search" class="sr-only">${t("بحث فوري في مواصفات الأنظمة", "Instant search in system specifications")}</label>
        <div class="prod-search-box">
          <span class="prod-search-icon" aria-hidden="true">🔍</span>
          <input type="search" id="input-prod-search" class="prod-search-input" autocomplete="off" placeholder="${t("ابحث في الأنظمة، التقنيات، أو المعايير (مثلاً: IFRS, P2P, AI, Glass)...", "Search systems, tech, or standards (e.g. IFRS, P2P, AI, Glass)...")}">
          <span class="prod-count-pill" id="prod-counter-display">${t("عرض 7 من أصل 7 أنظمة", "Showing 7 of 7 systems")}</span>
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

            const searchTokens = `${x.title} ${x.headline} ${x.summary || ""} ${x.tags.join(" ")} ${x.code} ${meta.category}`.toLowerCase();

            return `
              <div class="prod-card-wrapper" data-category="${meta.category}" data-search="${esc(searchTokens)}" style="display:flex; flex-direction:column;">
                <div style="margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-size:0.75rem; font-family:var(--font-mono, monospace); color:var(--accent,#00F0FF); background:rgba(0,240,255,0.08); padding:0.2rem 0.5rem; border-radius:6px;">
                    ${esc(isEn ? meta.badgeEn : meta.badgeAr)}
                  </span>
                  <span style="font-size:1.1rem;">${meta.icon}</span>
                </div>
                ${cardMarkup}
                <div style="margin-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
                  <button type="button" class="btn btn--outline btn--sm btn-open-sandbox" data-product="${x.slug}" style="flex:1; justify-content:center;">
                    <span>⚡</span>
                    <span>${t("المحاكي المباشر", "Live Sandbox")}</span>
                  </button>
                  <button type="button" class="btn btn--outline btn--sm btn-open-rfq" data-product="${x.slug}" data-product-title="${esc(x.title)}" style="flex:1; justify-content:center;">
                    <span>📋</span>
                    <span>${t("طلب مواصفة", "Request RFQ")}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>`,

    C.ctaBand({
      h: t("جرّب النظام على بياناتك", "Test the system on your data"),
      lede: t("نُجري لك عرضاً تقديمياً على حالة من واقع شركتك — لا على بيانات تجريبية جاهزة.", "We deliver a live walkthrough built around your actual enterprise cases — not generic dummy data."),
      primary: { href: "/contact", label: t("اطلب عرضاً تقديمياً", "Request a live presentation"), kind: "primary" },
      site
    }),

    renderModals(t, products, isEn)
  ]);

  return {
    path: "/products",
    html: page({
      site,
      seo: { ...p.seo, path: "/products", ogImage: "/assets/img/og/products.png" },
      active: "products",
      body,
      schema: [breadcrumbSchema(site, [{ name: isEn ? "Home" : "الرئيسية", path: isEn ? "/en" : "/" }, { name: isEn ? "Products" : "المنتجات", path: "/products" }])],
      bodyClass: "page-products"
    })
  };
}

/* /products/[slug] — the rich product template (section 6.5) */
export function renderProduct(ctx, p) {
  const { site, stats, themes, cases, products } = ctx;
  const isEn = ctx.locale === "en";
  const t = (ar, en) => (isEn ? en : ar);
  const tTheme = themes[p.theme];
  const relatedCase = p.caseSlug ? cases.find((c) => c.slug === p.caseSlug) : null;
  const heroMedia = p.device === "cockpit" ? C.cockpit({ tilt: true, live: true, cls: "hero__dev" }) : p.mock ? C.device({ kind: p.device, inner: C.mockScreen(p.mock), alt: p.headline, tilt: true, label: p.title }) : p.image ? C.device({ kind: p.device, src: p.image, alt: p.title, tilt: true, lazy: false, label: p.title }) : "";
  const toc = [
    { id: "features", label: t("المزايا", "Features") },
    ...(p.modules.length ? [{ id: "modules", label: t("الوحدات", "Modules") }] : []),
    ...(p.countries.length ? [{ id: "countries", label: t("حزم الدول", "Country Packs") }] : []),
    { id: "usecases", label: t("لمن هو", "Use Cases") },
    { id: "proof", label: t("الدليل", "Proof") },
    { id: "architecture", label: t("البنية التقنية", "Architecture") }
  ];

  const body = join([
    `<section class="hero hero--product themed${tTheme.ink ? " hero--ink" : ""}" style="${C.themeStyle(tTheme)};view-transition-name:vt-${p.slug};view-transition-class:vt-card" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          <nav class="crumbs rv" aria-label="${t("مسار التنقّل", "Breadcrumb navigation")}">
            <a href="/">${t("الرئيسية", "Home")}</a>
            <span aria-hidden="true">/</span>
            <a href="/products">${t("المنتجات", "Products")}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">${esc(p.title)}</span>
          </nav>
          <div class="chero__eyebrow rv" style="--i:1">${C.syscode(p.code, p.status)}<span class="chero__kind">${esc(p.kind)}</span></div>
          <h1 class="d-hero rv" style="--i:2">${esc(p.title)}</h1>
          <p class="lede rv" style="--i:3">${p.headline}</p>
          <div class="chips rv" style="--i:4">${p.tags.map((x) => `<span class="chip chip--card">${esc(x)}</span>`).join("")}</div>
          <div class="btn-row rv" style="--i:5">
            ${C.btn({ href: "/contact", label: p.cta.label, kind: "primary" })}
            <button type="button" class="btn btn--outline btn-open-sandbox" data-product="${p.slug}">
              <span>⚡</span>
              <span>${t("المحاكي المباشر", "Live Sandbox")}</span>
            </button>
            <button type="button" class="btn btn--outline btn-open-rfq" data-product="${p.slug}" data-product-title="${esc(p.title)}">
              <span>📋</span>
              <span>${t("طلب مواصفة فنية", "Request RFQ")}</span>
            </button>
            ${relatedCase ? C.btn({ href: `/work/${relatedCase.slug}`, label: t("دراسة الحالة", "Case Study"), kind: "ghost", arrow: true }) : C.btn({ href: "/work", label: t("كل الأعمال", "All Work"), kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${heroMedia}</div>
      </div>
    </section>`,

    C.subnav({ title: p.title, code: p.code, status: p.status, cta: p.cta.label, href: "/contact", secondary: relatedCase ? { href: `/work/${relatedCase.slug}`, label: t("دراسة الحالة", "Case Study") } : null }),
    p.film ? C.film(p.film) : "",
    p.moments ? C.moments(p.moments, stats) : "",

    p.flow ? `<section class="sec sec--alt" id="flow">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: p.flow.eyebrow, eyebrowEn: "THE PATH", h: p.flow.h, lede: p.flow.lede })}
        ${C.flow({ steps: p.flow.steps, label: p.flow.h })}
      </div>
    </section>` : "",

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: t("في هذه الصفحة", "On this page"), items: [...(p.film ? [{ id: "film", label: t("كيف يعمل", "How it works") }] : []), ...toc] }], t("فهرس المنتج", "Product Index"))}
          <div class="indexed__col">

            <div class="case__sec" id="features">
              ${C.sectionHead({ eyebrowAr: "المزايا", eyebrowEn: "FEATURES", h: t("ما الذي يفعله فعلاً", "What it actually does") })}
              ${C.featureList(p.features, 2)}
            </div>

            ${p.modules && p.modules.length ? `
            <div class="case__sec" id="modules">
              ${C.sectionHead({ eyebrowAr: "الوحدات", eyebrowEn: "MODULES", h: isEn ? `${p.modules.length} ready modules` : `${p.modules.length} وحدات جاهزة` })}
              <div class="tbl-wrap rv" tabindex="0" role="region" aria-labelledby="mod-cap">
                <table class="tbl">
                  <caption class="sr-only" id="mod-cap">${t(`جدول وحدات ${esc(p.title)} وما تشمله كل وحدة`, `Modules table for ${esc(p.title)}`)}</caption>
                  <thead><tr><th scope="col">${t("الوحدة", "Module")}</th><th scope="col">${t("ما تشمله", "Coverage")}</th></tr></thead>
                  <tbody>${p.modules.map(([m, d]) => `<tr><td>${esc(m)}</td><td>${esc(d)}</td></tr>`).join("")}</tbody>
                </table>
              </div>
            </div>` : ""}

            ${p.countries && p.countries.length ? `
            <div class="case__sec" id="countries">
              ${C.sectionHead({ eyebrowAr: "حزم الدول", eyebrowEn: "COUNTRY PACKS", h: isEn ? `${p.countries.length} country packs` : `${p.countries.length} حزم دول`, lede: p.countriesNote })}
              <div class="packs rv" data-stagger>${p.countries.map((c) => `<span class="pack">${esc(c)}</span>`).join("")}</div>
            </div>` : ""}

            <div class="case__sec" id="usecases">
              ${C.sectionHead({ eyebrowAr: "لمن هو", eyebrowEn: "USE CASES", h: t("من يستفيد منه", "Who benefits") })}
              <div class="ucases rv" data-stagger>${p.useCases.map((u, i) => `<article class="ucase"><span class="ucase__n mono">0${i + 1}</span><h3>${u.t}</h3><p>${u.d}</p></article>`).join("")}</div>
            </div>

            <div class="case__sec" id="proof">
              ${C.sectionHead({ eyebrowAr: "الدليل", eyebrowEn: "PROOF", h: t("أرقام لا صفات", "Numbers, not adjectives") })}
              <div class="impact rv" data-stagger>${p.proof.map((x) => C.impactTile(x.stat ? x : x.text !== undefined ? x : { n: x.n, prefix: x.prefix || "", suffix: x.suffix || "", label: x.label }, stats)).join("")}</div>
              ${p.testimonial ? `<blockquote class="quote quote--pull rv"><p>${p.testimonial.text}</p><footer>— ${esc(p.testimonial.name)}</footer></blockquote>` : ""}
            </div>

            <div class="case__sec" id="architecture">
              ${C.sectionHead({ eyebrowAr: "البنية التقنية", eyebrowEn: "ARCHITECTURE", h: t("كيف بُني", "How it is built") })}
              <ul class="bullets rv" data-stagger>${p.architecture.map((a) => `<li>${a}</li>`).join("")}</ul>

              <!-- Sovereign Technical Verification Box -->
              <div style="margin-top:2rem; padding:1.25rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px;">
                <div style="font-size:0.78rem;  color:var(--accent,#00F0FF); margin-bottom:0.5rem;">
                  ${t("الاعتماد والتحقق السيادي المباشر", "Direct Sovereign Telemetry & Verification")}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; font-size:0.85rem;">
                  <div>
                    <span style="color:var(--dim,#8b949e); display:block;">${t("رمز النظام والتسجيل:", "System SKU:")}</span>
                    <strong style="font-family:var(--font-mono, monospace);">${esc(p.code)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--dim,#8b949e); display:block;">${t("ضمان الاتاحية التشغيلية:", "Operational SLA:")}</span>
                    <strong style="color:#4ade80;">99.999% High Availability</strong>
                  </div>
                  <div>
                    <span style="color:var(--dim,#8b949e); display:block;">${t("التشفير والعزل:", "Encryption & Isolation:")}</span>
                    <strong>Zero-Trust · Air-Gapped Ready</strong>
                  </div>
                </div>
              </div>

              ${relatedCase ? C.nextCard(relatedCase, themes, t("دراسة الحالة", "Case Study")) : ""}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: p.cta.label, lede: p.cta.sub, primary: { href: "/contact", label: p.cta.label, kind: "primary" }, site }),
    renderModals(t, products, isEn)
  ]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    brand: { "@type": "Brand", name: site.brand.latin },
    sku: p.code,
    category: p.kind,
    url: `${site.brand.url}${isEn ? "/en" : ""}/products/${p.slug}`,
    ...(p.image ? { image: `${site.brand.url}${p.image}` } : {})
  };

  return {
    path: `/products/${p.slug}`,
    html: page({
      site,
      seo: {
        title: seoTitle(p.title, p.headline, isEn ? "Awalim Group" : "عوالِم قروب"),
        description: p.summary,
        path: `/products/${p.slug}`,
        ogImage: `/assets/img/og/products-${p.slug}.png`,
        type: "product"
      },
      active: "products",
      body,
      schema: [productSchema, breadcrumbSchema(site, [{ name: isEn ? "Home" : "الرئيسية", path: isEn ? "/en" : "/" }, { name: isEn ? "Products" : "المنتجات", path: "/products" }, { name: p.title, path: `/products/${p.slug}` }])],
      bodyClass: "page-product"
    })
  };
}
