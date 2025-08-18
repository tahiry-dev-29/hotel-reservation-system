import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { Room, RoomService } from '../../../core/services/room-service';
import { BookingService, BookingCreateRequest } from '../../../core/services/booking-service';
import { CustomerAuthService } from '../../../core/services/customer-auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environments'; // Import environment

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TextareaModule,
    FormsModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './reservation-page.component.html',
})
export class ReservationPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  private customerAuthService = inject(CustomerAuthService);
  private messageService = inject(MessageService);

  room = signal<Room | null>(null);
  bookingDetails = signal<any>(null);
  notes = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const roomId = params['roomId'];
      this.bookingDetails.set(params);

      if (roomId) {
        this.roomService.getRoomById(roomId).subscribe(room => {
          // Construct full image URLs
          this.room.set({
            ...room,
            imageUrls: room.imageUrls.map(url => `${environment.fileUrl}/${url}`)
          });
        });
      }

      if (params['successMessage']) {
        this.messageService.add({ severity: 'success', summary: 'Availability Confirmed', detail: 'The room is available for your selected dates. Please confirm your reservation.', life: 5000 });
      }
    });
  }

  confirmBooking() {
    const customer = this.customerAuthService.currentCustomerProfile();
    console.log('Customer in confirmBooking:', customer);
    if (!customer) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to make a reservation.' });
      return;
    }

    const details = this.bookingDetails();
    const bookingRequest: BookingCreateRequest = {
      customerId: customer.id,
      roomId: details.roomId,
      checkInDate: details.checkInDate,
      checkOutDate: details.checkOutDate,
      numAdults: details.numAdults,
      numChildren: details.numChildren,
      notes: this.notes
    };

    this.bookingService.createBooking(bookingRequest).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Reservation confirmed!' });
      setTimeout(() => this.router.navigate(['/my-bookings']), 2000);
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create booking.' });
    });
  }
}
