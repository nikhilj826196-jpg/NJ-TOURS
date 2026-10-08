const fs = require('fs');

const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  booking: {
    processTitle: { en: "How to book your ride", mr: "तुमची राइड कशी बुक करावी", hi: "अपनी राइड कैसे बुक करें" },
    processSubtitle: { en: "Simple 4-step process to confirm your luxury cab", mr: "तुमची लक्झरी कॅब निश्चित करण्यासाठी सोपी 4-टप्प्यांची प्रक्रिया", hi: "अपनी लक्जरी कैब की पुष्टि करने के लिए सरल 4-चरणीय प्रक्रिया" },
    steps: {
      step1: {
        title: { en: "Search Ride", mr: "राइड शोधा", hi: "राइड खोजें" },
        desc: { en: "Pick route & cab category", mr: "मार्ग आणि कॅब श्रेणी निवडा", hi: "रूट और कैब श्रेणी चुनें" }
      },
      step2: {
        title: { en: "Review", mr: "आढावा घ्या", hi: "समीक्षा करें" },
        desc: { en: "Verify trip details", mr: "प्रवासाचे तपशील तपासा", hi: "यात्रा विवरण सत्यापित करें" }
      },
      step3: {
        title: { en: "Pay Safely", mr: "सुरक्षितपणे पैसे द्या", hi: "सुरक्षित भुगतान करें" },
        desc: { en: "Zero hidden fees", mr: "कोणतेही छुपे शुल्क नाही", hi: "शून्य छिपे हुए शुल्क" }
      },
      step4: {
        title: { en: "Travel", mr: "प्रवास", hi: "यात्रा" },
        desc: { en: "Enjoy business class ride", mr: "बिझनेस क्लास राइडचा आनंद घ्या", hi: "बिजनेस क्लास राइड का आनंद लें" }
      }
    }
  }
};

function mergeRecursive(targ, source, lang) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && source[key].en) {
      targ[key] = source[key][lang];
    } else if (source[key] && typeof source[key] === 'object') {
      if (!targ[key]) targ[key] = {};
      mergeRecursive(targ[key], source[key], lang);
    }
  }
}

mergeRecursive(en, translations, 'en');
mergeRecursive(mr, translations, 'mr');
mergeRecursive(hi, translations, 'hi');

fs.writeFileSync(dataPaths.en, JSON.stringify(en, null, 2));
fs.writeFileSync(dataPaths.mr, JSON.stringify(mr, null, 2));
fs.writeFileSync(dataPaths.hi, JSON.stringify(hi, null, 2));

let bpContent = fs.readFileSync('src/components/booking/BookingProcess.jsx', 'utf8');

bpContent = bpContent.replace(
  /const steps = \[[\s\S]*?\];/,
  \`const { t } = useTranslation();
  const steps = [
    { num: '1', titleKey: 'booking.steps.step1.title', descKey: 'booking.steps.step1.desc', icon: Search, color: 'bg-blue-50 text-blue-600' },
    { num: '2', titleKey: 'booking.steps.step2.title', descKey: 'booking.steps.step2.desc', icon: CheckCircle, color: 'bg-amber-50 text-amber-600' },
    { num: '3', titleKey: 'booking.steps.step3.title', descKey: 'booking.steps.step3.desc', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
    { num: '4', titleKey: 'booking.steps.step4.title', descKey: 'booking.steps.step4.desc', icon: Compass, color: 'bg-purple-50 text-purple-600' },
  ];\`
);

if (!bpContent.includes("useTranslation")) {
  bpContent = bpContent.replace("import { Search", "import { useTranslation } from 'react-i18next';\nimport { Search");
}

bpContent = bpContent.replace(
  /<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How to book your ride<\/h2>/,
  '<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("booking.processTitle")}</h2>'
);
bpContent = bpContent.replace(
  /<p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">\s*Simple 4-step process to confirm your luxury cab\s*<\/p>/,
  '<p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xl mx-auto">{t("booking.processSubtitle")}</p>'
);

bpContent = bpContent.replace(
  /\{step\.title\}/g,
  '{t(step.titleKey)}'
);
bpContent = bpContent.replace(
  /\{step\.desc\}/g,
  '{t(step.descKey)}'
);
bpContent = bpContent.replace(
  /key=\{step\.num\}/,
  'key={step.num}'
);

fs.writeFileSync('src/components/booking/BookingProcess.jsx', bpContent);
console.log('BookingProcess refactored.');
