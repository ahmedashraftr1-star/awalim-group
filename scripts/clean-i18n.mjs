import fs from "fs";

const file = "/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
  `data-name="المهندس أحمد أشرف" data-name-en="Eng. Ahmed Ashraf" data-role="صاحب المنظومة والمؤسس" data-role-en="Owner & Founder" data-clearance="0x00 ROOT" data-avatar="/assets/img/ahmed-personal.webp" data-node="القدس"`,
  `data-name="\${isEn ? "Eng. Ahmed Ashraf" : "المهندس أحمد أشرف"}" data-name-en="Eng. Ahmed Ashraf" data-role="\${isEn ? "Owner & Founder" : "صاحب المنظومة والمؤسس"}" data-role-en="Owner & Founder" data-clearance="0x00 ROOT" data-avatar="/assets/img/ahmed-personal.webp" data-node="\${isEn ? "Jerusalem" : "القدس"}"`
);

content = content.replace(
  `data-name="م. طارق الناصر" data-name-en="Eng. Tariq Al-Nasser" data-role="قائد النواة والأنظمة المصرفية" data-role-en="Lead Systems Architect" data-clearance="0x01 KERNEL" data-avatar="" data-node="القدس"`,
  `data-name="\${isEn ? "Eng. Tariq Al-Nasser" : "م. طارق الناصر"}" data-name-en="Eng. Tariq Al-Nasser" data-role="\${isEn ? "Lead Systems Architect" : "قائد النواة والأنظمة المصرفية"}" data-role-en="Lead Systems Architect" data-clearance="0x01 KERNEL" data-avatar="" data-node="\${isEn ? "Jerusalem" : "القدس"}"`
);

content = content.replace(
  `data-name="د. ليلى منصور" data-name-en="Dr. Layla Mansour" data-role="قائدة شبكات الإغاثة الميدانية" data-role-en="Field Mesh Director" data-clearance="0x02 FIELD" data-avatar="" data-node="بيروت"`,
  `data-name="\${isEn ? "Dr. Layla Mansour" : "د. ليلى منصور"}" data-name-en="Dr. Layla Mansour" data-role="\${isEn ? "Field Mesh Director" : "قائدة شبكات الإغاثة الميدانية"}" data-role-en="Field Mesh Director" data-clearance="0x02 FIELD" data-avatar="" data-node="\${isEn ? "Beirut" : "بيروت"}"`
);

content = content.replace(
  `data-name="م. سارة العلي" data-name-en="Eng. Sarah Al-Ali" data-role="رئيسة التدقيق الجنائي والتشفير" data-role-en="Chief Cryptographer" data-clearance="0x01 CRYPTO" data-avatar="" data-node="عمان"`,
  `data-name="\${isEn ? "Eng. Sarah Al-Ali" : "م. سارة العلي"}" data-name-en="Eng. Sarah Al-Ali" data-role="\${isEn ? "Chief Cryptographer" : "رئيسة التدقيق الجنائي والتشفير"}" data-role-en="Chief Cryptographer" data-clearance="0x01 CRYPTO" data-avatar="" data-node="\${isEn ? "Amman" : "عمان"}"`
);

content = content.replace(
  `data-name="م. عمر الصالح" data-name-en="Eng. Omar Al-Saleh" data-role="كبير مهندسي معايير IFRS" data-role-en="Principal IFRS Architect" data-clearance="0x02 LEDGER" data-avatar="" data-node="رام الله"`,
  `data-name="\${isEn ? "Eng. Omar Al-Saleh" : "م. عمر الصالح"}" data-name-en="Eng. Omar Al-Saleh" data-role="\${isEn ? "Principal IFRS Architect" : "كبير مهندسي معايير IFRS"}" data-role-en="Principal IFRS Architect" data-clearance="0x02 LEDGER" data-avatar="" data-node="\${isEn ? "Ramallah" : "رام الله"}"`
);

content = content.replace(
  `data-name="م. كمال درويش" data-name-en="Eng. Kamal Darwish" data-role="مهندس أول تعمية النواة وMerkle" data-role-en="Senior Crypto Engineer" data-clearance="0x02 CRYPTO" data-avatar="" data-node="دبي"`,
  `data-name="\${isEn ? "Eng. Kamal Darwish" : "م. كمال درويش"}" data-name-en="Eng. Kamal Darwish" data-role="\${isEn ? "Senior Crypto Engineer" : "مهندس أول تعمية النواة وMerkle"}" data-role-en="Senior Crypto Engineer" data-clearance="0x02 CRYPTO" data-avatar="" data-node="\${isEn ? "Dubai" : "دبي"}"`
);

content = content.replace(
  `data-name="م. هناء الزعبي" data-name-en="Eng. Hana Al-Zoubi" data-role="مهندسة شبكات بدون إنترنت P2P Mesh" data-role-en="Offline P2P Mesh Specialist" data-clearance="0x02 FIELD" data-avatar="" data-node="غزة"`,
  `data-name="\${isEn ? "Eng. Hana Al-Zoubi" : "م. هناء الزعبي"}" data-name-en="Eng. Hana Al-Zoubi" data-role="\${isEn ? "Offline P2P Mesh Specialist" : "مهندسة شبكات بدون إنترنت P2P Mesh"}" data-role-en="Offline P2P Mesh Specialist" data-clearance="0x02 FIELD" data-avatar="" data-node="\${isEn ? "Gaza" : "غزة"}"`
);

