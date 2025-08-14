import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  imports: [],
  template: `
    <div class="relative rounded-lg shadow-md p-4 bg-slate-600/10 custome-border h-full flex flex-col">
      <button
        class="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-100/80 dark:bg-surface-700/80
               hover:bg-surface-200 dark:hover:bg-surface-600
               text-surface-600 dark:text-surface-300 transition-colors duration-200"
        (click)="toggleFavorite()"
      >
        <i class="pi" [class]="{'pi-heart-fill text-red-500': isFavorite(), 'pi-heart': !isFavorite()}"></i>
      </button>

      @if (imageUrl()) {
        <img [src]="imageUrl()" alt="Card Image" class="w-full h-48 object-cover rounded-md mb-4">
      }
      @if (title()) {
        <div class="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-2">{{title()}}</div>
      }
      @if (content()) {
        <div class="text-surface-600 dark:text-surface-300 text-base flex-grow">{{content()}}</div>
      }
    </div>
  `,
  styles: [],
})
export class DynamicCardComponent {
  title = input<string>();
  content = input<string>();
  imageUrl = input<string>();

  isFavorite = input<boolean>(false);

  favoriteToggled = output<boolean>();

  toggleFavorite(): void {
    this.favoriteToggled.emit(!this.isFavorite());
  }
}