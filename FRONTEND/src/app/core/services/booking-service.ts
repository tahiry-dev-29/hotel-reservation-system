import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface Booking {
  id: string;
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numAdults: number;
  numChildren: number;
  notes?: string;
  status: string;
}

export interface BookingCreateRequest {
  customerId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numAdults: number;
  numChildren: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);

  createBooking(bookingRequest: BookingCreateRequest): Observable<Booking> {
    return this.http.post<Booking>(`${environment.apiUrl}/bookings`, bookingRequest);
  }

  getBookingsByCustomerId(customerId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/by-customer/${customerId}`);
  }
}
