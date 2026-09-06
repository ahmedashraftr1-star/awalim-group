# عوالِم قروب — الموقع المؤسسي (v2)

موقع ثابت (static) من 30 صفحة، عربي أولاً RTL، وضع ليلي مصمَّم، ونظام حركة كامل —
مبني من **محتوى JSON + قوالب JavaScript** بسكربت بناء بلا أي dependencies.
المخرجات HTML/CSS/JS خالصة تُرفع كما هي على أي استضافة.

```
npm run build      # يولّد كل الصفحات + assets/css/awalim.css + sitemap.xml
npm run dev        # build ثم معاينة محلية على http://localhost:8899 (brotli + clean URLs زي Vercel)
npm test           # دلالات الدمج ثنائي اللغة + تباين WCAG + روابط داخلية + Playwright + تدقيق الصفحة كما تُرسم
npm run audit      # التدقيق وحده: كل مسار × فاتح/ليلي/موبايل — تباين فعلي، نص مقصوص، حجم الأهداف
npm run og         # يولّد صور Open Graph لكل صفحة (assets/img/og/)
npm run covers     # يولّد أغلفة المقالات التايبوغرافية (assets/img/journal/cover-*.webp)
npm run shots      # لقطات شاشة لكل الصفحات (desktop · dark · mobile)
```

> Node ≥ 18. الاختبارات وصور OG تحتاج `npm install` (Playwright) — البناء نفسه لا يحتاج شيئاً.

## البنية

```
src/content/          المحتوى — المصدر الوحيد للحقيقة
  site.json           العلامة، الأرقام (stats)، القائمة، الفوتر، ثيمات الأقسام، المعايير، المراحل، الأسئلة
  cases.json          8 دراسات حالة (+4 أعمال أصغر)  →  /work و /work/[slug]
  products.json       7 منتجات                        →  /products و /products/[slug]
  journal.json        6 مقالات كاملة                   →  /journal و /journal/[slug]
  pages.json          نصوص الصفحات الثابتة (الرئيسية، الخدمات، الأكاديمية، المجموعة، تواصل، 404)
src/lib/
  components.mjs      مكتبة المكوّنات (القسم 3.4 من البرومبت): أزرار، chips، بطاقات بطلة، Metric Bar،
                      Stat Tile، Feature Row، الفهرس الجانبي، الأكورديون، الموكابات، الـ cockpit الحيّ…
  layout.mjs          هيكل الصفحة: <head> + JSON-LD + Pill Nav + Drawer + Footer + السكربتات
  icons.mjs · html.mjs
src/pages/*.mjs       قالب لكل مسار
src/css/              الطبقات → تُدمج في assets/css/awalim.css
  tokens.css          رموز التصميم (ألوان light/dark، طباعة، مسافات، حواف، حركة) — انظر DESIGN-TOKENS.md
  base.css · components.css · motion.css · pages.css
assets/js/awalim.js   السلوك الأساسي بلا dependencies (ثيم، قائمة، كشف، عدّادات، أكورديون، فلاتر، scroll-spy، النموذج)
assets/js/motion.js   طبقة الحركة: محرّك scrub خفيف (40 سطراً بدل GSAP) + Lenis — parallax، pinned process، timeline، cockpit، الانتقالات، المؤشّر
assets/js/extras.js   «الموقع كنظام»: لوحة ⌘K، التحقّق من التوقيع، التدقيق الذاتي الحيّ، إمالة الأجهزة، تسميات المؤشّر، تلوين الخلفية، رسم المخطّط
assets/js/ledger.js   دفتر القيود الحيّ في الـ hero (يُحمَّل فقط حيث يوجد cockpit تفاعلي)
sw.js                 Service Worker مولَّد من src/sw.template.js (يحمل ختم البناء)
scripts/serve.mjs     خادم تطوير مطابق للإنتاج: brotli/gzip، clean URLs، 404، cache headers
assets/vendor/        lenis فقط (مستضاف محلياً — CSP يمنع CDN)
assets/fonts/         IBM Plex Sans Arabic (نص) · Alexandria 800/900 (عناوين العرض) · Archivo (لاتيني) · IBM Plex Mono (self-hosted, subset)
assets/img/journal/   أغلفة المقالات — تايبوغرافية مولَّدة من الهوية (`npm run covers`)، لا صور stock.
                      الغلاف يحمل «كلمة الغلاف» (`journal.json → coverWord`) لا العنوان: البطاقة تطبع العنوان
                      نصّاً تحته مباشرة، وصور OG وحدها هي التي تحمل العنوان لأنها تُرى منفردة.
assets/img/og/        صور OG مولَّدة لكل صفحة
scripts/              merge-test · contrast · check-links · e2e · audit-render · og · shots
build.mjs             سكربت البناء
```

## ما لا تجده في موقع شركة آخر

