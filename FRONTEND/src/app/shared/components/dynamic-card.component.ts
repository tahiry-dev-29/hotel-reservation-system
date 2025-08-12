
import { Component, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic-card',
  template: `
    <div class="dynamic-card">
      @if (title()) {
        <div class="card-title" [innerHTML]="sanitizedTitle()"></div>
      }
      @if (content()) {
        <div class="card-content" [innerHTML]="sanitizedContent()"></div>
      }
      @if (imageUrl()) {
        <img [src]="imageUrl()" alt="Card Image" class="card-image">
      }
    </div>
  `,
  styles: [`
    .dynamic-card {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      margin: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .card-content {
      font-size: 1rem;
      margin-bottom: 8px;
    }
    .card-image {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
  `],
  standalone: true,
})
export class DynamicCardComponent {
  title = input<string>();
  content = input<string>();
  imageUrl = input<string>();

  sanitizedTitle: () => SafeHtml;
  sanitizedContent: () => SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.sanitizedTitle = () => this.sanitizer.bypassSecurityTrustHtml(this.title() || '');
    this.sanitizedContent = () => this.sanitizer.bypassSecurityTrustHtml(this.content() || '');
  }
}
