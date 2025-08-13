import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dynamic-card',
  standalone: true,
  template: `
    <div class="rounded-lg shadow-md p-4 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-full flex flex-col">
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
  styles: [], // Removed custom CSS, using only Tailwind
})
export class DynamicCardComponent {
  title = input<string>();
  content = input<string>();
  imageUrl = input<string>();

  // sanitizedTitle: () => SafeHtml;
  // sanitizedContent: () => SafeHtml;

  // constructor(private sanitizer: DomSanitizer) {
  //   this.sanitizedTitle = () => this.sanitizer.bypassSecurityTrustHtml(this.title() || '');
  //   this.sanitizedContent = () => this.sanitizer.bypassSecurityTrustHtml(this.content() || '');
  // }
}
