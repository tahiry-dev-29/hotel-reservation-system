// search-bar.component.ts
import { CommonModule } from '@angular/common';
import { Component, output, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Added this import

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule, // Added this module
  ],
  template: `
    <div class="flex justify-center w-full max-w-md mx-auto">
      <div class="relative w-full">
        <p-iconfield iconposition="left">
          <p-inputicon>
            @if (isLoading()) {
              <p-progress-spinner strokeWidth="4" fill="transparent" animationDuration=".9s" [style]="{ width: '1.25rem', height: '1.25rem'}" />
            } @else {
              <i class="pi pi-search text-lg text-gray-400"></i>
            }
          </p-inputicon>
          <input
            type="text"
            pInputText
            class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Rechercher..."
            [(ngModel)]="searchTerm"
          />
        </p-iconfield>
        @if (searchTerm()) {
          <div
            class="absolute inset-y-0 right-0 flex items-center pr-3"
            (click)="clearSearch()"
          >
            <i
              class="pi pi-times-circle text-lg text-gray-500 cursor-pointer"
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

  clearSearch() {
    this.searchTerm.set('');
    clearTimeout(this.debounceTimer);
    this.isLoading.set(false);
    this.search.emit('');
  }
}