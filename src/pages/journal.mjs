import { esc, join, slug as slugify } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export function renderIndex(ctx) {
  const { site, pages, articles, categories } = ctx;
  const j = pages.journal;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow("رؤى", "JOURNAL", "rv")}
        <h1 class="d-hero rv" style="--i:1">${j.h}</h1>
        <p class="lede rv" style="--i:2">${j.lede}</p>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          <nav class="sideidx sideidx--filters" aria-label="التصنيفات" data-filter-group="journal-list">
            <p class="sideidx__h">التصنيفات</p>
            <ol class="sideidx__list">${categories.map((c, i) => `<li><button class="sideidx__btn" type="button" data-filter="${c.key}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(c.label)}</button></li>`).join("")}</ol>
            <p class="small muted" data-filter-count aria-live="polite"></p>
          </nav>
          <div class="indexed__col">
            <div class="posts posts--list" id="journal-list" data-stagger>
              ${articles.map((a, i) => C.postCard(a, { lazy: i > 1 })).join("")}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: "عندك سؤال هندسي محدّد؟", lede: "أحياناً تكفي مكالمة قصيرة لتوفير أسابيع من المسار الخطأ. اسألنا — دون التزام.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: "/journal",
    html: page({ site, seo: { ...j.seo, path: "/journal", ogImage: "/assets/img/og/journal.png" }, active: "journal", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "رؤى", path: "/journal" }])], bodyClass: "page-journal" })
  };
}

/* /journal/[slug] — reading view (section 6.9) */
export function renderArticle(ctx, a, i) {
  const { site, themes, articles } = ctx;
  const t = themes[a.theme] || themes.accounting;
  const blocks = a.body.map((b) => (b.h2 ? { ...b, id: "s-" + slugify(b.h2).slice(0, 40) } : b));
  const toc = blocks.filter((b) => b.h2).map((b) => ({ id: b.id, label: b.h2 }));
  const related = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const date = new Date(a.date);
  /* Latin digits in both locales — the site's numeral policy is one policy */
  const dateAr = date.toLocaleDateString(ctx.locale === "en" ? "en-GB" : "ar-EG-u-nu-latn", { year: "numeric", month: "long", day: "numeric" });

  const body = join([
    `<div class="readbar" data-readbar aria-hidden="true"><span></span></div>`,
    `<section class="chero themed${t.ink ? " chero--ink" : ""} chero--article" style="${C.themeStyle(t)};view-transition-name:vt-a-${a.slug};view-transition-class:vt-card">
      <div class="wrap wrap--wide">
        <nav class="crumbs rv" aria-label="مسار التنقّل"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="/journal">رؤى</a><span aria-hidden="true">/</span><span aria-current="page">مقال</span></nav>
        <p class="chero__meta rv" style="--i:1"><span>${esc(a.catLabel)}</span><span aria-hidden="true">·</span><time datetime="${a.date}">${dateAr}</time><span aria-hidden="true">·</span><span>${esc(a.readLabel)}</span></p>
        <h1 class="d-1 chero__title rv" style="--i:2">${a.title}</h1>
        <p class="lede rv" style="--i:3">${a.excerpt}</p>
        <p class="chero__by rv" style="--i:4">بقلم <b>${esc(a.author)}</b></p>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed indexed--article">
          <nav class="sideidx" data-spy aria-label="جدول المحتويات">
            <span class="sideidx__bar" aria-hidden="true"></span>
            <div class="sideidx__g"><p class="sideidx__h">في هذا المقال</p><ol class="sideidx__list">${toc.map((x) => `<li><a href="#${x.id}">${x.label}</a></li>`).join("")}</ol></div>
          </nav>
          <article class="prose indexed__col rv">
            ${C.articleBody(blocks)}
            <footer class="prose__ftr">
              <div class="sig"><b>${esc(a.author)}</b><span>${esc(site.brand.name)}</span></div>
              ${C.btnRow([C.waLink(site, "ناقش المقال معنا")])}
            </footer>
          </article>
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="related">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "مقالات ذات صلة", eyebrowEn: "RELATED", h: "اقرأ أيضاً" })}
        <div class="posts" data-stagger>${related.map((r) => C.postCard(r)).join("")}</div>
      </div>
    </section>`,

    C.ctaBand({ h: "عندك سؤال هندسي محدّد؟", lede: "أحياناً تكفي مكالمة قصيرة لتوفير أسابيع من المسار الخطأ.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: `${site.brand.url}${a.image}`,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "ar",
    author: { "@type": "Person", name: a.author },
    publisher: { "@id": `${site.brand.url}/#org` },
    mainEntityOfPage: `${site.brand.url}/journal/${a.slug}`
  };

  return {
    path: `/journal/${a.slug}`,
    html: page({
      site,
      seo: { title: `${a.title} | رؤى · عوالِم قروب`, description: a.excerpt, path: `/journal/${a.slug}`, ogImage: `/assets/img/og/journal-${a.slug}.png`, type: "article" },
      active: "journal",
      body,
      schema: [articleSchema, breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "رؤى", path: "/journal" }, { name: a.title, path: `/journal/${a.slug}` }])],
      bodyClass: "page-article"
    })
  };
}
