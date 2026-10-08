const fs = require('fs');

const toursDataPath = 'src/data/toursData.js';
let toursData = fs.readFileSync(toursDataPath, 'utf8');

const newTestimonials = `export const TESTIMONIALS = [
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
];`;

const startIdx = toursData.indexOf('export const TESTIMONIALS = [');
const endIdx = toursData.indexOf('];', startIdx) + 2;
toursData = toursData.slice(0, startIdx) + newTestimonials + toursData.slice(endIdx);

const newGallery = `export const GALLERY_ITEMS = [
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
];`;

const startIdxGal = toursData.indexOf('export const GALLERY_ITEMS = [');
const endIdxGal = toursData.indexOf('];', startIdxGal) + 2;
toursData = toursData.slice(0, startIdxGal) + newGallery + toursData.slice(endIdxGal);

fs.writeFileSync(toursDataPath, toursData);
console.log('TESTIMONIALS and GALLERY_ITEMS arrays updated successfully!');
