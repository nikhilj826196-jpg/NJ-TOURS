const fs = require('fs');

const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  stats: {
    happyCustomers: { en: "Happy\nCustomers", mr: "समाधानी\nग्राहक", hi: "खुश\nग्राहक" },
    vehicles: { en: "Vehicles", mr: "वाहने", hi: "वाहन" },
    tripsCompleted: { en: "Trips\nCompleted", mr: "पूर्ण केलेल्या\nसहली", hi: "पूरी की गई\nयात्राएं" },
    citiesCovered: { en: "Cities\nCovered", mr: "कव्हर केलेली\nशहरे", hi: "कवर किए गए\nशहर" }
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
console.log('Stats translations added.');
