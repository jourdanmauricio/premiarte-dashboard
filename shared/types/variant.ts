export interface VariantValue {
  id?: number;
  value: string;
}

export interface Variant {
  id?: number;
  name: string;
  values: VariantValue[];
}
