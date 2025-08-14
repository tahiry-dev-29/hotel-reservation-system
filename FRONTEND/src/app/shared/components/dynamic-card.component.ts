import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  imports: [],
  template: `
    <div class="relative rounded-lg shadow-md bg-card custome-border h-full flex flex-col">

      @if (imageUrl()) {
        <img [src]="imageUrl()" alt="Card Image" class="w-full h-48 object-cover rounded-t-2xl mb-4">
      }
      <div class="p-4 flex flex-col h-full">

      
      @if (title()) {
        <div class="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-2">{{title()}}</div>
      }
      @if (content()) {
        <div class="text-surface-600 dark:text-surface-300 text-base flex-grow">{{content()}}</div>
      }
    </div>
    </div>
  `,
  styles: [],
})
export class DynamicCardComponent {
  title = input<string>();
  content = input<string>();
  imageUrl = input<string>();
}