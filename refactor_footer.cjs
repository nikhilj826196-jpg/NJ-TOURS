const fs = require('fs');
const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  footer: {
    links: {
      terms: { en: "Terms & Conditions", mr: "अटी आणि शर्ती", hi: "नियम और शर्तें" },
      privacy: { en: "Privacy Policy", mr: "गोपनीयता धोरण", hi: "गोपनीयता नीति" },
      cancel: { en: "Cancellation Policy", mr: "रद्दीकरण धोरण", hi: "रद्दीकरण नीति" }
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
console.log('Footer translations added.');