| الميزة | أين | كيف |
|---|---|---|
| **أرقام موقّعة تشفيريّاً** | كل شريط أرقام + `/verify` | البناء يوقّع `stats` بمفتاح Ed25519 خاصّ (`.keys/`، خارج git)؛ المتصفّح يعيد التحقّق عبر WebCrypto: الهاش، التوقيع، المفتاح المنشور، ومطابقة ما يُعرض بما وُقِّع. الملفّ العامّ: `/verify/stats.json` |
| **دفتر قيود حيّ** | hero الرئيسية | «صوِّر فاتورة» يستخرج ويقترح قيداً مزدوجاً يُحسب فعلاً (مدين = دائن)؛ «اعتمد» يرحّله فتتحدّث الأرقام والرسم |
| **التدقيق الذاتي** | بطاقات المعايير 06–08 + الفوتر | LCP/CLS/INP والوزن والتباين وتسلسل العناوين تُقاس حيّاً في متصفّح الزائر عبر PerformanceObserver |
| **لوحة أوامر ⌘K** | كل الصفحات | فهرس `search.json` يُبنى وقت البناء بتطبيع عربي (تشكيل، همزات، تاء مربوطة) |
| **View Transitions بعناصر مشتركة** | البطاقات → صفحاتها | `view-transition-name` لكل بطاقة/hero — البطاقة نفسها تتحوّل إلى الصفحة |
| **موكابات HTML صادقة** | الأكاديمية · Vibe OS · مختبر الذكاء | واجهات المنتجات مرسومة بـ HTML/CSS (`mockScreen()`) بدل صور AI عامّة — تتبدّل مع الثيم وتُقرأ بقارئ الشاشة |
| **مخطّط النظام** | قسم الأطروحة | SVG يُرسم بالسكرول (`pathLength=1`) في الفراغ المقصود للقسم |
| **فيلم المنتج المثبّت** (Apple-style) | `/products/smart-accountant` | الجهاز ثابت والسكرول يقلّب 5 فصول: صوِّر → استخرِج → وازِن → رحِّل → أقفِل (`products.json → film`) |
| **لحظات الأرقام + الشريط اللاصق** | صفحات المنتجات والحالات | أرقام ضخمة تكبر مع السكرول، وشريط اسم المنتج + CTA يلتصق تحت القائمة |
| **Dynamic Island** | كل الصفحات | إشعار حيّ واحد لكل حدث (قيد رُحّل، الأرقام موقّعة، الوضع الليلي، نُسخ الرابط) — `AwalimIsland.say()` |
| **أسرع من الإنتاج نفسه** | كل الصفحات | CSS الحرج مضمّن (`/* @critical */` fences)، Service Worker (`sw.js`) بذاكرة مؤقّتة مُصنَّفة + صفحة `/offline`، خادم تطوير بـ brotli |

> المفتاح الخاصّ في `.keys/awalim-ed25519.pem` — **خذ نسخة احتياطية**. بدونه لا يمكن إعادة توقيع الأرقام بعد تغييرها (البناء يستمرّ ويعلّمها «غير موقّعة»).

## المسارات

```
/                      الرئيسية
/work                  الأعمال (فلاتر + فهرس جانبي لاصق + بطاقات بطلة)
/work/[slug]           دراسة حالة (التحدّي → المقاربة → الحل → النتائج → التالي)
/products              المنتجات
/products/[slug]       صفحة منتج (المزايا، الوحدات، حزم الدول، لمن هو، الدليل، البنية)
/services              الخدمات + المراحل الأربع (مثبّتة) + المعايير + التسعير
/academy               الأكاديمية (المسارات، المنهج، الفلسفة)
/group                 المجموعة (المسار الزمني، القيم، المؤسّس، Born in Palestine)
/journal               رؤى (فلاتر التصنيف)
/journal/[slug]        مقال (شريط تقدّم، جدول محتويات لاصق، مقالات ذات صلة)
/contact               نموذج موجز من 4 خطوات (واتساب/بريد — لا يُخزَّن شيء)
/verify                تحقّق من الأرقام (توقيع Ed25519 يتحقّق منه المتصفّح)
/404
/about → /group · /insights → /journal (تحويلات)
```

## أكواد الأنظمة (فريدة)
`SYS-ACC-01` محاسب ذكي · `SYS-RAHM-02` RahmaCare · `SYS-ACAD-03` الأكاديمية · `SYS-LAB-04` مختبر الذكاء · `SYS-STU-05` استوديو الهوية (وأعمال الهوية مثل Maya) · `SYS-WEB-06` Vibe OS 4.0 · `SYS-IH-07` آيلاند هيفن · `SYS-APP-08` Jameel Store · `SYS-WEB-09` منصّات الويب · `STUDY-HMI` دراسة لوحة القيادة.

## الأرقام — مصدر واحد

كل رقم في الموقع يُقرأ من `src/content/site.json → stats`. القاعدة المعتمدة:

| المفتاح | القيمة | المعنى |
|---|---|---|
| `engineersTrained` | +1,200 | مهندس دخل مساراً في الأكاديمية |
| `certifiedGraduates` | +682 | خرّيج معتمد أنهى المسار كاملاً بمشروع منشور |
| `clientCountries` | +10 | دول عملاء المجموعة |
| `graduateCountries` | +6 | الدول التي يعمل فيها الخرّيجون |

غيّر الرقم في مكان واحد ثم `npm run build`.

## النشر

**Vercel** — يقرأ `vercel.json` (clean URLs، تحويلات، ترويسات أمان وتخزين):
```bash
npm run build && npx vercel --prod
```
`.vercelignore` يستبعد `src/` والأدوات فلا تُنشر.

**Netlify** — `_redirects` + `_headers` جاهزان: `npx netlify deploy --prod --dir .`

**Hostinger / cPanel** — ارفع كل الملفات إلى `public_html`؛ `.htaccess` يتكفّل بالمسارات النظيفة والتحويلات والترويسات.

## قبل النشر
1. النطاق في `src/content/site.json → brand.url` (يُستخدم في canonical وOG وsitemap وJSON-LD).
2. رقم واتساب والبريد في `site.json → contact` (وفي `assets/js/awalim.js` للنموذج).
3. حقول `metric.rating` / `metric.users` في `cases.json` فارغة عمداً — تُعرض فقط حين تُملأ بأرقام حقيقية.
4. شهادات الخرّيجين في `pages.json → academy.testimonials` فارغة — تُضاف بالاسم وبموافقة أصحابها.
