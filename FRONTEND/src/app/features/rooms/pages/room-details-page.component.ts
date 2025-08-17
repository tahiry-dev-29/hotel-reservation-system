import { Component, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ImagesInputComponent } from '../../../shared/components/images-input-component';
import { DynamicAccordionPanelComponent } from '../../../shared/components/dynamic-accordion-panel-component';
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from '../../../shared/components/button-component';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogModule,
} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  Room,
  RoomService,
  AMENITIES,
} from '../../../core/services/room-service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environments';
import { CheckAvailabilityDialogComponent } from '../components/check-availability-dialog.component';

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
    ToastModule,
    CheckAvailabilityDialogComponent,
  ],
  providers: [DialogService, MessageService],
  templateUrl: './room-details-page-component.html',
  styles: [`
    :host ::ng-deep .p-dialog-content {
      height: 100%;
    }
  `]
})
export class RoomDetailsPageComponents implements OnInit {
  isLoading = signal(true);
  roomData = signal<Room | null>(null);
  activePanel = signal<string[] | number>(['0']);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  dialogRef: DynamicDialogRef | undefined;
  allAmenities = AMENITIES;

  categories: Category[] = [
    { name: 'Apartment', code: 'APT' },
    { name: 'House', code: 'HSE' },
    { name: 'Studio', code: 'STD' },
    { name: 'Villa', code: 'VLA' },
  ];

  availableTags: Tag[] = [
    { name: 'WiFi', value: 'wifi' },
    { name: 'Pool', value: 'pool' },
    { name: 'Kitchen', value: 'kitchen' },
    { name: 'Pet Friendly', value: 'pet_friendly' },
  ];

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.isLoading.set(true);
            return this.roomService.getRoomById(id);
          }
          return [];
        })
      )
      .subscribe((room) => {
        this.roomData.set({
          ...room,
          imageUrls: room.imageUrls.map(
            (url) => `${environment.fileUrl}/${url}`
          ),
        });
        this.isLoading.set(false);
      });
  }

  openReservationDialog() {
    const currentRoom = this.roomData();
    if (!currentRoom) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Room data not loaded.',
        life: 3000,
      });
      return;
    }

    this.dialogRef = this.dialogService.open(CheckAvailabilityDialogComponent, {
      header: `Check Availability for: ${currentRoom.title}`,
      width: '70%',
      height: '80%',
      closable: true,
      baseZIndex: 10000,
      modal: true,
      data: {
        roomId: currentRoom.id,
      },
    });

    this.dialogRef.onClose.subscribe((result) => {
      if (result && result.available) {
        const bookingDetails = result.bookingDetails;
        this.router.navigate(['/reservation'], {
          queryParams: {
            roomId: currentRoom.id,
            checkInDate: this.formatDate(new Date(bookingDetails.checkInDate)),
            checkOutDate: this.formatDate(
              new Date(bookingDetails.checkOutDate)
            ),
            numAdults: bookingDetails.numAdults,
            numChildren: bookingDetails.numChildren,
            successMessage: true
          },
        });
      } else if (result === undefined) {
        // This case handles when the dialog is closed without a selection (e.g., clicking outside)
        this.messageService.add({
          severity: 'info',
          summary: 'Check Canceled',
          detail: 'Availability check was canceled.',
          life: 3000,
        });
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
