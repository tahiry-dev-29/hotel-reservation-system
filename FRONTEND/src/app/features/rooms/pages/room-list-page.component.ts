import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from '../../../shared/components/dynamic-table-component';

@Component({
  selector: 'app-room-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DynamicTableComponent,
    ButtonModule
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Rooms Management</h2>
        <a routerLink="../new">
          <p-button label="Add Room" icon="pi pi-plus"></p-button>
        </a>
      </div>

      <!-- Rooms Table -->
      <div class="rounded-md!">
        <app-dynamic-table
          [data]="rooms"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onEditRoom($event)"
          (onDelete)="onDeleteRoom($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``]
})
export class RoomListPageComponents {
  rooms = [
    { id: 1, roomNumber: '101', type: 'Single', price: 150, status: 'Available' },
    { id: 2, roomNumber: '102', type: 'Double', price: 200, status: 'Occupied' },
    { id: 3, roomNumber: '103', type: 'Suite', price: 350, status: 'Available' },
    { id: 4, roomNumber: '201', type: 'Single', price: 150, status: 'Maintenance' },
    { id: 5, roomNumber: '202', type: 'Double', price: 200, status: 'Available' },
    { id: 6, roomNumber: '203', type: 'Suite', price: 350, status: 'Occupied' },
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

  onEditRoom(room: any) {
    console.log('Edit room:', room);
    // Implement navigation or dialog for editing
  }

  onDeleteRoom(room: any) {
    console.log('Delete room:', room);
    // Implement confirmation and deletion logic
  }
}
