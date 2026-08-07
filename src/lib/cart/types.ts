export type CartItem = {
  productId: number;
  variantId: number | null;
  variantLabel: string | null;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
};
