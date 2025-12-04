// lib/ageChecker.d.ts

declare global {
  interface Window {
    AgeChecker?: {
      verify: (options: {
        siteId: string;
        onSuccess: (result: AgeVerificationResult) => void;
        onFailure?: () => void;
      }) => void;
    };
  }
}

export interface AgeVerificationResult {
  status: 'verified' | 'underage' | 'failed';
  timestamp: string;
  verificationId?: string;
  ageVerified?: number;
  country?: string;
  region?: string;
  metadata?: Record<string, unknown>;
}

// We don't need to export this because it's globally available.
