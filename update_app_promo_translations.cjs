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
    appPromo: {
      badge: "Next-Gen Mobile Mobility",
      title1: "Download the ",
      title2: " App",
      desc: "Book outstation cabs, track driver location in real-time, generate digital GST invoices, and get instant 24x7 SOS emergency support — all from your phone.",
      features: {
        tracking: {
          title: "Live Satellite Tracking",
          desc: "Share trip ETA with family"
        },
        notifications: {
          title: "Instant Notifications",
          desc: "Driver & cab arrival updates"
        },
        sos: {
          title: "SOS Emergency Alert",
          desc: "Direct 24x7 control room hotline"
        },
        gst: {
          title: "Digital GST Invoices",
          desc: "Instant PDF download after trip"
        }
      },
      store: {
        getItOn: "GET IT ON",
        downloadOn: "DOWNLOAD ON THE",
        googlePlay: "Google Play",
        appStore: "App Store"
      },
      phoneUi: {
        live: "LIVE",
        activeBooking: "Active Booking #NJ892",
        route: "Mumbai ➔ Mahabaleshwar",
        driverAssigned: "MH 04 ET 4020 • Driver Assigned",
        pickupTime: "Pickup Time",
        timeToday: "07:30 AM Today",
        estFare: "Estimated Fare",
        trackingActive: "📍 Live Tracking Active",
        cancelSos: "CANCEL / SOS SUPPORT"
      }
    }
  },
  mr: {
    appPromo: {
      badge: "पुढील पिढीची मोबाईल मोबिलिटी",
      title1: "डाउनलोड करा ",
      title2: " ॲप",
      desc: "आउटस्टेशन कॅब बुक करा, रिअल-टाइममध्ये ड्रायव्हरचे स्थान ट्रॅक करा, डिजिटल जीएसटी इनव्हॉइस जनरेट करा आणि थेट तुमच्या फोनवरून २४x७ एसओएस आपत्कालीन मदत मिळवा.",
      features: {
        tracking: {
          title: "थेट उपग्रह ट्रॅकिंग",
          desc: "कुटुंबासोबत प्रवासाचा ईटीए शेअर करा"
        },
        notifications: {
          title: "झटपट सूचना",
          desc: "ड्रायव्हर आणि कॅब आगमनाचे अपडेट्स"
        },
        sos: {
          title: "एसओएस आपत्कालीन सूचना",
          desc: "थेट २४x७ नियंत्रण कक्ष हॉटलाइन"
        },
        gst: {
          title: "डिजिटल जीएसटी इनव्हॉइस",
          desc: "प्रवासांनंतर झटपट पीडीएफ डाउनलोड करा"
        }
      },
      store: {
        getItOn: "मिळवा",
        downloadOn: "डाउनलोड करा",
        googlePlay: "Google Play",
        appStore: "App Store"
      },
      phoneUi: {
        live: "थेट",
        activeBooking: "सक्रिय बुकिंग #NJ892",
        route: "मुंबई ➔ महाबळेश्वर",
        driverAssigned: "MH 04 ET 4020 • चालक नियुक्त",
        pickupTime: "पिकअप वेळ",
        timeToday: "आज सकाळी ०७:३० वाजता",
        estFare: "अंदाजे भाडे",
        trackingActive: "📍 थेट ट्रॅकिंग सक्रिय",
        cancelSos: "रद्द करा / एसओएस समर्थन"
      }
    }
  },
  hi: {
    appPromo: {
      badge: "अगली पीढ़ी की मोबाइल मोबिलिटी",
      title1: "डाउनलोड करें ",
      title2: " ऐप",
      desc: "आउटस्टेशन कैब बुक करें, रियल-टाइम में ड्राइवर के स्थान को ट्रैक करें, डिजिटल जीएसटी इनवॉइस जेनरेट करें और सीधे अपने फोन से 24x7 एसओएस आपातकालीन सहायता प्राप्त करें।",
      features: {
        tracking: {
          title: "लाइव सैटेलाइट ट्रैकिंग",
          desc: "परिवार के साथ यात्रा ईटीए साझा करें"
        },
        notifications: {
          title: "त्वरित सूचनाएं",
          desc: "ड्राइवर और कैब आगमन अपडेट"
        },
        sos: {
          title: "एसओएस आपातकालीन अलर्ट",
          desc: "सीधा 24x7 नियंत्रण कक्ष हॉटलाइन"
        },
        gst: {
          title: "डिजिटल जीएसटी इनवॉइस",
          desc: "यात्रा के बाद तुरंत पीडीएफ डाउनलोड"
        }
      },
      store: {
        getItOn: "पाएं इसे",
        downloadOn: "डाउनलोड करें",
        googlePlay: "Google Play",
        appStore: "App Store"
      },
      phoneUi: {
        live: "लाइव",
        activeBooking: "सक्रिय बुकिंग #NJ892",
        route: "मुंबई ➔ महाबलेश्वर",
        driverAssigned: "MH 04 ET 4020 • ड्राइवर असाइन किया गया",
        pickupTime: "पिकअप समय",
        timeToday: "आज सुबह 07:30 बजे",
        estFare: "अनुमानित किराया",
        trackingActive: "📍 लाइव ट्रैकिंग सक्रिय",
        cancelSos: "रद्द करें / एसओएस सहायता"
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
