const fs = require('fs');

const toursDataPath = 'src/data/toursData.js';
let toursData = fs.readFileSync(toursDataPath, 'utf8');

const newServices = `export const SERVICES = [
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
];`;

const startIdx = toursData.indexOf('export const SERVICES = [');
const endIdx = toursData.indexOf('];', startIdx) + 2;
const updatedData = toursData.slice(0, startIdx) + newServices + toursData.slice(endIdx);
fs.writeFileSync(toursDataPath, updatedData);
console.log('SERVICES array updated successfully!');
