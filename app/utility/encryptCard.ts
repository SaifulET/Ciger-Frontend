import JSEncrypt from "jsencrypt";
export const encryptCardData = (publicKey: string, cardData: any) => {
  const encrypt = new JSEncrypt();

  encrypt.setPublicKey(publicKey.trim());

  const minimalCard = {
    n: cardData.number,
    m: cardData.expiryMonth,
    y: cardData.expiryYear,
    c: cardData.cvv,
  };

  const jsonString = JSON.stringify(minimalCard).replace(/\s+/g, "");

  console.log("JSON Size:", jsonString.length);

  const encrypted = encrypt.encrypt(jsonString);

  if (!encrypted) {
    console.error("❌ Encryption Failed!");
  }

  return encrypted;
};
