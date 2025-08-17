// src/app/features/rooms/pages/room-list-page-component.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from '../../../shared/components/dynamic-table-component'; // Import TableColumn
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'; // For opening dialogs
import { CustomDynamiqueDialogComponent } from '../../../shared/components/custom-dynamic-dialog-component'; // The custom dialog component
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api'; // For toasts and confirmation
import { ToastModule } from 'primeng/toast'; // Import ToastModule for p-toast component
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Import ConfirmDialogModule for p-confirmdialog

// Import Room, RoomService, and the new runtime constants, including VIEW_TYPES
import { Room, RoomService, ROOM_TYPES, AMENITIES, ROOM_STATUSES, VIEW_TYPES } from '../../../core/services/room-service';
import { RoomImageGalleryDialogComponent } from '../../../shared/components/room-image-gallery-dialog-component'; // NEW IMPORT for image gallery

@Component({
  selector: 'app-room-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DynamicTableComponent, // Ensure DynamicTableComponent is imported
    ButtonModule,
    ToastModule, // Add ToastModule here
    ConfirmDialogModule // Add ConfirmDialogModule here
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
          (onCustomAction)="onShowImages($event)"
          [tableTitle]="'All Rooms'"
        ></app-dynamic-table>
      </div>
    </div>

    <!-- The Toast component to display success/error messages -->
    <p-toast></p-toast>
    <!-- The ConfirmDialog component to display delete confirmation -->
    <p-confirmDialog [baseZIndex]="10000"></p-confirmDialog> <!-- Set a high baseZIndex -->
  `,
  styles: [``],
  providers: [DialogService, MessageService, ConfirmationService] // Add ConfirmationService to providers
})
export class RoomListPageComponents implements OnInit {
  rooms = signal<Room[]>([]);
  ref: DynamicDialogRef | undefined; // Reference to the opened dialog

  columns: TableColumn[] = [
    { field: 'roomNumber', header: 'Room No.', sortable: true, visible: true },
    { field: 'title', header: 'Title', sortable: true, visible: true },
    { field: 'roomType', header: 'Type', sortable: true, visible: true },
    { field: 'basePrice', header: 'Price/Night', sortable: true, type: 'numeric', visible: true },
    { field: 'roomStatus', header: 'Status', type: 'status', sortable: true, visible: true, statusConfig: {
      map: {
        'AVAILABLE': { severity: 'success', text: 'Available' },
        'OCCUPIED': { severity: 'danger', text: 'Occupied' },
        'MAINTENANCE': { severity: 'warning', text: 'Maintenance' },
        'CLEANING': { severity: 'info', text: 'Cleaning' },
      }
    }},
    { field: 'isPublished', header: 'Published', sortable: true, type: 'boolean', visible: true },
    // Custom action column for images
    { field: 'imageUrls', header: 'Images', type: 'custom', sortable: false, visible: true, customAction: true, buttonIcon: 'pi pi-images' },
    // Columns that might be less frequently used, initially hidden
    { field: 'capacity.adults', header: 'Adults', sortable: true, type: 'numeric', visible: false },
    { field: 'capacity.children', header: 'Children', sortable: true, type: 'numeric', visible: false },
    { field: 'sizeInSqMeters', header: 'Size (m²)', sortable: true, type: 'numeric', visible: false },
    { field: 'floor', header: 'Floor', sortable: true, type: 'numeric', visible: false },
    { field: 'bedConfiguration', header: 'Bed Config', sortable: true, visible: false },
    { field: 'viewType', header: 'View', sortable: true, visible: false },
    { field: 'weekendPrice', header: 'Weekend Price', sortable: true, type: 'numeric', visible: false },
    { field: 'onSale', header: 'On Sale', sortable: true, type: 'boolean', visible: false },
    { field: 'salePrice', header: 'Sale Price', sortable: true, type: 'numeric', visible: false },
    { field: 'amenities', header: 'Amenities', sortable: true, visible: false, type: 'tags' }, // Display amenities as tags
    { field: 'internalNotes', header: 'Internal Notes', sortable: false, visible: false },
  ];

  private roomService = inject(RoomService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

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
      autoZIndex: true,
      draggable: true,
      resizable: true,
      data: {
        room: room, // Pass the entire room object
        options: { // Pass the new runtime constants
          roomTypes: ROOM_TYPES,
          amenities: AMENITIES,
          roomStatuses: ROOM_STATUSES,
          viewTypes: VIEW_TYPES
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
    this.confirmationService.confirm({
      message: `Do you want to delete Room ${room.roomNumber}?`,
      header: 'Confirmation de suppression',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger', // Style for accept button
      rejectButtonStyleClass: 'p-button-text p-button-secondary', // Style for reject button
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        // This is executed if the user clicks 'Yes'
        this.roomService.deleteRoom(room.id).subscribe({
          next: () => {
            this.messageService.add({severity:'success', summary: 'Deleted', detail: `Room deleted successfully!`});
            this.loadRooms(); // Refresh the list
          },
          error: (error) => {
            console.error('Error deleting room:', error);
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Failed to delete room.'});
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        // This is executed if the user clicks 'No' or closes the dialog
        switch (type) {
            case ConfirmEventType.REJECT:
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                break;
            case ConfirmEventType.CANCEL:
                this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                break;
        }
      }
    });
  }

  // NEW: Method to open the image gallery dialog
  onShowImages(room: Room): void {
    if (room.imageUrls && room.imageUrls.length > 0) {
      this.dialogService.open(RoomImageGalleryDialogComponent, {
        header: `Images for Room: ${room.roomNumber}`,
        width: '70%',
        contentStyle: { 'max-height': '80vh', overflow: 'auto' },
        baseZIndex: 11000, // Higher than edit dialog to ensure it's always on top
        closable: true, // Allow closing the dialog
        data: {
          imageUrls: room.imageUrls
        }
      });
    } else {
      this.messageService.add({severity:'info', summary: 'Info', detail: 'No images available for this room.'});
    }
  }
}
