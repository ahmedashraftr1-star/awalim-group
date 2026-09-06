/* The bilingual merge and its invariant, extracted so scripts/merge-test.mjs
   can assert the SEMANTICS rather than trust the implementation. */

/** Deep merge an override onto a base. Arrays of objects that carry an
 *  identity key (slug / id / key / n) merge element-wise by it, so a
 *  translation file only repeats the fields it actually changes and never
 *  has to restate themes, icons or numbers.
 *
 *  Elements WITHOUT an identity key pair by position, and every override is
 *  consumed at most once. Both rules matter: an array where only some elements
 *  are keyed (a stat list of three numbers and one word) used to resolve every
 *  unkeyed element to the same override — the English page then printed one
 *  tile twice and lost the other, in valid English, where no test could see it. */
const ID_KEYS = ["slug", "id", "key", "n"];
const idKeyOf = (v) => (v && typeof v === "object" && !Array.isArray(v) ? ID_KEYS.find((k) => v[k] !== undefined) : undefined);
const merge = (base, over) => {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
    /* A list of scalars is one value: the translation restates it whole. A list
       of OBJECTS never is — replacing it wholesale drops every field the
       translation had no reason to repeat. That is how the English case page
       lost a mock screen: its approach steps carry only `t` and `d`, so the
       Arabic step's `mock: "vibe"` went with the array it replaced. */
    if (!base.some(isObj) && !over.some(isObj)) return over;
    const used = new Set();
    /* identity keys pair elements across a reordered or partial translation;
       elements without one fall back to position, and each override is
       consumed at most once — an array where only SOME elements are keyed
       used to resolve every unkeyed element to the same override, so the
       English page printed one stat tile twice and lost the other. */
    const pick = (b, i) => {
      const k = idKeyOf(b);
      let j = k ? over.findIndex((o, oi) => !used.has(oi) && isObj(o) && o[k] === b[k]) : -1;
      if (j < 0 && !used.has(i) && over[i] !== undefined) {
        const ok = idKeyOf(over[i]);
        if (!k || !ok || over[i][k] === b[k]) j = i;
      }
      if (j < 0) return undefined;
      used.add(j);
      return over[j];
    };
    const out = base.map((b, i) => { const o = pick(b, i); return o === undefined ? b : merge(b, o); });
    /* an override longer than the original adds items — an English-only gallery */
    over.forEach((o, i) => { if (!used.has(i) && i >= base.length) out.push(o); });
    return out;
  }
  if (base && typeof base === "object" && over && typeof over === "object" && !Array.isArray(over))
    return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(over)])].map((k) => [k, merge(base[k], over[k])]));
  return over;
};

/* Merging a translation may only ever ADD. An English file states what differs
   and inherits the rest, so a key that vanishes or an array that shortens is
   content the mirror silently lost — and it loses it in fluent English, where
   the no-Arabic-survives assertion sees nothing wrong. Two separate merge bugs
   shipped that way before this guard existed: a partially-keyed array that
   resolved every unkeyed element to the same override, and an object array
   replaced wholesale so the Arabic step's `mock` went with it. */
const findLoss = (base, merged, path, out) => {
  if (Array.isArray(base)) {
    if (!Array.isArray(merged) || merged.length < base.length) { out.push(`${path}: array of ${base.length} became ${Array.isArray(merged) ? merged.length : typeof merged}`); return; }
    base.forEach((b, i) => findLoss(b, merged[i], `${path}[${i}]`, out));
  } else if (base && typeof base === "object") {
    if (!merged || typeof merged !== "object") { out.push(`${path}: object became ${typeof merged}`); return; }
    for (const k of Object.keys(base)) {
      if (!(k in merged)) { out.push(`${path}.${k}: key lost in the translation`); continue; }
      findLoss(base[k], merged[k], `${path}.${k}`, out);
    }
  }
};

export { ID_KEYS, idKeyOf, merge, findLoss };
