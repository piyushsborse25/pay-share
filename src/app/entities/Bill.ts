import { Item } from "./Item";

export interface Bill {
  billId: number;
  store: string;
  address: string;
  phone: string;
  billNumber: string;
  billDate: string;
  time: string;
  cashier: string;
  items: Item[];
  participants: Set<string>;
  paidBy: string,
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
}