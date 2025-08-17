// src/app/shared/components/images-input-component.ts
import { Component, input } from '@angular/core';
import { ImageModule } from 'primeng/image'; // Assuming Image is part of ImageModule

@Component({
  selector: 'app-images-input-component',
  standalone: true, // Assuming it's standalone as per your project configuration
  imports: [ImageModule], // Import ImageModule to use p-image
  template: `
        <p-image [src]="imageSrc()" 
                 [width]="width()"
                 [loading]="'lazy'"
                 [height]="height()"
                 [alt]="alt()"
                 [preview]="preview()"
                 [class]="'block w-full h-full ' + class() + (preview() ? '' : ' transition-transform duration-300 hover:scale-105 cursor-pointer')"
                 [imageClass]="'object-cover'" 
                 
                 [class.placeholder-image]="!imageSrc() || imageSrc() === 'https://placehold.co/250x250/C0C0C0/FFFFFF?text=Placeholder'">
        </p-image>
        <!-- (onImageError)="handleImageError($event)"
                 [class.error-image]="!imageSrc() || imageSrc() === '' || isError" -->
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
  
  // isError = false;

  // handleImageError(event: Event): void {
  //   console.error('Image failed to load:', event);
  //   this.isError = true;
  //   (event.target as HTMLImageElement).src = 'https://placehold.co/250x250/E0E0E0/000000?text=No+Image';
  // }
}
