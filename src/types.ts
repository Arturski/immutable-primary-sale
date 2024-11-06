// types.ts

// Server
export interface ServerConfig {
  [key: string]: EnvironmentConfig;
}

export interface EnvironmentConfig {
  HOST_IP: string;
  PORT: number;
  INVENTORY_API_KEY: string;
  RESERVATION_TIME: string;
  enableFileLogging: boolean;
  logLevel: string;
  enableWebhookVerification: boolean;
  allowedTopicArn: string;
}

// Quote
export interface QuoteRequest {
  recipient_address: string;
  products: {
    product_id: string;
    quantity: number;
  }[];
}

export interface Pricing {
  currency: string;
  currency_type: string;
  amount: number;
}

export interface ProductResponse {
  product_id: string;
  quantity: number;
  pricing: Pricing[];
}

export interface QuoteResponse {
  products: ProductResponse[];
  totals: Pricing[];
}

// Authorize
export interface AuthorizeRequest {
  recipient_address: string;
  currency: string;
  products: {
    product_id: string;
    quantity: number;
  }[];
}

export interface AuthorizeProductDetail {
  token_id: string;
  amount: number;
}

export interface AuthorizeProductResponse {
  product_id: string;
  collection_address: string;
  contract_type: string;
  detail: AuthorizeProductDetail[];
}

export interface AuthorizeResponse {
  reference: string;
  currency: string;
  products: AuthorizeProductResponse[];
}

// Confirm
export interface ConfirmRequest {
  reference: string;
  tx_hash: string;
  token_id_hash: string;
  recipient_address: string;
  order: {
    contract_address: string;
    total_amount: number;
    deadline: number;
    created_at: number;
    currency: string;
    products: {
      product_id: number;
      detail: {
        token_id: string;
        amount: number;
      }[];
      quantity: number;
      collection_address: string;
      collection_type: string;
    }[];
  };
}

// Expired Order
export interface ExpiredOrderRequest {
  reference: string;
}

// Passport
export type PassportIDToken = {
  header: { alg: "RS256"; typ: "JWT"; kid: "3aaYytdwwe032s1r3TIr9" };
  payload: {
    passport: {
      zkevm_eth_address: string;
      zkevm_user_admin_address: string;
    };
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    locale: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
    sub: string;
    sid: string;
  };
  signature: string;
};

export interface Metadata {
  animation_url: string | null;
  attributes: Attribute[] | null;
  chain: Chain;
  contract_address: string;
  created_at: string;
  description: string | null;
  external_url: string | null;
  id: string;
  image: string | null;
  name: string | null;
  updated_at: string | null;
  youtube_url: string | null;
}

export interface Pricing {
  id: number;
  product_id: number;
  currency: string;
  currency_type: string;
  amount: number;
}

export interface Attribute {
  trait_type: string;
  value: string | number | boolean;
}

export interface Chain {
  id: string;
  name: string;
}

export interface ProductsResult {
  productData: Product[];
}
export interface Product {
  id: number;
  name: string;
  description: string;
  rarity: string;
  contract_address: string;
  metadata_id: string;
  pricing: Pricing[];
}

export interface ProductWithMetadata extends Product {
  metadata: Metadata | undefined
}

export interface SimpleProduct {
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
