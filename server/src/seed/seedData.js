import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { shippingFor } from '../utils/pricing.js';

const categories = [
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'shirt',
    tagline: 'Lawn, kurtas and everyday classics',
    order: 1
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'devices',
    tagline: 'Smart tech for modern homes',
    order: 2
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    icon: 'home',
    tagline: 'Warm touches for every room',
    order: 3
  },
  {
    name: 'Beauty & Care',
    slug: 'beauty',
    icon: 'sparkles',
    tagline: 'Everyday rituals, made in Pakistan',
    order: 4
  },
  {
    name: 'Grocery',
    slug: 'grocery',
    icon: 'basket',
    tagline: 'Pantry staples and festive treats',
    order: 5
  },
  {
    name: 'Sports',
    slug: 'sports',
    icon: 'trophy',
    tagline: 'Built for the street and the field',
    order: 6
  }
];

const products = [
  {
    name: 'Embroidered Lawn 3-Piece',
    slug: 'embroidered-lawn-3-piece',
    brand: 'Zarlish',
    category: 'fashion',
    price: 4850,
    compareAtPrice: 5990,
    stock: 34,
    rating: 4.8,
    numReviews: 126,
    soldCount: 214,
    featured: true,
    image: '/products/lawn.svg',
    tags: ['lawn', '3 piece', 'summer', 'embroidered'],
    description:
      'A breathable three-piece lawn suit with fine thread embroidery on the front panel, finished with a printed chiffon dupatta. Cut for Pakistani summers, from sehri to soirées.',
    specs: [
      { label: 'Fabric', value: 'Premium 100% cotton lawn' },
      { label: 'Includes', value: 'Shirt, trouser and chiffon dupatta' },
      { label: 'Stitching', value: 'Unstitched' },
      { label: 'Care', value: 'Gentle machine wash' }
    ]
  },
  {
    name: "Men's Wash & Wear Kurta",
    slug: 'mens-wash-and-wear-kurta',
    brand: 'Rekhta',
    category: 'fashion',
    price: 3290,
    compareAtPrice: 3990,
    stock: 42,
    rating: 4.6,
    numReviews: 89,
    soldCount: 156,
    featured: true,
    image: '/products/kurta.svg',
    tags: ['kurta', 'menswear', 'eid'],
    description:
      'A crisp wash-and-wear kurta with a mandarin collar and a clean, straight cut — ready for Jummah, Eid and everything in between.',
    specs: [
      { label: 'Fabric', value: 'Cotton-blend wash and wear' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Collar', value: 'Mandarin' },
      { label: 'Care', value: 'Machine wash cold' }
    ]
  },
  {
    name: 'Peshawari Chappal',
    slug: 'peshawari-chappal',
    brand: 'Ustad & Sons',
    category: 'fashion',
    price: 2450,
    compareAtPrice: null,
    stock: 28,
    rating: 4.7,
    numReviews: 213,
    soldCount: 301,
    featured: false,
    image: '/products/chappal.svg',
    tags: ['footwear', 'chappal', 'handmade', 'leather'],
    description:
      'Handstitched in Khyber Pakhtunkhwa using full-grain leather and a cushioned rubber sole. The classic Peshawari chappal, built to age beautifully.',
    specs: [
      { label: 'Upper', value: 'Full-grain cowhide' },
      { label: 'Sole', value: 'Cushioned rubber' },
      { label: 'Made in', value: 'Mardan, Khyber Pakhtunkhwa' },
      { label: 'Sizes', value: 'EU 39–45' }
    ]
  },
  {
    name: 'Chiffon Dupatta',
    slug: 'chiffon-dupatta',
    brand: 'Chinar',
    category: 'fashion',
    price: 1690,
    compareAtPrice: 2190,
    stock: 51,
    rating: 4.4,
    numReviews: 64,
    soldCount: 122,
    featured: false,
    image: '/products/dupatta.svg',
    tags: ['dupatta', 'chiffon', 'accessories'],
    description:
      'A soft, feather-light chiffon dupatta with a delicate scalloped border — the easiest way to finish any outfit.',
    specs: [
      { label: 'Fabric', value: 'Bemberg chiffon' },
      { label: 'Size', value: '2.5 metres' },
      { label: 'Finish', value: 'Scalloped border' },
      { label: 'Care', value: 'Dry clean only' }
    ]
  },
  {
    name: 'Hand-Embroidered Khussa',
    slug: 'hand-embroidered-khussa',
    brand: 'Rekhta',
    category: 'fashion',
    price: 2990,
    compareAtPrice: null,
    stock: 18,
    rating: 4.9,
    numReviews: 97,
    soldCount: 143,
    featured: true,
    image: '/products/khussa.svg',
    tags: ['khussa', 'footwear', 'wedding'],
    description:
      'Hand-embroidered khussas on a flexible leather sole, finished with tiny mirror work. Made for mehndi nights and wedding season.',
    specs: [
      { label: 'Upper', value: 'Velvet and zari thread' },
      { label: 'Sole', value: 'Leather' },
      { label: 'Made in', value: 'Lahore' },
      { label: 'Sizes', value: 'EU 36–42' }
    ]
  },
  {
    name: 'Tez AirBuds Pro',
    slug: 'tez-airbuds-pro',
    brand: 'TezTech',
    category: 'electronics',
    price: 3999,
    compareAtPrice: 5499,
    stock: 23,
    rating: 4.5,
    numReviews: 311,
    soldCount: 640,
    featured: true,
    image: '/products/earbuds.svg',
    tags: ['earbuds', 'bluetooth', 'audio'],
    description:
      'Crisp sound, active noise cancellation and 28 hours of playtime with the charging case. Designed for Karachi traffic and long calls.',
    specs: [
      { label: 'Battery', value: '6h buds + 28h case' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Water resistance', value: 'IPX5' },
      { label: 'Charging', value: 'USB-C' }
    ]
  },
  {
    name: 'Pulse S2 Smartwatch',
    slug: 'pulse-s2-smartwatch',
    brand: 'TezTech',
    category: 'electronics',
    price: 6499,
    compareAtPrice: 7999,
    stock: 16,
    rating: 4.3,
    numReviews: 142,
    soldCount: 289,
    featured: true,
    image: '/products/smartwatch.svg',
    tags: ['smartwatch', 'fitness', 'wearable'],
    description:
      'A 1.85-inch AMOLED smartwatch with heart-rate tracking, 100+ sport modes and a 10-day battery. Your daily companion, on wrist.',
    specs: [
      { label: 'Display', value: '1.85-inch AMOLED' },
      { label: 'Battery', value: 'Up to 10 days' },
      { label: 'Health', value: 'Heart rate and SpO2' },
      { label: 'Compatibility', value: 'Android and iOS' }
    ]
  },
  {
    name: '20,000mAh Fast Power Bank',
    slug: '20000mah-fast-power-bank',
    brand: 'Volt Pakistan',
    category: 'electronics',
    price: 3499,
    compareAtPrice: null,
    stock: 37,
    rating: 4.6,
    numReviews: 204,
    soldCount: 410,
    featured: false,
    image: '/products/powerbank.svg',
    tags: ['power bank', 'charging', 'travel'],
    description:
      'Two-way 22.5W fast charging with enough backup for three full phone charges. Load-shedding friendly and travel ready.',
    specs: [
      { label: 'Capacity', value: '20,000mAh' },
      { label: 'Output', value: '22.5W PD and QC 3.0' },
      { label: 'Ports', value: '2x USB-A, 1x USB-C' },
      { label: 'Weight', value: '395g' }
    ]
  },
  {
    name: 'AeroFry 5L Air Fryer',
    slug: 'aerofry-5l-air-fryer',
    brand: 'Baraka',
    category: 'electronics',
    price: 14999,
    compareAtPrice: 17999,
    stock: 9,
    rating: 4.7,
    numReviews: 76,
    soldCount: 118,
    featured: true,
    image: '/products/airfryer.svg',
    tags: ['air fryer', 'kitchen', 'appliance'],
    description:
      'Even, oil-free cooking for families — pakoras, fries and tandoori wings with up to 85% less oil. A 5-litre basket with a digital touch panel.',
    specs: [
      { label: 'Capacity', value: '5 litres' },
      { label: 'Power', value: '1500W' },
      { label: 'Presets', value: '8 one-touch' },
      { label: 'Warranty', value: '1 year' }
    ]
  },
  {
    name: 'Multani Blue Pottery Vase',
    slug: 'multani-blue-pottery-vase',
    brand: 'Nayaab',
    category: 'home-living',
    price: 2250,
    compareAtPrice: null,
    stock: 21,
    rating: 4.8,
    numReviews: 58,
    soldCount: 87,
    featured: true,
    image: '/products/vase.svg',
    tags: ['pottery', 'decor', 'handmade'],
    description:
      'Hand-painted blue pottery from Multan, glazed and fired using techniques passed down for generations. Every piece is quietly one of a kind.',
    specs: [
      { label: 'Material', value: 'Glazed ceramic' },
      { label: 'Height', value: '26cm' },
      { label: 'Origin', value: 'Multan, Punjab' },
      { label: 'Care', value: 'Wipe with a dry cloth' }
    ]
  },
  {
    name: '8-Piece Steel Dinner Set',
    slug: '8-piece-steel-dinner-set',
    brand: 'Dastarkhwan',
    category: 'home-living',
    price: 8750,
    compareAtPrice: 9990,
    stock: 12,
    rating: 4.5,
    numReviews: 39,
    soldCount: 52,
    featured: false,
    image: '/products/dinnerset.svg',
    tags: ['dinner set', 'steel', 'kitchen'],
    description:
      'A heavyweight stainless steel dinner set for eight, with a mirror finish and rolled edges that survive everyday dastarkhwans.',
    specs: [
      { label: 'Pieces', value: '8 (plates and bowls)' },
      { label: 'Material', value: 'Food-grade stainless steel' },
      { label: 'Finish', value: 'Mirror polish' },
      { label: 'Dishwasher', value: 'Safe' }
    ]
  },
  {
    name: 'King Cotton Bed Sheet Set',
    slug: 'king-cotton-bed-sheet-set',
    brand: 'Aangan',
    category: 'home-living',
    price: 5490,
    compareAtPrice: 6590,
    stock: 26,
    rating: 4.6,
    numReviews: 115,
    soldCount: 192,
    featured: true,
    image: '/products/bedsheet.svg',
    tags: ['bedding', 'cotton', 'home'],
    description:
      'A breathable king-size cotton bed sheet set with two pillow covers, woven for hot nights and soft mornings.',
    specs: [
      { label: 'Size', value: 'King (90 x 100 inches)' },
      { label: 'Includes', value: '1 sheet and 2 pillow covers' },
      { label: 'Fabric', value: '100% combed cotton' },
      { label: 'Thread count', value: '200 TC' }
    ]
  },
  {
    name: 'Neem & Aloe Face Wash',
    slug: 'neem-and-aloe-face-wash',
    brand: 'Sehat',
    category: 'beauty',
    price: 850,
    compareAtPrice: null,
    stock: 80,
    rating: 4.4,
    numReviews: 267,
    soldCount: 730,
    featured: false,
    image: '/products/facewash.svg',
    tags: ['skincare', 'neem', 'face wash'],
    description:
      'A gentle daily cleanser with neem, aloe vera and tea tree to calm breakouts without stripping your skin.',
    specs: [
      { label: 'Volume', value: '150ml' },
      { label: 'Skin type', value: 'Oily and combination' },
      { label: 'Key ingredients', value: 'Neem, aloe, tea tree' },
      { label: 'Made in', value: 'Karachi' }
    ]
  },
  {
    name: 'Oud-e-Mehran Attar (12ml)',
    slug: 'oud-e-mehran-attar',
    brand: 'Ittar House',
    category: 'beauty',
    price: 1450,
    compareAtPrice: null,
    stock: 45,
    rating: 4.9,
    numReviews: 183,
    soldCount: 258,
    featured: true,
    image: '/products/attar.svg',
    tags: ['attar', 'fragrance', 'oud'],
    description:
      'A warm, long-lasting attar layered with oud, amber and a whisper of rose. Alcohol-free, in a hand-cut glass bottle.',
    specs: [
      { label: 'Volume', value: '12ml' },
      { label: 'Notes', value: 'Oud, amber, rose' },
      { label: 'Type', value: 'Alcohol-free attar' },
      { label: 'Origin', value: 'Blended in Lahore' }
    ]
  },
  {
    name: 'Kissan Gold Super Basmati 5kg',
    slug: 'kissan-gold-super-basmati-5kg',
    brand: 'Kissan Gold',
    category: 'grocery',
    price: 3150,
    compareAtPrice: 3450,
    stock: 60,
    rating: 4.7,
    numReviews: 402,
    soldCount: 980,
    featured: true,
    image: '/products/rice.svg',
    tags: ['rice', 'basmati', 'grocery'],
    description:
      'Extra-long grain basmati, aged for 12 months for that unmistakable aroma. The everyday biryani standard.',
    specs: [
      { label: 'Weight', value: '5kg' },
      { label: 'Grain', value: 'Extra-long basmati' },
      { label: 'Aging', value: '12 months' },
      { label: 'Origin', value: 'Punjab, Pakistan' }
    ]
  },
  {
    name: 'Festive Dry Fruit Gift Box',
    slug: 'festive-dry-fruit-gift-box',
    brand: 'Mehr',
    category: 'grocery',
    price: 4200,
    compareAtPrice: null,
    stock: 30,
    rating: 4.8,
    numReviews: 91,
    soldCount: 140,
    featured: false,
    image: '/products/dryfruit.svg',
    tags: ['dry fruit', 'gift', 'festive'],
    description:
      'A hand-packed gift box of almonds, pistachios, cashews and apricots — ready for Eid, weddings and thoughtful visits.',
    specs: [
      { label: 'Net weight', value: '900g' },
      { label: 'Contains', value: 'Almonds, pistachios, cashews and apricots' },
      { label: 'Packaging', value: 'Wooden gift box' },
      { label: 'Sourcing', value: 'Gilgit-Baltistan and Iran' }
    ]
  },
  {
    name: 'Kashmir Willow Cricket Bat',
    slug: 'kashmir-willow-cricket-bat',
    brand: 'Kohsar Sports',
    category: 'sports',
    price: 5750,
    compareAtPrice: 6990,
    stock: 14,
    rating: 4.6,
    numReviews: 73,
    soldCount: 96,
    featured: true,
    image: '/products/cricket.svg',
    tags: ['cricket', 'bat', 'sports'],
    description:
      'A grade-1 Kashmir willow bat with a full profile and a light pickup — made for tape-ball rivalries and club matches alike.',
    specs: [
      { label: 'Willow', value: 'Kashmir willow' },
      { label: 'Weight', value: '1150–1200g' },
      { label: 'Handle', value: 'Sarawak cane' },
      { label: 'Size', value: 'Full / short handle' }
    ]
  },
  {
    name: 'Match Football Size 5',
    slug: 'match-football-size-5',
    brand: 'Mehr Sports',
    category: 'sports',
    price: 1950,
    compareAtPrice: null,
    stock: 33,
    rating: 4.3,
    numReviews: 54,
    soldCount: 175,
    featured: false,
    image: '/products/football.svg',
    tags: ['football', 'sports', 'outdoor'],
    description:
      'A machine-stitched size-5 match ball with a butyl bladder that holds air through serious street football.',
    specs: [
      { label: 'Size', value: '5' },
      { label: 'Construction', value: 'Machine stitched' },
      { label: 'Bladder', value: 'Butyl' },
      { label: 'Surface', value: 'All-weather synthetic' }
    ]
  }
];

const reviewers = [
  { name: 'Sana Malik', email: 'sana@dastak.demo', city: 'Lahore' },
  { name: 'Hira Qureshi', email: 'hira@dastak.demo', city: 'Islamabad' },
  { name: 'Bilal Ahmed', email: 'bilal@dastak.demo', city: 'Karachi' },
  { name: 'Usman Tariq', email: 'usman@dastak.demo', city: 'Rawalpindi' }
];

const reviewSeeds = [
  {
    product: 'embroidered-lawn-3-piece',
    reviewer: 'sana@dastak.demo',
    rating: 5,
    comment:
      'The embroidery is even better in person. Stitched it as a straight shirt and got compliments all through lunch.'
  },
  {
    product: 'embroidered-lawn-3-piece',
    reviewer: 'hira@dastak.demo',
    rating: 4,
    comment:
      'Beautiful lawn and quick delivery to Islamabad. The dupatta is a little sheer, but it drapes beautifully.'
  },
  {
    product: 'tez-airbuds-pro',
    reviewer: 'bilal@dastak.demo',
    rating: 4,
    comment: 'Battery easily lasts my commute. Calls stay clear even in traffic.'
  },
  {
    product: 'tez-airbuds-pro',
    reviewer: 'hira@dastak.demo',
    rating: 5,
    comment: 'Bought a second pair for my brother. Great value for the price.'
  },
  {
    product: 'oud-e-mehran-attar',
    reviewer: 'sana@dastak.demo',
    rating: 5,
    comment: 'Lasts the whole day and the bottle feels premium. Reminds me of the attar shops in Anarkali.'
  },
  {
    product: 'kissan-gold-super-basmati-5kg',
    reviewer: 'bilal@dastak.demo',
    rating: 5,
    comment: 'Long grains, beautiful aroma. Friday biryani came out perfect.'
  },
  {
    product: 'kashmir-willow-cricket-bat',
    reviewer: 'usman@dastak.demo',
    rating: 4,
    comment: 'Good pickup and ping. Needed a bit of knocking, but well worth the price.'
  },
  {
    product: 'multani-blue-pottery-vase',
    reviewer: 'hira@dastak.demo',
    rating: 5,
    comment: 'Packed very carefully. The blue is stunning on our console table.'
  },
  {
    product: 'neem-and-aloe-face-wash',
    reviewer: 'sana@dastak.demo',
    rating: 4,
    comment: 'Gentle on my skin and the neem smell is fresh, not overpowering.'
  },
  {
    product: 'king-cotton-bed-sheet-set',
    reviewer: 'hira@dastak.demo',
    rating: 4,
    comment: 'Soft cotton and a generous size. The colour is slightly deeper than the photos.'
  }
];

const demoAddresses = {
  karachi: {
    fullName: 'Ayesha Khan',
    phone: '0300 1234567',
    street: 'House 24, Street 8, Block 6, Gulshan-e-Iqbal',
    city: 'Karachi',
    province: 'Sindh',
    postalCode: '75300'
  },
  lahore: {
    fullName: 'Ayesha Khan',
    phone: '0321 9876543',
    street: 'Flat 12-B, Askari Tower, Main Boulevard, DHA Phase 5',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '54810'
  },
  islamabad: {
    fullName: 'Ayesha Khan',
    phone: '0333 5556677',
    street: 'House 7, Street 22, F-8/3',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    postalCode: '44000'
  }
};

const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const now = Date.now();

function createDemoOrders(customerId, productBySlug) {
  const line = (slug, qty) => {
    const product = productBySlug.get(slug);
    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      image: product.images[0],
      price: product.price,
      qty
    };
  };

  const buildOrder = ({
    orderNumber,
    items,
    address,
    paymentMethod,
    statusTrail,
    isPaid,
    notes = ''
  }) => {
    const itemsPrice = items.reduce((total, item) => total + item.price * item.qty, 0);
    const shippingPrice = shippingFor(itemsPrice);
    const placedAt = new Date(statusTrail[0][1]);
    const lastAt = new Date(statusTrail[statusTrail.length - 1][1]);
    const status = statusTrail[statusTrail.length - 1][0];

    return {
      orderNumber,
      user: customerId,
      items,
      shippingAddress: address,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
      status,
      statusHistory: statusTrail.map(([eventStatus, at]) => ({
        status: eventStatus,
        at: new Date(at)
      })),
      isPaid,
      paidAt: isPaid ? (paymentMethod === 'cod' ? lastAt : placedAt) : null,
      notes,
      createdAt: placedAt,
      updatedAt: lastAt
    };
  };

  return [
    buildOrder({
      orderNumber: 'DST-DEMO01',
      items: [line('embroidered-lawn-3-piece', 1), line('king-cotton-bed-sheet-set', 1)],
      address: demoAddresses.karachi,
      paymentMethod: 'cod',
      isPaid: true,
      statusTrail: [
        ['placed', now - 7 * day],
        ['confirmed', now - 7 * day + 3 * hour],
        ['packed', now - 5 * day],
        ['shipped', now - 3 * day],
        ['delivered', now - 2 * day]
      ]
    }),
    buildOrder({
      orderNumber: 'DST-DEMO02',
      items: [line('tez-airbuds-pro', 1)],
      address: demoAddresses.lahore,
      paymentMethod: 'easypaisa',
      isPaid: true,
      statusTrail: [
        ['placed', now - 2 * day],
        ['confirmed', now - 2 * day + 2 * hour],
        ['packed', now - 1 * day],
        ['shipped', now - 20 * hour]
      ]
    }),
    buildOrder({
      orderNumber: 'DST-DEMO03',
      items: [line('oud-e-mehran-attar', 2)],
      address: demoAddresses.karachi,
      paymentMethod: 'cod',
      isPaid: false,
      notes: 'Please call before delivery.',
      statusTrail: [['placed', now - 5 * hour]]
    }),
    buildOrder({
      orderNumber: 'DST-DEMO04',
      items: [line('match-football-size-5', 1)],
      address: demoAddresses.islamabad,
      paymentMethod: 'jazzcash',
      isPaid: false,
      statusTrail: [
        ['placed', now - 10 * day],
        ['cancelled', now - 9 * day]
      ]
    }),
    buildOrder({
      orderNumber: 'DST-DEMO05',
      items: [line('kissan-gold-super-basmati-5kg', 2), line('neem-and-aloe-face-wash', 1)],
      address: demoAddresses.lahore,
      paymentMethod: 'bank',
      isPaid: true,
      statusTrail: [
        ['placed', now - 20 * day],
        ['confirmed', now - 19 * day],
        ['packed', now - 18 * day],
        ['shipped', now - 17 * day],
        ['delivered', now - 15 * day]
      ]
    })
  ];
}

async function ensureAdmin() {
  const admin = await User.findOne({ email: 'admin@dastak.pk' });
  if (admin) return admin;
  return User.create({
    name: 'Dastak Admin',
    email: 'admin@dastak.pk',
    password: 'Admin@123',
    phone: '0300 0000000',
    role: 'admin'
  });
}

export async function seedDatabase({ force = false } = {}) {
  const existingProducts = await Product.countDocuments();

  if (!force && existingProducts > 0) {
    await ensureAdmin();
    return { seeded: false };
  }

  if (force) {
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
  }

  await ensureAdmin();

  const customer = await User.create({
    name: 'Ayesha Khan',
    email: 'customer@dastak.pk',
    password: 'Customer@123',
    phone: '0300 1234567',
    role: 'customer'
  });

  const reviewerDocs = await User.create(
    reviewers.map((reviewer) => ({
      name: reviewer.name,
      email: reviewer.email,
      password: 'Demo@1234',
      role: 'customer'
    }))
  );

  const categoryDocs = await Category.insertMany(categories);
  const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category]));

  const productDocs = await Product.insertMany(
    products.map(({ image, ...product }) => ({
      ...product,
      slug: product.slug,
      category: categoryBySlug.get(product.category)._id,
      images: [image]
    }))
  );

  const productBySlug = new Map(productDocs.map((product) => [product.slug, product]));
  const reviewerByEmail = new Map(reviewerDocs.map((reviewer) => [reviewer.email, reviewer]));

  await Review.insertMany(
    reviewSeeds.map((review) => ({
      product: productBySlug.get(review.product)._id,
      user: reviewerByEmail.get(review.reviewer)._id,
      name: reviewerByEmail.get(review.reviewer).name,
      rating: review.rating,
      comment: review.comment
    }))
  );

  await Order.insertMany(createDemoOrders(customer._id, productBySlug));

  return {
    seeded: true,
    products: productDocs.length,
    categories: categoryDocs.length
  };
}
