import { Component, OnInit, inject, signal } from '@angular/core';

import { Booking, BookingService } from '../../../core/services/booking-service';
import { CustomerAuthService } from '../../../core/services/customer-auth-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DynamicTableComponent, TableColumn } from '../../../shared/components/dynamic-table-component';

@Component({
  selector: 'app-my-bookings-page-component',
  standalone: true,
  imports: [
    ToastModule,
    DynamicTableComponent
],
  providers: [MessageService],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">My Bookings</h1>

      <app-dynamic-table
        [data]="bookings()"
        [columns]="bookingColumns"
        [tableTitle]="'My Reservations'"
        [showGlobalFilter]="true"
        [showColumnFilters]="false"
        [clientSidePaginator]="true"
        [showColumnSelect]="false"
      ></app-dynamic-table>
    </div>
    <p-toast></p-toast>
  `,
  styles: []
})
export class MyBookingsPageComponent implements OnInit {
  private customerAuthService = inject(CustomerAuthService);
  private bookingService = inject(BookingService);
  private messageService = inject(MessageService);

  bookings = signal<Booking[]>([]);

  bookingColumns: TableColumn[] = [
    { field: 'roomId', header: 'Room ID', sortable: true },
    { field: 'checkInDate', header: 'Check-in Date', type: 'date', sortable: true },
    { field: 'checkOutDate', header: 'Check-out Date', type: 'date', sortable: true },
    { field: 'numAdults', header: 'Adults', type: 'numeric', sortable: true },
    { field: 'numChildren', header: 'Children', type: 'numeric', sortable: true },
    { field: 'status', header: 'Status', type: 'status', sortable: true, statusConfig: { map: {
      'CONFIRMED': { severity: 'success', text: 'Confirmed' },
      'PENDING': { severity: 'info', text: 'Pending' },
      'CANCELLED': { severity: 'danger', text: 'Cancelled' },
      'CHECKED_IN': { severity: 'primary', text: 'Checked In' },
      'CHECKED_OUT': { severity: 'secondary', text: 'Checked Out' },
      'NO_SHOW': { severity: 'warning', text: 'No Show' }
    } } },
    { field: 'notes', header: 'Notes', type: 'text' }
  ];

  ngOnInit() {
    const customer = this.customerAuthService.currentCustomerProfile();
    if (customer && customer.id) {
      this.bookingService.getBookingsByCustomerId(customer.id).subscribe({
        next: (data) => {
          this.bookings.set(data);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load bookings.' });
          console.error('Failed to load bookings', err);
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Not Logged In', detail: 'Please log in to view your bookings.' });
    }
  }
}
