import { Component, OnInit } from '@angular/core';
import { items, itemPrices, itemSizes } from './data/data';
import { MenuService } from './services/menu-service';
import { ItemWithPrices } from './models/itemWithPrices.model';
import { PizzaItem } from './components/pizza-item/pizza-item';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PizzaItem],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  items: ItemWithPrices[] = [];
  originalItems: ItemWithPrices[] = [];
  expandedItemId: number | null = null;

  getOriginal(itemId: number) {
    return this.originalItems.find((item) => item.itemId === itemId);
  }

  onItemUpdate(updatedItem: ItemWithPrices) {
    const index = this.items.findIndex((i) => i.itemId === updatedItem.itemId);
    if (index !== -1) {
      this.items[index] = JSON.parse(JSON.stringify(updatedItem));
      this.storage.save(this.items);
    }
  }

  onItemUndo(itemId: number) {
    const original = this.originalItems.find((i) => i.itemId === itemId);
    const index = this.items.findIndex((i) => i.itemId === itemId);
    if (original && index !== -1) {
      this.items[index] = JSON.parse(JSON.stringify(original));
      this.storage.save(this.items);
    }
  }

  onExpand(itemId: number) {
    this.expandedItemId = this.expandedItemId === itemId ? null : itemId;
  }

  constructor(private storage: MenuService) {}

  ngOnInit(): void {
    const saved = this.storage.load();
    if (saved) {
      this.items = saved;
    } else {
      this.items = this.combineData();
      this.storage.save(this.items);
    }

    this.originalItems = this.combineData();
  }

  combineData(): ItemWithPrices[] {
    return items.map((item) => {
      const sizes = itemSizes.map((size) => {
        const priceEntry = itemPrices.find(
          (p) => p.itemId === item.itemId && p.sizeId === size.sizeId
        );
        return {
          sizeId: size.sizeId,
          name: size.name,
          price: priceEntry?.price || 0,
          enabled: true,
          previousPrice: 0,
        };
      });

      return {
        itemId: item.itemId,
        name: item.name,
        sizes,
      };
    });
  }
}
