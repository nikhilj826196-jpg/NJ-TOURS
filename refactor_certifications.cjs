const fs = require('fs');
const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  about: {
    certifications: {
      title: { en: "Accreditations & Trust", mr: "मान्यता आणि विश्वास", hi: "मान्यता और विश्वास" },
      subtitle: { en: "Recognized and certified by leading transport and tourism authorities", mr: "अग्रणी वाहतूक आणि पर्यटन प्राधिकरणांद्वारे मान्यताप्राप्त आणि प्रमाणित", hi: "प्रमुख परिवहन और पर्यटन अधिकारियों द्वारा मान्यता प्राप्त और प्रमाणित" },
      items: {
        gst: {
          title: { en: "GST Registered Entity", mr: "GST नोंदणीकृत संस्था", hi: "GST पंजीकृत इकाई" },
          desc: { en: "100% compliant digital GST invoices provided.", mr: "100% अनुपालन डिजिटल GST पावत्या दिल्या जातात.", hi: "100% अनुपालन डिजिटल GST चालान प्रदान किए जाते हैं।" }
        },
        permit: {
          title: { en: "Commercial Transport Permit", mr: "व्यावसायिक वाहतूक परवाना", hi: "वाणिज्यिक परिवहन परमिट" },
          desc: { en: "All India Tourist Permit (AITP) authorized fleet.", mr: "अखिल भारतीय पर्यटक परवाना (AITP) अधिकृत ताफा.", hi: "अखिल भारतीय पर्यटक परमिट (AITP) अधिकृत बेड़ा।" }
        },
        drivers: {
          title: { en: "Double Verified Drivers", mr: "दोनदा पडताळलेले ड्रायव्हर्स", hi: "दोहरे सत्यापित ड्राइवर" },
          desc: { en: "Commercial DL, police background check & medical test.", mr: "व्यावसायिक DL, पोलीस पार्श्वभूमी तपासणी आणि वैद्यकीय चाचणी.", hi: "वाणिज्यिक DL, पुलिस पृष्ठभूमि की जांच और चिकित्सा परीक्षण।" }
        },
        registered: {
          title: { en: "Government Registered", mr: "सरकार नोंदणीकृत", hi: "सरकार पंजीकृत" },
          desc: { en: "Officially registered transport mobility company.", mr: "अधिकृतपणे नोंदणीकृत वाहतूक मोबिलिटी कंपनी.", hi: "आधिकारिक तौर पर पंजीकृत परिवहन मोबिलिटी कंपनी।" }
        },
        insured: {
          title: { en: "Fully Insured Vehicles", mr: "पूर्णपणे विमा उतरवलेली वाहने", hi: "पूरी तरह से बीमित वाहन" },
          desc: { en: "Comprehensive commercial passenger insurance policy.", mr: "सर्वसमावेशक व्यावसायिक प्रवासी विमा पॉलिसी.", hi: "व्यापक वाणिज्यिक यात्री बीमा पॉलिसी।" }
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
console.log('Certifications translations added.');
