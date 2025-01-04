import { Item } from "./Item";

export interface Bill {
  store: string;
  address: string;
  phone: string;
  bill_number: string;
  bill_date: string;
  time: string;
  cashier: string;
  items: Item[];
  total_items: number;
  total_quantity: number;
  total_value: number;
}