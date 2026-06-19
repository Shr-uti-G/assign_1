export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getDiscountedPrice(price, discount = 0) {
  if (!discount) return price;
  return price - (price * discount) / 100;
}

export function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return image;
}
