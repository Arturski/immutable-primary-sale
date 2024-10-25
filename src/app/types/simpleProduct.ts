interface SimpleProduct {
  product_id: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  collection: {
    collection_address: string;
    collection_type: string;
  };
  limits: {
    enabled: boolean;
  };
  status: string;
  pricing: {
    amount: number;
    currency: string;
  }[];
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
