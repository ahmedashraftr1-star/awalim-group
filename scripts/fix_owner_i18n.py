import json

# 1. Update src/content/owner.json
p_ar = '/Users/ahmedashraf/Awalim-Group-Site/src/content/owner.json'
with open(p_ar, 'r', encoding='utf-8') as f:
    data_ar = json.load(f)

for v in data_ar['ventures']:
    if v['id'] == 'island-haven':
        v['lead_en'] = 'Eng. Tariq Al-Nasser'
    elif v['id'] == 'rahmacare':
        v['lead_en'] = 'Dr. Layla Mansour'
    elif v['id'] == 'smart-accountant':
        v['lead_en'] = 'Eng. Omar Al-Saleh'
    elif v['id'] == 'awalim-academy':
        v['lead_en'] = 'Eng. Ahmed Ashraf'
    elif v['id'] == 'vibe-os-lab':
        v['lead_en'] = 'Kernel Core Team'
    elif v['id'] == 'awalim-studio':
        v['lead_en'] = 'Sovereign Arts Team'

for c in data_ar['contracts']:
    if c['id'] == 'CNT-2026-089':
        c['client_en'] = 'Island Haven Banking Group'
        c['venture_en'] = 'Island Haven Core'
        c['value_en'] = '$1,250,000 / yr'
        c['status_en'] = 'Active · Stable'
    elif c['id'] == 'CNT-2026-092':
        c['client_en'] = 'Rahma Humanitarian Alliance'
        c['venture_en'] = 'RahmaCare VIP'
        c['value_en'] = '$680,000 / grant'
        c['status_en'] = 'Field Operational'
    elif c['id'] == 'CNT-2026-077':
        c['client_en'] = 'Falcon Gulf Enterprise'
        c['venture_en'] = 'Falcon ERP'
        c['value_en'] = '$420,000 / qtr'
        c['status_en'] = 'Reconciled · Paid'
    elif c['id'] == 'CNT-2026-104':
        c['client_en'] = 'Digital Talent Fund'
        c['venture_en'] = 'Awalim Academy'
        c['value_en'] = '$350,000 / yr'
        c['status_en'] = 'Active · Cohort 2'

for d in data_ar['directives']:
    if d['id'] == 'DIR-01':
        d['title_en'] = 'Ensure 100% infrastructure sovereignty from any external cloud'
        d['priority_en'] = 'Priority 0'
        d['status_en'] = 'Active & Enforced'
    elif d['id'] == 'DIR-02':
        d['title_en'] = 'Expand RahmaCare field mesh to 20 additional emergency nodes'
        d['priority_en'] = 'Critical Emergency'
        d['status_en'] = 'Field Deployment'
    elif d['id'] == 'DIR-03':
        d['title_en'] = 'Deploy Sovereign Vibe OS 4.0 architecture to Island Haven and Falcon'
        d['priority_en'] = 'High'
        d['status_en'] = 'Completed & Signed'

with open(p_ar, 'w', encoding='utf-8') as f:
    json.dump(data_ar, f, ensure_ascii=False, indent=2)

# 2. Update src/content/en/owner.json
p_en = '/Users/ahmedashraf/Awalim-Group-Site/src/content/en/owner.json'
data_en = json.loads(json.dumps(data_ar))
data_en['owner']['name'] = 'Eng. Ahmed Ashraf'
data_en['owner']['title'] = 'Sovereign Owner, Founder & Chief Architect'
data_en['owner']['base'] = 'Palestine / Distributed Sovereign Mesh'
data_en['treasury']['currency'] = 'USD / USDC Vault'
data_en['treasury']['reconciliation_status'] = 'IFRS Verified / Zero Variance 0.00%'

for v in data_en['ventures']:
    v['name'] = v.get('name_en', v['name'])
    v['sector'] = v.get('sector_en', v['sector'])
    v['lead'] = v.get('lead_en', v['lead'])
    if 'الخريجون' in v.get('sla', ''):
        v['sla'] = '682 Certified Grads'

for c in data_en['contracts']:
    c['client'] = c.get('client_en', c['client'])
    c['venture'] = c.get('venture_en', c['venture'])
    c['value'] = c.get('value_en', c['value'])
    c['status'] = c.get('status_en', c['status'])

for d in data_en['directives']:
    d['title'] = d.get('title_en', d['title'])
    d['priority'] = d.get('priority_en', d['priority'])
    d['status'] = d.get('status_en', d['status'])

with open(p_en, 'w', encoding='utf-8') as f:
    json.dump(data_en, f, ensure_ascii=False, indent=2)

# 3. Update dashboard.mjs to use English fields when isEn is true
p_dash = '/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs'
with open(p_dash, 'r', encoding='utf-8') as f:
    dash_code = f.read()

dash_code = dash_code.replace(
    '${t("المالك و", "Owner &")}',
    '${t("المالك والمؤسس", "Owner & Founder")}'
)
dash_code = dash_code.replace(
    '<span class="badge badge--ok">18 عقود</span>',
    '<span class="badge badge--ok">${t("18 عقود", "18 Contracts")}</span>'
)
dash_code = dash_code.replace(
    '${t(v.lead, v.lead)}',
    '${isEn ? (v.lead_en || v.lead) : v.lead}'
)
dash_code = dash_code.replace(
    '${t(v.sector, v.sector_en || v.sector)}',
    '${isEn ? (v.sector_en || v.sector) : v.sector}'
)
dash_code = dash_code.replace(
    '${t(v.name, v.name_en || v.name)}',
    '${isEn ? (v.name_en || v.name) : v.name}'
)
dash_code = dash_code.replace(
    '<td><b>${c.client}</b></td>',
    '<td><b>${isEn ? (c.client_en || c.client) : c.client}</b></td>'
)
dash_code = dash_code.replace(
    '<span class="chip chip--sm">${c.venture}</span>',
    '<span class="chip chip--sm">${isEn ? (c.venture_en || c.venture) : c.venture}</span>'
)
dash_code = dash_code.replace(
    '<td class="mono" style="color:var(--gold,#D4AF37); font-weight:var(--w-bold);">${c.value}</td>',
    '<td class="mono" style="color:var(--gold,#D4AF37); font-weight:var(--w-bold);">${isEn ? (c.value_en || c.value) : c.value}</td>'
)
dash_code = dash_code.replace(
    '<td><span class="dot dot--live"></span> ${c.status}</td>',
    '<td><span class="dot dot--live"></span> ${isEn ? (c.status_en || c.status) : c.status}</td>'
)
dash_code = dash_code.replace(
    '<td><b>${d.title}</b></td>',
    '<td><b>${isEn ? (d.title_en || d.title) : d.title}</b></td>'
)
dash_code = dash_code.replace(
    '<td><span class="chip chip--danger">${d.priority}</span></td>',
    '<td><span class="chip chip--danger">${isEn ? (d.priority_en || d.priority) : d.priority}</span></td>'
)
dash_code = dash_code.replace(
    '<td><span class="dot dot--live"></span> ${d.status}</td>',
    '<td><span class="dot dot--live"></span> ${isEn ? (d.status_en || d.status) : d.status}</td>'
)

with open(p_dash, 'w', encoding='utf-8') as f:
    f.write(dash_code)

print('Updated i18n parity successfully')
