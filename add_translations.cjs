const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/i18n/en/common.json', 'utf8'));
const mr = JSON.parse(fs.readFileSync('src/i18n/mr/common.json', 'utf8'));
const hi = JSON.parse(fs.readFileSync('src/i18n/hi/common.json', 'utf8'));

// Inject SERVICES translations
en.services = en.services || {};
en.services.items = {
  carRental: {
    title: "Car Rental",
    description: "Premium Sedans, Hatchbacks & Luxury SUVs for local and outstation trips with courteous drivers.",
    features: ["Zero Hidden Toll Charges", "Clean & Sanitized Fleet", "Flexible Hourly / Outstation Packages"],
    badge: "Popular"
  },
  busRental: {
    title: "Bus Rental",
    description: "Luxury 20 to 56 Seater AC/Non-AC Volvo & BharatBenz Coaches for grand tours & corporate events.",
    features: ["Air Suspension Comfort", "Reclining Pushback Seats", "Surround Sound & LED Screens"],
    badge: "Group Travel"
  },
  tempoTraveller: {
    title: "Tempo Traveller",
    description: "12, 17, 20 & 26 Seater Luxury Maharaja Tempo Travellers ideal for family holidays & pilgrim trips.",
    features: ["Individual AC Vents", "Plush Leather Recliners", "Luggage Roof Carrier"],
    badge: "Best Seller"
  },
  airportPickup: {
    title: "Airport Pickup",
    description: "Punctual, stress-free transfers to & from major domestic and international airports in India.",
    features: ["Live Flight Status Tracking", "Meet & Greet Service", "60 Mins Free Waiting Time"],
    badge: "24x7 Express"
  },
  corporateTransport: {
    title: "Corporate Transport",
    description: "Dedicated executive mobility solutions, monthly employee shuttle contracts, and VIP delegation cabs.",
    features: ["Dedicated Account Manager", "Monthly Automated Billing", "GPS Real-time Tracking"],
    badge: "B2B Solutions"
  },
  holidayPackages: {
    title: "Holiday Packages",
    description: "Handcrafted tour packages across India's top tourist destinations with hotel, cab & guide inclusions.",
    features: ["Customized Itineraries", "Verified 3★ to 5★ Hotels", "24x7 On-Trip Assistance"],
    badge: "All Inclusive"
  },
  weddingTransport: {
    title: "Wedding Transport",
    description: "Luxury wedding convoy fleet management for guests, bride-groom cars, and venue transfers.",
    features: ["Decorated Vintage & Luxury Cars", "Coordinated Fleet Managers", "Uniformed Professional Chauffeurs"],
    badge: "Luxury VIP"
  },
  schoolTrips: {
    title: "School Trips",
    description: "Safe, speed-governed, GPS-monitored buses for educational excursions and institutional tours.",
    features: ["Speed Governor Enabled", "CCTV & First Aid Kits", "Double Verified Drivers"],
    badge: "Safe Certified"
  }
};

// MR Services
mr.services = mr.services || {};
mr.services.items = {
  carRental: {
    title: "कार रेंटल",
    description: "स्थानिक आणि आउटस्टेशन प्रवासासाठी प्रीमियम सेडान, हॅचबॅक आणि लक्झरी SUV आणि विनम्र ड्रायव्हर.",
    features: ["कोणतेही लपलेले टोल शुल्क नाही", "स्वच्छ आणि निर्जंतुक ताफा", "लवचिक तासांचे / आउटस्टेशन पॅकेजेस"],
    badge: "लोकप्रिय"
  },
  busRental: {
    title: "बस रेंटल",
    description: "भव्य पर्यटन आणि कॉर्पोरेट इव्हेंटसाठी लक्झरी 20 ते 56 सीटर AC/Non-AC व्होल्वो आणि भारतबेंझ कोच.",
    features: ["एअर सस्पेंशनची सोय", "रिक्लाइनिंग पुशबॅक सीट्स", "सराउंड साउंड आणि एलईडी स्क्रीन्स"],
    badge: "ग्रुप ट्रॅव्हल"
  },
  tempoTraveller: {
    title: "टेम्पो ट्रॅव्हलर",
    description: "कौटुंबिक सुट्ट्या आणि तीर्थयात्रेसाठी आदर्श 12, 17, 20 आणि 26 सीटर लक्झरी महाराजा टेम्पो ट्रॅव्हलर.",
    features: ["स्वतंत्र AC व्हेंट्स", "प्लश लेदर रिक्लायनर्स", "छतावरील लगेज कॅरियर"],
    badge: "बेस्ट सेलर"
  },
  airportPickup: {
    title: "एअरपोर्ट पिकअप",
    description: "भारतातील प्रमुख देशांतर्गत आणि आंतरराष्ट्रीय विमानतळांवरून वेळेवर आणि तणावमुक्त ट्रान्सफर.",
    features: ["लाइव्ह फ्लाइट ट्रॅकिंग", "मीट अँड ग्रीट सेवा", "60 मिनिटे मोफत प्रतीक्षा वेळ"],
    badge: "24x7 एक्सप्रेस"
  },
  corporateTransport: {
    title: "कॉर्पोरेट ट्रान्सपोर्ट",
    description: "एक्झिक्युटिव्ह मोबिलिटी सोल्यूशन्स, मासिक कर्मचारी शटल करार आणि व्हीआयपी डेलिगेशन कॅब.",
    features: ["स्वतंत्र अकाउंट मॅनेजर", "मासिक ऑटोमेटेड बिलिंग", "जीपीएस रिअल-टाइम ट्रॅकिंग"],
    badge: "B2B सोल्यूशन्स"
  },
  holidayPackages: {
    title: "हॉलिडे पॅकेजेस",
    description: "हॉटेल, कॅब आणि गाईडसह भारतातील शीर्ष पर्यटन स्थळांवर कस्टमाइज्ड टूर पॅकेजेस.",
    features: ["कस्टमाइज्ड कार्यक्रम", "प्रमाणित 3★ ते 5★ हॉटेल्स", "24x7 ऑन-ट्रिप मदत"],
    badge: "सर्वसमावेशक"
  },
  weddingTransport: {
    title: "लग्नसमारंभ वाहने",
    description: "अतिथी, वधू-वर कार आणि कार्यक्रम स्थळाच्या ट्रान्सफरसाठी लक्झरी लग्न ताफा व्यवस्थापन.",
    features: ["सजवलेल्या व्हिंटेज आणि लक्झरी कार", "समन्वयक फ्लीट मॅनेजर", "गणवेशधारी व्यावसायिक ड्रायव्हर"],
    badge: "लक्झरी VIP"
  },
  schoolTrips: {
    title: "शालेय सहली",
    description: "शैक्षणिक सहली आणि संस्थात्मक दौऱ्यांसाठी सुरक्षित, गती नियंत्रित, GPS-सज्ज बसेस.",
    features: ["गती नियंत्रक सज्ज", "सीसीटीव्ही आणि प्रथमोपचार किट", "दोनदा पडताळलेले ड्रायव्हर"],
    badge: "सुरक्षित प्रमाणित"
  }
};

