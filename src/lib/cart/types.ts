export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
};
