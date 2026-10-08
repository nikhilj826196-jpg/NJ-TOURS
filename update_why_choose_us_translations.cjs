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
    about: {
      whyChooseUsAdvantage: "The National Journey Advantage",
      standardProtocol: "Standard Quality Protocol",
      gpsDemo: {
        badge: "LIVE VEHICLE GPS TELEMATICS DEMO",
        title: "Track Your Cab & Driver Location Real-Time",
        desc: "As soon as your booking is confirmed, receive a live SMS/WhatsApp tracking link to monitor your vehicle's speed, route, ETA, and driver phone details.",
        driverStatus: "Driver Status:",
        onDuty: "On Duty (Verified)",
        currentSpeed: "Current Speed:",
        safeLimit: "62 km/h (Safe Limit)",
        tripRoute: "Trip: Mumbai ➔ Pune Express Highway",
        vehicleInfo: "MH 12 AB 9822 • Innova Crysta",
        eta: "ETA: 42 Mins",
        mumbai: "Mumbai (Bandra)",
        lonavala: "Lonavala Ghat",
        pune: "Pune (Swargate)"
      },
      features: {
        drivers: {
          title: "Professional & Uniformed Drivers",
          desc: "Police verified, highly trained chauffeurs fluent in local languages and route expertise for stress-free travel.",
          badge: "Verified 100%"
        },
        support: {
          title: "24×7 Dedicated Support",
          desc: "Round the clock phone & WhatsApp assistance for route queries, booking modifications, or emergency dispatch.",
          badge: "Always Active"
        },
        gps: {
          title: "Real-time Live GPS Tracking",
          desc: "Every vehicle is equipped with live satellite GPS tracking & SOS emergency button for ultimate peace of mind.",
          badge: "Smart Tech"
        },
        pricing: {
          title: "Affordable & Transparent Pricing",
          desc: "No hidden charges or unexpected toll surcharges. Clear itemized bill provided before trip start.",
          badge: "Best Rates"
        },
        fleet: {
          title: "Safe & Sanitized Fleet",
          desc: "Deep sanitized cabs, speed governors, seatbelts for all passengers, and regular multi-point safety audits.",
          badge: "Safety First"
        },
        punctual: {
          title: "Trusted & Punctual Service",
          desc: "99.8% on-time pickup record across 150+ cities in India with guaranteed vehicle replacement on backup.",
          badge: "On-Time Guarantee"
        }
      }
    }
  },
  mr: {
    about: {
      whyChooseUsAdvantage: "नॅशनल जर्नीचा फायदा",
      standardProtocol: "मानक गुणवत्ता प्रोटोकॉल",
      gpsDemo: {
        badge: "थेट वाहन जीपीएस टेलिमॅटिक्स डेमो",
        title: "तुमच्या कॅब आणि ड्रायव्हरचे स्थान रिअल-टाइम ट्रॅक करा",
        desc: "तुमचे बुकिंग निश्चित होताच, तुमच्या वाहनाचा वेग, मार्ग, ईटीए आणि ड्रायव्हरच्या फोनच्या तपशीलांवर लक्ष ठेवण्यासाठी थेट एसएमएस/व्हॉट्सॲप ट्रॅकिंग लिंक मिळवा.",
        driverStatus: "चालक स्थिती:",
        onDuty: "कामावर (पडताळणी केलेले)",
        currentSpeed: "सध्याचा वेग:",
        safeLimit: "६२ किमी/तास (सुरक्षित मर्यादा)",
        tripRoute: "प्रवास: मुंबई ➔ पुणे एक्सप्रेस हायवे",
        vehicleInfo: "MH 12 AB 9822 • इनोव्हा क्रिस्टा",
        eta: "अंदाजे वेळ: ४२ मिनिटे",
        mumbai: "मुंबई (वांद्रे)",
        lonavala: "लोणावळा घाट",
        pune: "पुणे (स्वारगेट)"
      },
      features: {
        drivers: {
          title: "व्यावसायिक आणि गणवेशधारी चालक",
          desc: "तणावमुक्त प्रवासासाठी स्थानिक भाषांचे ज्ञान आणि मार्गाचा अनुभव असलेले पोलीस-पडताळणी केलेले, उच्च प्रशिक्षित चालक.",
          badge: "१००% पडताळणी केलेले"
        },
        support: {
          title: "२४×७ समर्पित समर्थन",
          desc: "मार्ग चौकशी, बुकिंग बदल किंवा आपत्कालीन सेवांसाठी चोवीस तास फोन आणि व्हॉट्सॲप मदत.",
          badge: "नेहमी सक्रिय"
        },
        gps: {
          title: "रिअल-टाइम थेट GPS ट्रॅकिंग",
          desc: "अंतिम शांततेसाठी प्रत्येक वाहन थेट उपग्रह GPS ट्रॅकिंग आणि SOS आपत्कालीन बटणासह सज्ज आहे.",
          badge: "स्मार्ट तंत्रज्ञान"
        },
        pricing: {
          title: "परवडणारी आणि पारदर्शक किंमत",
          desc: "कोणतेही छुपे शुल्क किंवा अनपेक्षित टोल अधिभार नाही. प्रवास सुरू होण्यापूर्वी स्पष्ट तपशीलवार बिल दिले जाते.",
          badge: "सर्वोत्तम दर"
        },
        fleet: {
          title: "सुरक्षित आणि निर्जंतुक ताफा",
          desc: "खोलवर निर्जंतुक केलेल्या कॅब, वेग नियंत्रक, सर्व प्रवाशांसाठी सीटबेल्ट आणि नियमित बहु-बिंदू सुरक्षा ऑडिट.",
          badge: "सुरक्षा प्रथम"
        },
        punctual: {
          title: "विश्वासार्ह आणि वक्तशीर सेवा",
          desc: "बॅकअपवर हमी वाहनासह भारतातील १५०+ शहरांमध्ये ९९.८% वेळेवर पिकअपचा विक्रम.",
          badge: "वेळेची हमी"
        }
      }
    }
  },
  hi: {
    about: {
      whyChooseUsAdvantage: "नेशनल जर्नी का लाभ",
      standardProtocol: "मानक गुणवत्ता प्रोटोकॉल",
      gpsDemo: {
        badge: "लाइव वाहन जीपीएस टेलीमैटिक्स डेमो",
        title: "अपनी कैब और ड्राइवर की स्थिति को रियल-टाइम ट्रैक करें",
        desc: "जैसे ही आपकी बुकिंग की पुष्टि होती है, अपने वाहन की गति, मार्ग, ईटीए और ड्राइवर के फोन विवरण की निगरानी के लिए एक लाइव एसएमएस/व्हाट्सएप ट्रैकिंग लिंक प्राप्त करें।",
        driverStatus: "ड्राइवर की स्थिति:",
        onDuty: "ड्यूटी पर (सत्यापित)",
        currentSpeed: "वर्तमान गति:",
        safeLimit: "62 किमी/घंटा (सुरक्षित सीमा)",
        tripRoute: "यात्रा: मुंबई ➔ पुणे एक्सप्रेस हाईवे",
        vehicleInfo: "MH 12 AB 9822 • इनोवा क्रिस्टा",
        eta: "अनुमानित समय: 42 मिनट",
        mumbai: "मुंबई (बांद्रा)",
        lonavala: "लोनावला घाट",
        pune: "पुणे (स्वारगेट)"
      },
      features: {
        drivers: {
          title: "पेशेवर और वर्दीधारी ड्राइवर",
          desc: "तनाव मुक्त यात्रा के लिए स्थानीय भाषाओं के ज्ञान और मार्ग के अनुभव के साथ पुलिस-सत्यापित, उच्च प्रशिक्षित ड्राइवर।",
          badge: "100% सत्यापित"
        },
        support: {
          title: "24×7 समर्पित सहायता",
          desc: "मार्ग पूछताछ, बुकिंग बदलाव या आपातकालीन सेवाओं के लिए चौबीसों घंटे फोन और व्हाट्सएप सहायता।",
          badge: "हमेशा सक्रिय"
        },
        gps: {
          title: "रियल-टाइम लाइव जीपीएस ट्रैकिंग",
          desc: "परम मानसिक शांति के लिए प्रत्येक वाहन लाइव सैटेलाइट जीपीएस ट्रैकिंग और एसओएस आपातकालीन बटन से लैस है।",
          badge: "स्मार्ट टेक"
        },
        pricing: {
          title: "किफायती और पारदर्शी मूल्य निर्धारण",
          desc: "कोई छिपा हुआ शुल्क या अप्रत्याशित टोल अधिभार नहीं। यात्रा शुरू होने से पहले स्पष्ट विस्तृत बिल प्रदान किया जाता है।",
          badge: "सर्वोत्तम दर"
        },
        fleet: {
          title: "सुरक्षित और सैनिटाइज्ड बेड़ा",
          desc: "गहन सैनिटाइज्ड कैब, गति नियंत्रक, सभी यात्रियों के लिए सीट बेल्ट और नियमित मल्टी-पॉइंट सुरक्षा ऑडिट।",
          badge: "सुरक्षा पहले"
        },
        punctual: {
          title: "विश्वसनीय और समयबद्ध सेवा",
          desc: "बैकअप पर गारंटीकृत वाहन प्रतिस्थापन के साथ भारत के 150+ शहरों में 99.8% समय पर पिकअप का रिकॉर्ड।",
          badge: "समय पर गारंटी"
        }
      }
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