// HI Services
hi.services = hi.services || {};
hi.services.items = {
  carRental: {
    title: "कार रेंटल",
    description: "स्थानीय और आउटस्टेशन यात्राओं के लिए प्रीमियम सेडान, हैचबैक और लग्जरी SUV, विनम्र ड्राइवरों के साथ।",
    features: ["कोई छिपे हुए टोल शुल्क नहीं", "स्वच्छ और सैनिटाइज़्ड फ्लीट", "फ्लेक्सिबल प्रति घंटा / आउटस्टेशन पैकेज"],
    badge: "लोकप्रिय"
  },
  busRental: {
    title: "बस रेंटल",
    description: "भव्य पर्यटन और कॉर्पोरेट इवेंट्स के लिए लग्जरी 20 से 56 सीटर AC/Non-AC वोल्वो और भारतबेंज़ कोच।",
    features: ["एयर सस्पेंशन कंफर्ट", "रेक्लाइनिंग पुशबैक सीट्स", "सराउंड साउंड और एलईडी स्क्रीन"],
    badge: "ग्रुप ट्रैवल"
  },
  tempoTraveller: {
    title: "टेम्पो ट्रैवलर",
    description: "पारिवारिक छुट्टियों और तीर्थयात्राओं के लिए आदर्श 12, 17, 20 और 26 सीटर लग्जरी महाराजा टेम्पो ट्रैवलर।",
    features: ["अलग-अलग AC वेंट्स", "प्लश लेदर रिक्लाइनर्स", "छत पर लगेज कैरियर"],
    badge: "बेस्ट सेलर"
  },
  airportPickup: {
    title: "एयरपोर्ट पिकअप",
    description: "भारत के प्रमुख घरेलू और अंतर्राष्ट्रीय हवाई अड्डों से समयनिष्ठ और तनावमुक्त ट्रांसफर।",
    features: ["लाइव फ्लाइट स्टेटस ट्रैकिंग", "मीट एंड ग्रीट सेवा", "60 मिनट फ्री वेटिंग टाइम"],
    badge: "24x7 एक्सप्रेस"
  },
  corporateTransport: {
    title: "कॉर्पोरेट ट्रांसपोर्ट",
    description: "समर्पित कार्यकारी मोबिलिटी समाधान, मासिक कर्मचारी शटल अनुबंध और VIP डेलिगेशन कैब।",
    features: ["समर्पित अकाउंट मैनेजर", "मासिक ऑटोमेटेड बिलिंग", "जीपीएस रियल-टाइम ट्रैकिंग"],
    badge: "B2B सॉल्यूशंस"
  },
  holidayPackages: {
    title: "हॉलिडे पैकेज",
    description: "होटल, कैब और गाइड के साथ भारत के शीर्ष पर्यटन स्थलों में कस्टमाइज़्ड टूर पैकेज।",
    features: ["कस्टमाइज़्ड कार्यक्रम", "प्रमाणित 3★ से 5★ होटल", "24x7 ऑन-ट्रिप सहायता"],
    badge: "ऑल इनक्लूसिव"
  },
  weddingTransport: {
    title: "वेडिंग ट्रांसपोर्ट",
    description: "मेहमानों, दूल्हा-दुल्हन की कारों और वेन्यू ट्रांसफर के लिए लग्जरी वेडिंग फ्लीट मैनेजमेंट।",
    features: ["सजाए गए विंटेज और लग्जरी कारें", "समन्वित फ्लीट मैनेजर्स", "वर्दीधारी पेशेवर ड्राइवर"],
    badge: "लग्जरी VIP"
  },
  schoolTrips: {
    title: "स्कूल ट्रिप्स",
    description: "शैक्षणिक भ्रमण और संस्थागत दौरों के लिए सुरक्षित, स्पीड गवर्नड, जीपीएस-सज्ज बसें।",
    features: ["स्पीड गवर्नर इनेबल्ड", "सीसीटीवी और फर्स्ट ऐड किट", "डबल वेरिफाइड ड्राइवर्स"],
    badge: "सेफ सर्टिफाइड"
  }
};

fs.writeFileSync('src/i18n/en/common.json', JSON.stringify(en, null, 2));
fs.writeFileSync('src/i18n/mr/common.json', JSON.stringify(mr, null, 2));
fs.writeFileSync('src/i18n/hi/common.json', JSON.stringify(hi, null, 2));

console.log('Translations updated successfully');
