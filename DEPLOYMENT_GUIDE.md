# نشر موقع عوالِم قروب على Hostinger

الاستضافة: **awalimgroup.com** على استضافة Hostinger المشتركة (خادم LiteSpeed).
هذا الخادم لا يقرأ إلا ملف **`.htaccess`**. أما `_headers` و`vercel.json` فلا يقرؤهما، ولذلك لا يدخلان الحزمة.

## ١. جهّز الحزمة (على جهازك)

```bash
cd ~/Awalim-Group-Site
npm run pack
```

يبني هذا الأمر الموقع، ثم يُخرج الملف **`dist/awalim-hostinger-YYYY-MM-DD.zip`**. يحتوي الملف على الموقع العام وحده: صفحات اللغتين، و`404.html`، و`assets/`، و`.htaccess`، و`robots.txt`، و`sitemap.xml`، و`sw.js`، و`search.json`، و`verify/`، وصفحات التحويل القديمة.
ولا يحتوي على لوحة المالك (`dashboard/`)، ولا على `.keys`، ولا على `src` أو `scripts`، ولا على أي ملف ‎`.md` أو صورة شاشة.

قبل أن ينتهي الأمر، يفكّ الحزمة في مجلّد مؤقت ويشغّلها وحدها، ثم يتحقّق من أن كل روابط خريطة الموقع ترجع 200 وأن الروابط الداخلية كلها سليمة. إن ظهرت **✖** فلا ترفع الحزمة.

## ٢. ارفعها (hPanel)

1. ادخل hPanel ← **Websites** ← awalimgroup.com ← **File Manager** ← افتح المجلّد **`public_html`**.
2. **احذف كل ما في `public_html`**، وخاصةً `default.php` أو `index.php` الافتراضي. وجود هذين الملفّين، أو بقاء المجلّد فارغاً، هو سبب خطأ 403 الحالي.
3. اضغط **Upload** وارفع ملف الـzip.
4. انقر على الملف بالزر الأيمن ثم **Extract**، واختر الاستخراج إلى `public_html` نفسه، لا إلى مجلّد فرعي داخله.
   - يجب أن يظهر `index.html` مباشرةً داخل `public_html`، لا داخل `public_html/awalim-hostinger-…/`.
5. احذف ملف الـzip من `public_html` بعد الاستخراج.
6. تأكّد من وجود **`.htaccess`**. هو ملف مخفي، فإن لم تره فافتح **Settings** في File Manager وفعّل **Show hidden files**.

## ٣. SSL

افتح hPanel ← **Security ← SSL** وتأكّد أن شهادة awalimgroup.com حالتها **Active**. إن لم تكن مفعّلة ففعّلها، وقد يستغرق ذلك دقائق.
ملف `.htaccess` يحوّل تلقائياً `http://` و`www.` إلى **https://awalimgroup.com** (تحويل 301)، ويُرسل HSTS. لذلك لا تفعّل «Force HTTPS» من hPanel أيضاً، فلا حاجة لتحويلين.

## ٤. اختبر

افتح هذه الروابط في نافذة خاصّة (Incognito):

| الرابط | المتوقّع |
|---|---|
| `https://awalimgroup.com/` | الصفحة الرئيسية العربية |
| `https://awalimgroup.com/en/` | الإنجليزية |
| `https://awalimgroup.com/work` | صفحة الأعمال، بلا شرطة مائلة في آخر الرابط |
| `http://www.awalimgroup.com/` | يحوّلك إلى `https://awalimgroup.com/` |
| `https://awalimgroup.com/about` | يحوّلك إلى `/group` |
| `https://awalimgroup.com/en/insights` | يحوّلك إلى `/en/journal` |
| `https://awalimgroup.com/xyz` | صفحة 404 العربية |
| `https://awalimgroup.com/en/xyz` | صفحة 404 الإنجليزية |
| `https://awalimgroup.com/dashboard` | 404، فاللوحة لا تُرفع أصلاً |
| `https://awalimgroup.com/.keys/` | 404 |

وللتحقّق من ترويسات الأمان:

```bash
curl -sI https://awalimgroup.com/ | grep -iE "content-security|strict-transport|x-frame"
```

يجب أن تظهر الترويسات الثلاث. افتح بعدها الصفحة الرئيسية واضغط «صوِّر فاتورة»، وتأكّد أن الـConsole خالٍ من أخطاء CSP.

## ٥. عند كل تحديث

شغّل `npm run pack` من جديد، ثم في `public_html` ارفع الـzip الجديد واستخرجه فوق الملفات القديمة واحذفه.
لا تعدّل `.htaccess` يدوياً على الخادم: البناء يولّده، والـCSP فيه يحمل بصمات السكربتات الخاصة بكل بناء، فأي نسخة قديمة منه ستعطّل الصفحات.

## لوحة المالك

`/dashboard` تعمل محلّياً فقط، عبر `npm run dev` ثم فتح `http://localhost:8899/dashboard`. لا تُرفع إلى الاستضافة، و`.htaccess` يحجب مسارها احتياطاً.
