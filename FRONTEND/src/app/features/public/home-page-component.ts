
import { Component, computed, signal } from '@angular/core';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { FilterComponent } from '../../shared/components/filter.component';
import { DynamicCardComponent } from '../../shared/components/dynamic-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    SearchBarComponent,
    FilterComponent,
    DynamicCardComponent
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-1">
        <app-filter (filterChange)="onFilterChange($event)"></app-filter>
      </div>
      <div class="col-span-3">
        <app-search-bar (search)="onSearch($event)"></app-search-bar>
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          @for (item of filteredItems(); track item.id) {
            <app-dynamic-card 
              [title]="item.title" 
              [content]="item.content"
              [imageUrl]="item.imageUrl">
            </app-dynamic-card>
          } @empty {
            <p>Aucun résultat trouvé.</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class HomePageComponent {
  // Sample Data
  private allItems = signal<any[]>([
    { id: 1, title: 'Suite Royale', content: 'Une suite luxueuse avec vue sur la mer.', imageUrl: 'https://picsum.photos/seed/suite/400/300', category: 'suite', price: 450, inStock: true, onSale: false },
    { id: 2, title: 'Chambre Double Confort', content: 'Parfaite pour les couples.', imageUrl: 'https://picsum.photos/seed/double/400/300', category: 'double', price: 220, inStock: true, onSale: true },
    { id: 3, title: 'Chambre Simple Standard', content: 'Idéale pour les voyageurs solo.', imageUrl: 'https://picsum.photos/seed/simple/400/300', category: 'single', price: 150, inStock: false, onSale: false },
    { id: 4, title: 'Suite Familiale', content: 'Spacieuse et équipée pour toute la famille.', imageUrl: 'https://picsum.photos/seed/family/400/300', category: 'family', price: 350, inStock: true, onSale: true },
    { id: 5, title: 'Chambre Double Éco', content: 'Le meilleur rapport qualité-prix.', imageUrl: 'https://picsum.photos/seed/eco/400/300', category: 'double', price: 180, inStock: true, onSale: false },
    { id: 6, title: 'Penthouse', content: 'Le luxe ultime au dernier étage.', imageUrl: 'https://picsum.photos/seed/penthouse/400/300', category: 'suite', price: 700, inStock: true, onSale: false },
  ]);

  // Signals for filtering
  searchTerm = signal<string>('');
  filters = signal<any>({ priceRange: [0, 700] });
  isLoading = signal<boolean>(false); // New signal for loading state

  // Computed signal for the filtered list
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const f = this.filters();

    return this.allItems().filter(item => {
      const titleMatch = item.title.toLowerCase().includes(term);
      
      const categoryMatch = f.category ? item.category === f.category : true;
      const priceMatch = item.price >= f.priceRange[0] && item.price <= f.priceRange[1];
      const stockMatch = f.inStock ? item.inStock === true : true;
      const saleMatch = f.onSale ? item.onSale === true : true;

      return titleMatch && categoryMatch && priceMatch && stockMatch && saleMatch;
    });
  });

  onSearch(term: string) {
    this.isLoading.set(true); // Set loading to true when search starts
    this.searchTerm.set(term);

    // Simulate an asynchronous operation (e.g., an API call)
    setTimeout(() => {
      this.isLoading.set(false); // Set loading to false after operation completes
    }, 1000); // Simulate 1 second loading time
  }

  onFilterChange(filters: any) {
    this.filters.set(filters);
  }
}
