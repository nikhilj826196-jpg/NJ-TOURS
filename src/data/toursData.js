export const COMPANY_INFO = {
  name: "NJ Tours",
  shortName: "NJ Tours",
  fullForm: "National Journey",
  subTagline: "Tours • Travels • Transport",
  tagline: "Your Journey, Our Responsibility.",
  headlineSubtitle: "Premium Tours & Travels and Transport Solutions for Every Journey Across India.",
  phone: "+91 93225 12345",
  altPhone: "+91 98220 11223",
  email: "booking@njtours.in",
  supportEmail: "support@nationaljourney.com",
  address: "National Journey HQ, Express Highway, Pune, Maharashtra, India",
  citiesCovered: 150,
  fleetSize: 250,
  happyCustomers: "50,000+",
  tripsCompleted: "100,000+"
};

export const SERVICES = [
  {
    id: "car-rental",
    titleKey: "services.items.carRental.title",
    icon: "Car",
    descriptionKey: "services.items.carRental.description",
    featuresKeys: ["services.items.carRental.features.0", "services.items.carRental.features.1", "services.items.carRental.features.2"],
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.carRental.badge"
  },
  {
    id: "bus-rental",
    titleKey: "services.items.busRental.title",
    icon: "Bus",
    descriptionKey: "services.items.busRental.description",
    featuresKeys: ["services.items.busRental.features.0", "services.items.busRental.features.1", "services.items.busRental.features.2"],
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.busRental.badge"
  },
  {
    id: "tempo-traveller",
    titleKey: "services.items.tempoTraveller.title",
    icon: "Truck",
    descriptionKey: "services.items.tempoTraveller.description",
    featuresKeys: ["services.items.tempoTraveller.features.0", "services.items.tempoTraveller.features.1", "services.items.tempoTraveller.features.2"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.tempoTraveller.badge"
  },
  {
    id: "airport-pickup",
    titleKey: "services.items.airportPickup.title",
    icon: "Plane",
    descriptionKey: "services.items.airportPickup.description",
    featuresKeys: ["services.items.airportPickup.features.0", "services.items.airportPickup.features.1", "services.items.airportPickup.features.2"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.airportPickup.badge"
  },
  {
    id: "corporate-transport",
    titleKey: "services.items.corporateTransport.title",
    icon: "Briefcase",
    descriptionKey: "services.items.corporateTransport.description",
    featuresKeys: ["services.items.corporateTransport.features.0", "services.items.corporateTransport.features.1", "services.items.corporateTransport.features.2"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.corporateTransport.badge"
  },
  {
    id: "holiday-packages",
    titleKey: "services.items.holidayPackages.title",
    icon: "Palmtree",
    descriptionKey: "services.items.holidayPackages.description",
    featuresKeys: ["services.items.holidayPackages.features.0", "services.items.holidayPackages.features.1", "services.items.holidayPackages.features.2"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.holidayPackages.badge"
  },
  {
    id: "wedding-transport",
    titleKey: "services.items.weddingTransport.title",
    icon: "Heart",
    descriptionKey: "services.items.weddingTransport.description",
    featuresKeys: ["services.items.weddingTransport.features.0", "services.items.weddingTransport.features.1", "services.items.weddingTransport.features.2"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.weddingTransport.badge"
  },
  {
    id: "school-trips",
    titleKey: "services.items.schoolTrips.title",
    icon: "GraduationCap",
    descriptionKey: "services.items.schoolTrips.description",
    featuresKeys: ["services.items.schoolTrips.features.0", "services.items.schoolTrips.features.1", "services.items.schoolTrips.features.2"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    badgeKey: "services.items.schoolTrips.badge"
  }
];

export const DESTINATIONS = [
  {
    id: "goa-beach",
    nameKey: "destinations.items.goaBeach.name",
    categoryKey: "destinations.categories.goa",
    durationKey: "destinations.items.goaBeach.duration",
    price: 11999,
    originalPrice: 15999,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.goaBeach.inclusions.0", "destinations.items.goaBeach.inclusions.1", "destinations.items.goaBeach.inclusions.2", "destinations.items.goaBeach.inclusions.3"],
    vehicleKey: "destinations.items.goaBeach.vehicle",
    hotelKey: "destinations.items.goaBeach.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.goaBeach.itinerary.0.title", descKey: "destinations.items.goaBeach.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.goaBeach.itinerary.1.title", descKey: "destinations.items.goaBeach.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.goaBeach.itinerary.2.title", descKey: "destinations.items.goaBeach.itinerary.2.desc" },
      { day: 4, titleKey: "destinations.items.goaBeach.itinerary.3.title", descKey: "destinations.items.goaBeach.itinerary.3.desc" },
      { day: 5, titleKey: "destinations.items.goaBeach.itinerary.4.title", descKey: "destinations.items.goaBeach.itinerary.4.desc" }
    ]
  },
  {
    id: "mahabaleshwar-weekend",
    nameKey: "destinations.items.mahabaleshwar.name",
    categoryKey: "destinations.categories.maharashtra",
    durationKey: "destinations.items.mahabaleshwar.duration",
    price: 6999,
    originalPrice: 9499,
    rating: 4.8,
    reviews: 240,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.mahabaleshwar.inclusions.0", "destinations.items.mahabaleshwar.inclusions.1", "destinations.items.mahabaleshwar.inclusions.2", "destinations.items.mahabaleshwar.inclusions.3"],
    vehicleKey: "destinations.items.mahabaleshwar.vehicle",
    hotelKey: "destinations.items.mahabaleshwar.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.mahabaleshwar.itinerary.0.title", descKey: "destinations.items.mahabaleshwar.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.mahabaleshwar.itinerary.1.title", descKey: "destinations.items.mahabaleshwar.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.mahabaleshwar.itinerary.2.title", descKey: "destinations.items.mahabaleshwar.itinerary.2.desc" }
    ]
  },
  {
    id: "shirdi-darshan",
    nameKey: "destinations.items.shirdi.name",
    categoryKey: "destinations.categories.maharashtra",
    durationKey: "destinations.items.shirdi.duration",
    price: 4999,
    originalPrice: 6999,
    rating: 4.9,
    reviews: 410,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.shirdi.inclusions.0", "destinations.items.shirdi.inclusions.1", "destinations.items.shirdi.inclusions.2", "destinations.items.shirdi.inclusions.3"],
    vehicleKey: "destinations.items.shirdi.vehicle",
    hotelKey: "destinations.items.shirdi.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.shirdi.itinerary.0.title", descKey: "destinations.items.shirdi.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.shirdi.itinerary.1.title", descKey: "destinations.items.shirdi.itinerary.1.desc" }
    ]
  },
  {
    id: "nashik-wine",
    nameKey: "destinations.items.nashik.name",
    categoryKey: "destinations.categories.maharashtra",
    durationKey: "destinations.items.nashik.duration",
    price: 5999,
    originalPrice: 7999,
    rating: 4.8,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.nashik.inclusions.0", "destinations.items.nashik.inclusions.1", "destinations.items.nashik.inclusions.2", "destinations.items.nashik.inclusions.3"],
    vehicleKey: "destinations.items.nashik.vehicle",
    hotelKey: "destinations.items.nashik.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.nashik.itinerary.0.title", descKey: "destinations.items.nashik.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.nashik.itinerary.1.title", descKey: "destinations.items.nashik.itinerary.1.desc" }
    ]
  },
  {
    id: "lonavala-getaway",
    nameKey: "destinations.items.lonavala.name",
    categoryKey: "destinations.categories.maharashtra",
    durationKey: "destinations.items.lonavala.duration",
    price: 3999,
    originalPrice: 5499,
    rating: 4.7,
    reviews: 290,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.lonavala.inclusions.0", "destinations.items.lonavala.inclusions.1", "destinations.items.lonavala.inclusions.2", "destinations.items.lonavala.inclusions.3"],
    vehicleKey: "destinations.items.lonavala.vehicle",
    hotelKey: "destinations.items.lonavala.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.lonavala.itinerary.0.title", descKey: "destinations.items.lonavala.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.lonavala.itinerary.1.title", descKey: "destinations.items.lonavala.itinerary.1.desc" }
    ]
  },
  {
    id: "matheran-ecotour",
    nameKey: "destinations.items.matheran.name",
    categoryKey: "destinations.categories.maharashtra",
    durationKey: "destinations.items.matheran.duration",
    price: 4499,
    originalPrice: 5999,
    rating: 4.8,
    reviews: 150,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.matheran.inclusions.0", "destinations.items.matheran.inclusions.1", "destinations.items.matheran.inclusions.2", "destinations.items.matheran.inclusions.3"],
    vehicleKey: "destinations.items.matheran.vehicle",
    hotelKey: "destinations.items.matheran.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.matheran.itinerary.0.title", descKey: "destinations.items.matheran.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.matheran.itinerary.1.title", descKey: "destinations.items.matheran.itinerary.1.desc" }
    ]
  },
  {
    id: "kashmir-paradise",
    nameKey: "destinations.items.kashmir.name",
    categoryKey: "destinations.categories.kashmir",
    durationKey: "destinations.items.kashmir.duration",
    price: 18999,
    originalPrice: 24999,
    rating: 5.0,
    reviews: 450,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.kashmir.inclusions.0", "destinations.items.kashmir.inclusions.1", "destinations.items.kashmir.inclusions.2", "destinations.items.kashmir.inclusions.3"],
    vehicleKey: "destinations.items.kashmir.vehicle",
    hotelKey: "destinations.items.kashmir.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.kashmir.itinerary.0.title", descKey: "destinations.items.kashmir.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.kashmir.itinerary.1.title", descKey: "destinations.items.kashmir.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.kashmir.itinerary.2.title", descKey: "destinations.items.kashmir.itinerary.2.desc" },
      { day: 4, titleKey: "destinations.items.kashmir.itinerary.3.title", descKey: "destinations.items.kashmir.itinerary.3.desc" },
      { day: 5, titleKey: "destinations.items.kashmir.itinerary.4.title", descKey: "destinations.items.kashmir.itinerary.4.desc" },
      { day: 6, titleKey: "destinations.items.kashmir.itinerary.5.title", descKey: "destinations.items.kashmir.itinerary.5.desc" }
    ]
  },
  {
    id: "manali-snow",
    nameKey: "destinations.items.manali.name",
    categoryKey: "destinations.categories.himachal",
    durationKey: "destinations.items.manali.duration",
    price: 13999,
    originalPrice: 18999,
    rating: 4.9,
    reviews: 380,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.manali.inclusions.0", "destinations.items.manali.inclusions.1", "destinations.items.manali.inclusions.2", "destinations.items.manali.inclusions.3"],
    vehicleKey: "destinations.items.manali.vehicle",
    hotelKey: "destinations.items.manali.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.manali.itinerary.0.title", descKey: "destinations.items.manali.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.manali.itinerary.1.title", descKey: "destinations.items.manali.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.manali.itinerary.2.title", descKey: "destinations.items.manali.itinerary.2.desc" },
      { day: 4, titleKey: "destinations.items.manali.itinerary.3.title", descKey: "destinations.items.manali.itinerary.3.desc" },
      { day: 5, titleKey: "destinations.items.manali.itinerary.4.title", descKey: "destinations.items.manali.itinerary.4.desc" }
    ]
  },
  {
    id: "kerala-backwaters",
    nameKey: "destinations.items.kerala.name",
    categoryKey: "destinations.categories.kerala",
    durationKey: "destinations.items.kerala.duration",
    price: 14999,
    originalPrice: 19999,
    rating: 4.9,
    reviews: 340,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.kerala.inclusions.0", "destinations.items.kerala.inclusions.1", "destinations.items.kerala.inclusions.2", "destinations.items.kerala.inclusions.3"],
    vehicleKey: "destinations.items.kerala.vehicle",
    hotelKey: "destinations.items.kerala.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.kerala.itinerary.0.title", descKey: "destinations.items.kerala.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.kerala.itinerary.1.title", descKey: "destinations.items.kerala.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.kerala.itinerary.2.title", descKey: "destinations.items.kerala.itinerary.2.desc" },
      { day: 4, titleKey: "destinations.items.kerala.itinerary.3.title", descKey: "destinations.items.kerala.itinerary.3.desc" },
      { day: 5, titleKey: "destinations.items.kerala.itinerary.4.title", descKey: "destinations.items.kerala.itinerary.4.desc" }
    ]
  },
  {
    id: "rajasthan-royal",
    nameKey: "destinations.items.rajasthan.name",
    categoryKey: "destinations.categories.rajasthan",
    durationKey: "destinations.items.rajasthan.duration",
    price: 16999,
    originalPrice: 22999,
    rating: 5.0,
    reviews: 420,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    inclusionsKeys: ["destinations.items.rajasthan.inclusions.0", "destinations.items.rajasthan.inclusions.1", "destinations.items.rajasthan.inclusions.2", "destinations.items.rajasthan.inclusions.3"],
    vehicleKey: "destinations.items.rajasthan.vehicle",
    hotelKey: "destinations.items.rajasthan.hotel",
    itineraryKeys: [
      { day: 1, titleKey: "destinations.items.rajasthan.itinerary.0.title", descKey: "destinations.items.rajasthan.itinerary.0.desc" },
      { day: 2, titleKey: "destinations.items.rajasthan.itinerary.1.title", descKey: "destinations.items.rajasthan.itinerary.1.desc" },
      { day: 3, titleKey: "destinations.items.rajasthan.itinerary.2.title", descKey: "destinations.items.rajasthan.itinerary.2.desc" },
      { day: 4, titleKey: "destinations.items.rajasthan.itinerary.3.title", descKey: "destinations.items.rajasthan.itinerary.3.desc" },
      { day: 5, titleKey: "destinations.items.rajasthan.itinerary.4.title", descKey: "destinations.items.rajasthan.itinerary.4.desc" },
      { day: 6, titleKey: "destinations.items.rajasthan.itinerary.5.title", descKey: "destinations.items.rajasthan.itinerary.5.desc" }
    ]
  }
];

