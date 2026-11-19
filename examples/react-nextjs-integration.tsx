import React, { useState } from "react";
import {
  numberToAmharicWords,
  currencyToAmharicWords,
  toChequeWords,
  isSupportedNumber,
} from "amharic-number-words";

/**
 * Example React component demonstrating dynamic Amharic number and currency conversion.
 */
export function AmharicNumberConverterWidget(): React.ReactElement {
  const [amount, setAmount] = useState<string>("1500.50");
  const [mode, setMode] = useState<"plain" | "currency" | "cheque">("currency");

  const isValid = isSupportedNumber(amount);

  let output = "";
  if (isValid) {
    switch (mode) {
      case "plain":
        output = numberToAmharicWords(amount);
        break;
      case "currency":
        output = currencyToAmharicWords(amount, { currency: "ETB" });
        break;
      case "cheque":
        output = toChequeWords(amount, { currency: "ETB" });
        break;
    }
  }

  return (
    <div style={{ maxWidth: 450, padding: 24, border: "1px solid #ccc", borderRadius: 8, fontFamily: "sans-serif" }}>
      <h2>የአማርኛ ቁጥር እና የገንዘብ መጠን መመልከቻ</h2>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="amount-input" style={{ display: "block", marginBottom: 6 }}>
          የገንዘብ መጠን (Amount):
        </label>
        <input
          id="amount-input"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="ለምሳሌ፡ 1500.50"
          style={{ width: "100%", padding: 8, fontSize: 16 }}
        />
      </div>

      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <button type="button" onClick={() => setMode("currency")}>
          ብር (ETB)
        </button>
        <button type="button" onClick={() => setMode("cheque")}>
          ቼክ (Cheque)
        </button>
        <button type="button" onClick={() => setMode("plain")}>
          ቁጥር ብቻ (Plain)
        </button>
      </div>

      <div style={{ marginTop: 20, padding: 12, backgroundColor: "#f9f9f9", borderRadius: 6 }}>
        <strong>በፊደል (In Words):</strong>
        <p style={{ fontSize: 18, fontWeight: 600, color: "#1a5f7a", marginTop: 8 }}>
          {isValid ? output : "እባክዎ ትክክለኛ ቁጥር ያስገቡ (Please enter a valid number)"}
        </p>
      </div>
    </div>
  );
}
