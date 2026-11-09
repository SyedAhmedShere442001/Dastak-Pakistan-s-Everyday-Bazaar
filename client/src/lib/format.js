export const FREE_SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FLAT = 250;

export const formatPKR = (value) =>
  `Rs ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

export const formatDate = (value) =>
  new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(value));

export const PAYMENT_LABELS = {
  cod: 'Cash on Delivery',
  easypaisa: 'Easypaisa',
  jazzcash: 'JazzCash',
  bank: 'Bank Transfer'
};

export const STATUS_LABELS = {
  placed: 'Order placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const STATUS_TONES = {
  placed: 'info',
  confirmed: 'info',
  packed: 'warn',
  shipped: 'warn',
  delivered: 'success',
  cancelled: 'danger'
};

export const ORDER_TIMELINE = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu & Kashmir'
];

export const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Gujrat',
  'Sukkur',
  'Larkana',
  'Mardan',
  'Mirpur',
  'Gilgit'
];

export const PRICE_RANGES = [
  { key: 'under-2000', label: 'Under Rs 2,000', min: 0, max: 2000 },
  { key: '2000-5000', label: 'Rs 2,000 – 5,000', min: 2000, max: 5000 },
  { key: '5000-10000', label: 'Rs 5,000 – 10,000', min: 5000, max: 10000 },
  { key: 'over-10000', label: 'Over Rs 10,000', min: 10000, max: undefined }
];

export const discountPercent = (product) => {
  if (!product?.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
};
