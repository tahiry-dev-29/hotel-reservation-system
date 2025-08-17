import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from "../../../shared/components/dynamic-table-component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker'; // Changed from primeng/calendar
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Room, RoomService } from '../../../core/services/room-service';

@Component({
  selector: 'app-public-room-list-page',
  standalone: true,
  imports: [
    ButtonModule,
    DynamicTableComponent,
    ReactiveFormsModule,
    DatePickerModule, // Changed module
    InputNumberModule,
    MessageModule,
    FloatLabelModule
  ],
  template: `
    <div class="space-y-6 p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold text-text-color">Public Room List</h1>
        <p-button label="View All Rooms" (click)="loadAllPublicRooms()" class="p-button-secondary" />
      </div>

      <form [formGroup]="filterForm" (ngSubmit)="onSearchAvailableRooms()" class="bg-theme custome-border grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4">
        <div class="flex flex-col">
          <p-floatlabel variant="in">
            <p-datePicker id="checkInDate" formControlName="checkInDate" dateFormat="yy-mm-dd" [showIcon]="true" inputId="checkInDate" class="w-full" />
            <label for="checkInDate">Check-in Date</label>
          </p-floatlabel>
          <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['checkInDate']) && f['checkInDate'].errors?.['required']) {
              <p-message severity="error" text="Check-in date is required" />
            }
          </div>
        </div>

        <div class="flex flex-col">
          <p-floatlabel variant="in">
            <p-datePicker id="checkOutDate" formControlName="checkOutDate" dateFormat="yy-mm-dd" [showIcon]="true" inputId="checkOutDate" class="w-full" />
            <label for="checkOutDate">Check-out Date</label>
          </p-floatlabel>
          <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['checkOutDate']) && f['checkOutDate'].errors?.['required']) {
              <p-message severity="error" text="Check-out date is required" />
            }
          </div>
        </div>

        <div class="flex flex-col">
          <p-floatlabel variant="in">
            <p-inputNumber id="numAdults" formControlName="numAdults" mode="decimal" [showButtons]="true" [min]="1" inputId="numAdults" class="w-full" />
            <label for="numAdults">Adults</label>
          </p-floatlabel>
          <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['numAdults']) && f['numAdults'].errors?.['required']) {
              <p-message severity="error" text="At least 1 adult is required" />
            }
            @if (isFieldInvalid(f['numAdults']) && f['numAdults'].errors?.['min']) {
              <p-message severity="error" text="Minimum 1 adult" />
            }
          </div>
        </div>

        <div class="flex flex-col">
          <p-floatlabel variant="in">
            <p-inputNumber id="numChildren" formControlName="numChildren" mode="decimal" [showButtons]="true" [min]="0" inputId="numChildren" class="w-full" />
            <label for="numChildren">Children (Optional)</label>
          </p-floatlabel>
          <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['numChildren']) && f['numChildren'].errors?.['min']) {
              <p-message severity="error" text="Children count cannot be negative" />
            }
          </div>
        </div>
        
        <div class="md:col-span-4 flex justify-end">
          @if (searchErrorMessage()) {
            <p-message severity="error" [text]="searchErrorMessage()" class="mr-4" />
          }
          <p-button label="Search Available Rooms" type="submit" [disabled]="filterForm.invalid" />
        </div>
      </form>

      <div class="rounded-md!">
        <app-dynamic-table
          [data]="rooms()"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onViewRoomDetails($event)"
          [tableTitle]="'Available Rooms List'"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-datePicker .p-inputtext,
    :host ::ng-deep .p-inputnumber .p-inputtext {
        width: 100%;
        border-radius: 9999px; /* Tailwind rounded-full */
    }
    :host ::ng-deep .p-floatlabel > .p-datePicker,
    :host ::ng-deep .p-floatlabel > .p-inputnumber {
        width: 100%;
    }
    :host ::ng-deep .p-datePicker .p-button {
      border-top-right-radius: 9999px;
      border-bottom-right-radius: 9999px;
    }
    :host ::ng-deep .p-inputnumber .p-button {
      border-radius: 9999px;
    }
  `]
})
export class PublicRoomListPageComponent implements OnInit {
  rooms = signal<Room[]>([]);
  searchErrorMessage = signal<string | undefined>(undefined); // Specific error message for the search form

