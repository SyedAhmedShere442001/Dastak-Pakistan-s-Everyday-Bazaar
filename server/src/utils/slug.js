import slugify from 'slugify';
import Product from '../models/Product.js';

export async function uniqueProductSlug(name, excludeId) {
  const base = slugify(name, { lower: true, strict: true, trim: true }) || 'product';
  let candidate = base;
  let counter = 2;

  // A product's own slug should not block its update.
  while (
    await Product.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    })
  ) {
    candidate = `${base}-${counter++}`;
  }

  return candidate;
}
