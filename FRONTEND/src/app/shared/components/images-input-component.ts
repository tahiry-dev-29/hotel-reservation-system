import { Component, input } from '@angular/core';
import { Image } from 'primeng/image';

@Component({
  selector: 'app-images-input-component',
  imports: [Image], 
  template: `
        <p-image [src]="imageSrc()" 
                 [width]="width()"
                 [loading]="'lazy'"
                 [height]="height()"
                 [alt]="alt()"
                 (onImageError)="handleImageError($event)"
                 [preview]="preview()"
                 [class]="class() + ' object-cover' "
                 [class.error-image]="!imageSrc() || imageSrc() === '' || isError"
                 [class.placeholder-image]="!imageSrc() || imageSrc() === 'https://placehold.co/250x250/C0C0C0/FFFFFF?text=Placeholder'">
        </p-image>
  `,
  styles: `
    .error-image {
      border: 2px solid red;
      opacity: 0.7;
    }
    .placeholder-image {
      filter: grayscale(80%);
    }
  `
})
export class ImagesInputComponent {
  imageSrc = input<string>('https://placehold.co/250x250/C0C0C0/FFFFFF?text=Placeholder'); 
  width = input<string>('450');
  height = input<string>('250');
  alt = input<string>('Image Placeholder');
  preview = input<boolean>(true);
  class = input<string>('rounded-lg shadow-md');
  
  isError = false;

  handleImageError(event: Event): void {
    console.error('Image failed to load:', event);
    this.isError = true;
    (event.target as HTMLImageElement).src = 'https://placehold.co/250x250/E0E0E0/000000?text=No+Image';
  }
}

