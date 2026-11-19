import { formatAmountInAmharic } from "../src/index.js";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const items: InvoiceItem[] = [
  { description: "Software Consultation", quantity: 10, unitPrice: 2500.0 },
  { description: "Server Hosting Setup", quantity: 1, unitPrice: 5450.75 },
];

const subtotal = items.reduce(
  (sum, item) => sum + item.quantity * item.unitPrice,
  0
);
const vat = subtotal * 0.15; // 15% Ethiopian VAT
const total = subtotal + vat;

console.log("=== INVOICE TOTAL IN AMHARIC ===");
console.log(`Subtotal: ${subtotal.toFixed(2)} ETB`);
console.log(`VAT (15%): ${vat.toFixed(2)} ETB`);
console.log(`Total: ${total.toFixed(2)} ETB`);
console.log();

// Format total for invoice
const invoiceWords = formatAmountInAmharic(total.toFixed(2), {
  currency: "ETB",
  style: "invoice",
  customLabel: "የክፍያው ጠቅላላ ድምር በፊደል፡",
});

console.log(invoiceWords);
