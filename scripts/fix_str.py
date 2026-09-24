p = '/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<span class="badge badge--ok">18 عقود</span>', '<span class="badge badge--ok">${t("18 عقود", "18 Contracts")}</span>')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

print('Fixed string')
