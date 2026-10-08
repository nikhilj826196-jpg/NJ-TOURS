const fs = require('fs');

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
    timeline: {
      title: { en: "Our Journey Timeline", mr: "आमच्या प्रवासाची टाइमलाइन", hi: "हमारी यात्रा की टाइमलाइन" },
      subtitle: { en: "Over a decade of landmark milestones and growth", mr: "एका दशकाहून अधिक काळातील महत्त्वाचे टप्पे आणि प्रगती", hi: "एक दशक से अधिक के प्रमुख मील के पत्थर और विकास" },
      milestones: {
        started: {
          title: { en: "Company Started", mr: "कंपनी सुरू झाली", hi: "कंपनी शुरू हुई" },
          desc: { en: "NJ Tours launched operations in Pune with a fleet of 5 sedan cabs.", mr: "NJ टूर्सने ५ सेडान कॅबच्या ताफ्यासह पुण्यात ऑपरेशन्स सुरू केले.", hi: "NJ टूर्स ने 5 सेडान कैब के बेड़े के साथ पुणे में अपना काम शुरू किया।" }
        },
        customers1k: {
          title: { en: "1,000+ Happy Customers", mr: "१,०००+ समाधानी ग्राहक", hi: "१,०००+ खुश ग्राहक" },
          desc: { en: "Expanded intercity outstation routes connecting Mumbai, Pune, and Goa.", mr: "मुंबई, पुणे आणि गोव्याला जोडणाऱ्या आंतरशहर आउटस्टेशन मार्गांचा विस्तार केला.", hi: "मुंबई, पुणे और गोवा को जोड़ने वाले इंटरसिटी आउटस्टेशन मार्गों का विस्तार किया।" }
        },
        expansion: {
          title: { en: "Fleet Expansion", mr: "ताफ्याचा विस्तार", hi: "फ्लीट का विस्तार" },
          desc: { en: "Added luxury Volvo coaches and Maharaja Tempo Travellers to our group mobility division.", mr: "आमच्या ग्रुप मोबिलिटी विभागात लक्झरी व्होल्वो कोच आणि महाराजा टेम्पो ट्रॅव्हलर जोडले.", hi: "हमारे ग्रुप मोबिलिटी डिवीजन में लक्जरी वोल्वो कोच और महाराजा टेम्पो ट्रैवलर्स शामिल किए।" }
        },
        online: {
          title: { en: "Online Booking Launched", mr: "ऑनलाइन बुकिंग सुरू", hi: "ऑनलाइन बुकिंग शुरू" },
          desc: { en: "Introduced automated instant fare calculator and online cab dispatch engine.", mr: "स्वयंचलित झटपट भाडे कॅल्क्युलेटर आणि ऑनलाइन कॅब डिस्पॅच इंजिन सुरू केले.", hi: "स्वचालित तत्काल किराया कैलकुलेटर और ऑनलाइन कैब डिस्पैच इंजन पेश किया।" }
        },
        customers50k: {
          title: { en: "50,000+ Happy Travelers", mr: "५०,०००+ समाधानी प्रवासी", hi: "५०,०००+ खुश यात्री" },
          desc: { en: "Crossed major milestone serving over 50k passengers across 150+ Indian cities.", mr: "१५०+ भारतीय शहरांमधील ५० हजारांहून अधिक प्रवाशांना सेवा देण्याचा मोठा टप्पा पार केला.", hi: "150+ भारतीय शहरों में 50 हजार से अधिक यात्रियों की सेवा करने का प्रमुख मील का पत्थर पार किया।" }
        },
        platform: {
          title: { en: "NJ Tours Digital Platform Launch", mr: "NJ टूर्स डिजिटल प्लॅटफॉर्म लाँच", hi: "NJ टूर्स डिजिटल प्लेटफॉर्म लॉन्च" },
          desc: { en: "Unveiled state-of-the-art Web & Mobile platform with real-time driver GPS telematics.", mr: "रिअल-टाइम ड्रायव्हर जीपीएस टेलिमॅटिक्ससह अत्याधुनिक वेब आणि मोबाइल प्लॅटफॉर्मचे अनावरण केले.", hi: "रियल-टाइम ड्राइवर जीपीएस टेलीमैटिक्स के साथ अत्याधुनिक वेब और मोबाइल प्लेटफॉर्म का अनावरण किया।" }
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

// Update the React component
let timelineContent = fs.readFileSync('src/components/about/Timeline.jsx', 'utf8');

timelineContent = timelineContent.replace(
  /const milestones = \[[\s\S]*?\];/,
  \`const { t } = useTranslation();
  const milestones = [
    { year: '2012', titleKey: 'about.timeline.milestones.started.title', descKey: 'about.timeline.milestones.started.desc', icon: Rocket },
    { year: '2015', titleKey: 'about.timeline.milestones.customers1k.title', descKey: 'about.timeline.milestones.customers1k.desc', icon: Users },
    { year: '2018', titleKey: 'about.timeline.milestones.expansion.title', descKey: 'about.timeline.milestones.expansion.desc', icon: Bus },
    { year: '2021', titleKey: 'about.timeline.milestones.online.title', descKey: 'about.timeline.milestones.online.desc', icon: Globe },
    { year: '2024', titleKey: 'about.timeline.milestones.customers50k.title', descKey: 'about.timeline.milestones.customers50k.desc', icon: Award },
    { year: '2026', titleKey: 'about.timeline.milestones.platform.title', descKey: 'about.timeline.milestones.platform.desc', icon: Sparkles },
  ];\`
);

if (!timelineContent.includes("useTranslation")) {
  timelineContent = timelineContent.replace("import { Rocket", "import { useTranslation } from 'react-i18next';\nimport { Rocket");
}

timelineContent = timelineContent.replace(
  /<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our Journey Timeline<\/h2>/,
  '<h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("about.timeline.title")}</h2>'
);
timelineContent = timelineContent.replace(
  /<p className="text-xs sm:text-sm text-slate-500 font-semibold">Over a decade of landmark milestones and growth<\/p>/,
  '<p className="text-xs sm:text-sm text-slate-500 font-semibold">{t("about.timeline.subtitle")}</p>'
);

timelineContent = timelineContent.replace(
  /<h3 className="text-base font-black text-slate-900">{m\.title}<\/h3>/,
  '<h3 className="text-base font-black text-slate-900">{t(m.titleKey)}</h3>'
);
timelineContent = timelineContent.replace(
  /<p className="text-xs text-slate-600 font-normal leading-relaxed">{m\.desc}<\/p>/,
  '<p className="text-xs text-slate-600 font-normal leading-relaxed">{t(m.descKey)}</p>'
);

fs.writeFileSync('src/components/about/Timeline.jsx', timelineContent);
console.log('Timeline translations added and component refactored.');
