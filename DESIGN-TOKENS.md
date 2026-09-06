# نظام التصميم — رموز التصميم (Design Tokens)

المصدر الوحيد: [`src/css/tokens.css`](src/css/tokens.css). كل مكوّن يقرأ من هذه المتغيّرات؛ لا قيم عشوائية داخل المكوّنات.
ثيمات الأقسام (لون كل بطاقة/منتج) في [`src/content/site.json → themes`](src/content/site.json).

## الألوان

| Token | Light | Dark | الاستخدام |
|---|---|---|---|
| `--bg` | `#FAFAF8` | `#0A0A0B` | خلفية الصفحة (أبيض دافئ) |
| `--surface` | `#FFFFFF` | `#141416` | البطاقات والأقسام البديلة |
| `--surface-2` | `#F2F2EF` | `#1C1C1F` | بطاقات الإحصاء، الحقول |
| `--text` | `#111112` | `#F5F5F3` | النص الأساسي |
| `--text-2` | `#3A3A3E` | `#C9C9CD` | نص القيادة والثانوي |
| `--text-muted` | `#5A5A5E` | `#A6A6AB` | التسميات — 6.5:1 (كان `#A7A7A7` = 2.3:1) |
| `--border` | `#E6E6E1` | `#26262A` | الحدود |
| `--accent` | `#189C8E` | `#2FC4B4` | التركوازي للعناوين الكبيرة والرسوم (≥ 3:1) |
| `--accent-text` | `#0E7A6F` | `#6FE0D0` | التركوازي للنص بحجم القراءة (≥ 4.5:1) |
| `--accent-ink` | `#FFFFFF` | `#0A1A18` | الحبر الذي يُكتب **فوق** أرضية `--accent-text` — ينقلب مع الوضع |
| `--ink-strip` | `#111112` | `#1C1C1F` | الشريط الداكن للتقنيات |

كل الأزواج تُفحص آلياً: `node scripts/contrast.mjs` (WCAG 2.2 AA).

لكن فحص الأزواج يُثبت أن الرمز **قانوني**، لا أنه استُعمل على السطح الصحيح. `node scripts/audit-render.mjs` يقيس الصفحة كما تُرسم فعلاً: يركّب خلفية كل عنصر كما يركّبها المتصفّح عبر كل مسار في الوضعين وعلى عرضين — فيرى اللون القانوني حين يقع على سطح لم يُصمَّم له.

### ثيمات الأقسام (`site.json → themes`)
كل ثيم: `bg · fg · dim · accent · ink` + `dark: { bg, fg, dim, accent }`. الداكنة تبقى داكنة في الوضعين؛ الفاتحة لها نسخة ليلية مصمَّمة (محايد فاتح → أخضر عميق، خوخي → بنّي…). المكوّن يحمل الزوجين inline (`--l-*` / `--d-*`) وقاعدة `.themed` تختار حسب `data-theme`؛ الأزرار والـ chips داخل السطح المُثيَّم تقرأ لون السطح لا لون الصفحة — فلا يظهر نص ليلي فوق أرضية فاتحة أبداً.

| المفتاح | القسم | الخلفية |
|---|---|---|
| `accounting` | محاسب ذكي SYS-ACC-01 | `#EAF4F1` محايد + تركوازي |
| `rahmacare` | RahmaCare SYS-RAHM-02 | `#0F3D3A` أخضر طبّي داكن |
| `jameel` | Jameel Store SYS-STU-05 | `#F5E7DA` خوخي |
| `vibeos` | Vibe OS 4.0 SYS-WEB-06 | `#111C4E` كحلي عميق |
| `academy` | الأكاديمية SYS-ACAD-03 | `#EFE9DC` رملي |
| `lab` | مختبر الذكاء SYS-LAB-04 | `#2A2540` بنفسجي |
| `maya` · `hmi` · `islandhaven` · `web` · `studio` | باقي الحالات والمنتجات | — |

## التايبوغرافي