export const VEHICLE_FLEET = [
  {
    id: "swift-dzire",
    nameKey: "fleet.items.swiftDzire.name",
    subNameKey: "fleet.items.swiftDzire.subName",
    categoryKey: "fleet.items.swiftDzire.category",
    seats: 4,
    luggage: "2 bags",
    ac: true,
    pricePerKm: 12,
    baseFare: 2500,
    minKmPerDay: 250,
    driverAllowance: 400,
    rating: 4.9,
    descriptionKey: "fleet.items.swiftDzire.description",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "maruti-ertiga",
    nameKey: "fleet.items.marutiErtiga.name",
    subNameKey: "fleet.items.marutiErtiga.subName",
    categoryKey: "fleet.items.marutiErtiga.category",
    seats: 6,
    luggage: "3 bags",
    ac: true,
    pricePerKm: 15,
    baseFare: 3500,
    minKmPerDay: 250,
    driverAllowance: 500,
    rating: 4.9,
    descriptionKey: "fleet.items.marutiErtiga.description",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "innova-crysta",
    nameKey: "fleet.items.innovaCrysta.name",
    subNameKey: "fleet.items.innovaCrysta.subName",
    categoryKey: "fleet.items.innovaCrysta.category",
    seats: 7,
    luggage: "4 bags",
    ac: true,
    pricePerKm: 18,
    baseFare: 4500,
    minKmPerDay: 300,
    driverAllowance: 500,
    rating: 5.0,
    descriptionKey: "fleet.items.innovaCrysta.description",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "force-urbania",
    nameKey: "fleet.items.forceUrbania.name",
    subNameKey: "fleet.items.forceUrbania.subName",
    categoryKey: "fleet.items.forceUrbania.category",
    seats: 10,
    luggage: "8 bags",
    ac: true,
    pricePerKm: 26,
    baseFare: 7500,
    minKmPerDay: 300,
    driverAllowance: 600,
    rating: 4.9,
    descriptionKey: "fleet.items.forceUrbania.description",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "tempo-12",
    nameKey: "fleet.items.tempo12.name",
    subNameKey: "fleet.items.tempo12.subName",
    categoryKey: "fleet.items.tempo12.category",
    seats: 12,
    luggage: "6 bags",
    ac: true,
    pricePerKm: 20,
    baseFare: 5500,
    minKmPerDay: 300,
    driverAllowance: 600,
    rating: 4.9,
    descriptionKey: "fleet.items.tempo12.description",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "tempo-traveller",
    nameKey: "fleet.items.tempo17.name",
    subNameKey: "fleet.items.tempo17.subName",
    categoryKey: "fleet.items.tempo17.category",
    seats: 17,
    luggage: "10 bags",
    ac: true,
    pricePerKm: 22,
    baseFare: 6500,
    minKmPerDay: 300,
    driverAllowance: 600,
    rating: 4.9,
    descriptionKey: "fleet.items.tempo17.description",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "tempo-26",
    nameKey: "fleet.items.tempo26.name",
    subNameKey: "fleet.items.tempo26.subName",
    categoryKey: "fleet.items.tempo26.category",
    seats: 26,
    luggage: "15 bags",
    ac: true,
    pricePerKm: 25,
    baseFare: 8500,
    minKmPerDay: 300,
    driverAllowance: 700,
    rating: 4.9,
    descriptionKey: "fleet.items.tempo26.description",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "mini-bus",
    nameKey: "fleet.items.miniBus.name",
    subNameKey: "fleet.items.miniBus.subName",
    categoryKey: "fleet.items.miniBus.category",
    seats: 32,
    luggage: "20 bags",
    ac: true,
    pricePerKm: 28,
    baseFare: 11000,
    minKmPerDay: 300,
    driverAllowance: 800,
    rating: 4.9,
    descriptionKey: "fleet.items.miniBus.description",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "luxury-coach",
    nameKey: "fleet.items.luxuryCoach.name",
    subNameKey: "fleet.items.luxuryCoach.subName",
    categoryKey: "fleet.items.luxuryCoach.category",
    seats: 45,
    luggage: "40 bags",
    ac: true,
    pricePerKm: 32,
    baseFare: 14000,
    minKmPerDay: 300,
    driverAllowance: 900,
    rating: 5.0,
    descriptionKey: "fleet.items.luxuryCoach.description",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  },
  {
    id: "luxury-bus",
    nameKey: "fleet.items.volvoAC.name",
    subNameKey: "fleet.items.volvoAC.subName",
    categoryKey: "fleet.items.volvoAC.category",
    seats: 56,
    luggage: "50 bags",
    ac: true,
    pricePerKm: 38,
    baseFare: 17000,
    minKmPerDay: 300,
    driverAllowance: 1000,
    rating: 5.0,
    descriptionKey: "fleet.items.volvoAC.description",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    amenitiesKeys: ["fleet.amenities.ac", "fleet.amenities.gps", "fleet.amenities.driver", "fleet.amenities.music", "fleet.amenities.charging"]
  }
];

