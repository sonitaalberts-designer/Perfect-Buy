export type CategorySlug =
  | "new-arrivals"
  | "attire"
  | "footwear"
  | "gifts-toys"
  | "perfumes"
  | "womens-clothing"
  | "health-wellness"
  | "accessories";
export type Product = {
  id: string;
  name: string;
  price?: number;
  description?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  category: CategorySlug;
};
export type Category = {
  slug: CategorySlug;
  name: string;
  note: string;
  blurb: string;
  img: string;
  mobileMenuOnly?: boolean;
};
const photo = (name: string) => `/products/${name}.webp`;
export const products: Product[] = [
  {
    id: "sweet-tooth-perfume-hand-cream-set",
    name: "Sweet Tooth Perfume & Hand Cream Set — 35ml + 30ml",
    price: 30,
    description:
      "A women's Sweet Tooth gift set containing a 35ml eau de toilette and a 30ml scented hand cream in coordinated pink packaging.",
    images: ["/products/sweet-tooth-perfume-hand-cream-set.jpg"],
    category: "perfumes",
  },
  {
    id: "kayali-yum-pistachio-gelato-33-100ml",
    name: "Kayali Yum Pistachio Gelato 33 Eau de Parfum — 100ml",
    price: 299,
    description:
      "Kayali Yum Pistachio Gelato 33 Intense eau de parfum presented in a 100ml mint-green statement bottle.",
    images: ["/products/kayali-yum-pistachio-gelato-33-100ml.jpg"],
    category: "perfumes",
  },
  {
    id: "cotton-candy-perfume-35ml",
    name: "Cotton Candy Eau de Parfum — 35ml",
    price: 25,
    description:
      "A sweet cotton-candy scented eau de parfum in a compact 35ml natural spray bottle.",
    images: ["/products/cotton-candy-perfume-35ml.jpg"],
    category: "perfumes",
  },
  {
    id: "red-velvet-perfume-35ml",
    name: "Red Velvet Eau de Parfum — 35ml",
    price: 25,
    description: "A rich Red Velvet eau de parfum natural spray in a compact 35ml bottle.",
    images: ["/products/red-velvet-perfume-35ml.jpg"],
    category: "perfumes",
  },
  {
    id: "kunafa-chocolate-perfume-35ml",
    name: "Kunafa Chocolate Eau de Parfum — 35ml",
    price: 25,
    description: "A Kunafa Chocolate eau de parfum natural spray in a compact 35ml bottle.",
    images: ["/products/kunafa-chocolate-perfume-35ml.jpg"],
    category: "perfumes",
  },
  {
    id: "dexclusive-lily-essence-shower-gel-400ml",
    name: "Dexclusive Le Jardin Lily Essence Shower Gel — 400ml",
    price: 45,
    description:
      "A 400ml lily-scented shower gel from the Dexclusive Le Jardin collection, created for a hydrating and nourishing cleanse.",
    images: ["/products/dexclusive-lily-essence-shower-gel-400ml.jpg"],
    category: "health-wellness",
  },
  {
    id: "dexclusive-sakura-essence-shower-gel-400ml",
    name: "Dexclusive Le Jardin Sakura Essence Shower Gel — 400ml",
    price: 45,
    description:
      "A 400ml Sakura essence shower gel from the Dexclusive Le Jardin collection for a fresh, gently scented daily cleanse.",
    images: ["/products/dexclusive-sakura-essence-shower-gel-400ml.png"],
    category: "health-wellness",
  },
  {
    id: "dexclusive-coconut-essence-shower-gel-400ml",
    name: "Dexclusive Le Jardin Coconut Essence Shower Gel — 400ml",
    price: 45,
    description:
      "A 400ml coconut essence shower gel from the Dexclusive Le Jardin collection, designed to leave skin feeling soft and moisturised.",
    images: ["/products/dexclusive-coconut-essence-shower-gel-400ml.png"],
    category: "health-wellness",
  },
  {
    id: "dexclusive-milk-therapy-body-wash-415ml",
    name: "Dexclusive Milk Therapy Body Wash — 415ml",
    price: 40,
    description:
      "A creamy 415ml Dexclusive Milk Therapy body wash with a silky-touch formula for an extra-moisturising cleanse.",
    images: ["/products/dexclusive-milk-therapy-body-wash-415ml.jpg"],
    category: "health-wellness",
  },
  {
    id: "cotton-road-handbag",
    name: "Cotton Road Handbag",
    price: 230,
    description:
      "A structured Cotton Road handbag with twin handles, a front zip pocket and a detachable shoulder strap for versatile everyday wear.",
    images: ["/products/cotton-road-handbag.jpg"],
    category: "accessories",
  },
  {
    id: "swarovski-blinged-nike-air-max-27c-full-pink",
    name: "Swarovski Blinged Nike Air Max — Full Pink",
    price: 7650,
    description:
      "A vivid full-pink Air Max style finished with sparkling crystal details for a bold statement look.",
    images: [photo("swarovski-blinged-nike-air-max-27c-full-pink")],
    sizes: ["6", "7", "8"],
    category: "footwear",
  },
  {
    id: "dessert-hand-lip-care-gift-box-orange",
    name: "Dessert Ice Cream Hand and Lip Care Gift Box — Orange",
    price: 50,
    description:
      "A playful dessert-themed gift set pairing hand cream and lip care in bright orange packaging.",
    images: [photo("dessert-hand-lip-care-gift-box-orange")],
    category: "gifts-toys",
  },
  {
    id: "dessert-hand-lip-care-gift-box-blue",
    name: "Dessert Ice Cream Hand and Lip Care Gift Box — Blue",
    price: 50,
    description:
      "A playful dessert-themed gift set pairing hand cream and lip care in bright blue packaging.",
    images: [photo("dessert-hand-lip-care-gift-box-blue")],
    category: "gifts-toys",
  },
  {
    id: "stress-relief-squeezie-toy",
    name: "Stress Relief Squeezie Toy",
    price: 50,
    description:
      "A colourful soft squeezie designed for satisfying sensory play and light stress-relief use.",
    images: [photo("stress-relief-squeezie-toy")],
    category: "gifts-toys",
  },
  {
    id: "sun-color-changing-heart-stress-ball-4-piece",
    name: "Sun Color-Changing Heart Stress Ball — 4 Piece Set",
    price: 199,
    description:
      "A four-piece set of heart-shaped stress balls that change colour in sunlight for a playful sensory effect.",
    images: [photo("sun-color-changing-heart-stress-ball-4-piece")],
    category: "gifts-toys",
  },
  {
    id: "fizz-bath-bombs-glow-in-the-dark-toys-6-piece",
    name: "Fizz Bath Bombs with Glow-in-the-Dark Toys Inside — 2 Piece Pack",
    price: 145,
    description:
      "A pack of 2 bath bombs, each with a small glow-in-the-dark surprise toy inside. The photo shows assorted designs; each pack contains 2 bath bombs.",
    images: [photo("fizz-bath-bombs-glow-in-the-dark-toys-6-piece")],
    category: "gifts-toys",
  },
  {
    id: "glow-in-the-dark-graffiti-pens",
    name: "Glow-in-the-Dark Graffiti Pens — 8 Colors",
    price: 229,
    description:
      "A colorful set of eight glow-in-the-dark pens for creating bright designs on clothing, shoes and other suitable materials.",
    images: [photo("glow-graffiti-pens-transparent")],
    category: "gifts-toys",
  },
  {
    id: "water-ripple-night-light",
    name: "16-Color Water Ripple Ambient Light — Pink Crystal Cube Night Light",
    price: 199,
    description:
      "A pink crystal cube night light with 16 colors, dynamic water-ripple lighting effects, remote control and touch control.",
    images: [photo("water-ripple-night-light-pink")],
    category: "gifts-toys",
  },
  {
    id: "water-ripple-night-light-blue",
    name: "16-Color Water Ripple Ambient Light — Blue Crystal Cube Night Light",
    price: 199,
    description:
      "A blue crystal cube night light with 16 colors, dynamic water-ripple lighting effects, remote control and touch control.",
    images: [photo("water-ripple-night-light-transparent")],
    category: "gifts-toys",
  },
  {
    id: "sabrina-carpenter-perfume",
    name: "Sabrina Carpenter Sweet Tooth Perfume",
    price: 350,
    description:
      "A sweet perfume collection presented in playful statement bottles and gift-ready packaging.",
    images: [
      photo("sabrina-carpenter-perfume-blue"),
      photo("sabrina-carpenter-perfume-pink"),
      photo("sabrina-carpenter-perfume-cherry"),
    ],
    category: "perfumes",
  },
  {
    id: "la-bon-bon-perfume",
    name: "La Bon Bon Perfume",
    price: 350,
    description: "A statement perfume presented in a sparkling pink rabbit-shaped bottle.",
    images: [photo("sabrina-carpenter-perfume-la-bonbon")],
    category: "perfumes",
  },
  {
    id: "cool-girl-eau-de-parfum-40ml",
    name: "Cool Girl Eau de Parfum — 40ml",
    price: 90,
    description: "Cool Girl eau de parfum natural spray in a 40ml bottle.",
    images: [
      "/products/cool-girl-eau-de-parfum-40ml.webp",
      "/products/cool-girl-eau-de-parfum-40ml-burgundy.webp",
      "/products/cool-girl-eau-de-parfum-40ml-black-white.webp",
    ],
    category: "perfumes",
  },
  {
    id: "cotton-road-perfume",
    name: "Iscents Perfume",
    price: 250,
    description: "A decorative floral perfume presented in a handbag-inspired bottle.",
    images: ["/products/cotton-road-perfume.webp"],
    category: "perfumes",
  },
  {
    id: "marshmallow-blush-paris-corner-100ml",
    name: "Marshmallow Blush by Paris Corner — 100ml",
    price: 330,
    description: "Marshmallow Blush perfume by Paris Corner in a 100ml presentation box.",
    images: [
      photo("marshmallow-blush-paris-corner-100ml-1"),
      photo("marshmallow-blush-paris-corner-100ml-2"),
    ],
    category: "perfumes",
  },
  {
    id: "bath-bomb-bottles",
    name: "Foam Erupting Magic Bath Salts — 1 Piece",
    price: 135,
    description:
      "A colorful bottle of magic bath salts that creates a fun, fizzy and foamy bath-time experience.",
    images: [photo("bath-bomb-bottles-transparent")],
    category: "gifts-toys",
  },
  {
    id: "dual-head-retractable-charger",
    name: "140W Type-C Fast Charging Adapter",
    price: 150,
    description:
      "A compact 140W Type-C fast-charging adapter with a retractable cable and automatic power cut-off when devices are fully charged.",
    images: [photo("dual-head-retractable-charger-transparent")],
    category: "accessories",
  },
  {
    id: "1000ah-magnetic-power-bank",
    name: "1000Ah Magnetic Power Bank",
    price: 350,
    description:
      "Fast-charging portable power bank with three built-in cables and a hidden bracket. Suitable for smartphones, tablets and other electronics, with a magnetic stand for hands-free viewing.",
    images: [photo("1000ah-magnetic-power-bank")],
    category: "accessories",
  },
  {
    id: "500mah-mini-usb-c-power-bank",
    name: "500mAh Mini USB-C Power Bank",
    price: 210,
    description:
      "Compact Type-C plug-in power bank with a built-in USB-C cable and LED digital battery display. Suitable for iPhone 17, 16 and 15 Pro Max models, Samsung devices and other compatible electronics.",
    images: [photo("500mah-mini-usb-c-power-bank")],
    category: "accessories",
  },
  {
    id: "1000mah-22-5w-pd-portable-charger",
    name: "1000mAh 22.5W PD Portable Charger",
    price: 250,
    description:
      "Portable charger with a digital power display, 22.5W PD fast charging, three input ports and four output ports. Compatible with iPhone 16, 15, 14 and 13 models, iPod, Samsung Galaxy devices and other compatible electronics.",
    images: [photo("1000mah-22-5w-pd-portable-charger")],
    category: "accessories",
  },
  {
    id: "240w-usb-c-cable-phone-stand",
    name: "240W USB-C to USB-C Fast-Charging Cable with Rotatable Phone Stand",
    price: 150,
    description:
      "A braided USB-C to USB-C fast-charging cable with an integrated rotatable phone stand for portrait or hands-free landscape viewing.",
    images: [photo("240w-usb-c-cable-phone-stand-1"), photo("240w-usb-c-cable-phone-stand-2")],
    category: "accessories",
  },
  {
    id: "womens-lightweight-bottle-holder-bag",
    name: "Women's Lightweight Bag with Built-In Water Bottle Holder",
    price: 500,
    description:
      "A lightweight crossbody bag with an adjustable strap, card pocket, removable divider and built-in holder for most water bottles and coffee cups.",
    images: [
      photo("womens-lightweight-bottle-holder-bag-pink"),
      photo("womens-lightweight-bottle-holder-bag-white"),
      photo("womens-lightweight-bottle-holder-bag-dimensions-1"),
      photo("womens-lightweight-bottle-holder-bag-lifestyle"),
      photo("womens-lightweight-bottle-holder-bag-dimensions-2"),
      photo("womens-lightweight-bottle-holder-bag-details"),
    ],
    colors: ["Pink", "White"],
    category: "accessories",
  },
  {
    id: "coloring-flannel-blanket",
    name: "Coloring Flannel Blanket",
    price: 199,
    description:
      "A soft flannel blanket covered in playful black-and-white illustrations ready to be colored in.",
    images: ["/products/coloring-flannel-blanket.webp"],
    sizes: ["75 × 100 cm"],
    category: "gifts-toys",
  },
  {
    id: "swarovski-blinged-nike-air-max-27c",
    name: "Swarovski Blinged Nike Air Max — White & Black",
    price: 6685,
    description:
      "A white and black Air Max style customised with sparkling crystal details and a sculpted air-cushion profile.",
    images: [
      photo("swarovski-blinged-nike-air-max-27c"),
      photo("swarovski-blinged-nike-air-max-27c-top"),
      photo("swarovski-blinged-nike-air-max-27c-rear"),
    ],
    sizes: ["3", "4", "5", "6", "7"],
    category: "footwear",
  },
  {
    id: "nike-air-max-no-bling",
    name: "Nike Air Max no bling",
    price: 6150,
    description:
      "A streamlined pink Air Max style without crystal embellishments for a cleaner everyday statement.",
    images: [photo("nike-air-max-no-bling")],
    sizes: ["3", "4", "5", "6", "7"],
    category: "footwear",
  },
  {
    id: "ice-blue-bling-air-force-1",
    name: "Ice Blue Bling Air Force 1",
    price: 6999,
    description:
      "A white low-top Air Force style with ice-blue laces and sparkling blue crystal accents.",
    images: [photo("ice-blue-bling-air-force-1-side"), photo("ice-blue-bling-air-force-1-front")],
    sizes: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    category: "footwear",
  },
  {
    id: "new-bling-womens-air-max-27c-swarovski",
    name: "New Bling Women's Air Max 27C with Swarovski Crystals",
    price: 6830,
    description:
      "A women's Air Max 27C style with a monochrome upper, visible cushioning and Swarovski crystal detailing.",
    images: [
      "/products/new-bling-womens-air-max-27c-swarovski-1.webp",
      "/products/new-bling-womens-air-max-27c-swarovski-2.webp",
      "/products/new-bling-womens-air-max-27c-swarovski-3.webp",
    ],
    sizes: ["7", "8", "9", "10", "11"],
    category: "footwear",
  },
  {
    id: "rose-gold-air-max-27c-swarovski",
    name: "Rose Gold Air Max 27C with Swarovski Crystals",
    price: 6708,
    description:
      "Rose-gold Air Max 27C finished with Swarovski crystals on every check and Air detail.",
    images: ["/products/rose-gold-air-max-27c-swarovski.webp"],
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    category: "footwear",
  },
  {
    id: "butterfly-af1",
    name: "Butterfly AF1 Sneakers",
    price: 4780,
    description:
      "White low-top AF1-style sneakers decorated with blue butterfly accents and crystal detailing.",
    images: [photo("butterfly-af1-1"), photo("butterfly-af1-2"), photo("butterfly-af1-3")],
    sizes: ["3", "4", "5", "6", "7", "8", "9", "10"],
    category: "footwear",
  },
  {
    id: "pearl-crystal-af1",
    name: "Pearl Crystal AF1 Sneakers",
    price: 3400,
    description:
      "White low-top AF1-style sneakers finished with pearl and crystal accents for a polished statement look.",
    images: [photo("pearl-crystal-af1")],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    category: "footwear",
  },
  {
    id: "sun-protecting-moisturizer",
    name: "Sun Protecting Moisturizer",
    price: 199,
    description:
      "A compact sun-protecting moisturiser in colourful, travel-friendly packaging with an attached carry loop.",
    images: [photo("sun-protecting-moisturizer")],
    category: "health-wellness",
  },
  {
    id: "light-invisible-sunscreen",
    name: "Light Invisible Sunscreen",
    price: 199,
    description:
      "A lightweight sunscreen stick designed for convenient, mess-free application while travelling or on the go.",
    images: [photo("light-invisible-sunscreen")],
    category: "health-wellness",
  },
  {
    id: "bioaqua-lightweight-sunscreen",
    name: "BIOAQUA Lightweight Sunscreen",
    price: 160,
    description:
      "A compact BIOAQUA sunscreen in a protective pink case with a clip for easy everyday carrying.",
    images: [photo("bioaqua-lightweight-sunscreen")],
    category: "health-wellness",
  },
  {
    id: "cheeta-pajamas",
    name: "White Timeless Cheeta Print Pajama Set",
    price: 399,
    description:
      "A lightweight short-sleeve button-up pajama set in a white and grey cheetah print with dark piping.",
    images: [photo("cheeta-pajamas-front"), photo("cheeta-pajamas-back")],
    sizes: ["M", "L", "XL"],
    category: "womens-clothing",
  },
  {
    id: "striped-pajamas",
    name: "White Timeless Striped Pajama Set",
    price: 399,
    description:
      "A lightweight short-sleeve button-up pajama set with subtle white stripes and a relaxed matching short.",
    images: [photo("striped-pajamas-front"), photo("striped-pajamas-detail")],
    sizes: ["XS", "S", "M", "L"],
    category: "womens-clothing",
  },
  {
    id: "crystal-sunscreen-spray",
    name: "Crystal Sunscreen Spray",
    price: 199,
    description:
      "A portable sunscreen spray in a slim crystal-style bottle with an attached carry ring.",
    images: [photo("crystal-sunscreen-spray")],
    category: "health-wellness",
  },
  {
    id: "blue-christmas-advent-calendar",
    name: "Christmas Advent Calendar Create Your Own Blue and Silver Bracelet",
    price: 320,
    description:
      "A Christmas countdown calendar with blue and silver bracelet charms for creating a personalised festive bracelet.",
    images: [photo("blue-christmas-advent-calendar")],
    category: "gifts-toys",
  },
  {
    id: "pink-christmas-advent-calendar",
    name: "Christmas Advent Calendar Create Your Own Pink and Silver Bracelet",
    price: 320,
    description:
      "A Christmas countdown calendar with pink and silver bracelet charms for creating a personalised festive bracelet.",
    images: [photo("pink-christmas-advent-calendar")],
    category: "gifts-toys",
  },
  {
    id: "blue-bracelet-calendar",
    name: "Christmas Countdown Bracelet-Making Advent Calendar — Blue",
    price: 320,
    description:
      "A blue Christmas countdown gift set containing bracelet pieces and festive charms to reveal and assemble.",
    images: [
      photo("blue-bracelet-calendar-cover"),
      photo("blue-bracelet-calendar"),
      photo("blue-bracelet-calendar-detail"),
    ],
    category: "gifts-toys",
  },
  {
    id: "pink-bracelet-calendar",
    name: "Christmas Countdown Bracelet-Making Advent Calendar — Pink",
    price: 320,
    description:
      "A pink Christmas countdown gift set containing bracelet pieces and festive charms to reveal and assemble.",
    images: [
      photo("pink-bracelet-calendar"),
      photo("pink-bracelet-calendar-guide"),
      photo("pink-bracelet-calendar-detail"),
    ],
    category: "gifts-toys",
  },
  {
    id: "24-day-advent-calendar",
    name: "24-Day Advent Calendar",
    price: 199,
    description: "A 24-piece Advent calendar featuring colourful 2D acrylic charms.",
    images: ["/products/24-day-advent-calendar.webp"],
    category: "gifts-toys",
  },
  {
    id: "body-and-soul-collagen-270g",
    name: "Body and Soul Collagen — 270g Pouch",
    price: 449,
    description:
      "100% pure hydrolysed bovine collagen peptides with added dietary fibre and probiotic.",
    images: [photo("body-and-soul-collagen-270g")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-collagen-jar-1l",
    name: "Collagen Jar — 1L",
    price: 249,
    description:
      "Empty glass jar with a wooden lid for storing your monthly Body and Soul Collagen refill.",
    images: [photo("body-and-soul-collagen-jar-1l")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-collagen-hot-chocolate-240g",
    name: "Body and Soul Collagen Hot Chocolate — 240g Pouch",
    price: 329,
    description:
      "A creamy blend of hydrolysed bovine collagen, natural raw cocoa, chocolate flavouring and skimmed milk powder.",
    images: [photo("body-and-soul-collagen-hot-chocolate-240g")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-shape-weight-loss-capsules-60",
    name: "Body & Soul Shape Weight Loss Capsules — 60 Capsules",
    price: 549,
    description: "Body & Soul Shape Weight Loss Capsules — 60 capsules per bottle.",
    images: [photo("body-and-soul-shape-weight-loss-capsules-60")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-collagen-sachets-30x10g",
    name: "Body & Soul Collagen Sachets — 30 × 10g (300g)",
    price: 559,
    description:
      "30 × 10g sachets (300g) containing hydrolysed bovine collagen with added dietary fibre and probiotics.",
    images: [photo("body-and-soul-collagen-sachets-30x10g")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-collagen-sample-sachet-10g",
    name: "Body & Soul Collagen Sample Sachet — 10g",
    price: 39,
    description:
      "A single 10g sachet of hydrolysed bovine collagen with added dietary fibre and probiotics.",
    images: [photo("body-and-soul-collagen-sample-sachet-10g")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-golden-hair-growth-mist-250ml",
    name: "Body & Soul Golden Collagen & Keratin Hair Growth Mist — 250ml",
    price: 325,
    description: "A refreshing collagen and keratin spray for hair and scalp.",
    images: [photo("body-and-soul-golden-hair-growth-mist-250ml")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-glow-facial-serum-30ml",
    name: "Body & Soul Glow Collagen & Peptide Facial Serum — 30ml",
    price: 399,
    description: "A 30ml facial serum containing 8% marine collagen.",
    images: [photo("body-and-soul-glow-facial-serum-30ml")],
    category: "health-wellness",
  },
  {
    id: "body-and-soul-collagen-vitamin-c-mixed-berry",
    name: "Body & Soul Collagen with Added Vitamin C — Mixed Berry",
    price: 549,
    description:
      "Mixed berry flavoured hydrolysed bovine collagen supplement with added vitamin C.",
    images: [photo("body-and-soul-collagen-vitamin-c-mixed-berry")],
    category: "health-wellness",
  },
  {
    id: "lemme-purr-vaginal-probiotic-gummies-60",
    name: "Lemme Purr Vaginal Probiotic Gummies — 60 Gummies",
    price: 1450,
    description:
      "Pineapple-flavoured probiotic gummies formulated to support balanced pH, healthy odour, yeast balance and vaginal flora, with vitamin C for immune support.",
    images: [photo("lemme-purr-vaginal-probiotic-gummies-60")],
    category: "health-wellness",
  },
  {
    id: "lemme-debloat-digestive-gummies-60",
    name: "Lemme Debloat Digestive & Gut Health Gummies — 60 Gummies",
    price: 1450,
    description:
      "Blackberry-flavoured digestive gummies with two clinically studied probiotic strains and 3 billion CFUs. Vegan, gluten-free and non-GMO.",
    images: [photo("lemme-debloat-digestive-gummies-60")],
    category: "health-wellness",
  },
  {
    id: "lemme-creatine-monohydrate-gummies-60",
    name: "Lemme Creatine Monohydrate Gummies — 60 Gummies",
    price: 1350,
    description: "Creatine monohydrate gummies for men and women, providing a 5g serving dose.",
    images: [photo("lemme-creatine-monohydrate-gummies-60")],
    category: "health-wellness",
  },
];

const adventCalendarIds = new Set([
  "blue-christmas-advent-calendar",
  "pink-christmas-advent-calendar",
  "blue-bracelet-calendar",
  "pink-bracelet-calendar",
  "24-day-advent-calendar",
]);

export const categories: Category[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    note: "Discover the collection",
    blurb:
      "Explore statement footwear, perfumes, beauty gifts, toys, sun care and timeless pajama sets.",
    img: "/products/coloring-flannel-blanket.webp",
  },
  {
    slug: "attire",
    name: "Attire",
    note: "Clothing & footwear",
    blurb: "Shop standout sneakers and timeless pajama sets in a range of styles and sizes.",
    img: photo("swarovski-blinged-nike-air-max-27c"),
  },
  {
    slug: "gifts-toys",
    name: "Gifts & Toys",
    note: "Playful treats and gift sets",
    blurb:
      "Browse Christmas advent calendars, sweet self-care gifts, stress-relief toys and playful bath-time treats.",
    img: photo("dessert-hand-lip-care-gift-box-orange"),
  },
  {
    slug: "perfumes",
    name: "Perfumes",
    note: "Sweet scents & fragrance gifts",
    blurb:
      "Browse eau de parfum, eau de toilette and fragrance gift sets in playful, gift-ready presentations.",
    img: "/products/sweet-tooth-perfume-hand-cream-set.jpg",
    mobileMenuOnly: true,
  },
  {
    slug: "health-wellness",
    name: "Health & Wellness",
    note: "Wellness, supplements & sun care",
    blurb:
      "Shop collagen, supplements, everyday wellness essentials and sun-care products selected to support your routine.",
    img: photo("body-and-soul-collagen-270g"),
  },
  {
    slug: "accessories",
    name: "Jewellery & Accessories",
    note: "Jewellery, chargers & more",
    blurb:
      "Shop Christmas advent calendars, useful charging accessories and everyday device essentials.",
    img: photo("blue-christmas-advent-calendar"),
  },
];

// Focused collections share the catalog, with their own canonical pages.
export const fashionCollections: Category[] = [
  {
    slug: "footwear",
    name: "Women's Sneakers",
    note: "Statement styles & everyday pairs",
    blurb:
      "Shop women's sneakers in South Africa, from pink and crystal-detail pairs to butterfly designs. Compare photos, prices and SA/UK sizes before you order.",
    img: photo("swarovski-blinged-nike-air-max-27c-full-pink"),
  },
  {
    slug: "womens-clothing",
    name: "Women's Pajama Sets",
    note: "White Timeless sleepwear",
    blurb:
      "Shop women's pajama sets in South Africa. Compare White Timeless striped and cheeta-print sets, view matching pieces and check the available sizes.",
    img: photo("striped-pajamas-front"),
  },
];

export const desktopCategories = categories.filter((category) => !category.mobileMenuOnly);

export function getCategory(slug: string): Category | undefined {
  return [...categories, ...fashionCollections].find((category) => category.slug === slug);
}
export function productsFor(slug: CategorySlug): Product[] {
  if (slug === "new-arrivals") return products;
  if (slug === "attire") {
    return products.filter(
      (product) => product.category === "footwear" || product.category === "womens-clothing",
    );
  }

  return products.filter(
    (product) =>
      product.category === slug || (slug === "accessories" && adventCalendarIds.has(product.id)),
  );
}

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function categorySlugForProduct(product: Product): CategorySlug {
  return product.category;
}

export function productDescription(product: Product): string {
  if (product.description) return product.description;

  const category = getCategory(categorySlugForProduct(product));
  return `Discover ${product.name} from the ${category?.name ?? "Perfect Buy"} collection, with clear pricing and available options for South African shoppers.`;
}
