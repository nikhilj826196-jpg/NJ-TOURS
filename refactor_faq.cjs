const fs = require('fs');

const dataPaths = { en: 'src/i18n/en/common.json', mr: 'src/i18n/mr/common.json', hi: 'src/i18n/hi/common.json' };

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  faq: {
    badge: { en: "Frequent Questions", mr: "सतत विचारले जाणारे प्रश्न", hi: "अक्सर पूछे जाने वाले प्रश्न" },
    title: { en: "How can we help?", mr: "आम्ही कशी मदत करू शकतो?", hi: "हम कैसे मदद कर सकते हैं?" },
    subtitle: { en: "Answers to common queries about our transport services", mr: "आमच्या वाहतूक सेवांबद्दलच्या सामान्य प्रश्नांची उत्तरे", hi: "हमारी परिवहन सेवाओं के बारे में सामान्य प्रश्नों के उत्तर" },
    items: {
      q1: {
        q: { en: "Are toll taxes, state driver allowances, and parking fees included in the fare?", mr: "टोल टॅक्स, राज्य ड्रायव्हर भत्ते आणि पार्किंग शुल्क भाड्यात समाविष्ट आहेत का?", hi: "क्या टोल टैक्स, राज्य चालक भत्ते और पार्किंग शुल्क किराए में शामिल हैं?" },
        a: { en: "Our base fare estimates include the vehicle per-km charge and driver day allowance. Toll taxes, state border entry permits, and airport parking fees are payable directly at official booths or itemized transparently in your final bill.", mr: "आमच्या मूळ भाड्याच्या अंदाजामध्ये वाहनाचा प्रति-किमी शुल्क आणि ड्रायव्हरचा दैनिक भत्ता समाविष्ट आहे. टोल टॅक्स, राज्य सीमा प्रवेश परवाने आणि विमानतळ पार्किंग शुल्क थेट अधिकृत बूथवर भरले जाऊ शकतात किंवा अंतिम बिलात पारदर्शकपणे दाखवले जातात.", hi: "हमारे आधार किराया अनुमान में वाहन प्रति-किमी शुल्क और ड्राइवर का दैनिक भत्ता शामिल है। टोल टैक्स, राज्य सीमा प्रवेश परमिट और हवाई अड्डे के पार्किंग शुल्क सीधे आधिकारिक बूथों पर देय हैं या आपके अंतिम बिल में पारदर्शी रूप से दर्शाए जाते हैं।" }
      },
      q2: {
        q: { en: "How far in advance should I book a Tempo Traveller or Volvo Coach?", mr: "मी टेम्पो ट्रॅव्हलर किंवा व्होल्वो कोच किती दिवस आधी बुक करावे?", hi: "मुझे टेम्पो ट्रैवलर या वोल्वो कोच कितनी पहले बुक करना चाहिए?" },
        a: { en: "For weekend family trips and peak wedding season, we recommend booking 3 to 7 days prior. However, emergency outstation cab bookings can be fulfilled within 60 minutes.", mr: "वीकेंड कौटुंबिक सहलींसाठी आणि लग्नाच्या हंगामासाठी, आम्ही ३ ते ७ दिवस आधी बुकिंग करण्याची शिफारस करतो. तथापि, आपत्कालीन आउटस्टेशन कॅब बुकिंग ६० मिनिटांत पूर्ण केली जाऊ शकते.", hi: "सप्ताहांत की पारिवारिक यात्राओं और चरम शादी के मौसम के लिए, हम 3 से 7 दिन पहले बुकिंग करने की सलाह देते हैं। हालांकि, आपातकालीन आउटस्टेशन कैब बुकिंग 60 मिनट के भीतर पूरी की जा सकती है।" }
      },
      q3: {
        q: { en: "Are your drivers police-verified and safe for solo women & family travel?", mr: "तुमचे ड्रायव्हर पोलिस-पडताळणी केलेले आणि महिला तसेच कुटुंबासाठी सुरक्षित आहेत का?", hi: "क्या आपके ड्राइवर पुलिस-सत्यापित और अकेली महिलाओं व परिवार की यात्रा के लिए सुरक्षित हैं?" },
        a: { en: "Yes! 100% of our chauffeurs undergo mandatory background verification, possess valid commercial licenses, and wear clean uniforms. All cabs feature live GPS satellite tracking.", mr: "होय! आमचे १००% ड्रायव्हर्स अनिवार्य पार्श्वभूमी पडताळणीतून जातात, त्यांच्याकडे वैध व्यावसायिक परवाने असतात आणि ते स्वच्छ गणवेश घालतात. सर्व कॅबमध्ये थेट GPS उपग्रह ट्रॅकिंगची सुविधा आहे.", hi: "हाँ! हमारे 100% ड्राइवर अनिवार्य पृष्ठभूमि सत्यापन से गुजरते हैं, वैध वाणिज्यिक लाइसेंस रखते हैं, और साफ वर्दी पहनते हैं। सभी कैब में लाइव जीपीएस सैटेलाइट ट्रैकिंग की सुविधा है।" }
      },
      q4: {
        q: { en: "What happens if a vehicle breaks down during an outstation trip?", mr: "आउटस्टेशन प्रवासात वाहन नादुरुस्त झाल्यास काय होते?", hi: "यदि आउटस्टेशन यात्रा के दौरान कोई वाहन खराब हो जाए तो क्या होगा?" },
        a: { en: "National Journey guarantees 100% trip continuity. In the rare event of mechanical issues, a replacement cab of identical or higher category is dispatched within 45 to 60 minutes.", mr: "नॅशनल जर्नी १००% प्रवास अखंडतेची हमी देते. क्वचित यांत्रिक समस्या उद्भवल्यास, ४५ ते ६० मिनिटांत त्याच किंवा उच्च श्रेणीची बदली कॅब पाठवली जाते.", hi: "नेशनल जर्नी 100% यात्रा निरंतरता की गारंटी देती है। दुर्लभ यांत्रिक समस्याओं की स्थिति में, 45 से 60 मिनट के भीतर उसी या उच्च श्रेणी की प्रतिस्थापन कैब भेजी जाती है।" }
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
console.log('FAQ translations added.');
