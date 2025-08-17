import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ImagesInputComponent } from '../../../shared/components/images-input-component';
import { DynamicAccordionPanelComponent } from "../../../shared/components/dynamic-accordion-panel-component";
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from "../../../shared/components/button-component";
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CustomDynamiqueDialogComponent } from '../../../shared/components/custom-dynamic-dialog-component';
import { Room, RoomService, AMENITIES } from '../../../core/services/room-service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';

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
  standalone: true,
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

  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  dialogRef: DynamicDialogRef | undefined;
  allAmenities = AMENITIES;

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
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isLoading.set(true);
          return this.roomService.getRoomById(id);
        }
        return [];
      })
    ).subscribe(room => {
      this.roomData.set({
        ...room,
        imageUrls: room.imageUrls.map(url => `${environment.fileUrl}/${url}`)
      });
      this.isLoading.set(false);
    });
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
        initialMessage: `You are booking the ${currentRoom.title} for ${currentRoom.basePrice}$/night.`, 
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
