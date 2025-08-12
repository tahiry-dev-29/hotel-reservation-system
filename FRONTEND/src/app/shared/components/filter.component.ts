
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    FormsModule,
    AutoCompleteModule,
    CheckboxModule,
    SliderModule,
    ButtonModule
  ],
  template: `
    <div class="filter-container p-4 border-round-sm">
      <h4>Filtres</h4>
      
      <!-- Filtre par catégorie -->
      <div class="p-field mb-3">
        <label for="category">Catégorie</label>
        <p-autoComplete 
          id="category"
          [(ngModel)]="filters.category"
          [suggestions]="categorySuggestions"
          (completeMethod)="searchCategory($event)"
          field="name"
          placeholder="Toutes"
          [forceSelection]="true"
          (onChange)="applyFilters()">
        </p-autoComplete>
      </div>

      <!-- Filtre par prix -->
      <div class="p-field mb-3">
        <label>Gamme de prix</label>
        <p-slider [(ngModel)]="filters.priceRange" [range]="true" [min]="0" [max]="500" (onSlideEnd)="applyFilters()"></p-slider>
        <div class="flex justify-content-between mt-2">
            <span>{{ filters.priceRange[0] }} €</span>
            <span>{{ filters.priceRange[1] }} €</span>
        </div>
      </div>

      <!-- Filtres booléens -->
      <div class="p-field-checkbox mb-3">
        <p-checkbox [(ngModel)]="filters.inStock" [binary]="true" inputId="inStock" (onChange)="applyFilters()"></p-checkbox>
        <label for="inStock" class="ml-2">En stock uniquement</label>
      </div>

      <div class="p-field-checkbox mb-3">
        <p-checkbox [(ngModel)]="filters.onSale" [binary]="true" inputId="onSale" (onChange)="applyFilters()"></p-checkbox>
        <label for="onSale" class="ml-2">En promotion</label>
      </div>

      <p-button label="Réinitialiser" icon="pi pi-refresh" styleClass="p-button-sm p-button-secondary" (onClick)="resetFilters()"></p-button>
    </div>
  `,
  styles: [`
    .filter-container {
        background-color: var(--surface-card);
        border: 1px solid var(--surface-border);
    }
  `]
})
export class FilterComponent {
  filterChange = output<any>();

  // Données d'exemple pour les filtres
  allCategories = [
    { name: 'Chambre Simple', code: 'single' },
    { name: 'Chambre Double', code: 'double' },
    { name: 'Suite', code: 'suite' },
    { name: 'Familiale', code: 'family' }
  ];

  categorySuggestions: any[] = [];

  filters = this.getDefaultFilters();

  private getDefaultFilters() {
    return {
      category: null,
      priceRange: [0, 500],
      inStock: false,
      onSale: false
    };
  }

  searchCategory(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.categorySuggestions = this.allCategories.filter(cat => 
      cat.name.toLowerCase().includes(query)
    );
  }

  applyFilters() {
    // When a category object is selected, we emit its code
    const emitFilters = {
      ...this.filters,
      category: this.filters.category ? (this.filters.category as any).code : null
    };
    this.filterChange.emit(emitFilters);
  }

  resetFilters() {
    this.filters = this.getDefaultFilters();
    this.applyFilters();
  }
}
