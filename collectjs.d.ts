// collectjs.d.ts
declare global {
  interface Window {
    CollectJS: {
      configure: (options: CollectJSOptions) => void;
      startPaymentRequest: () => void;
      on: (event: string, callback: (e: CollectJSEvent) => void) => void;
    };
  }

  interface CollectJSOptions {
    dataTokenizationKey: string;
    dataVariant: 'inline' | 'lightbox'; // You can specify more variants if necessary
    dataPaymentSelector: string;
  }

  interface CollectJSEvent {
    paymentToken: string;
    cavv?: string;
    xid?: string;
    eci?: string;
    cardHolderAuth?: string;
    threeDsVersion?: string;
    directoryServerId?: string;
    cardHolderInfo?: string;
  }
}

export {};
