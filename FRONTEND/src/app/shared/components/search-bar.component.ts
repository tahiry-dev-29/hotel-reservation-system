import { Component, output, signal, effect, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
  ],
  selector: 'app-search-bar',
  template: `
    <div class="flex justify-center w-full max-w-md mx-auto" [class]="height()">
      <div class="relative w-full h-full">
        <p-iconfield iconposition="left" class="h-full">
          <!-- p-inputicon takes full height to allow vertical centering of its content -->
          <p-inputicon class="flex items-center justify-center">
            @if (isLoading()) {
              <p-progress-spinner strokeWidth="4" fill="transparent" animationDuration=".9s" [style]="{ width: '1.25rem', height: '1.25rem'}" />
            }
            @if (progressspinner()) {
              <!-- Using searchIconClass() for the search icon as it's semantically correct -->
              <i class="pi pi-search text-gray-400" [class]="searchIconClass()"></i>
            }
          </p-inputicon>
          <input
            type="text"
            pInputText
            [class]="getClasses()"
            placeholder="Rechercher..."
            [(ngModel)]="searchTerm"
          />
        </p-iconfield>
        @if (searchTerm()) {
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3"
            (click)="clearSearch()"
          >
            <!-- clearIconClass() is applied here for the clear button -->
            <i
              class="pi pi-times-circle text-gray-500 cursor-pointer"
              [class]="clearIconClass()"
            ></i>
          </div>
        }
      </div>
    </div>
  `,
})
export class SearchBarComponent {
  searchTerm = signal<string>('');
  search = output<string>();
  isLoading = signal<boolean>(false);

  width = input<string>('w-full');
  height = input<string>('h-10');
  customClass = input<string>('');
  progressspinner = input.required<boolean>();
  searchIconClass = input<string>('text-lg');
  clearIconClass = input<string>('text-lg');
  private debounceTimer: any;

  constructor() {
    effect(() => {
      const currentTerm = this.searchTerm();

      clearTimeout(this.debounceTimer);

      if (currentTerm) {
        this.isLoading.set(true);
        this.debounceTimer = setTimeout(() => {
          this.search.emit(currentTerm);
          this.isLoading.set(false);
        }, 300);
      } else {
        this.isLoading.set(false);
        this.search.emit('');
      }
    });
  }

  getClasses(): string {
    // Preserving the original input style with py-2 and height()
    const baseClasses = 'pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500';
    return `${baseClasses} ${this.width()} ${this.height()} ${this.customClass()}`;
  }

  clearSearch() {
    this.searchTerm.set('');
    clearTimeout(this.debounceTimer);
    this.isLoading.set(false);
    this.search.emit('');
  }
}
