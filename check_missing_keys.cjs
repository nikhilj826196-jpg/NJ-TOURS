const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('src/locales/mr/translation.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('src/locales/hi/translation.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], newPrefix));
    } else {
      keys.push(newPrefix);
    }
  }
  return keys;
}

const enKeys = getKeys(en);
const mrKeys = getKeys(mr);
const hiKeys = getKeys(hi);

const missingMr = enKeys.filter(k => !mrKeys.includes(k));
const missingHi = enKeys.filter(k => !hiKeys.includes(k));

console.log(`Missing in Marathi: ${missingMr.length}`);
console.log(missingMr.slice(0, 50));
console.log(`Missing in Hindi: ${missingHi.length}`);
console.log(missingHi.slice(0, 50));