export const POPULAR_ROUTES = [
  { from: "Mumbai", to: "Pune", dist: "150 km", estFare: "₹ 2,499", vehicle: "Sedan" },
  { from: "Mumbai", to: "Goa", dist: "590 km", estFare: "₹ 8,999", vehicle: "Innova Crysta" },
  { from: "Delhi", to: "Agra", dist: "230 km", estFare: "₹ 3,200", vehicle: "Sedan" },
  { from: "Delhi", to: "Manali", dist: "540 km", estFare: "₹ 11,500", vehicle: "Tempo Traveller" }
];

export const TESTIMONIALS = [
  {
    id: 1,
    nameKey: "testimonials.items.rajesh.name",
    locationKey: "testimonials.items.rajesh.location",
    tripKey: "testimonials.items.rajesh.trip",
    rating: 5,
    dateKey: "testimonials.items.rajesh.date",
    commentKey: "testimonials.items.rajesh.comment",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    nameKey: "testimonials.items.anand.name",
    locationKey: "testimonials.items.anand.location",
    tripKey: "testimonials.items.anand.trip",
    rating: 5,
    dateKey: "testimonials.items.anand.date",
    commentKey: "testimonials.items.anand.comment",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];

export const GALLERY_ITEMS = [
  {
    id: 1,
    titleKey: "gallery.items.volvo.title",
    categoryKey: "gallery.categories.vehicles",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    titleKey: "gallery.items.kashmir.title",
    categoryKey: "gallery.categories.destinations",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80"
  }
];