content = content.replace(
  `data-name="م. زياد قاسم" data-name-en="Eng. Ziad Qasim" data-role="مهندس محركات الذكاء الاصطناعي" data-role-en="AI Runtime Engineer" data-clearance="0x02 AI" data-avatar="" data-node="القاهرة"`,
  `data-name="\${isEn ? "Eng. Ziad Qasim" : "م. زياد قاسم"}" data-name-en="Eng. Ziad Qasim" data-role="\${isEn ? "AI Runtime Engineer" : "مهندس محركات الذكاء الاصطناعي"}" data-role-en="AI Runtime Engineer" data-clearance="0x02 AI" data-avatar="" data-node="\${isEn ? "Cairo" : "القاهرة"}"`
);

content = content.replace(
  `data-name="م. رزان العلمي" data-name-en="Eng. Razan Al-Alami" data-role="مهندسة فيزياء الزجاج وتجربة HMI" data-role-en="Glass Physics & UI Lead" data-clearance="0x03 UI" data-avatar="" data-node="لندن"`,
  `data-name="\${isEn ? "Eng. Razan Al-Alami" : "م. رزان العلمي"}" data-name-en="Eng. Razan Al-Alami" data-role="\${isEn ? "Glass Physics & UI Lead" : "مهندسة فيزياء الزجاج وتجربة HMI"}" data-role-en="Glass Physics & UI Lead" data-clearance="0x03 UI" data-avatar="" data-node="\${isEn ? "London" : "لندن"}"`
);

content = content.replace(
  `data-name="م. يوسف النجار" data-name-en="Eng. Youssef Al-Najjar" data-role="كبير موجهي أكاديمية النظم المعقدة" data-role-en="Senior Academy Mentor" data-clearance="0x03 MENTOR" data-avatar="" data-node="إسطنبول"`,
  `data-name="\${isEn ? "Eng. Youssef Al-Najjar" : "م. يوسف النجار"}" data-name-en="Eng. Youssef Al-Najjar" data-role="\${isEn ? "Senior Academy Mentor" : "كبير موجهي أكاديمية النظم المعقدة"}" data-role-en="Senior Academy Mentor" data-clearance="0x03 MENTOR" data-avatar="" data-node="\${isEn ? "Istanbul" : "إسطنبول"}"`
);

content = content.replace(
  `data-name="م. مريم خليل" data-name-en="Eng. Maryam Khalil" data-role="مهندسة دفاع سيبراني ومراقبة التهديدات" data-role-en="Cyber Threat Specialist" data-clearance="0x02 SEC" data-avatar="" data-node="برلين"`,
  `data-name="\${isEn ? "Eng. Maryam Khalil" : "م. مريم خليل"}" data-name-en="Eng. Maryam Khalil" data-role="\${isEn ? "Cyber Threat Specialist" : "مهندسة دفاع سيبراني ومراقبة التهديدات"}" data-role-en="Cyber Threat Specialist" data-clearance="0x02 SEC" data-avatar="" data-node="\${isEn ? "Berlin" : "برلين"}"`
);

// In RBAC table
content = content.replace(
  `<td><span class="chip chip--sm">م. أحمد أشرف</span></td>`,
  `<td><span class="chip chip--sm">\${isEn ? "Eng. Ahmed Ashraf" : "م. أحمد أشرف"}</span></td>`
);
content = content.replace(
  `<td><span class="chip chip--sm">م. طارق الناصر</span> <span class="chip chip--sm">م. سارة العلي</span></td>`,
  `<td><span class="chip chip--sm">\${isEn ? "Eng. Tariq Al-Nasser" : "م. طارق الناصر"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Sarah Al-Ali" : "م. سارة العلي"}</span></td>`
);
content = content.replace(
  `<td><span class="chip chip--sm">د. ليلى منصور</span> <span class="chip chip--sm">م. عمر الصالح</span> <span class="chip chip--sm">م. زياد قاسم</span> <span class="chip chip--sm">م. هناء الزعبي</span> <span class="chip chip--sm">م. كمال درويش</span> <span class="chip chip--sm">م. مريم خليل</span></td>`,
  `<td><span class="chip chip--sm">\${isEn ? "Dr. Layla Mansour" : "د. ليلى منصور"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Omar Al-Saleh" : "م. عمر الصالح"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Ziad Qasim" : "م. زياد قاسم"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Hana Al-Zoubi" : "م. هناء الزعبي"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Kamal Darwish" : "م. كمال درويش"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Maryam Khalil" : "م. مريم خليل"}</span></td>`
);
content = content.replace(
  `<td><span class="chip chip--sm">م. رزان العلمي</span> <span class="chip chip--sm">م. يوسف النجار</span></td>`,
  `<td><span class="chip chip--sm">\${isEn ? "Eng. Razan Al-Alami" : "م. رزان العلمي"}</span> <span class="chip chip--sm">\${isEn ? "Eng. Youssef Al-Najjar" : "م. يوسف النجار"}</span></td>`
);

fs.writeFileSync(file, content, "utf8");
console.log("Cleaned i18n in dashboard.mjs");