  columns: TableColumn[] = [
    { field: 'roomNumber', header: 'Room No.', sortable: true },
    { field: 'title', header: 'Title', sortable: true },
    { field: 'roomType', header: 'Type', sortable: true }, 
    { field: 'basePrice', header: 'Price/Night', sortable: true, type: 'numeric' }, 
    { field: 'capacity.adults', header: 'Adults', sortable: true, type: 'numeric' }, // Nested field for capacity
    { field: 'capacity.children', header: 'Children', sortable: true, type: 'numeric' }, // Nested field for capacity
    { field: 'roomStatus', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'AVAILABLE': { severity: 'success', text: 'Available' },
        'OCCUPIED': { severity: 'danger', text: 'Occupied' },
        'MAINTENANCE': { severity: 'warning', text: 'Maintenance' },
      }
    }},
  ];

  private router = inject(Router);
  private roomService = inject(RoomService);
  private fb = inject(FormBuilder);

  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      checkInDate: [null, Validators.required],
      checkOutDate: [null, Validators.required],
      numAdults: [1, [Validators.required, Validators.min(1)]],
      numChildren: [0, Validators.min(0)]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.filterForm.controls;
  }
  
  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  ngOnInit(): void {
    // Load all public rooms initially for a broader view
    this.loadAllPublicRooms();
  }

  loadAllPublicRooms(): void {
    this.roomService.getPublicRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.searchErrorMessage.set(undefined); // Clear search specific error
      },
      error: (error) => {
        // Keep console.error for internal debugging
        console.error('Error loading all public rooms:', error);
        this.searchErrorMessage.set('Failed to load all rooms. Please try again later.');
        this.rooms.set([]); // Clear rooms on error to prevent displaying stale data
      }
    });
  }

  onSearchAvailableRooms(): void {
    this.searchErrorMessage.set(undefined); // Clear previous search errors

    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      this.searchErrorMessage.set('Please fill in all required fields for search.');
      return;
    }

    const { checkInDate, checkOutDate, numAdults, numChildren } = this.filterForm.value;

    // Dates from p-datePicker are Date objects or null. Ensure valid Date.
    if (!(checkInDate instanceof Date) || isNaN(checkInDate.getTime()) || 
        !(checkOutDate instanceof Date) || isNaN(checkOutDate.getTime())) {
      this.searchErrorMessage.set('Please select valid dates using the date picker.');
      return;
    }

    // Format dates to YYYY-MM-DD
    const formattedCheckInDate = this.formatDate(checkInDate);
    const formattedCheckOutDate = this.formatDate(checkOutDate);

    // Basic date validation: checkOutDate must be after checkInDate
    if (new Date(formattedCheckInDate) >= new Date(formattedCheckOutDate)) {
      this.searchErrorMessage.set('Check-out date must be after check-in date.');
      return;
    }


    this.roomService.getAvailableRooms(
      formattedCheckInDate,
      formattedCheckOutDate,
      numAdults,
      numChildren || 0 // Default to 0 if not provided
    ).subscribe({
      next: (data) => {
        this.rooms.set(data);
        if (data.length === 0) {
          this.searchErrorMessage.set('No rooms found for the selected criteria.');
        }
      },
      error: (error) => {
        // Keep console.error for internal debugging
        console.error('Error searching available rooms:', error);
        this.searchErrorMessage.set('Failed to search available rooms. Please ensure dates are valid and try again.');
        this.rooms.set([]); // Clear rooms on error
      }
    });
  }

  /**
   * Formats a Date object into a YYYY-MM-DD string.
   * @param date The Date object to format.
   * @returns A string in YYYY-MM-DD format.
   */
  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onViewRoomDetails(room: any) {
    this.router.navigate(['/room-details', room.id]);
  }
}