- العربي والنص: **IBM Plex Sans Arabic** (300/400/500/600/700) — مستضاف ذاتياً، subset عربي + لاتيني، `font-display: swap`.
- عناوين العرض (`.d-hero`, `.d-1`, `.d-2`, عناوين الفيلم): **Alexandria** 800 (`--font-display-ar`) — صوت واحد لكل العناوين الكبيرة. `.h3` وما دونها Plex 600. الجزء الثانوي داخل عنوان البطاقة (`.hcard__sub`, `.chero__sub`) Plex 500 ليقرأ كتفسير لا كعنوان ثانٍ.
- العناوين اللاتينية والأرقام الضخمة: **Archivo** (متغيّر 100–900، wdth 62–125).
- الأكواد `SYS-XXX-00`: **IBM Plex Mono**.
- الأرقام: لاتينية (0123) في كل الموقع، جدولية (`tabular-nums`). المصطلحات اللاتينية داخل RTL معزولة بـ `lang="en"` / `unicode-bidi: isolate`.
- ممنوع `letter-spacing` على أي نص عربي؛ التتبّع فقط على `.eyebrow__latin`.

| Token | القيمة | الاستخدام |
|---|---|---|
| `--fs-hero` | `clamp(2.6rem, 7vw, 7.5rem)` | `.d-hero` — عنوان الصفحة (الطلب 9vw؛ خُفّض لتتّسع الأسطر العربية في 1280px) |
| `--fs-d1` | `clamp(2.25rem, 5vw, 5.25rem)` | `.d-1` — عناوين الأقسام |
| `--fs-d2` | `clamp(1.6rem, 3.2vw, 3rem)` | `.d-2` — عناوين البطاقات |
| `--fs-h3` | `clamp(1.25rem, 2vw, 1.75rem)` | `.h3` |
| `--fs-lg` | `1.25rem / 1.7` | `.lede` |
| `--fs-body` | `1.0625rem / 1.75` | النص |
| `--fs-xs` | `.8125rem` | `.eyebrow` والليبلات |
| `--lh-hero` | `1.22` | العربية تحتاج ارتفاعاً للتشكيل والامتدادات |

## المسافات والشبكة
- `--space-1…11` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px.
- `--container: 1280px` · `--container-wide: 1440px` · `--gutter: clamp(20px, 5vw, 80px)`.
- `--sec-y: clamp(96px, 12vw, 200px)` — كل قسم يأخذ نصفه من كل جهة فيلتقي قسمان عند القيمة كاملة.
- الحواف: `--r-sm 12 · --r-md 20 · --r-lg 28 · --r-xl 40 · --r-pill`.
- الظلال: `--shadow-card`, `--shadow-card-h` (hover), `--shadow-dev` (الموكابات).

## الحركة (`motion.css` + `assets/js/motion.js`)
- `--ease-out: cubic-bezier(.22,1,.36,1)` · مدد `200/420/700ms` · لا حركة أطول من `--d-max: 900ms` · stagger `75ms`.
- `.rv` كشف عند التمرير (`translateY(24px) → 0`) — `[data-stagger]` يوزّع `--i` على الأبناء.
- `.kl` عنوان الـ hero سطراً سطراً بقناع (CSS خالص).
- `[data-parallax]` ±40px عبر محرّك الـ scrub في `motion.js` (`--py`) — بلا GSAP.
- `[data-process]` قسم «كيف نعمل» مثبّت (sticky + تقدّم السكرول).
- `[data-tilt]` إمالة الجهاز مع مؤشّر الفأرة (`--tx/--ty`) · `[data-cursor="…"]` تسمية داخل المؤشّر · `--tint` تلوين الأرضية بثيم البطاقة النشطة.
- `[data-blueprint]` مخطّط SVG يُرسم بالسكرول (`--draw` → `--p` لكل عنصر بـ `--k`).
- `view-transition-name: vt-<slug>` على البطاقة وعلى hero صفحتها → تحوّل مشترك بين الصفحات.
- `[data-spy]` الفهرس الجانبي اللاصق بمؤشّر متحرّك.
- `[data-count]` عدّادات · `@view-transition` انتقال بين الصفحات (والستارة `.curtain` كبديل).
- كل ما سبق يتوقّف تحت `prefers-reduced-motion: reduce`.

## أين تعدّل ماذا
| تريد | عدّل |
|---|---|
| رقم يظهر في الموقع (خرّيجون، دول…) | `src/content/site.json → stats` فقط |
| دراسة حالة / منتج / مقال | `src/content/cases.json` · `products.json` · `journal.json` |
| لون ثيم قسم | `site.json → themes` |
| نص صفحة | `src/content/pages.json` |
| مكوّن | `src/lib/components.mjs` + `src/css/components.css` |

ثم: `npm run build`.
