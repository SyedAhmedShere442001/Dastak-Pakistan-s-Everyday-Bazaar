export const PAYMENT_METHODS = ['cod', 'easypaisa', 'jazzcash', 'bank'];

export const ORDER_STATUSES = [
  'placed',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled'
];

export function getShippingConfig() {
  return {
    flat: Number(process.env.SHIPPING_FLAT ?? 250),
    freeThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD ?? 5000)
  };
}

export function shippingFor(itemsPrice) {
  const { flat, freeThreshold } = getShippingConfig();
  return itemsPrice >= freeThreshold ? 0 : flat;
}

export const roundRupees = (value) => Math.round(Number(value) || 0);
