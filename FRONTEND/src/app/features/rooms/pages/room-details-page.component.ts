import { Component, signal, OnInit, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ImagesInputComponent } from '../../../shared/components/images-input-component';
import { DynamicAccordionPanelComponent } from "../../../shared/components/dynamic-accordion-panel-component";
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from "../../../shared/components/button-component";
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomDynamiqueDialogComponent } from '../../../shared/components/custom-dynamic-dialog-component';

interface Room {
  id?: string;
  title: string;
  location?: string;
  imageUrls: string[];
  content: string;
  amenities: string[];
  hostName: string;
  hostDescription: string;
  price: number;
  inStock: boolean;
  onSale: boolean;
}

interface Category {
  name: string;
  code: string;
}

interface Tag {
  name: string;
  value: string;
}

@Component({
  selector: 'app-room-detail',
  imports: [
    AccordionModule,
    ImagesInputComponent,
    DynamicAccordionPanelComponent,
    ButtonModule,
    ButtonComponent,
    DynamicDialogModule,
    ToastModule
  ],
  providers: [
    DialogService,
    MessageService
  ],
  templateUrl: './room-details-page-component.html',
})
export class RoomDetailsPageComponents implements OnInit {
  isLoading = signal(true);
  roomData = signal<Room | null>(null);
  activePanel = signal<string[] | number>(['0']);

  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  dialogRef: DynamicDialogRef | undefined;

  categories: Category[] = [
    { name: 'Apartment', code: 'APT' },
    { name: 'House', code: 'HSE' },
    { name: 'Studio', code: 'STD' },
    { name: 'Villa', code: 'VLA' }
  ];

  availableTags: Tag[] = [
    { name: 'WiFi', value: 'wifi' },
    { name: 'Pool', value: 'pool' },
    { name: 'Kitchen', value: 'kitchen' },
    { name: 'Pet Friendly', value: 'pet_friendly' }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.roomData.set({
        id: '1',
        title: 'Cozy Mountain Retreat',
        location: 'Highlands, Madagascar',
        imageUrls: [
          'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
          'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
          'https://primefaces.org/cdn/primeng/images/galleria/galleria3.jpg',
          'https://primefaces.org/cdn/primeng/images/galleria/galleria4.jpg',
          'https://primefaces.org/cdn/primeng/images/galleria/galleria5.jpg'
        ],
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

  openReservationDialog() {
    const currentRoom = this.roomData();
    if (!currentRoom) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Room data not loaded.', life: 3000 });
      return;
    }

    this.dialogRef = this.dialogService.open(CustomDynamiqueDialogComponent, {
      header: `Book: ${currentRoom.title}`,
      width: '90%',
      maximizable: true,
      closable: true,
      height: 'auto',
      contentStyle: { 'max-height': 'calc(100vh - 100px)', 'overflow': 'auto' },
      baseZIndex: 10000,
      data: {
        initialMessage: `You are booking the ${currentRoom.title} in ${currentRoom.location || 'an unknown location'} for ${currentRoom.price}$/night.`,
        formData: {
          userName: '',
          userEmail: '',
          subscribed: false,
          selectedCategory: this.categories.find(cat => cat.name === 'Apartment'),
          startDate: new Date(),
          description: `Booking for ${currentRoom.title}`,
          tags: []
        },
        categories: this.categories,
        availableTags: this.availableTags
      }
    });

    this.dialogRef.onClose.subscribe((result) => {
      if (result) {
        this.messageService.add({
          severity: 'success',
          summary: 'Reservation Confirmed! 🎉',
          detail: `You've successfully requested to book ${currentRoom.title}!`,
          life: 5000
        });
        console.log('Reservation Data:', result.formData);
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Reservation Canceled 😥',
          detail: 'Your booking request has been cancelled.',
          life: 3000
        });
      }
    });
  }
}
