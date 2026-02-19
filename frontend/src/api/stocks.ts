import { http } from "./http";

export type Stock = {
  symbol: string;
  price: number;
};

export function listStocksApi() {
  return http<Stock[]>("stocks");
}
