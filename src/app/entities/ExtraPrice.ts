export interface ExtraPrice {
  name: string;
  value: number;
  type: "EXTRA_CHARGES" | "DISCOUNT" | "TAX" | "CASHBACK";
}