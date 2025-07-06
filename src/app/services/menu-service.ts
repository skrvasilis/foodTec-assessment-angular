import { Injectable } from '@angular/core';
import { ItemWithPrices } from '../models/itemWithPrices.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private key = 'pizzaMenu';

  save(items: ItemWithPrices[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  load(): ItemWithPrices[] | null {
    const data = localStorage.getItem(this.key);

    return data ? JSON.parse(data) : null;
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  constructor() {}
}
