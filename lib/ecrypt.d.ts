export interface EcryptConfig {
  publicKey: string;
}

export interface CardFieldStyle {
  base?: {
    color?: string;
    fontSize?: string;
    fontFamily?: string;
    '::placeholder'?: {
      color?: string;
    };
  };
  invalid?: {
    color?: string;
  };
}

export interface CardFieldOptions {
  style?: CardFieldStyle;
}

export interface CardFieldInstance {
  mount: (element: string | HTMLElement) => void;
  unmount: () => void;
  on: (event: string, handler: () => void) => void;
}

export interface TokenResponse {
  token?: string;
  error?: {
    message: string;
    type: string;
  };
}

export interface EcryptInstance {
  createCardField: (options: CardFieldOptions) => CardFieldInstance;
  createToken: (cardField: CardFieldInstance) => Promise<TokenResponse>;
}

declare global {
  interface Window {
    Ecrypt: {
      init: (config: EcryptConfig) => EcryptInstance;
    };
  }
}