const fs = require('fs');

const paths = [
  'src/locales/en/translation.json',
  'src/locales/mr/translation.json',
  'src/locales/hi/translation.json',
  'src/i18n/en/common.json',
  'src/i18n/mr/common.json',
  'src/i18n/hi/common.json'
];

const newTranslations = {
  en: {
    services: {
      comprehensiveSolutions: "Comprehensive Solutions",
      estimatorDesc: "Real-time route & category estimates",
      approx: "Approx."
    }
  },
  mr: {
    services: {
      comprehensiveSolutions: "सर्वसमावेशक उपाय",
      estimatorDesc: "रिअल-टाइम मार्ग आणि श्रेणी अंदाज",
      approx: "अंदाजे"
    }
  },
  hi: {
    services: {
      comprehensiveSolutions: "व्यापक समाधान",
      estimatorDesc: "रियल-टाइम मार्ग और श्रेणी अनुमान",
      approx: "अनुमानित"
    }
  }
};

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

paths.forEach(p => {
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const lang = p.includes('/mr/') ? 'mr' : p.includes('/hi/') ? 'hi' : 'en';
    deepMerge(data, newTranslations[lang]);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${p}`);
  }
});
