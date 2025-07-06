export interface ItemWithPrices {
  itemId: number;
  name: string;
  sizes: {
    sizeId: number;
    name: string;
    price: number;
    enabled: boolean;
    previousPrice: number;
  }[];
}
