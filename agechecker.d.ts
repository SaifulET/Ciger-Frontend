// types/agechecker.d.ts

interface Verification {
  status: "accepted" | "denied" | "pending"; // Add any other possible statuses if needed
}

interface AgeCheckerConfig {
  element: string; // ID or selector of the element that will trigger the popup
  key: string; // Your AgeChecker API key
  background?: string; // Custom background for the popup (optional)
  font?: string; // Custom font for the popup text (optional)
  accent_color?: string; // Custom button color (optional)
  mode: "auto" | "manual"; // Mode of the popup (auto or manual)
  onstatuschanged?: (verification: Verification) => void; // Callback when verification status changes
  // Add any other properties from the AgeCheckerConfig as needed
}

interface Window {
  AgeCheckerConfig: AgeCheckerConfig; // Use the AgeCheckerConfig type here
}
