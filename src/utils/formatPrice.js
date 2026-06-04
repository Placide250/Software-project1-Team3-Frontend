export default function formatPrice(price) {
  if (typeof price !== "number") {
    price = parseInt(price);
  }
  return `$${(price / 100).toFixed(2)}`;
}
