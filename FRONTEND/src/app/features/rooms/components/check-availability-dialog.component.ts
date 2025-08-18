import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Room, RoomService } from '../../../core/services/room-service';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-check-availability-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    ToastModule,
    DividerModule,
    MessageModule
],
  providers: [MessageService],
  templateUrl: './check-availability-dialog.component.html',
  styles: [`
    :host ::ng-deep .p-dialog-content {
      height: 100%;
    }
  `]
})
export class CheckAvailabilityDialogComponent implements OnInit {
  availabilityForm!: FormGroup;
  private roomId: string;
  availabilityResult = signal<'initial' | 'available' | 'not-available' | 'error'>('initial');

  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  constructor() {
    this.roomId = this.config.data.roomId;
  }

  ngOnInit() {
    this.availabilityForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      numAdults: [1, Validators.required],
      numChildren: [0]
    });
  }

  checkAvailability() {
    if (this.availabilityForm.invalid) {
      return;
    }

    const { checkInDate, checkOutDate, numAdults, numChildren } = this.availabilityForm.value;

    // Format dates to YYYY-MM-DD
    const formattedCheckInDate = this.formatDate(new Date(checkInDate));
    const formattedCheckOutDate = this.formatDate(new Date(checkOutDate));

    this.roomService.getAvailableRooms(formattedCheckInDate, formattedCheckOutDate, numAdults, numChildren)
      .subscribe({
        next: (availableRooms: Room[]) => {
          const isAvailable = availableRooms.some((room: Room) => room.id === this.roomId);
          if (isAvailable) {
            this.availabilityResult.set('available');
          } else {
            this.availabilityResult.set('not-available');
            this.messageService.add({ severity: 'warn', summary: 'Not Available', detail: 'This room is not available for the selected dates.', life: 3000 });
          }
        },
        error: () => {
          this.availabilityResult.set('error');
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while checking availability.', life: 3000 });
        }
      });
  }

  reserve() {
    this.ref.close({ available: true, bookingDetails: this.availabilityForm.value });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
