"use client";

import { useState } from "react";
import { encryptCardData } from "../../utility/encryptCard";
import api from "@/lib/axios";

export default function PaymentForm() {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
const formattedKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwS8QdfiF8i5x...
...about 600 characters...
-----END PUBLIC KEY-----
`;


  const handlePay = async () => {
    const encrypted = encryptCardData(
      formattedKey,
      {
        number,
        expiryMonth: expiry.split("/")[0],
        expiryYear: expiry.split("/")[1],
        cvv,
      }
    );
console.log("Encrypted Card Data:", encrypted);
    await api.post("/payment/payment", {
  encryptedCard: encrypted,
  amount: 100,
  currency: "USD",
});


    
 
  };

  return (
    <div>
      <input
        placeholder="Card Number"
        onChange={(e) => setNumber(e.target.value)}
      />
      <input
        placeholder="MM/YY"
        onChange={(e) => setExpiry(e.target.value)}
      />
      <input placeholder="CVV" onChange={(e) => setCvv(e.target.value)} />
      <button onClick={handlePay}>Pay</button>
    </div>
  );
}
