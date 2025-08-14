import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast'; // Import ToastModule
import { MessageService } from 'primeng/api'; // Import MessageService

import { ButtonComponent } from "../../../shared/components/button-component";
import { ToggleSwitchWithLabelComponent } from "../../../shared/components/toggle-switch-with-label-component";


interface Category {
  name: string;
  code: string;
}

interface Tag {
  name: string;
  value: string;
}

@Component({
  selector: 'app-room-add',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    InputNumberModule,
    FloatLabelModule,
    MessageModule,
    DatePickerModule,
    ToggleSwitchModule,
    TextareaModule,
    MultiSelectModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    ButtonComponent,
    ToggleSwitchWithLabelComponent,
    ToastModule // Add ToastModule to imports
  ],
  providers: [MessageService], // Provide MessageService
  templateUrl: './room-add-components.html',
  styles: [`
    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .p-calendar .p-inputtext,
    :host ::ng-deep .p-multiselect .p-multiselect-label {
        border-radius: 9999px !important; 
    }
    :host ::ng-deep .p-autocomplete input.p-inputtext,
    :host ::ng-deep .p-inputnumber .p-inputnumber-input {
      border-radius: 0px !important; 
    }
    :host ::ng-deep .p-floatlabel > .p-inputtext,
    :host ::ng-deep .p-floatlabel > .p-inputnumber,
    :host ::ng-deep .p-floatlabel > .p-autocomplete,
    :host ::ng-deep .p-floatlabel > .p-calendar,
    :host ::ng-deep .p-floatlabel > .p-multiselect,
    :host ::ng-deep .p-floatlabel > .p-inputtextarea {
        width: 100%;
    }
    :host ::ng-deep .p-calendar .p-inputtext {
        width: 100%;
    }
    :host ::ng-deep .p-multiselect-panel .p-checkbox {
      margin-right: 0.5rem;
    }
  `]
})
export class RoomAddComponents {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService); // Inject MessageService

  loading = signal(false);

  roomForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    roomType: [null, [Validators.required]],
    price: [null, [Validators.required, Validators.min(0.01)]],
    availableFrom: [null, [Validators.required]],
    roomStatus: [null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    amenities: [[], [Validators.required, Validators.minLength(1)]],
    inStock: [true],
    onSale: [false]
  });

  roomTypes: Category[] = [
    { name: 'Single', code: 'single' },
    { name: 'Double', code: 'double' },
    { name: 'Suite', code: 'suite' },
    { name: 'Apartment', code: 'APT' },
    { name: 'House', code: 'HSE' },
    { name: 'Studio', code: 'STD' },
    { name: 'Villa', code: 'VLA' }
  ];
  filteredRoomTypes: any[] = [];

  roomStatuses: Tag[] = [
    { name: 'Available', value: 'available' },
    { name: 'Occupied', value: 'occupied' },
    { name: 'Maintenance', value: 'maintenance' }
  ];
  filteredRoomStatuses: any[] = [];

  availableAmenities: Tag[] = [
    { name: 'WiFi', value: 'wifi' },
    { name: 'Pool', value: 'pool' },
    { name: 'Kitchen', value: 'kitchen' },
    { name: 'Pet Friendly', value: 'pet_friendly' },
    { name: 'Free parking', value: 'free_parking' },
    { name: 'Air conditioning', value: 'air_conditioning' },
    { name: 'Heating', value: 'heating' },
    { name: 'TV', value: 'tv' },
    { name: 'Private Bathroom', value: 'private_bathroom' }
  ];

  get f() {
    return this.roomForm.controls;
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

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

  onSubmit() {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      console.log('Form is invalid:', this.roomForm.errors, this.roomForm.value);
      this.messageService.add({ severity: 'error', summary: 'Erreur de Validation', detail: 'Veuillez corriger les erreurs dans le formulaire.', life: 3000 });
      return;
    }
    
    this.loading.set(true);
    console.log('Room creation in progress...', this.roomForm.value);

    setTimeout(() => {
      this.loading.set(false);
      console.log('Room created successfully!', this.roomForm.value);
      this.messageService.add({ severity: 'success', summary: 'Succès ! 🎉', detail: 'La chambre a été ajoutée avec succès !', life: 3000 });
      // alert('Room created successfully!'); // Replaced by Toast
    }, 2000); 
  }
}
