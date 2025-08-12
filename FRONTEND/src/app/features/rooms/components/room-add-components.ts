import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-add',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    InputNumberModule
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Add New Room</h2>
        <a routerLink="../list">
          <p-button label="Back to List" icon="pi pi-arrow-left" styleClass="p-button-text"></p-button>
        </a>
      </div>

      <!-- Add Room Form -->
      <div class="rounded-md!">
        <form class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Room Number -->
            <div class="flex flex-col gap-2">
              <label for="roomNumber" class="font-medium text-text-color-secondary">Room Number</label>
              <input pInputText id="roomNumber" name="roomNumber" required />
            </div>

            <!-- Room Type -->
            <div class="flex flex-col gap-2">
              <label for="roomType" class="font-medium text-text-color-secondary">Room Type</label>
              <p-autoComplete [(ngModel)]="selectedRoomType" [suggestions]="filteredRoomTypes" (completeMethod)="searchRoomTypes($event)" name="roomType" [showClear]="true" placeholder="Select a Type"></p-autoComplete>
            </div>

            <!-- Price per Night -->
            <div class="flex flex-col gap-2">
              <label for="price" class="font-medium text-text-color-secondary">Price per Night</label>
              <p-inputNumber inputId="price" [(ngModel)]="price" name="price" mode="currency" currency="USD" locale="en-US"></p-inputNumber>
            </div>

            <!-- Status -->
            <div class="flex flex-col gap-2">
              <label for="status" class="font-medium text-text-color-secondary">Status</label>
              <p-autoComplete [(ngModel)]="selectedRoomStatus" [suggestions]="filteredRoomStatuses" (completeMethod)="searchRoomStatuses($event)" name="status" [showClear]="true" placeholder="Select a Status"></p-autoComplete>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-4 mt-8">
            <p-button label="Cancel" styleClass="p-button-text" routerLink="../list"></p-button>
            <p-button label="Save Room" icon="pi pi-check" type="submit"></p-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [``]
})
export class RoomAddComponents {
  roomTypes = [
    { name: 'Single', value: 'single' },
    { name: 'Double', value: 'double' },
    { name: 'Suite', value: 'suite' }
  ];
  filteredRoomTypes: any[] = [];

  roomStatuses = [
    { name: 'Available', value: 'available' },
    { name: 'Occupied', value: 'occupied' },
    { name: 'Maintenance', value: 'maintenance' }
  ];
  filteredRoomStatuses: any[] = [];

  selectedRoomType: any;
  selectedRoomStatus: any;
  price: number | undefined;

  searchRoomTypes(event: any) {
    this.filteredRoomTypes = this.roomTypes.filter(type =>
      type.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  searchRoomStatuses(event: any) {
    this.filteredRoomStatuses = this.roomStatuses.filter(status =>
      status.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }
}
