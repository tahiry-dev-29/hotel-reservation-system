import { Component, signal, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea'; // Updated import from InputTextareaModuleCalendarModule
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { CurrencyPipe } from '@angular/common';

interface Product {
  id: number;
  product: string;
  price: number;
}

interface Category {
  name: string;
  code: string;
}

interface Tag {
  name: string;
  value: string;
}

interface FormData {
  userName: string;
  userEmail: string;
  subscribed: boolean;
  selectedCategory: Category | undefined;
  startDate: Date | null;
  description: string;
  tags: Tag[];
}

@Component({
  selector: 'app-custome-dynamic-dialog',
  templateUrl: './custom-dynamic-dialog-component.html',
  styles : ``,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    TableModule,
    AutoCompleteModule,
    CheckboxModule,
    TextareaModule,
    ToastModule,
    MultiSelectModule,
    DatePickerModule,
    CurrencyPipe
  ],
  providers: [MessageService]
})
export class CustomDynamiqueDialogComponent implements OnInit {
  initialMessage = signal<string>('');
  processing = signal<boolean>(false);

  _userName = signal<string>('');
  _userEmail = signal<string>('');
  _isSubscribed = signal<boolean>(false);
  _selectedCategory = signal<Category | undefined>(undefined);
  _startDate = signal<Date | null>(null);
  _description = signal<string>('');
  _tags = signal<Tag[]>([]);
  _availableTags = signal<Tag[]>([]);
  _categories = signal<Category[]>([]);
  _filteredCategories = signal<Category[]>([]);

  responseMessage = signal<string>('');

  products = signal<Product[]>([
    { id: 101, product: 'Gaming Keyboard', price: 99.99 },
    { id: 102, product: 'Wireless Mouse', price: 49.99 },
    { id: 103, product: 'USB-C Hub', price: 35.00 }
  ]);

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.config.data) {
      this.initialMessage.set(this.config.data.initialMessage || '');

      if (this.config.data.formData) {
        this._userName.set(this.config.data.formData.userName || '');
        this._userEmail.set(this.config.data.formData.userEmail || '');
        this._isSubscribed.set(this.config.data.formData.subscribed || false);
        this._selectedCategory.set(this.config.data.formData.selectedCategory || undefined);
        this._startDate.set(this.config.data.formData.startDate ? new Date(this.config.data.formData.startDate) : null);
        this._description.set(this.config.data.formData.description || '');
        this._tags.set(this.config.data.formData.tags || []);
      }
      if (this.config.data.categories) {
        this._categories.set(this.config.data.categories);
      }
      if (this.config.data.availableTags) {
        this._availableTags.set(this.config.data.availableTags);
      }
    }
  }

  filterCategories(event: { query: string }) {
    const filtered: Category[] = [];
    const query = event.query.toLowerCase();

    for (const category of this._categories()) {
      if (category.name.toLowerCase().includes(query)) {
        filtered.push(category);
      }
    }
    this._filteredCategories.set(filtered);
  }

  confirmAndSend() {
    this.processing.set(true);
    this.messageService.add({severity:'info', summary: 'Processing', detail: 'Saving changes...', life: 1500});

    setTimeout(() => {
      this.processing.set(false);
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Changes saved!', life: 1500});

      this.ref.close({
        message: this.responseMessage() || 'Details updated successfully.',
        confirmed: true,
        formData: {
          userName: this._userName(),
          userEmail: this._userEmail(),
          subscribed: this._isSubscribed(),
          selectedCategory: this._selectedCategory(),
          startDate: this._startDate(),
          description: this._description(),
          tags: this._tags()
        }
      });
    }, 2000);
  }

  cancel() {
    this.ref.close(null);
  }
}
