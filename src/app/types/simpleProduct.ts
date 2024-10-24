export interface SimpleProduct {
  collection: Collection;
  description: string;
  image: string;
  limits: Limits;
  name: string;
  pricing: Pricing[];
  product_id: string;
  quantity: number;
  status: string;
}

export interface Collection {
  collection_address: string;
  collection_type: string;
  token_id: string;
}

export interface Limits {
  enabled: boolean;
}

export interface Pricing {
  amount: number;
  currency: string;
}
