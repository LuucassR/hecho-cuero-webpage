export type ProductOptionValue = { id: number; value: string };
export type ProductOption = { id: number; name: string; values: ProductOptionValue[] };

export type ProductVariant = {
  id: number;
  sku: string | null;
  priceCents: number | null;
  stock: number;
  active: boolean;
  valuesByOptionId: Record<number, number>;
};

type RawVariant = {
  id: number;
  sku: string | null;
  priceCents: number | null;
  stock: number;
  active: boolean;
  variantValues: { optionValueId: number; optionValue: { optionId: number } }[];
};

export function mapVariant(raw: RawVariant): ProductVariant {
  return {
    id: raw.id,
    sku: raw.sku,
    priceCents: raw.priceCents,
    stock: raw.stock,
    active: raw.active,
    valuesByOptionId: Object.fromEntries(
      raw.variantValues.map((vv) => [vv.optionValue.optionId, vv.optionValueId]),
    ),
  };
}

export function variantLabel(variant: ProductVariant, options: ProductOption[]): string {
  return options
    .map((option) => {
      const valueId = variant.valuesByOptionId[option.id];
      return option.values.find((v) => v.id === valueId)?.value;
    })
    .filter((v): v is string => Boolean(v))
    .join(" / ");
}

export function findMatchingVariant(
  variants: ProductVariant[],
  options: ProductOption[],
  selection: Record<number, number>,
): ProductVariant | undefined {
  return variants.find((variant) =>
    options.every((option) => variant.valuesByOptionId[option.id] === selection[option.id]),
  );
}
