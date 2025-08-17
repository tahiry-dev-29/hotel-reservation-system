import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ButtonComponent } from "../../../shared/components/button-component";
// Room-specific imports
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Subscription } from 'rxjs';

import { RoomService, RoomCreateRequest, ROOM_TYPES, AMENITIES, ROOM_STATUSES, VIEW_TYPES, RoomType, ViewType, Amenity, RoomStatus } from '../../../core/services/room-service';
import { DynamicFileUploadComponent } from '../../../shared/components/dynamic-file-upload-component';
import { ToggleSwitchWithLabelComponent } from "../../../shared/components/toggle-switch-with-label-component";

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
    SelectModule,
    FloatLabelModule,
    MessageModule,
    DatePickerModule,
    DividerModule,
    ButtonComponent,
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
  templateUrl: './room-add-components.html',
  styles: [`
    /* Styles for fully rounded inputs (like InputText simple) */
    :host ::ng-deep .p-inputtext {
        border-radius: 9999px !important;
    }
    
    /* Styles for inputs that should NOT be fully rounded (Select, InputNumber, MultiSelect, DatePicker, Textarea) */
    :host ::ng-deep .p-dropdown .p-dropdown-label,
    :host ::ng-deep .p-inputnumber .p-inputnumber-input,
    :host ::ng-deep .p-multiselect .p-multiselect-label,
    :host ::ng-deep .p-datepicker .p-inputtext,
    :host ::ng-deep .p-inputtextarea {
      border-radius: 0.5rem !important;
      width: 100%;
    }

    /* Ensure float labels work with full width */
    :host ::ng-deep .p-floatlabel > .p-inputtext,
    :host ::ng-deep .p-floatlabel > .p-inputnumber,
    :host ::ng-deep .p-floatlabel > .p-dropdown,
    :host ::ng-deep .p-floatlabel > .p-datepicker,
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

    /* Styles for p-toast to ensure higher z-index (already there, confirmed) */
    :host ::ng-deep .p-toast {
      z-index: 1100 !important;
    }
  `],
  providers: [MessageService]
})
export class RoomAddComponents implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  loading = signal(false);
  selectedFiles: File[] = [];
  private subscriptions: Subscription = new Subscription();

  roomTypeOptions: SelectOption[] = ROOM_TYPES.map(type => ({ name: type, value: type }));
  amenityOptions: SelectOption[] = AMENITIES.map(amenity => ({ name: amenity, value: amenity }));
  roomStatusOptions: SelectOption[] = ROOM_STATUSES.map(status => ({ name: status, value: status }));
  viewTypeOptions: SelectOption[] = VIEW_TYPES.map(type => ({ name: type, value: type }));

  roomForm = this.fb.group({
    roomNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Z]{3,6}$/)]],
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.minLength(10), Validators.maxLength(500)]],
    location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    availableFrom: [null as Date | null, [Validators.required]],
    roomType: [null as string | null, Validators.required],
    adultsCapacity: [1, [Validators.required, Validators.min(1)]],
    childrenCapacity: [0, [Validators.min(0)]],
    sizeInSqMeters: [null as number | null, [Validators.min(10)]],
    floor: [null as number | null, [Validators.min(0)]],
    bedConfiguration: ['', Validators.required],
    viewType: [null as string | null, Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    basePrice: [null as number | null],
    weekendPrice: [null as number | null, [Validators.min(0)]],
    onSale: [false],
    salePrice: [null as number | null, Validators.min(0)],
    amenities: [[] as string[]],
    roomStatus: [null as string | null, Validators.required],
    inStock: [true],
    isPublished: [true],
    internalNotes: [''],
  });

  ngOnInit(): void {
    this.subscriptions.add(
      this.roomForm.get('onSale')?.valueChanges.subscribe(onSale => {
        const salePriceControl = this.roomForm.get('salePrice');
        if (onSale) {
          salePriceControl?.setValidators([Validators.required, Validators.min(0)]);
        } else {
          salePriceControl?.clearValidators();
          salePriceControl?.setValue(null);
        }
        salePriceControl?.updateValueAndValidity();
      })
    );

    this.subscriptions.add(
      this.roomForm.get('price')?.valueChanges.subscribe(price => {
        this.roomForm.get('basePrice')?.setValue(price);
      })
    );

    this.subscriptions.add(
      this.roomForm.get('inStock')?.valueChanges.subscribe(inStock => {
        this.roomForm.get('isPublished')?.setValue(inStock);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get f() {
    return this.roomForm.controls;
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  onFilesReady(files: File[]) {
    this.selectedFiles = files;
  }

  onSubmit() {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.messageService.add({ severity: 'info', summary: 'Creating Room', detail: 'Please wait...',closable: true });

    const formValue = this.roomForm.value;

    const roomCreateRequest: RoomCreateRequest = {
      roomNumber: formValue.roomNumber!,
      title: formValue.title!,
      description: formValue.description || '',
      roomType: formValue.roomType as RoomType,
      capacity: {
        adults: formValue.adultsCapacity!,
        children: formValue.childrenCapacity!,
      },
      sizeInSqMeters: formValue.sizeInSqMeters ?? undefined,
      floor: formValue.floor ?? undefined,
      bedConfiguration: formValue.bedConfiguration!,
      viewType: formValue.viewType as ViewType,
      basePrice: formValue.basePrice!,
      weekendPrice: formValue.weekendPrice ?? undefined,
      onSale: formValue.onSale!,
      salePrice: formValue.salePrice ?? undefined,
      amenities: formValue.amenities as Amenity[] || [],
      roomStatus: formValue.roomStatus as RoomStatus,
      isPublished: formValue.isPublished!,
      internalNotes: formValue.internalNotes || '',
    };

    this.roomService.createRoom(roomCreateRequest, this.selectedFiles).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.roomForm.reset();
        this.selectedFiles = [];
        this.router.navigate(['/admin/rooms/list']);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Room ${response.roomNumber} created successfully! 🎉`, closable: true });
      },
      error: (error) => {
        this.loading.set(false);
      }
    });
  }
}
