const fs = require('fs');

const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  about: {
    team: {
      title: { en: "Meet Our Leadership Team", mr: "आमच्या लीडरशिप टीमला भेटा", hi: "हमारी लीडरशिप टीम से मिलें" },
      subtitle: { en: "The passionate professionals behind National Journey’s commitment to excellence", mr: "नॅशनल जर्नीच्या उत्कृष्टतेच्या वचनबद्धतेमागील उत्कट व्यावसायिक", hi: "नेशनल जर्नी की उत्कृष्टता के प्रति प्रतिबद्धता के पीछे जोशीले पेशेवर" },
      members: {
        nikhil: {
          name: { en: "Nikhil Jadhav", mr: "निखिल जाधव", hi: "निखिल जाधव" },
          role: { en: "Founder & Managing Director", mr: "संस्थापक आणि व्यवस्थापकीय संचालक", hi: "संस्थापक और प्रबंध निदेशक" },
          desc: { en: "Visionary entrepreneur with over 15 years of leadership in transport infrastructure and tourism operations.", mr: "वाहतूक पायाभूत सुविधा आणि पर्यटन ऑपरेशन्समधील १५ वर्षांहून अधिक नेतृत्वाचा अनुभव असलेले दूरदर्शी उद्योजक.", hi: "परिवहन बुनियादी ढांचे और पर्यटन संचालन में 15 से अधिक वर्षों के नेतृत्व के साथ दूरदर्शी उद्यमी।" }
        },
        rajesh: {
          name: { en: "Rajesh Kulkarni", mr: "राजेश कुलकर्णी", hi: "राजेश कुलकर्णी" },
          role: { en: "Operations Manager", mr: "ऑपरेशन्स मॅनेजर", hi: "संचालन प्रबंधक" },
          desc: { en: "Oversees intercity route scheduling, dispatch logistics, and driver performance compliance.", mr: "आंतरशहर मार्ग शेड्यूलिंग, डिस्पॅच लॉजिस्टिक्स आणि ड्रायव्हर कामगिरी अनुपालनावर देखरेख ठेवतात.", hi: "इंटरसिटी रूट शेड्यूलिंग, डिस्पैच लॉजिस्टिक्स और ड्राइवर प्रदर्शन अनुपालन की देखरेख करते हैं।" }
        },
        priya: {
          name: { en: "Priya Sharma", mr: "प्रिया शर्मा", hi: "प्रिया शर्मा" },
          role: { en: "Fleet Manager", mr: "फ्लीट मॅनेजर", hi: "फ्लीट मैनेजर" },
          desc: { en: "Manages vehicle maintenance audits, telematics hardware, and luxury coach safety certifications.", mr: "वाहन देखभाल ऑडिट, टेलिमॅटिक्स हार्डवेअर आणि लक्झरी कोच सुरक्षा प्रमाणपत्रांचे व्यवस्थापन करतात.", hi: "वाहन रखरखाव ऑडिट, टेलीमैटिक्स हार्डवेयर और लक्जरी कोच सुरक्षा प्रमाणपत्रों का प्रबंधन करती हैं।" }
        },
        amitabh: {
          name: { en: "Amitabh Deshmukh", mr: "अमिताभ देशमुख", hi: "अमिताभ देशमुख" },
          role: { en: "Customer Support Lead", mr: "ग्राहक समर्थन प्रमुख", hi: "ग्राहक सहायता प्रमुख" },
          desc: { en: "Heads our 24x7 trip concierge team ensuring stress-free resolution for every passenger.", mr: "प्रत्येक प्रवाशासाठी तणावमुक्त निराकरण सुनिश्चित करणाऱ्या आमच्या २४x७ ट्रिप कन्सिएर्ज टीमचे नेतृत्व करतात.", hi: "प्रत्येक यात्री के लिए तनाव-मुक्त समाधान सुनिश्चित करने वाली हमारी 24x7 ट्रिप कंसीयज टीम का नेतृत्व करते हैं।" }
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
console.log('Team translations added.');
