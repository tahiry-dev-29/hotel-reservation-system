// src/app/core/services/room-service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

// Room-related interfaces, based on your backend API documentation
export interface Capacity {
  adults: number;
  children: number;
}

// Defined as types (unions of string literals)
export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'FAMILY';
export type ViewType = 'GARDEN' | 'SEA' | 'CITY' | 'MOUNTAIN' | 'NONE' | 'JARDIN'; // Added JARDIN to type
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
export type Amenity = 'WIFI' | 'TV' | 'AC' | 'MINIBAR' | 'BALCONY' | 'VIEW' | 'BATHTUB' | 'COFFEEMAKER';

// --- Corresponding runtime constants for usage with dropdowns/autocompletes ---
export const ROOM_TYPES: RoomType[] = ['SINGLE', 'DOUBLE', 'SUITE', 'FAMILY'];
export const VIEW_TYPES: ViewType[] = ['GARDEN', 'SEA', 'CITY', 'MOUNTAIN', 'NONE', 'JARDIN'];
export const ROOM_STATUSES: RoomStatus[] = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'];
export const AMENITIES: Amenity[] = ['WIFI', 'TV', 'AC', 'MINIBAR', 'BALCONY', 'VIEW', 'BATHTUB', 'COFFEEMAKER'];


export interface Room {
  id: string;
  roomNumber: string;
  title: string;
  description: string;
  roomType: RoomType;
  capacity: Capacity;
  sizeInSqMeters: number;
  floor: number;
  bedConfiguration: string;
  viewType: ViewType;
  basePrice: number;
  weekendPrice: number;
  onSale: boolean;
  salePrice?: number;
  amenities: Amenity[];
  imageUrls: string[]; // URLs of images for the room
  thumbnailUrl: string | null; // URL of the thumbnail image
  roomStatus: RoomStatus;
  isPublished: boolean;
  internalNotes?: string;
}

// DTO for Room Creation Request (what the backend expects for creation)
export interface RoomCreateRequest {
  roomNumber: string;
  title: string;
  description: string;
  roomType: RoomType;
  capacity: Capacity;
  sizeInSqMeters?: number; // Optional
  floor?: number; // Optional
  bedConfiguration: string;
  viewType: ViewType;
  basePrice: number;
  weekendPrice?: number; // Optional
  onSale: boolean;
  salePrice?: number; // Optional
  amenities?: Amenity[]; // Optional
  roomStatus: RoomStatus;
  isPublished: boolean;
  internalNotes?: string; // Optional
}


// DTO for Room Update Request (what the backend expects for updates)
export interface RoomUpdateRequest {
  title?: string; // Made optional as fields might not be sent if unchanged
  description?: string;
  roomType?: RoomType;
  capacity?: Capacity;
  sizeInSqMeters?: number; // Can be null or undefined if not set
  floor?: number; // Can be null or undefined if not set
  bedConfiguration?: string;
  viewType?: ViewType; // Using the type now
  basePrice?: number;
  weekendPrice?: number;
  onSale?: boolean;
  salePrice?: number;
  amenities?: Amenity[];
  roomStatus?: RoomStatus;
  isPublished?: boolean;
  internalNotes?: string;
}


/**
 * Service for fetching and managing room data.
 */
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  /**
   * Fetches all public rooms from the backend.
   * @returns An Observable array of Room objects.
   */
  getPublicRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/rooms`);
  }

  /**
   * Fetches all rooms (including non-public) from the backend.
   * This is typically for admin purposes.
   * @returns An Observable array of Room objects.
   */
  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/rooms`); // Assuming admin endpoint
  }

  /**
   * Fetches a single room by its ID.
   * @param id The ID of the room to fetch.
   * @returns An Observable of a Room object.
   */
  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${environment.apiUrl}/rooms/${id}`);
  }

  /**
   * Creates a new room.
   * @param roomCreateRequest The room creation DTO.
   * @param imageFiles Optional array of image files to upload.
   * @returns An Observable of the created Room object.
   */
  createRoom(roomCreateRequest: RoomCreateRequest, imageFiles: File[] = []): Observable<Room> {
    const formData = new FormData();
    formData.append('room', new Blob([JSON.stringify(roomCreateRequest)], { type: 'application/json' }));
    imageFiles.forEach(file => {
      formData.append('imageFiles', file, file.name); // Backend expects 'imageFiles' key for creation
    });
    return this.http.post<Room>(`${environment.apiUrl}/rooms`, formData);
  }


  /**
   * Updates an existing room.
   * @param id The ID of the room to update.
   * @param roomUpdateRequest The update request DTO.
   * @param newImageFiles Optional array of new image files to upload.
   * @returns An Observable of the updated Room object.
   */
  updateRoom(id: string, roomUpdateRequest: RoomUpdateRequest, newImageFiles: File[] = []): Observable<Room> {
    const formData = new FormData();
    formData.append('room', new Blob([JSON.stringify(roomUpdateRequest)], { type: 'application/json' }));
    newImageFiles.forEach(file => {
      formData.append('newImageFiles', file, file.name);
    });
    // Assuming a PUT request for updates
    return this.http.put<Room>(`${environment.apiUrl}/rooms/${id}`, formData); // Corrected endpoint if it's /api/rooms/{id}
  }

  /**
   * Deletes a room by its ID.
   * @param id The ID of the room to delete.
   * @returns An Observable representing the completion of the deletion.
   */
  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/rooms/${id}`); // Corrected endpoint if it's /api/rooms/{id}
  }

  /**
   * Fetches available rooms based on check-in/out dates, adults, and children.
   * @param checkInDate Check-in date (YYYY-MM-DD).
   * @param checkOutDate Check-out date (YYYY-MM-DD).
   * @param numAdults Number of adults.
   * @param numChildren Optional number of children.
   * @returns An Observable array of available Room objects.
   */
  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    numAdults: number,
    numChildren?: number
  ): Observable<Room[]> {
    let params = new HttpParams()
      .set('checkInDate', checkInDate)
      .set('checkOutDate', checkInDate) // Fixed: use checkOutDate
      .set('numAdults', numAdults.toString());

    if (numChildren !== undefined) {
      params = params.set('numChildren', numChildren.toString());
    }

    return this.http.get<Room[]>(`${environment.apiUrl}/bookings/available-rooms`, { params });
  }
}
