const fs = require('fs');
const path = require('path');

const dataPaths = {
  en: 'src/i18n/en/common.json',
  mr: 'src/i18n/mr/common.json',
  hi: 'src/i18n/hi/common.json'
};

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  about: {
    coreValues: {
      title: { en: "Our Core Values", mr: "आमची प्रमुख मूल्ये", hi: "हमारे मूल मूल्य" },
      subtitle: { en: "The foundational principles guiding every journey at NJ Tours (National Journey)", mr: "NJ टूर्स (नॅशनल जर्नी) मध्ये प्रत्येक प्रवासाला मार्गदर्शन करणारी मूलभूत तत्त्वे", hi: "NJ टूर्स (नेशनल जर्नी) में हर यात्रा का मार्गदर्शन करने वाले मूलभूत सिद्धांत" },
      items: {
        customer: {
          title: { en: "Customer First", mr: "ग्राहक प्रथम", hi: "ग्राहक प्रथम" },
          desc: { en: "Prioritizing passenger comfort, convenience, and custom itineraries at every touchpoint.", mr: "प्रत्येक टप्प्यावर प्रवाशांची सोय, आराम आणि कस्टम प्रवासाला प्राधान्य देणे.", hi: "हर टचपॉइंट पर यात्री आराम, सुविधा और कस्टम यात्रा को प्राथमिकता देना।" }
        },
        safety: {
          title: { en: "Safety", mr: "सुरक्षा", hi: "सुरक्षा" },
          desc: { en: "Speed governor enabled fleet, SOS panic buttons, and double-verified professional chauffeurs.", mr: "स्पीड गव्हर्नर सक्षम ताफा, SOS पॅनिक बटणे आणि दोनदा पडताळलेले व्यावसायिक ड्रायव्हर्स.", hi: "स्पीड गवर्नर सक्षम फ्लीट, SOS पैनिक बटन और दोहरे-सत्यापित पेशेवर ड्राइवर।" }
        },
        transparency: {
          title: { en: "Transparency", mr: "पारदर्शकता", hi: "पारदर्शिता" },
          desc: { en: "Clear itemized billing with zero hidden toll taxes or unexpected driver allowances.", mr: "कोणतेही छुपे टोल कर किंवा अनपेक्षित ड्रायव्हर भत्ते नसलेले स्पष्ट आयटमाइज्ड बिलिंग.", hi: "शून्य छिपे हुए टोल टैक्स या अप्रत्याशित ड्राइवर भत्ते के साथ स्पष्ट आइटमयुक्त बिलिंग।" }
        },
        professionalism: {
          title: { en: "Professionalism", mr: "व्यावसायिकता", hi: "व्यावसायिकता" },
          desc: { en: "Uniformed drivers, punctual airport pickups, and courteous 24x7 helpline team.", mr: "गणवेशधारी ड्रायव्हर्स, वेळेवर एअरपोर्ट पिकअप आणि नम्र 24x7 हेल्पलाइन टीम.", hi: "वर्दीधारी ड्राइवर, समयनिष्ठ हवाई अड्डे पिकअप, और विनम्र 24x7 हेल्पलाइन टीम।" }
        },
        innovation: {
          title: { en: "Innovation", mr: "नावीन्य", hi: "नवाचार" },
          desc: { en: "Live GPS telematics link shared with family members and online digital invoicing.", mr: "कुटुंबातील सदस्यांसह शेअर केलेली लाईव्ह जीपीएस टेलिमॅटिक्स लिंक आणि ऑनलाइन डिजिटल इनव्हॉइसिंग.", hi: "परिवार के सदस्यों के साथ साझा लाइव जीपीएस टेलीमैटिक्स लिंक और ऑनलाइन डिजिटल चालान।" }
        },
        reliability: {
          title: { en: "Reliability", mr: "विश्वसनीयता", hi: "विश्वसनीयता" },
          desc: { en: "Guaranteed cab arrival on time with backup vehicle replacement within 30 minutes.", mr: "३० मिनिटांत बॅकअप वाहन बदलण्यासह वेळेवर कॅब येण्याची खात्री.", hi: "30 मिनट के भीतर बैकअप वाहन प्रतिस्थापन के साथ समय पर कैब आगमन की गारंटी।" }
        }
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

// Update CoreValues.jsx
let cvContent = fs.readFileSync('src/components/about/CoreValues.jsx', 'utf8');

cvContent = cvContent.replace(
  /const values = \[[\s\S]*?\];/,
  \`const { t } = useTranslation();
  const values = [
    { titleKey: 'about.coreValues.items.customer.title', descKey: 'about.coreValues.items.customer.desc', icon: HeartHandshake, color: 'text-rose-500 bg-rose-50' },
    { titleKey: 'about.coreValues.items.safety.title', descKey: 'about.coreValues.items.safety.desc', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { titleKey: 'about.coreValues.items.transparency.title', descKey: 'about.coreValues.items.transparency.desc', icon: FileCheck, color: 'text-amber-500 bg-amber-50' },
    { titleKey: 'about.coreValues.items.professionalism.title', descKey: 'about.coreValues.items.professionalism.desc', icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
    { titleKey: 'about.coreValues.items.innovation.title', descKey: 'about.coreValues.items.innovation.desc', icon: Lightbulb, color: 'text-purple-600 bg-purple-50' },
    { titleKey: 'about.coreValues.items.reliability.title', descKey: 'about.coreValues.items.reliability.desc', icon: Clock, color: 'text-indigo-600 bg-indigo-50' },
  ];\`
);

if (!cvContent.includes("useTranslation")) {
  cvContent = cvContent.replace("import { HeartHandshake", "import { useTranslation } from 'react-i18next';\nimport { HeartHandshake");
}

cvContent = cvContent.replace(
  /<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our Core Values<\/h2>/,
  '<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("about.coreValues.title")}</h2>'
);
cvContent = cvContent.replace(
  /The foundational principles guiding every journey at NJ Tours \(National Journey\)/,
  '{t("about.coreValues.subtitle")}'
);

cvContent = cvContent.replace(
  /{v\.title}/g,
  '{t(v.titleKey)}'
);
cvContent = cvContent.replace(
  /{v\.desc}/g,
  '{t(v.descKey)}'
);
// fix the key loop
cvContent = cvContent.replace(
  /key=\{v\.title\}/,
  'key={v.titleKey}'
);

fs.writeFileSync('src/components/about/CoreValues.jsx', cvContent);
console.log('CoreValues translated and refactored.');
