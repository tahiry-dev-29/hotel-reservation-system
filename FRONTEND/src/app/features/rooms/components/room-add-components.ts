// src/app/features/rooms/pages/room-add-components.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // Import Router
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; // CHANGED: AutoCompleteModule to SelectModule
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ButtonComponent } from "../../../shared/components/button-component";
// Room-specific imports
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api'; // For toasts
import { ToastModule } from 'primeng/toast'; // For p-toast
import { DatePickerModule } from 'primeng/datepicker'; // Use DatePickerModule as requested
import { IconFieldModule } from 'primeng/iconfield'; // For p-iconField
import { InputIconModule } from 'primeng/inputicon'; // For p-inputIcon

import { RoomService, RoomCreateRequest, ROOM_TYPES, AMENITIES, ROOM_STATUSES, VIEW_TYPES, RoomType, ViewType, Amenity, RoomStatus } from '../../../core/services/room-service'; // Import types
import { DynamicFileUploadComponent } from '../../../shared/components/dynamic-file-upload-component'; // Import the new file upload component
import { ToggleSwitchWithLabelComponent } from "../../../shared/components/toggle-switch-with-label-component"; // Import ToggleSwitchWithLabelComponent

// Interface for Select/MultiSelect options
interface SelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-room-add',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    SelectModule, // CHANGED: AutoCompleteModule to SelectModule
    FloatLabelModule,
    MessageModule,
    DatePickerModule, // Use DatePickerModule
    DividerModule,
    ButtonComponent,
    // Room specific imports
    InputNumberModule,
    CheckboxModule,
    MultiSelectModule,
    TextareaModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    ToggleSwitchWithLabelComponent,
    DynamicFileUploadComponent
  ],
  templateUrl: './room-add-components.html', // Point to the new HTML
  styles: [`
    /* Styles for fully rounded inputs (like InputText simple) */
    :host ::ng-deep .p-inputtext {
        border-radius: 9999px !important; 
    }
    
    /* Styles for inputs that should NOT be fully rounded (Select, InputNumber, MultiSelect, DatePicker, Textarea) */
    :host ::ng-deep .p-select .p-select-label, /* Changed selector for p-select */
    :host ::ng-deep .p-inputnumber .p-inputnumber-input,
    :host ::ng-deep .p-multiselect .p-multiselect-label,
    :host ::ng-deep .p-datepicker .p-inputtext, /* Target p-datepicker input specifically */
    :host ::ng-deep .p-inputtextarea {
      border-radius: 0.5rem !important; /* Small rounded corners for these fields */
      width: 100%; /* Ensure they take full width if needed */
    }

    /* Ensure float labels work with full width */
    :host ::ng-deep .p-floatlabel > .p-inputtext,
    :host ::ng-deep .p-floatlabel > .p-inputnumber,
    :host ::ng-deep .p-floatlabel > .p-select, /* Changed selector for p-select */
    :host ::ng-deep .p-floatlabel > .p-datepicker, /* Target p-datepicker here */
    :host ::ng-deep .p-floatlabel > .p-multiselect,
    :host ::ng-deep .p-floatlabel > .p-inputtextarea {
        width: 100%;
    }
    
    /* Specific adjustment for p-datepicker to match input width */
    :host ::ng-deep .p-datepicker .p-inputtext {
        width: 100%;
    }
    
    :host ::ng-deep .p-multiselect-panel .p-checkbox {
      margin-right: 0.5rem;
    }
  `],
  providers: [MessageService] // Provide MessageService for toasts
})
export class RoomAddComponents {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService); // Inject RoomService
  private messageService = inject(MessageService); // Inject MessageService
  private router = inject(Router); // Inject Router for navigation

  loading = signal(false);
  selectedFiles: File[] = []; // To hold files from DynamicFileUploadComponent

  // Options for dropdowns/multiselects using SelectOption interface for consistency with name/value
  roomTypeOptions: SelectOption[] = ROOM_TYPES.map(type => ({ name: type, value: type }));
  amenityOptions: SelectOption[] = AMENITIES.map(amenity => ({ name: amenity, value: amenity }));
  roomStatusOptions: SelectOption[] = ROOM_STATUSES.map(status => ({ name: status, value: status }));
  viewTypeOptions: SelectOption[] = VIEW_TYPES.map(type => ({ name: type, value: type }));

  // Removed filtered options for autocomplete as p-select doesn't use them
  // filteredRoomTypes: SelectOption[] = [];
  // filteredRoomStatuses: SelectOption[] = [];
  // filteredViewTypes: SelectOption[] = [];

  // Initialize form with ALL fields expected by RoomCreateRequest DTO
  roomForm = this.fb.group({
    roomNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Z]{3,6}$/)]], // e.g., "101", "A203"
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.minLength(10), Validators.maxLength(500)]],
    
    // New fields from your provided template that might not map directly to RoomCreateRequest
    location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]], // No direct mapping in RoomCreateRequest
    availableFrom: [null as Date | null, [Validators.required]], // No direct mapping in RoomCreateRequest

    // Now storing string values directly, using optionValue in HTML
    roomType: [null as string | null, Validators.required], // Stocke la string (value de SelectOption)
    adultsCapacity: [1, [Validators.required, Validators.min(1)]],
    childrenCapacity: [0, [Validators.min(0)]],
    sizeInSqMeters: [null as number | null, [Validators.min(10)]],
    floor: [null as number | null, [Validators.min(0)]],
    bedConfiguration: ['', Validators.required],
    viewType: [null as string | null, Validators.required], // Stocke la string (value de SelectOption)
    
    // 'price' from your template will map to 'basePrice'
    price: [null as number | null, [Validators.required, Validators.min(0.01)]], // Corresponds to basePrice
    basePrice: [null as number | null], // Placeholder, will be set from 'price'
    weekendPrice: [null as number | null, [Validators.min(0)]],
    
    onSale: [false],
    salePrice: [null as number | null, Validators.min(0)], // Validated based on onSale later
    
    amenities: [[] as string[]], // Stocke un tableau de strings (value de SelectOption)
    roomStatus: [null as string | null, Validators.required], // Stocke la string (value de SelectOption)
    
    // 'inStock' from your template will map to 'isPublished'
    inStock: [true], // From your template, assuming it maps to isPublished
    isPublished: [true], // Placeholder, will be set from 'inStock'
    
    internalNotes: [''],
  });

  constructor() {
    // Conditional validation for salePrice
    this.roomForm.get('onSale')?.valueChanges.subscribe(onSale => {
      const salePriceControl = this.roomForm.get('salePrice');
      if (onSale) {
        salePriceControl?.setValidators([Validators.required, Validators.min(0)]);
      } else {
        salePriceControl?.clearValidators();
        salePriceControl?.setValue(null); // Clear value if not on sale
      }
      salePriceControl?.updateValueAndValidity();
    });

    // Map 'price' to 'basePrice' and 'inStock' to 'isPublished' before submission
    this.roomForm.get('price')?.valueChanges.subscribe(price => {
      this.roomForm.get('basePrice')?.setValue(price);
    });
    this.roomForm.get('inStock')?.valueChanges.subscribe(inStock => {
      this.roomForm.get('isPublished')?.setValue(inStock);
    });
  }

  get f() {
    return this.roomForm.controls;
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }


  // --- File upload event handler ---
  onFilesReady(files: File[]) {
    this.selectedFiles = files;
    console.log('Selected files ready:', this.selectedFiles);
  }

  onSubmit() {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields correctly.' });
      return;
    }

    this.loading.set(true);
    this.messageService.add({ severity: 'info', summary: 'Creating Room', detail: 'Please wait...' });

    const formValue = this.roomForm.value;

    const roomCreateRequest: RoomCreateRequest = {
      roomNumber: formValue.roomNumber!,
      title: formValue.title!,
      description: formValue.description || '',
      // Les valeurs sont déjà des strings grâce à optionValue="value" dans le HTML
      roomType: formValue.roomType as RoomType,
      capacity: {
        adults: formValue.adultsCapacity!,
        children: formValue.childrenCapacity!,
      },
      sizeInSqMeters: formValue.sizeInSqMeters ?? undefined,
      floor: formValue.floor ?? undefined,
      bedConfiguration: formValue.bedConfiguration!,
      viewType: formValue.viewType as ViewType,
      basePrice: formValue.basePrice!, // This now comes from 'price' field
      weekendPrice: formValue.weekendPrice ?? undefined,
      onSale: formValue.onSale!,
      salePrice: formValue.salePrice ?? undefined,
      // Le tableau est déjà de strings
      amenities: formValue.amenities as Amenity[] || [],
      roomStatus: formValue.roomStatus as RoomStatus,
      isPublished: formValue.isPublished!, // This now comes from 'inStock' field
      internalNotes: formValue.internalNotes || '',
    };


    this.roomService.createRoom(roomCreateRequest, this.selectedFiles).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Room ${response.roomNumber} created successfully! 🎉` });
        this.roomForm.reset(); // Reset the form
        this.selectedFiles = []; // Clear selected files
        // Optionally navigate back to room list or show confirmation
        this.router.navigate(['/admin/rooms/list']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error creating room:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create room. ' + (error.error?.message || error.message) });
      }
    });
  }
}
