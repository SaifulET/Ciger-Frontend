// File: lib/ageCheckerConfig.ts

export const ageCheckerConfig = {
  element: "#checkout-button", // Element that triggers the popup
  key: "LtE6WKMhRT41WntUJhk5oiEpuYl6g6SI", // Replace with your AgeChecker API key
  path: "/pages/checkout", // The path of the page where age verification should happen
  language: "en", // Optional: set the language of the age verification popup (default is "en")
  popupType: "modal", // Optional: define the type of popup (can be "modal" or "redirect")
  redirectUrl: "/pages/", // Optional: Redirect URL if age verification fails (used if popupType is "redirect")
};
