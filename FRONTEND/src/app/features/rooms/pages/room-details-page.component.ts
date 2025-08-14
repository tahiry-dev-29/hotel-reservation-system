import { Component, signal } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ImagesInputComponent } from '../../../shared/components/images-input-component';
import { DynamicAccordionPanelComponent } from "../../../shared/components/dynamic-accordion-panel-component";


interface Room {
  title: string;
  imageUrl: string;
  content: string;
  amenities: string[];
  hostName: string;
  hostDescription: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
}

@Component({
  selector: 'app-room-detail',
  imports: [
    AccordionModule,
    ImagesInputComponent,
    DynamicAccordionPanelComponent
],
  templateUrl: './room-details-page-component.html',
})
export class RoomDetailsPageComponents {
  isLoading = signal(true);
  roomData = signal<Room | null>(null);
  
  activePanel = signal<string[] | number>(['0']);

  constructor() {
    setTimeout(() => {
      this.roomData.set({
        title: 'Cozy Mountain Retreat',
        imageUrl: 'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
        content: 'Experience tranquility in this beautiful mountain retreat. Perfect for a peaceful getaway, offering stunning views and modern amenities.',
        amenities: ['Wi-Fi', 'Kitchen', 'Free parking', 'Air conditioning', 'Heating', 'TV', 'Private Bathroom'],
        hostName: 'Jane Doe',
        hostDescription: 'Experienced host with a passion for hospitality, dedicated to providing comfortable stays.',
        price: 150,
        inStock: true,
        onSale: false,
      });
      this.isLoading.set(false);
    }, 1500);
  }
}
