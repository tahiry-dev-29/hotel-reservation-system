import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from "../../../shared/components/dynamic-table-component";

@Component({
  selector: 'app-public-room-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DynamicTableComponent
],
  template: `
    <div class="space-y-6 p-4">
      <h2 class="text-2xl font-bold text-text-color mb-4">Available Rooms</h2>

      <div class="rounded-md!">
        <app-dynamic-table
          [data]="rooms"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onViewRoomDetails($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``]
})
export class PublicRoomListPageComponent {
  rooms = [
    { id: 1, roomNumber: '101', type: 'Single', price: 150, status: 'Available', description: 'Cozy single room.' },
    { id: 2, roomNumber: '102', type: 'Double', price: 200, status: 'Available', description: 'Spacious double room.' },
    { id: 3, roomNumber: '103', type: 'Suite', price: 350, status: 'Available', description: 'Luxury suite with a view.' },
    { id: 4, roomNumber: '201', type: 'Single', price: 150, status: 'Available', description: 'Standard single room.' },
    { id: 5, roomNumber: '202', type: 'Double', price: 200, status: 'Available', description: 'Comfortable double room.' },
    { id: 6, roomNumber: '203', type: 'Suite', price: 350, status: 'Available', description: 'Executive suite.' },
  ];

  columns: TableColumn[] = [
    { field: 'roomNumber', header: 'Room No.', sortable: true },
    { field: 'type', header: 'Type', sortable: true },
    { field: 'price', header: 'Price/Night', sortable: true },
    { field: 'status', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'Available': { severity: 'success', text: 'Available' },
        'Occupied': { severity: 'danger', text: 'Occupied' },
        'Maintenance': { severity: 'warning', text: 'Maintenance' },
      }
    }},
  ];

  constructor(private router: Router) {}

  onViewRoomDetails(room: any) {
    console.log('View room details:', room);
    // Navigate to a room details page, e.g., /rooms/details/1
    this.router.navigate(['/rooms', 'details', room.id]);
  }
}