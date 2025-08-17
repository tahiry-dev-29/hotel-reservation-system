import { Component, signal, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonComponent } from "./button-component";
import { AccordionModule } from 'primeng/accordion';
import { DynamicAccordionPanelComponent } from "./dynamic-accordion-panel-component";
// Import Room-related interfaces and types from the correct path
// We only import the types, not the runtime constants like ROOM_TYPES here,
// as the options come via config.data.options directly.
import { CurrencyPipe } from '@angular/common';
import { RoomType, ViewType, Amenity, RoomStatus, Room, RoomUpdateRequest } from '../../core/services/room-service';

@Component({
  selector: 'app-custome-dynamic-dialog',
  templateUrl: './custom-dynamic-dialog-component.html',
  styles: `
  :host ::ng-deep .p-inputnumber .p-inputtext {
    width: 100%;
  border-radius: 9999px; /* Tailwind rounded-full */
}
:host ::ng-deep .p-inputtextarea,
:host ::ng-deep .p-inputtext,
:host ::ng-deep .p-multiselect .p-multiselect-label,
:host ::ng-deep .p-autocomplete .p-inputtext {
  width: 100%;
  border-radius: 0.5rem; /* Tailwind rounded-md */
}
:host ::ng-deep .p-floatlabel > .p-inputtext,
:host ::ng-deep .p-floatlabel > .p-autocomplete,
:host ::ng-deep .p-floatlabel > .p-multiselect,
:host ::ng-deep .p-floatlabel > .p-inputnumber {
  width: 100%;
}
:host ::ng-deep .p-inputnumber .p-button-group {
  border-radius: 9999px; /* For rounded buttons on inputNumber */
}
:host ::ng-deep .p-multiselect {
  /* Ensure the overall multiselect component is also rounded */
  border-radius: 9999px;
}

  `,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    TextareaModule,
    ToastModule,
    MultiSelectModule,
    InputNumberModule,
    AutoCompleteModule,
    ButtonComponent,
    AccordionModule,
    DynamicAccordionPanelComponent,
    CurrencyPipe
],
  providers: [MessageService]
})
export class CustomDynamiqueDialogComponent implements OnInit {
  initialMessage = signal<string>('');
  processing = signal<boolean>(false);
  
  // Room specific signals for form fields
  _roomId = signal<string | null>(null);
  _roomNumber = signal<string>('');
  _title = signal<string>('');
  _description = signal<string>('');
  _roomType = signal<RoomType | undefined>(undefined);
  _adultsCapacity = signal<number | null>(null);
  _childrenCapacity = signal<number | null>(null);
  _sizeInSqMeters = signal<number | null>(null);
  _floor = signal<number | null>(null);
  _bedConfiguration = signal<string>('');
  _viewType = signal<ViewType | undefined>(undefined); // Changed type to ViewType directly
  _basePrice = signal<number | null>(null);
  _weekendPrice = signal<number | null>(null);
  _onSale = signal<boolean>(false);
  _salePrice = signal<number | null>(null);
  _amenities = signal<Amenity[]>([]); // For MultiSelect
  _roomStatus = signal<RoomStatus | undefined>(undefined); // For Dropdown
  _isPublished = signal<boolean>(false);
  _internalNotes = signal<string>('');

  // Options for dropdowns/multiselects - these will now receive string arrays
  // Note: These signals still use the TypeScript types (RoomType[], Amenity[], RoomStatus[])
  // which are compatible with string arrays.
  roomTypeOptions = signal<RoomType[]>([]);
  amenityOptions = signal<Amenity[]>([]);
  roomStatusOptions = signal<RoomStatus[]>([]);

  // Signals for filtered autocomplete suggestions
  _filteredRoomTypes = signal<RoomType[]>([]);
  _filteredRoomStatuses = signal<RoomStatus[]>([]);

  activePanel = signal<string[] | number>(['0']); 

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.config.data && this.config.data.room) {
      const room: Room = this.config.data.room;
      this._roomId.set(room.id);
      this._roomNumber.set(room.roomNumber);
      this._title.set(room.title);
      this._description.set(room.description);
      this._roomType.set(room.roomType);
      this._adultsCapacity.set(room.capacity?.adults || null);
      this._childrenCapacity.set(room.capacity?.children || null);
      this._sizeInSqMeters.set(room.sizeInSqMeters || null);
      this._floor.set(room.floor || null);
      this._bedConfiguration.set(room.bedConfiguration || '');
      this._viewType.set(room.viewType); // Assign directly from room
      this._basePrice.set(room.basePrice);
      this._weekendPrice.set(room.weekendPrice || null);
      this._onSale.set(room.onSale);
      this._salePrice.set(room.salePrice || null);
      this._amenities.set(room.amenities || []);
      this._roomStatus.set(room.roomStatus);
      this._isPublished.set(room.isPublished);
      this._internalNotes.set(room.internalNotes || '');
    }

    if (this.config.data && this.config.data.options) {
      // These are now directly assigned from the constants passed in data
      this.roomTypeOptions.set(this.config.data.options.roomTypes || []);
      this.amenityOptions.set(this.config.data.options.amenities || []);
      this.roomStatusOptions.set(this.config.data.options.roomStatuses || []);

      // Initialize filtered options with all options for immediate display
      this._filteredRoomTypes.set(this.roomTypeOptions());
      this._filteredRoomStatuses.set(this.roomStatusOptions());
    }
  }

  /**
   * Filters room types based on user input for p-autoComplete.
   * @param event The autocomplete event containing the query.
   */
  filterRoomTypes(event: { query: string }): void {
    const filtered: RoomType[] = [];
    const query = event.query.toLowerCase();

    for (const type of this.roomTypeOptions()) {
      if (type.toLowerCase().includes(query)) {
        filtered.push(type);
      }
    }
    this._filteredRoomTypes.set(filtered);
  }

  /**
   * Filters room statuses based on user input for p-autoComplete.
   * @param event The autocomplete event containing the query.
   */
  filterRoomStatuses(event: { query: string }): void {
    const filtered: RoomStatus[] = [];
    const query = event.query.toLowerCase();

    for (const status of this.roomStatusOptions()) {
      if (status.toLowerCase().includes(query)) {
        filtered.push(status);
      }
    }
    this._filteredRoomStatuses.set(filtered);
  }

  confirmAndSend() {
    this.processing.set(true);
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Saving changes...', life: 1500});

    const roomUpdateRequest: RoomUpdateRequest = {
      title: this._title(),
      description: this._description(),
      roomType: this._roomType(),
      capacity: {
        adults: this._adultsCapacity() || 0,
        children: this._childrenCapacity() || 0
      },
      // Use nullish coalescing operator (??) to ensure 'undefined' if signal is null
      sizeInSqMeters: this._sizeInSqMeters() ?? undefined,
      floor: this._floor() ?? undefined,
      bedConfiguration: this._bedConfiguration(),
      viewType: this._viewType() ?? undefined, // Assign directly without casting
      basePrice: this._basePrice() ?? undefined,
      weekendPrice: this._weekendPrice() ?? undefined,
      onSale: this._onSale(),
      salePrice: this._salePrice() ?? undefined,
      amenities: this._amenities(),
      roomStatus: this._roomStatus(),
      isPublished: this._isPublished(),
      internalNotes: this._internalNotes(),
    };

    setTimeout(() => {
      this.processing.set(false);
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Changes saved!', life: 1500});

      this.ref.close({
        confirmed: true,
        roomUpdateRequest: roomUpdateRequest
      });
    }, 1000);
  }

  cancel() {
    this.ref.close(null);
  }
}
