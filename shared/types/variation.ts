export interface VariationValue {
  id?: number;
  value: string;
}

export interface Variation {
  id?: number;
  sku: string;
  retailPrice?: number | undefined;
  wholesalePrice?: number | undefined;
  values: VariationValue[];
}
