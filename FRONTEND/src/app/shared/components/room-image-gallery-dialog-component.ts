// src/app/shared/components/room-image-gallery-dialog-component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngFor, ngIf
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image'; // For p-image
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-room-image-gallery-dialog',
  standalone: true,
  imports: [CommonModule, ImageModule], // CommonModule for structural directives, ImageModule for p-image
  template: `
    <div class="p-4 bg-surface-ground">
      <h3 class="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">Room Images</h3>
      @if (processedImageUrls.length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (url of processedImageUrls; track url) {
            <div class="w-full">
              <p-image [src]="url"
                       [alt]="'Room Image'"
                       [preview]="true"
                       imageClass="w-full h-48 object-cover rounded-md shadow-md"
                       class="block w-full h-full"
                       onError="this.src='https://placehold.co/400x300/EFEFEF/AAAAAA?text=No+Image'"
              ></p-image>
            </div>
          }
        </div>
      } @else {
        <div class="p-5 text-center text-color">
          <p class="text-gray-600 dark:text-gray-300">No images available for this room.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Add any specific styles for the image gallery here if needed */
  `]
})
export class RoomImageGalleryDialogComponent implements OnInit {
  rawImageUrls: string[] = [];
  processedImageUrls: string[] = [];

  config = inject(DynamicDialogConfig);

  ngOnInit() {
    if (this.config.data && this.config.data.imageUrls) {
      this.rawImageUrls = this.config.data.imageUrls;
      
      this.processedImageUrls = this.rawImageUrls.map(filename => {
        // Build the full URL explicitly based on your backend structure.
        // Assuming your backend serves media files directly under /api/media/
        // If environment.apiUrl is "http://localhost:8080/api", then this will correctly form:
        // "http://localhost:8080/api/media/{filename}"
        let baseUrl = environment.apiUrl;
        if (baseUrl.endsWith('/')) { // Ensure no double slash if environment.apiUrl ends with '/'
          baseUrl = baseUrl.slice(0, -1);
        }
        return `${baseUrl}/media/${filename}`; 
      });
    }
  }
}
