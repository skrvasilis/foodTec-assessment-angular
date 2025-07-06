import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ItemWithPrices } from '../../models/itemWithPrices.model';

@Component({
  selector: 'app-pizza-item',
  imports: [],
  templateUrl: './pizza-item.html',
  styleUrl: './pizza-item.css',
  standalone: true,
})
export class PizzaItem {
  @Input() item!: ItemWithPrices;
  @Input() IsExpanded: boolean = false;
  @Input() original!: ItemWithPrices;
  @Output() expand = new EventEmitter<number>();
  @Output() update = new EventEmitter<ItemWithPrices>();
  @Output() undo = new EventEmitter<number>();

  toggleSize(index: number) {
    const size = this.item.sizes[index];

    if (size.enabled) {
      // Save current price before disabling
      size.previousPrice = size.price;
      size.price = 0;
      size.enabled = false;
    } else {
      size.enabled = true;
      // Restore saved price if it exists
      if (typeof size.previousPrice === 'number') {
        size.price = size.previousPrice;
        size.previousPrice = 0
      } else {
        size.price = 0
      }
    }

    this.emitUpdate();
  }

  onPriceChange(index: number, value: string) {
    const price = parseFloat(value);
    if (!isNaN(price)) {
      this.item.sizes[index].price = price;
      this.emitUpdate();
    }
  }

  hasChanges(): boolean {
    return JSON.stringify(this.item) !== JSON.stringify(this.original);
  }

  emitUpdate() {
    this.update.emit(this.item);
  }

  onUndo() {
    this.undo.emit(this.item.itemId);
  }
}
