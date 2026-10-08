const fs = require('fs');

const toursDataPath = 'src/data/toursData.js';
let toursData = fs.readFileSync(toursDataPath, 'utf8');

const newDestinations = `export const DESTINATIONS = [
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
];`;

const startIdx = toursData.indexOf('export const DESTINATIONS = [');
const endIdx = toursData.indexOf('];', startIdx) + 2;
const updatedData = toursData.slice(0, startIdx) + newDestinations + toursData.slice(endIdx);
fs.writeFileSync(toursDataPath, updatedData);
console.log('DESTINATIONS array updated successfully!');
