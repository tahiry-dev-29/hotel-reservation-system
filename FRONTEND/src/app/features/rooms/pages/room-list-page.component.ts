import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from '../../../shared/components/dynamic-table-component'; // Import TableColumn
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'; // For opening dialogs
import { CustomDynamiqueDialogComponent } from '../../../shared/components/custom-dynamic-dialog-component'; // The custom dialog component
import { MessageService } from 'primeng/api'; // For toasts
import { Room, RoomService, ROOM_TYPES, AMENITIES, ROOM_STATUSES } from '../../../core/services/room-service';
// Import Room, RoomService, and the new runtime constants

@Component({
  selector: 'app-room-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DynamicTableComponent, // Ensure DynamicTableComponent is imported
    ButtonModule,
  ],
  template: `
    <div class="space-y-6 p-4">
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
          [data]="rooms()"
          [columns]="columns"
          [showGlobalFilter]="true"
          [showActions]="true"
          (onEdit)="onEditRoom($event)"
          (onDelete)="onDeleteRoom($event)"
          [tableTitle]="'All Rooms'"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``],
  providers: [DialogService, MessageService] // Add DialogService and MessageService to providers
})
export class RoomListPageComponents implements OnInit {
  rooms = signal<Room[]>([]);
  ref: DynamicDialogRef | undefined; // Reference to the opened dialog

  columns: TableColumn[] = [
    { field: 'roomNumber', header: 'Room No.', sortable: true },
    { field: 'title', header: 'Title', sortable: true },
    { field: 'roomType', header: 'Type', sortable: true },
    { field: 'basePrice', header: 'Price/Night', sortable: true, type: 'numeric' },
    { field: 'capacity.adults', header: 'Adults', sortable: true, type: 'numeric' }, // Nested field
    { field: 'capacity.children', header: 'Children', sortable: true, type: 'numeric' }, // Nested field
    { field: 'roomStatus', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'AVAILABLE': { severity: 'success', text: 'Available' },
        'OCCUPIED': { severity: 'danger', text: 'Occupied' },
        'MAINTENANCE': { severity: 'warning', text: 'Maintenance' },
        'CLEANING': { severity: 'info', text: 'Cleaning' }, // Add CLEANING status
      }
    }},
    { field: 'isPublished', header: 'Published', sortable: true, type: 'boolean' } // Show published status
  ];

  private roomService = inject(RoomService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to load rooms.'});
      }
    });
  }

  onEditRoom(room: Room): void {
    this.ref = this.dialogService.open(CustomDynamiqueDialogComponent, {
      header: `Edit Room: ${room.roomNumber}`,
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closable: true,
      focusOnShow: true,
      closeOnEscape: true,
      duplicate: false,
      maximizable: true,
      data: {
        room: room, // Pass the entire room object
        options: { // Pass the new runtime constants
          roomTypes: ROOM_TYPES, // Use the constant array
          amenities: AMENITIES,    // Use the constant array
          roomStatuses: ROOM_STATUSES // Use the constant array
        }
      }
    });

    this.ref.onClose.subscribe((result) => {
      if (result && result.confirmed && result.roomUpdateRequest) {
        this.roomService.updateRoom(room.id, result.roomUpdateRequest, []).subscribe({ // No new image files in this update flow
          next: (updatedRoom) => {
            this.messageService.add({severity:'success', summary: 'Success', detail: `Room ${updatedRoom.roomNumber} updated successfully!`});
            this.loadRooms(); // Refresh the list
          },
          error: (error) => {
            console.error('Error updating room:', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to update room.'});
          }
        });
      }
    });
  }

  onDeleteRoom(room: Room): void {
    this.messageService.clear(); // Clear previous messages
    this.messageService.add({
      key: 'confirm', // Use a unique key for confirmation
      sticky: true,
      severity:'warn',
      summary:'Are you sure?',
      detail:`Do you want to delete Room ${room.roomNumber}?`,
      data: room.id // Pass room ID to the message for confirmation logic
    });
  }

  // Handle confirmation for deletion (from the Toast message)
  onConfirm(event: any): void {
    if (event.message.key === 'confirm' && event.message.data) {
      const roomIdToDelete = event.message.data;
      this.roomService.deleteRoom(roomIdToDelete).subscribe({
        next: () => {
          this.messageService.clear('confirm'); // Clear confirmation message
          this.messageService.add({severity:'success', summary: 'Deleted', detail: `Room deleted successfully!`});
          this.loadRooms(); // Refresh the list
        },
        error: (error) => {
          console.error('Error deleting room:', error);
          this.messageService.clear('confirm');
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete room.'});
        }
      });
    }
  }

  onReject(): void {
    this.messageService.clear('confirm'); // Clear confirmation message on reject
    this.messageService.add({severity:'info', summary:'Cancelled', detail:'Deletion cancelled'});
  }
}
