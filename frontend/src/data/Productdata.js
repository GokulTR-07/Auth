import saffron1 from "../assets/Images/saffron-1.jpg";
import saffron2 from "../assets/Images/saffron-2.jpg";
import saffron3 from "../assets/Images/saffron-3.jpg";
import saffron4 from "../assets/Images/saffron-4.jpg";
import saffron5 from "../assets/Images/saffron-5.jpg";
import saffron6 from "../assets/Images/saffron-6.jpg";

export const products = [
  {
    id: 1,
    name: "Indian Kashmir Saffron",
    img: saffron1,
    extraImages: [saffron5, saffron2, saffron3, saffron4, saffron6],
    description: "High-quality saffron threads handpicked from the finest flowers.",
    content: "Premium Quality, Exquisite Flavor: Discover the luxury of Indian Kashmiri Saffron, renowned for its vibrant color, delicate aroma, and unparalleled flavor. Hand-harvested from the lush fields of Kashmir, our saffron is the epitome of quality and authenticity. Each strand is carefully selected to ensure you experience only the finest.",
    variants: [
      {
        weight: 2,
        price: 525,
        stock: 100,
        "Product Features": {
          "Origin": "Kashmir, India",
          "Type": "Saffron Threads (Grade 1)",
          "Flavor Profile": "Sweet, floral, with a subtle earthy undertone",
          "Color": "Deep red with orange-yellow hues",
          "Aroma": "Rich, aromatic, and heady",
          "Purity": "100% pure, with no additives or artificial color"
        }
      },
      {
        weight: 5,
        price: 1313,
        stock: 100,
        "Product Features": {
          "Origin": "Kashmir, India",
          "Type": "Saffron Threads (Grade 1)",
          "Flavor Profile": "Sweet, floral, with a subtle earthy undertone",
          "Color": "Deep red with orange-yellow hues",
          "Aroma": "Rich, aromatic, and heady",
          "Purity": "100% pure, with no additives or artificial color"
        }
      }
    ],
    origin: "Kashmir",
    category: [
      "Culinary Uses",
      "Pregnant Woman Uses",
      "Cosmetic Uses",
      "Medical Uses"
    ],
    rating: 4.8
  },
  {
    id: 2,
    name: "Premium Spain Saffron",
    img: saffron2,
    extraImages: [saffron5, saffron1, saffron3, saffron4, saffron6],
    description: "Unmatched quality with vibrant color and rich flavor from the heart of Spain.",
    content: "Discover the exquisite flavor and vibrant color of our Premium Spanish Saffron. Sourced from the sun-drenched fields of Spain, this high-quality saffron is known for its intense aroma, rich flavor, and deep red hue. Each strand is carefully hand-harvested to ensure the highest standards of quality and authenticity.",
    variants: [
      {
        weight: 2,
        price: 575,
        stock: 100,
        "Product Features": {
          "Origin": "Spain",
          "Type": "Spanish Saffron, Grade A+ (highest quality)",
          "Flavor Profile": "Sweet and floral with a hint of earthy richness",
          "Color": "Deep crimson red, indicative of purity and potency",
          "Aroma": "Intense and floral with subtle earthy undertones",
          "Purity": "100% pure saffron with no additives or fillers"
        }
      },
      {
        weight: 5,
        price: 1438,
        stock: 100,
        "Product Features": {
          "Origin": "Spain",
          "Type": "Spanish Saffron, Grade A+ (highest quality)",
          "Flavor Profile": "Sweet and floral with a hint of earthy richness",
          "Color": "Deep crimson red, indicative of purity and potency",
          "Aroma": "Intense and floral with subtle earthy undertones",
          "Purity": "100% pure saffron with no additives or fillers"
        }
      }
    ],
    origin: "Spain",
    category: ["Culinary Uses", "Cosmetic Uses", "Medical Uses"],
    rating: 4.7
  }
];


