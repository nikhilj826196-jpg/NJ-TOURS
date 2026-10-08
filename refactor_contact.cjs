const fs = require('fs');
const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  contact: {
    badge: { en: "24x7 Helpdesk & Inquiries", mr: "24x7 हेल्पडेस्क आणि चौकशी", hi: "24x7 हेल्पडेस्क और पूछताछ" },
    title: { en: "Get In Touch", mr: "संपर्क साधा", hi: "संपर्क करें" },
    subtitle: { en: "We are available round the clock. Let us help you plan your next perfect journey.", mr: "आम्ही चोवीस तास उपलब्ध आहोत. तुमचा पुढील उत्तम प्रवास नियोजित करण्यात आम्हाला मदत करू द्या.", hi: "हम चौबीसों घंटे उपलब्ध हैं। आइए आपकी अगली आदर्श यात्रा की योजना बनाने में आपकी मदद करें।" },
    helplines: {
      title: { en: "Phone Helplines", mr: "फोन हेल्पलाइन", hi: "फोन हेल्पलाइन" },
      support: { en: "(24x7 Support)", mr: "(24x7 समर्थन)", hi: "(24x7 सपोर्ट)" }
    },
    email: {
      title: { en: "Email Address", mr: "ईमेल पत्ता", hi: "ईमेल पता" }
    },
    hq: {
      title: { en: "Headquarters", mr: "मुख्यालय", hi: "मुख्यालय" }
    },
    form: {
      title: { en: "Send Quick Inquiry", mr: "त्वरित चौकशी पाठवा", hi: "त्वरित पूछताछ भेजें" },
      name: { en: "Your Full Name *", mr: "तुमचे पूर्ण नाव *", hi: "आपका पूरा नाम *" },
      namePh: { en: "e.g. Ramesh Kumar", mr: "उदा. रमेश कुमार", hi: "उदा. रमेश कुमार" },
      phone: { en: "Mobile Number *", mr: "मोबाईल क्रमांक *", hi: "मोबाइल नंबर *" },
      emailLabel: { en: "Email Address", mr: "ईमेल पत्ता", hi: "ईमेल पता" },
      tripType: { en: "Trip / Service Required", mr: "आवश्यक सहल / सेवा", hi: "यात्रा / सेवा आवश्यक" },
      tripOptions: {
        outstation: { en: "Outstation Car / SUV Rental", mr: "आउटस्टेशन कार / SUV रेंटल", hi: "आउटस्टेशन कार / SUV रेंटल" },
        tempo: { en: "Tempo Traveller Group Trip", mr: "टेम्पो ट्रॅव्हलर ग्रुप ट्रिप", hi: "टेम्पो ट्रैवलर ग्रुप ट्रिप" },
        bus: { en: "Luxury Volvo Bus Rental", mr: "लक्झरी व्होल्वो बस रेंटल", hi: "लक्जरी वोल्वो बस रेंटल" },
        package: { en: "Holiday Tour Package", mr: "हॉलिडे टूर पॅकेज", hi: "हॉलिडे टूर पैकेज" },
        corp: { en: "Corporate Shuttle / Wedding Convoy", mr: "कॉर्पोरेट शटल / लग्नाची वरात", hi: "कॉर्पोरेट शटल / वेडिंग काफिला" }
      },
      message: { en: "Trip Details / Special Request", mr: "प्रवासाचे तपशील / विशेष विनंती", hi: "यात्रा विवरण / विशेष अनुरोध" },
      messagePh: { en: "Mention pickup date, route details, or passenger count...", mr: "पिकअपची तारीख, मार्गाचे तपशील किंवा प्रवाशांची संख्या नमूद करा...", hi: "पिकअप तिथि, मार्ग विवरण या यात्री संख्या का उल्लेख करें..." },
      submit: { en: "SUBMIT INQUIRY NOW", mr: "आता चौकशी सबमिट करा", hi: "अभी पूछताछ सबमिट करें" }
    },
    success: {
      title: { en: "Inquiry Received Successfully!", mr: "चौकशी यशस्वीरित्या प्राप्त झाली!", hi: "पूछताछ सफलतापूर्वक प्राप्त हुई!" },
      desc1: { en: "Thank you", mr: "धन्यवाद", hi: "धन्यवाद" },
      desc2: { en: ". Our tour manager will call you back on", mr: ". आमचे टूर मॅनेजर तुम्हाला परत कॉल करतील", hi: ". हमारे टूर मैनेजर आपको वापस कॉल करेंगे" },
      desc3: { en: "within 15 minutes with a custom quote.", mr: "१५ मिनिटांत कस्टम कोटसह.", hi: "15 मिनट के भीतर कस्टम उद्धरण के साथ।" },
      button: { en: "Send Another Inquiry", mr: "दुसरी चौकशी पाठवा", hi: "एक और पूछताछ भेजें" }
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
console.log('Contact translations added.');
