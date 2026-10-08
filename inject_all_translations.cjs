const fs = require('fs');

const dataPaths = {
  en: 'src/i18n/en/common.json',
  mr: 'src/i18n/mr/common.json',
  hi: 'src/i18n/hi/common.json'
};

const en = JSON.parse(fs.readFileSync(dataPaths.en, 'utf8'));
const mr = JSON.parse(fs.readFileSync(dataPaths.mr, 'utf8'));
const hi = JSON.parse(fs.readFileSync(dataPaths.hi, 'utf8'));

const translations = {
  fleet: {
    amenities: {
      ac: { en: "Air Conditioned", mr: "वातानुकूलित", hi: "वातानुकूलित" },
      gps: { en: "GPS Tracking", mr: "GPS ट्रॅकिंग", hi: "GPS ट्रैकिंग" },
      driver: { en: "Professional Driver", mr: "व्यावसायिक ड्रायव्हर", hi: "पेशेवर ड्राइवर" },
      music: { en: "Music System", mr: "संगीत प्रणाली", hi: "म्यूजिक सिस्टम" },
      charging: { en: "Charging Ports", mr: "चार्जिंग पोर्ट्स", hi: "चार्जिंग पोर्ट्स" }
    },
    items: {
      swiftDzire: {
        name: { en: "Swift Dzire", mr: "स्विफ्ट डिझायर", hi: "स्विफ्ट डिज़ायर" },
        subName: { en: "Or Similar Sedan", mr: "किंवा तत्सम सेडान", hi: "या समान सेडान" },
        category: { en: "Sedan", mr: "सेडान", hi: "सेडान" },
        description: { en: "Comfortable and economical for small families and intercity drops.", mr: "लहान कुटुंबे आणि आंतरशहर प्रवासासाठी आरामदायी आणि किफायतशीर.", hi: "छोटे परिवारों और अंतरशहर यात्रा के लिए आरामदायक और किफायती।" }
      },
      marutiErtiga: {
        name: { en: "Maruti Ertiga", mr: "मारुती अर्टिगा", hi: "मारुति अर्टिगा" },
        subName: { en: "Or Similar MUV", mr: "किंवा तत्सम MUV", hi: "या समान MUV" },
        category: { en: "SUV/MUV", mr: "SUV/MUV", hi: "SUV/MUV" },
        description: { en: "Spacious MUV perfect for family vacations with extra luggage space.", mr: "अतिरिक्त सामानासाठी भरपूर जागेसह कौटुंबिक सुट्ट्यांसाठी प्रशस्त MUV.", hi: "अतिरिक्त सामान स्थान के साथ पारिवारिक छुट्टियों के लिए विशाल MUV।" }
      },
      innovaCrysta: {
        name: { en: "Innova Crysta", mr: "इनोव्हा क्रिस्टा", hi: "इनोवा क्रिस्टा" },
        subName: { en: "Premium MPV", mr: "प्रीमियम MPV", hi: "प्रीमियम MPV" },
        category: { en: "Premium", mr: "प्रीमियम", hi: "प्रीमियम" },
        description: { en: "Ultimate luxury and comfort for long road trips and corporate travel.", mr: "लांबच्या प्रवासासाठी आणि कॉर्पोरेट प्रवासासाठी सर्वोत्तम लक्झरी आणि आराम.", hi: "लंबी सड़क यात्राओं और कॉर्पोरेट यात्रा के लिए सर्वोत्तम लक्जरी और आराम।" }
      },
      forceUrbania: {
        name: { en: "Force Urbania", mr: "फोर्स अर्बनिया", hi: "फोर्स अर्बनिया" },
        subName: { en: "Luxury Van", mr: "लक्झरी व्हॅन", hi: "लक्जरी वैन" },
        category: { en: "Traveller", mr: "ट्रॅव्हलर", hi: "ट्रैवलर" },
        description: { en: "Modern, spacious van with business class seating for premium group travel.", mr: "प्रीमियम गट प्रवासासाठी बिझनेस क्लास सीटिंग असलेली आधुनिक, प्रशस्त व्हॅन.", hi: "प्रीमियम समूह यात्रा के लिए बिजनेस क्लास बैठने की सुविधा वाली आधुनिक, विशाल वैन।" }
      },
      tempo12: {
        name: { en: "12 Seater Tempo", mr: "12 सीटर टेम्पो", hi: "12 सीटर टेम्पो" },
        subName: { en: "Maharaja Seats", mr: "महाराजा सीट्स", hi: "महाराजा सीट्स" },
        category: { en: "Traveller", mr: "ट्रॅव्हलर", hi: "ट्रैवलर" },
        description: { en: "1x1 Maharaja luxury pushback seats for maximum comfort on tours.", mr: "प्रवासातील जास्तीत जास्त आरामासाठी 1x1 महाराजा लक्झरी पुशबॅक सीट्स.", hi: "यात्रा पर अधिकतम आराम के लिए 1x1 महाराजा लक्जरी पुशबैक सीटें।" }
      },
      tempo17: {
        name: { en: "17 Seater Tempo", mr: "17 सीटर टेम्पो", hi: "17 सीटर टेम्पो" },
        subName: { en: "2x1 Pushback Seats", mr: "2x1 पुशबॅक सीट्स", hi: "2x1 पुशबैक सीट्स" },
        category: { en: "Traveller", mr: "ट्रॅव्हलर", hi: "ट्रैवलर" },
        description: { en: "Ideal for medium groups, extended families, and outstation trips.", mr: "मध्यम गट, मोठी कुटुंबे आणि आउटस्टेशन प्रवासासाठी आदर्श.", hi: "मध्यम समूहों, बड़े परिवारों और आउटस्टेशन यात्राओं के लिए आदर्श।" }
      },
      tempo26: {
        name: { en: "26 Seater Tempo", mr: "26 सीटर टेम्पो", hi: "26 सीटर टेम्पो" },
        subName: { en: "2x2 Recliner Seats", mr: "2x2 रिक्लायनर सीट्स", hi: "2x2 रिक्लाइनर सीटें" },
        category: { en: "Traveller", mr: "ट्रॅव्हलर", hi: "ट्रैवलर" },
        description: { en: "Spacious tempo traveller for large group trips and corporate outings.", mr: "मोठ्या गटातील सहली आणि कॉर्पोरेट आउटिंगसाठी प्रशस्त टेम्पो ट्रॅव्हलर.", hi: "बड़ी समूह यात्राओं और कॉर्पोरेट आउटिंग के लिए विशाल टेम्पो ट्रैवलर।" }
      },
      miniBus: {
        name: { en: "32 Seater Mini Bus", mr: "32 सीटर मिनी बस", hi: "32 सीटर मिनी बस" },
        subName: { en: "AC Coach", mr: "AC कोच", hi: "AC कोच" },
        category: { en: "Bus", mr: "बस", hi: "बस" },
        description: { en: "Comfortable air-conditioned mini bus for school trips and events.", mr: "शालेय सहली आणि कार्यक्रमांसाठी आरामदायी वातानुकूलित मिनी बस.", hi: "स्कूल ट्रिप और कार्यक्रमों के लिए आरामदायक वातानुकूलित मिनी बस।" }
      },
      luxuryCoach: {
        name: { en: "45 Seater Coach", mr: "45 सीटर कोच", hi: "45 सीटर कोच" },
        subName: { en: "Luxury Bus", mr: "लक्झरी बस", hi: "लक्जरी बस" },
        category: { en: "Bus", mr: "बस", hi: "बस" },
        description: { en: "Premium air-suspension coach for long-distance group tours.", mr: "लांब पल्ल्याच्या गट प्रवासासाठी प्रीमियम एअर-सस्पेंशन कोच.", hi: "लंबी दूरी की समूह यात्राओं के लिए प्रीमियम एयर-सस्पेंशन कोच।" }
      },
      volvoAC: {
        name: { en: "56 Seater Volvo", mr: "56 सीटर व्होल्वो", hi: "56 सीटर वोल्वो" },
        subName: { en: "Multi-Axle AC", mr: "मल्टी-एक्सल AC", hi: "मल्टी-एक्सल AC" },
        category: { en: "Bus", mr: "बस", hi: "बस" },
        description: { en: "The ultimate luxury coach experience with modern amenities and smooth ride.", mr: "आधुनिक सुविधा आणि सुरळीत प्रवासासह सर्वोत्तम लक्झरी कोचचा अनुभव.", hi: "आधुनिक सुविधाओं और सुगम सवारी के साथ अंतिम लक्जरी कोच का अनुभव।" }
      }
    }
  },
  destinations: {
    title: { en: "Explore Popular Destinations", mr: "लोकप्रिय पर्यटन स्थळे एक्सप्लोर करा", hi: "लोकप्रिय गंतव्यों का अन्वेषण करें" },
    subtitle: { en: "Discover carefully curated holiday packages covering the most beautiful locations in India.", mr: "भारतातील सर्वात सुंदर ठिकाणांचा समावेश असलेली काळजीपूर्वक निवडलेली हॉलिडे पॅकेजेस शोधा.", hi: "भारत के सबसे खूबसूरत स्थानों को कवर करने वाले ध्यानपूर्वक चुने गए हॉलिडे पैकेजों की खोज करें।" },
    viewAll: { en: "View All", mr: "सर्व पहा", hi: "सभी देखें" },
    categories: {
      goa: { en: "Goa", mr: "गोवा", hi: "गोवा" },
      maharashtra: { en: "Maharashtra", mr: "महाराष्ट्र", hi: "महाराष्ट्र" },
      kashmir: { en: "Kashmir", mr: "काश्मीर", hi: "कश्मीर" },
      himachal: { en: "Himachal", mr: "हिमाचल", hi: "हिमाचल" },
      kerala: { en: "Kerala", mr: "केरळ", hi: "केरल" },
      rajasthan: { en: "Rajasthan", mr: "राजस्थान", hi: "राजस्थान" }
    },
    items: {
      goaBeach: {
        name: { en: "Goa Beach Holiday", mr: "गोवा बीच हॉलिडे", hi: "गोवा बीच हॉलिडे" },
        duration: { en: "4 Nights / 5 Days", mr: "4 रात्री / 5 दिवस", hi: "4 रातें / 5 दिन" },
        vehicle: { en: "AC Sedan / SUV", mr: "AC सेडान / SUV", hi: "AC सेडान / SUV" },
        hotel: { en: "4 Star Resort", mr: "4 स्टार रिसॉर्ट", hi: "4 स्टार रिज़ॉर्ट" },
        inclusions: [
          { en: "Airport Transfers", mr: "विमानतळ ट्रान्सफर", hi: "एयरपोर्ट ट्रांसफर" },
          { en: "North Goa Tour", mr: "उत्तर गोवा टूर", hi: "उत्तरी गोवा टूर" },
          { en: "South Goa Tour", mr: "दक्षिण गोवा टूर", hi: "दक्षिणी गोवा टूर" },
          { en: "Breakfast Included", mr: "न्याहारी समाविष्ट", hi: "नाश्ता शामिल" }
        ],
        itinerary: [
          { title: { en: "Arrival in Goa", mr: "गोव्यात आगमन", hi: "गोवा में आगमन" }, desc: { en: "Check-in and relax at beach", mr: "चेक-इन करा आणि बीचवर आराम करा", hi: "चेक-इन करें और बीच पर आराम करें" } },
          { title: { en: "North Goa", mr: "उत्तर गोवा", hi: "उत्तरी गोवा" }, desc: { en: "Fort Aguada, Baga Beach", mr: "अगुआडा किल्ला, बागा बीच", hi: "अगुआडा किला, बागा बीच" } },
          { title: { en: "South Goa", mr: "दक्षिण गोवा", hi: "दक्षिणी गोवा" }, desc: { en: "Colva Beach, Mangueshi Temple", mr: "कोलवा बीच, मंगेशी मंदिर", hi: "कोलवा बीच, मंगेशी मंदिर" } },
          { title: { en: "Leisure Day", mr: "आरामाचा दिवस", hi: "आराम का दिन" }, desc: { en: "Shopping and local exploration", mr: "खरेदी आणि स्थानिक भ्रमंती", hi: "शॉपिंग और स्थानीय अन्वेषण" } },
          { title: { en: "Departure", mr: "प्रस्थान", hi: "प्रस्थान" }, desc: { en: "Drop to airport/station", mr: "विमानतळ/स्टेशनवर ड्रॉप करा", hi: "एयरपोर्ट/स्टेशन पर ड्रॉप करें" } }
        ]
      },
      mahabaleshwar: {
        name: { en: "Mahabaleshwar Weekend", mr: "महाबळेश्वर वीकेंड", hi: "महाबलेश्वर वीकेंड" },
        duration: { en: "2 Nights / 3 Days", mr: "2 रात्री / 3 दिवस", hi: "2 रातें / 3 दिन" },
        vehicle: { en: "AC Innova", mr: "AC इनोव्हा", hi: "AC इनोवा" },
        hotel: { en: "3 Star Hotel", mr: "3 स्टार हॉटेल", hi: "3 स्टार होटल" },
        inclusions: [
          { en: "Pune/Mumbai Pickup", mr: "पुणे/मुंबई पिकअप", hi: "पुणे/मुंबई पिकअप" },
          { en: "Pratapgarh Fort", mr: "प्रतापगड किल्ला", hi: "प्रतापगढ़ किला" },
          { en: "Panchgani Tour", mr: "पाचगणी टूर", hi: "पंचगनी टूर" },
          { en: "Mapro Garden Visit", mr: "मॅप्रो गार्डन भेट", hi: "मैप्रो गार्डन दर्शन" }
        ],
        itinerary: [
          { title: { en: "Journey & Panchgani", mr: "प्रवास आणि पाचगणी", hi: "यात्रा और पंचगनी" }, desc: { en: "Table Land, Parsi Point", mr: "टेबल लँड, पारशी पॉईंट", hi: "टेबल लैंड, पारसी पॉइंट" } },
          { title: { en: "Mahabaleshwar Sightseeing", mr: "महाबळेश्वर दर्शन", hi: "महाबलेश्वर दर्शन" }, desc: { en: "Arthur's Seat, Venna Lake", mr: "ऑर्थर्स सीट, वेण्णा तलाव", hi: "आर्थर सीट, वेन्ना लेक" } },
          { title: { en: "Pratapgarh & Return", mr: "प्रतापगड आणि परतीचा प्रवास", hi: "प्रतापगढ़ और वापसी" }, desc: { en: "Fort visit and drop back", mr: "किल्ला दर्शन आणि परतीचा प्रवास", hi: "किला दर्शन और वापसी" } }
        ]
      },
      shirdi: {
        name: { en: "Shirdi Darshan", mr: "शिर्डी दर्शन", hi: "शिर्डी दर्शन" },
        duration: { en: "1 Night / 2 Days", mr: "1 रात्र / 2 दिवस", hi: "1 रात / 2 दिन" },
        vehicle: { en: "AC Sedan", mr: "AC सेडान", hi: "AC सेडान" },
        hotel: { en: "3 Star Hotel", mr: "3 स्टार हॉटेल", hi: "3 स्टार होटल" },
        inclusions: [
          { en: "Home Pickup/Drop", mr: "होम पिकअप/ड्रॉप", hi: "होम पिकअप/ड्रॉप" },
          { en: "VIP Darshan Pass assist", mr: "व्हीआयपी दर्शन पास मदत", hi: "वीआईपी दर्शन पास सहायता" },
          { en: "Shani Shingnapur", mr: "शनि शिंगणापूर", hi: "शनि शिंगणापुर" },
          { en: "Toll & Parking", mr: "टोल आणि पार्किंग", hi: "टोल और पार्किंग" }
        ],
        itinerary: [
          { title: { en: "Travel to Shirdi", mr: "शिर्डीला प्रवास", hi: "शिर्डी यात्रा" }, desc: { en: "Arrival and evening Darshan", mr: "आगमन आणि संध्याकाळचे दर्शन", hi: "आगमन और शाम का दर्शन" } },
          { title: { en: "Shani Shingnapur", mr: "शनि शिंगणापूर", hi: "शनि शिंगणापुर" }, desc: { en: "Visit temple and return journey", mr: "मंदिर दर्शन आणि परतीचा प्रवास", hi: "मंदिर दर्शन और वापसी यात्रा" } }
        ]
      },
      nashik: {
        name: { en: "Nashik Wine & Divine", mr: "नाशिक वाईन आणि डिव्हाईन", hi: "नासिक वाइन एंड डिवाइन" },
        duration: { en: "1 Night / 2 Days", mr: "1 रात्र / 2 दिवस", hi: "1 रात / 2 दिन" },
        vehicle: { en: "AC Sedan", mr: "AC सेडान", hi: "AC सेडान" },
        hotel: { en: "3 Star Hotel", mr: "3 स्टार हॉटेल", hi: "3 स्टार होटल" },
        inclusions: [
          { en: "Sula Vineyards Tour", mr: "सुला विनयार्ड्स टूर", hi: "सुला वाइनयार्ड्स टूर" },
          { en: "Trimbakeshwar Darshan", mr: "त्र्यंबकेश्वर दर्शन", hi: "त्र्यंबकेश्वर दर्शन" },
          { en: "Panchavati Tour", mr: "पंचवटी टूर", hi: "पंचवटी टूर" },
          { en: "Breakfast", mr: "न्याहारी", hi: "नाश्ता" }
        ],
        itinerary: [
          { title: { en: "Trimbakeshwar & Panchavati", mr: "त्र्यंबकेश्वर आणि पंचवटी", hi: "त्र्यंबकेश्वर और पंचवटी" }, desc: { en: "Temple visits", mr: "मंदिरांना भेटी", hi: "मंदिर दर्शन" } },
          { title: { en: "Vineyard Tour", mr: "विनयार्ड टूर", hi: "वाइनयार्ड टूर" }, desc: { en: "Sula visit and return", mr: "सुला भेट आणि परत", hi: "सुला दर्शन और वापसी" } }
        ]
      },
      lonavala: {
        name: { en: "Lonavala Getaway", mr: "लोणावळा गेटवे", hi: "लोनावाला गेटअवे" },
        duration: { en: "1 Night / 2 Days", mr: "1 रात्र / 2 दिवस", hi: "1 रात / 2 दिन" },
        vehicle: { en: "AC Sedan", mr: "AC सेडान", hi: "AC सेडान" },
        hotel: { en: "3 Star Resort", mr: "3 स्टार रिसॉर्ट", hi: "3 स्टार रिज़ॉर्ट" },
        inclusions: [
          { en: "Tiger Point", mr: "टायगर पॉईंट", hi: "टाइगर पॉइंट" },
          { en: "Bhushi Dam", mr: "भुशी धरण", hi: "भुशी डैम" },
          { en: "Karla Caves", mr: "कार्ला लेणी", hi: "कार्ला गुफाएं" },
          { en: "Breakfast", mr: "न्याहारी", hi: "नाश्ता" }
        ],
        itinerary: [
          { title: { en: "Arrival & Sightseeing", mr: "आगमन आणि दर्शन", hi: "आगमन और दर्शन" }, desc: { en: "Lonavala local tour", mr: "लोणावळा स्थानिक टूर", hi: "लोनावाला स्थानीय टूर" } },
          { title: { en: "Khandala Tour", mr: "खंडाळा टूर", hi: "खंडाला टूर" }, desc: { en: "Rajmachi Point and return", mr: "राजमाची पॉईंट आणि परत", hi: "राजमाची पॉइंट और वापसी" } }
        ]
      },
      matheran: {
        name: { en: "Matheran Eco-Tour", mr: "माथेरान इको-टूर", hi: "माथेरान इको-टूर" },
        duration: { en: "1 Night / 2 Days", mr: "1 रात्र / 2 दिवस", hi: "1 रात / 2 दिन" },
        vehicle: { en: "AC Sedan", mr: "AC सेडान", hi: "AC सेडान" },
        hotel: { en: "3 Star Resort", mr: "3 स्टार रिसॉर्ट", hi: "3 स्टार रिज़ॉर्ट" },
        inclusions: [
          { en: "Dasturi Naka Drop", mr: "दस्तूरी नाका ड्रॉप", hi: "दस्तूरी नाका ड्रॉप" },
          { en: "Charlotte Lake", mr: "शार्लोट तलाव", hi: "शार्लोट लेक" },
          { en: "Panorama Point", mr: "पॅनोरमा पॉईंट", hi: "पैनोरमा पॉइंट" },
          { en: "Breakfast", mr: "न्याहारी", hi: "नाश्ता" }
        ],
        itinerary: [
          { title: { en: "Arrival at Matheran", mr: "माथेरान आगमन", hi: "माथेरान आगमन" }, desc: { en: "Trek to points", mr: "पॉईंट्ससाठी ट्रेक", hi: "पॉइंट्स के लिए ट्रेक" } },
          { title: { en: "More Sightseeing", mr: "अधिक दर्शन", hi: "अधिक दर्शन" }, desc: { en: "Louisa Point and return", mr: "लुईसा पॉईंट आणि परत", hi: "लुइसा पॉइंट और वापसी" } }
        ]
      },
      kashmir: {
        name: { en: "Kashmir Paradise", mr: "काश्मीर नंदनवन", hi: "कश्मीर पैराडाइज़" },
        duration: { en: "5 Nights / 6 Days", mr: "5 रात्री / 6 दिवस", hi: "5 रातें / 6 दिन" },
        vehicle: { en: "AC Innova/Tavera", mr: "AC इनोव्हा/टवेरा", hi: "AC इनोवा/टवेरा" },
        hotel: { en: "4 Star Hotel/Houseboat", mr: "4 स्टार हॉटेल/हाऊसबोट", hi: "4 स्टार होटल/हाउसबोट" },
        inclusions: [
          { en: "Srinagar Shikara Ride", mr: "श्रीनगर शिकारा राइड", hi: "श्रीनगर शिकारा राइड" },
          { en: "Gulmarg Gondola", mr: "गुलमर्ग गोंडोला", hi: "गुलमर्ग गोंडोला" },
          { en: "Pahalgam Tour", mr: "पहलगाम टूर", hi: "पहलगाम टूर" },
          { en: "Breakfast & Dinner", mr: "न्याहारी आणि रात्रीचे जेवण", hi: "नाश्ता और रात का भोजन" }
        ],
        itinerary: [
          { title: { en: "Arrival in Srinagar", mr: "श्रीनगर आगमन", hi: "श्रीनगर आगमन" }, desc: { en: "Houseboat stay and Shikara ride", mr: "हाऊसबोट मुक्काम आणि शिकारा राइड", hi: "हाउसबोट स्टे और शिकारा राइड" } },
          { title: { en: "Sonamarg Excursion", mr: "सोनमर्ग सहल", hi: "सोनमर्ग भ्रमण" }, desc: { en: "Meadow of Gold visit", mr: "मिडोज ऑफ गोल्डला भेट", hi: "मीडोज ऑफ गोल्ड दर्शन" } },
          { title: { en: "Gulmarg Tour", mr: "गुलमर्ग टूर", hi: "गुलमर्ग टूर" }, desc: { en: "Gondola ride and snow activities", mr: "गोंडोला राइड आणि बर्फातील खेळ", hi: "गोंडोला राइड और स्नो एक्टिविटीज़" } },
          { title: { en: "Pahalgam Journey", mr: "पहलगाम प्रवास", hi: "पहलगाम यात्रा" }, desc: { en: "Valley of Shepherds", mr: "व्हॅली ऑफ शेफर्ड्स", hi: "वैली ऑफ शेफर्ड्स" } },
          { title: { en: "Srinagar Local", mr: "श्रीनगर स्थानिक", hi: "श्रीनगर स्थानीय" }, desc: { en: "Mughal Gardens visit", mr: "मुघल गार्डन्सला भेट", hi: "मुगल गार्डन्स दर्शन" } },
          { title: { en: "Departure", mr: "प्रस्थान", hi: "प्रस्थान" }, desc: { en: "Airport drop", mr: "विमानतळ ड्रॉप", hi: "एयरपोर्ट ड्रॉप" } }
        ]
      },
      manali: {
        name: { en: "Manali Snow Adventure", mr: "मनाली स्नो ॲडव्हेंचर", hi: "मनाली स्नो एडवेंचर" },
        duration: { en: "4 Nights / 5 Days", mr: "4 रात्री / 5 दिवस", hi: "4 रातें / 5 दिन" },
        vehicle: { en: "AC SUV", mr: "AC SUV", hi: "AC SUV" },
        hotel: { en: "3 Star Hotel", mr: "3 स्टार हॉटेल", hi: "3 स्टार होटल" },
        inclusions: [
          { en: "Rohtang Pass/Solang", mr: "रोहतांग पास/सोलंग", hi: "रोहतांग पास/सोलंग" },
          { en: "Kullu Valley", mr: "कुल्लू व्हॅली", hi: "कुल्लू वैली" },
          { en: "Hadimba Temple", mr: "हिडिम्बा मंदिर", hi: "हिडिम्बा मंदिर" },
          { en: "Breakfast & Dinner", mr: "न्याहारी आणि रात्रीचे जेवण", hi: "नाश्ता और रात का भोजन" }
        ],
        itinerary: [
          { title: { en: "Arrival in Manali", mr: "मनाली आगमन", hi: "मनाली आगमन" }, desc: { en: "Check-in and local market", mr: "चेक-इन आणि स्थानिक बाजार", hi: "चेक-इन और स्थानीय बाजार" } },
          { title: { en: "Local Sightseeing", mr: "स्थानिक दर्शन", hi: "स्थानीय दर्शन" }, desc: { en: "Hadimba Temple, Vashisht", mr: "हिडिम्बा मंदिर, वशिष्ठ", hi: "हिडिम्बा मंदिर, वशिष्ठ" } },
          { title: { en: "Solang Valley", mr: "सोलंग व्हॅली", hi: "सोलंग वैली" }, desc: { en: "Snow activities", mr: "बर्फातील खेळ", hi: "स्नो एक्टिविटीज़" } },
          { title: { en: "Kullu Trip", mr: "कुल्लू ट्रिप", hi: "कुल्लू ट्रिप" }, desc: { en: "River rafting and shawls", mr: "रिव्हर राफ्टिंग आणि शॉल्स", hi: "रिवर राफ्टिंग और शॉल्स" } },
          { title: { en: "Departure", mr: "प्रस्थान", hi: "प्रस्थान" }, desc: { en: "Return journey", mr: "परतीचा प्रवास", hi: "वापसी यात्रा" } }
        ]
      },
      kerala: {
        name: { en: "Kerala Backwaters", mr: "केरळ बॅकवॉटर", hi: "केरल बैकवॉटर्स" },
        duration: { en: "4 Nights / 5 Days", mr: "4 रात्री / 5 दिवस", hi: "4 रातें / 5 दिन" },
        vehicle: { en: "AC Sedan", mr: "AC सेडान", hi: "AC सेडान" },
        hotel: { en: "4 Star Resort/Houseboat", mr: "4 स्टार रिसॉर्ट/हाऊसबोट", hi: "4 स्टार रिज़ॉर्ट/हाउसबोट" },
        inclusions: [
          { en: "Munnar Tea Gardens", mr: "मुन्नार टी गार्डन्स", hi: "मुन्नार टी गार्डन्स" },
          { en: "Alleppey Houseboat", mr: "अलेप्पी हाऊसबोट", hi: "एलेप्पी हाउसबोट" },
          { en: "Cochin Tour", mr: "कोचीन टूर", hi: "कोचीन टूर" },
          { en: "Breakfast", mr: "न्याहारी", hi: "नाश्ता" }
        ],
        itinerary: [
          { title: { en: "Arrival in Cochin", mr: "कोचीन आगमन", hi: "कोचीन आगमन" }, desc: { en: "Transfer to Munnar", mr: "मुन्नार ट्रान्सफर", hi: "मुन्नार ट्रांसफर" } },
          { title: { en: "Munnar Sightseeing", mr: "मुन्नार दर्शन", hi: "मुन्नार दर्शन" }, desc: { en: "Tea gardens and Mattupetty Dam", mr: "टी गार्डन्स आणि मट्टुपेट्टी धरण", hi: "टी गार्डन्स और मट्टुपेट्टी डैम" } },
          { title: { en: "Thekkady", mr: "थेक्कडी", hi: "थेक्कडी" }, desc: { en: "Periyar Wildlife Sanctuary", mr: "पेरियार वन्यजीव अभयारण्य", hi: "पेरियार वन्यजीव अभयारण्य" } },
          { title: { en: "Alleppey", mr: "अलेप्पी", hi: "एलेप्पी" }, desc: { en: "Houseboat stay", mr: "हाऊसबोट मुक्काम", hi: "हाउसबोट स्टे" } },
          { title: { en: "Departure", mr: "प्रस्थान", hi: "प्रस्थान" }, desc: { en: "Drop at Cochin airport", mr: "कोचीन विमानतळावर ड्रॉप", hi: "कोचीन एयरपोर्ट ड्रॉप" } }
        ]
      },
      rajasthan: {
        name: { en: "Rajasthan Royal Tour", mr: "राजस्थान रॉयल टूर", hi: "राजस्थान रॉयल टूर" },
        duration: { en: "5 Nights / 6 Days", mr: "5 रात्री / 6 दिवस", hi: "5 रातें / 6 दिन" },
        vehicle: { en: "AC Innova", mr: "AC इनोव्हा", hi: "AC इनोवा" },
        hotel: { en: "Heritage Hotels", mr: "हेरिटेज हॉटेल्स", hi: "हेरिटेज होटल्स" },
        inclusions: [
          { en: "Jaipur Sightseeing", mr: "जयपूर दर्शन", hi: "जयपुर दर्शन" },
          { en: "Udaipur Lakes", mr: "उदयपूर तलाव", hi: "उदयपुर झीलें" },
          { en: "Jodhpur Fort", mr: "जोधपूर किल्ला", hi: "जोधपुर किला" },
          { en: "Breakfast", mr: "न्याहारी", hi: "नाश्ता" }
        ],
        itinerary: [
          { title: { en: "Arrival in Jaipur", mr: "जयपूर आगमन", hi: "जयपुर आगमन" }, desc: { en: "Check-in and Chokhi Dhani", mr: "चेक-इन आणि चोखी ढाणी", hi: "चेक-इन और चोखी ढाणी" } },
          { title: { en: "Jaipur Sightseeing", mr: "जयपूर दर्शन", hi: "जयपुर दर्शन" }, desc: { en: "Amer Fort, Hawa Mahal", mr: "आमेर किल्ला, हवा महल", hi: "आमेर किला, हवा महल" } },
          { title: { en: "Jodhpur Journey", mr: "जोधपूर प्रवास", hi: "जोधपुर यात्रा" }, desc: { en: "Travel to Blue City", mr: "ब्लू सिटीचा प्रवास", hi: "ब्लू सिटी यात्रा" } },
          { title: { en: "Jodhpur Sightseeing", mr: "जोधपूर दर्शन", hi: "जोधपुर दर्शन" }, desc: { en: "Mehrangarh Fort", mr: "मेहरानगड किल्ला", hi: "मेहरानगढ़ किला" } },
          { title: { en: "Udaipur Transfer", mr: "उदयपूर ट्रान्सफर", hi: "उदयपुर ट्रांसफर" }, desc: { en: "Arrival at Lake City", mr: "लेक सिटी आगमन", hi: "लेक सिटी आगमन" } },
          { title: { en: "Departure", mr: "प्रस्थान", hi: "प्रस्थान" }, desc: { en: "Udaipur airport drop", mr: "उदयपूर विमानतळ ड्रॉप", hi: "उदयपुर एयरपोर्ट ड्रॉप" } }
        ]
      }
    }
  },
  gallery: {
    title: { en: "Our Travel Gallery", mr: "आमची ट्रॅव्हल गॅलरी", hi: "हमारी ट्रैवल गैलरी" },
    categories: {
      vehicles: { en: "Vehicles", mr: "वाहने", hi: "वाहन" },
      destinations: { en: "Destinations", mr: "पर्यटन स्थळे", hi: "गंतव्य" }
    },
    items: {
      volvo: { title: { en: "Volvo Multi-Axle", mr: "व्होल्वो मल्टी-एक्सल", hi: "वोल्वो मल्टी-एक्सल" } },
      kashmir: { title: { en: "Kashmir Valley", mr: "काश्मीर व्हॅली", hi: "कश्मीर वैली" } }
    }
  },
  testimonials: {
    items: {
      rajesh: {
        name: { en: "Rajesh Kumar", mr: "राजेश कुमार", hi: "राजेश कुमार" },
        location: { en: "Mumbai, India", mr: "मुंबई, भारत", hi: "मुंबई, भारत" },
        trip: { en: "Pune to Goa Trip", mr: "पुणे ते गोवा ट्रिप", hi: "पुणे से गोवा ट्रिप" },
        date: { en: "August 2026", mr: "ऑगस्ट 2026", hi: "अगस्त 2026" },
        comment: { en: "Excellent service! The driver was very professional and the Innova was brand new. Highly recommended for family trips.", mr: "उत्कृष्ट सेवा! ड्रायव्हर खूप व्यावसायिक होता आणि इनोव्हा अगदी नवीन होती. कौटुंबिक सहलींसाठी अत्यंत शिफारसीय.", hi: "उत्कृष्ट सेवा! ड्राइवर बहुत पेशेवर था और इनोवा एकदम नई थी। पारिवारिक यात्राओं के लिए अत्यधिक अनुशंसित।" }
      },
      anand: {
        name: { en: "Anand Deshmukh", mr: "आनंद देशमुख", hi: "आनंद देशमुख" },
        location: { en: "Pune, India", mr: "पुणे, भारत", hi: "पुणे, भारत" },
        trip: { en: "Mahabaleshwar Tour", mr: "महाबळेश्वर टूर", hi: "महाबलेश्वर टूर" },
        date: { en: "July 2026", mr: "जुलै 2026", hi: "जुलाई 2026" },
        comment: { en: "Booked a Tempo Traveller for our extended family. Seamless booking experience and transparent pricing without any hidden charges.", mr: "आमच्या मोठ्या कुटुंबासाठी टेम्पो ट्रॅव्हलर बुक केला होता. विना अडथळा बुकिंगचा अनुभव आणि कोणत्याही छुपे शुल्काशिवाय पारदर्शक किंमत.", hi: "हमारे बड़े परिवार के लिए एक टेम्पो ट्रैवलर बुक किया। निर्बाध बुकिंग अनुभव और बिना किसी छिपे शुल्क के पारदर्शी मूल्य निर्धारण।" }
      }
    }
  },
  about: {
    whyChooseUsTitle: { en: "Why Choose NJ Tours?", mr: "NJ टूर्स का निवडावी?", hi: "NJ टूर्स क्यों चुनें?" },
    whyChooseUsSubtitle: { en: "Discover what sets National Journey apart as India's premier transport service", mr: "भारतातील प्रमुख वाहतूक सेवा म्हणून नॅशनल जर्नीला काय वेगळे बनवते ते शोधा", hi: "खोजें कि नेशनल जर्नी को भारत की प्रमुख परिवहन सेवा के रूप में क्या अलग बनाता है" },
    features: {
      professionalDrivers: {
        title: { en: "Professional Drivers", mr: "व्यावसायिक ड्रायव्हर", hi: "पेशेवर ड्राइवर" },
        desc: { en: "Commercial licensed & background verified chauffeurs.", mr: "व्यावसायिक परवाना असलेले आणि पार्श्वभूमी पडताळलेले ड्रायव्हर्स.", hi: "वाणिज्यिक लाइसेंस प्राप्त और पृष्ठभूमि सत्यापित ड्राइवर।" }
      },
      gpsEnabled: {
        title: { en: "GPS Enabled Vehicles", mr: "GPS सज्ज वाहने", hi: "GPS सक्षम वाहन" },
        desc: { en: "Real-time live telematics tracking shared with family.", mr: "कुटुंबासह शेअर केलेले रिअल-टाइम लाईव्ह टेलिमॅटिक्स ट्रॅकिंग.", hi: "परिवार के साथ साझा किया गया रियल-टाइम लाइव टेलीमैटिक्स ट्रैकिंग।" }
      },
      sanitizedFleet: {
        title: { en: "Sanitized Fleet", mr: "निर्जंतुक ताफा", hi: "स्वच्छ फ्लीट" },
        desc: { en: "Clean, vacuumed, and disinfected vehicle cabins.", mr: "स्वच्छ, व्हॅक्यूम केलेले आणि निर्जंतुक केलेले वाहन केबिन.", hi: "साफ, वैक्यूम और कीटाणुरहित वाहन केबिन।" }
      },
      affordablePricing: {
        title: { en: "Affordable Pricing", mr: "परवडणारी किंमत", hi: "किफायती मूल्य निर्धारण" },
        desc: { en: "Competitive per-km rates with zero hidden toll fees.", mr: "कोणत्याही छुप्या टोल शुल्काशिवाय स्पर्धात्मक प्रति-किमी दर.", hi: "शून्य छिपे हुए टोल शुल्क के साथ प्रतिस्पर्धी प्रति-किमी दर।" }
      },
      customerSupport: {
        title: { en: "24×7 Customer Support", mr: "24×7 ग्राहक समर्थन", hi: "24×7 ग्राहक सहायता" },
        desc: { en: "Dedicated trip concierge helpline available round-the-clock.", mr: "स्वतंत्र ट्रिप कन्सिएर्ज हेल्पलाइन चोवीस तास उपलब्ध.", hi: "समर्पित ट्रिप कंसीयज हेल्पलाइन चौबीसों घंटे उपलब्ध।" }
      },
      onTimePickup: {
        title: { en: "On-Time Pickup", mr: "वेळेवर पिकअप", hi: "समय पर पिकअप" },
        desc: { en: "Punctuality guarantee for airport and intercity trips.", mr: "विमानतळ आणि आंतरशहर प्रवासासाठी वक्तशीरपणाची हमी.", hi: "हवाई अड्डे और अंतरशहर यात्राओं के लिए समय की पाबंदी की गारंटी।" }
      },
      experiencedTeam: {
        title: { en: "Experienced Team", mr: "अनुभवी टीम", hi: "अनुभवी टीम" },
        desc: { en: "Over 15+ years of mobility management expertise.", mr: "मोबिलिटी व्यवस्थापनाचा 15+ वर्षांहून अधिक अनुभव.", hi: "मोबिलिटी प्रबंधन विशेषज्ञता के 15+ से अधिक वर्ष।" }
      },
      secureBooking: {
        title: { en: "Secure Booking", mr: "सुरक्षित बुकिंग", hi: "सुरक्षित बुकिंग" },
        desc: { en: "Encrypted digital payments with instant GST receipts.", mr: "झटपट GST पावत्यांसह एन्क्रिप्टेड डिजिटल पेमेंट.", hi: "त्वरित GST रसीदों के साथ एन्क्रिप्टेड डिजिटल भुगतान।" }
      }
    }
  }
};

function deepMerge(target, lang) {
  for (const section in translations) {
    if (!target[section]) target[section] = {};
    const sectionData = translations[section];
    
    // For nested keys, we need a recursive merge, but for this structure we can handle it specifically or with a simple recursive function
    function mergeRecursive(targ, source) {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && source[key].en) {
          // It's a translation string object
          targ[key] = source[key][lang];
        } else if (source[key] && Array.isArray(source[key])) {
          // Array of translation string objects
          targ[key] = source[key].map(item => item[lang] ? item[lang] : (item.title ? { title: item.title[lang], desc: item.desc[lang] } : item));
        } else if (source[key] && typeof source[key] === 'object') {
          if (!targ[key]) targ[key] = {};
          mergeRecursive(targ[key], source[key]);
        }
      }
    }
    
    mergeRecursive(target[section], sectionData);
  }
}

deepMerge(en, 'en');
deepMerge(mr, 'mr');
deepMerge(hi, 'hi');

fs.writeFileSync(dataPaths.en, JSON.stringify(en, null, 2));
fs.writeFileSync(dataPaths.mr, JSON.stringify(mr, null, 2));
fs.writeFileSync(dataPaths.hi, JSON.stringify(hi, null, 2));

console.log('Successfully injected massive translations');
