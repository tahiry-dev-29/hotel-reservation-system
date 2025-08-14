import { Component, computed, signal } from '@angular/core';
import { DynamicCardComponent } from '../../shared/components/dynamic-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { ScrollHide } from '../../shared/directives/scroll-hide';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchBarComponent, DynamicCardComponent, ScrollHide], 
  template: `
    <div class="space-y-12 flex flex-col items-center gap-y-5">
      <section 
        appScrollHide #scrollHide="appScrollHide"
        class="fixed top-30 left-0 right-0 z-40
               flex items-center justify-center
               transform transition-transform duration-200 ease-in-out-4"
        [style.transform]="scrollHide.visible() ? 'translateY(0)' : 'translateY(-80px)'"
        [style.opacity]="scrollHide.visible() ? '1' : '0'"
        [style.pointer-events]="scrollHide.visible() ? 'auto' : 'none'"
      >
        <app-search-bar 
          (search)="onSearch($event)" 
          [progressspinner]="false" 
          [height]="'h-20'" 
          [width]="'w-120'" 
          [customClass]="'rounded-full! shadow-lg'" 
          [clearIconClass]="'text-[24px]!'"
        />
      </section>

      <!-- Ajout d'un padding-top au contenu principal pour compenser la barre fixe -->
      <!-- Le padding doit correspondre à la hauteur totale des éléments fixed (Header + Search Bar) -->
      <section class="w-full max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 mt-34">
        @for (item of filteredItems(); track item.id) {
        <app-dynamic-card
          [title]="item.title"
          [content]="item.content"
          [imageUrl]="item.imageUrl"
        >
        </app-dynamic-card>
        } @empty {
          <p class="col-span-full text-center py-12 text-surface-500 dark:text-surface-400">Aucun résultat trouvé.</p>
        }
      </section>
    </div>
  `,
  styles: [`
    /* Plus besoin de styles personnalisés ici, Tailwind gère tout */
  `],
})
export class HomePageComponent {
  // All items data, initialized as a signal for reactivity.
  private allItems = signal<any[]>([
    {
      id: 1,
      title: 'Suite Royale',
      content: 'Une suite luxueuse avec vue sur la mer.',
      imageUrl: 'https://placehold.co/600x400/AD907B/FFF?text=Suite+Royale',
      category: 'suite',
      price: 450,
      inStock: true,
      onSale: false,
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Chambre Double Confort',
      content: 'Parfaite pour les couples.',
      imageUrl: 'https://placehold.co/600x400/8B929B/FFF?text=Chambre+Double',
      category: 'double',
      price: 220,
      inStock: true,
      onSale: true,
      isFavorite: false,
    },
    {
      id: 3,
      title: 'Chambre Simple Standard',
      content: 'Idéale pour les voyageurs solo.',
      imageUrl: 'https://placehold.co/600x400/6A89CC/FFF?text=Chambre+Simple',
      category: 'single',
      price: 150,
      inStock: false,
      onSale: false,
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Suite Familiale',
      content: 'Spacieuse et équipée pour toute la famille.',
      imageUrl: 'https://placehold.co/600x400/AA7F8F/FFF?text=Suite+Familiale',
      category: 'family',
      price: 350,
      inStock: true,
      onSale: true,
      isFavorite: false,
    },
    {
      id: 5,
      title: 'Chambre Double Éco',
      content: 'Le meilleur rapport qualité-prix.',
      imageUrl: 'https://placehold.co/600x400/4CAF50/FFF?text=Chambre+Eco',
      category: 'double',
      price: 180,
      inStock: true,
      onSale: false,
      isFavorite: false,
    },
    {
      id: 6,
      title: 'Penthouse',
      content: 'Le luxe ultime au dernier étage.',
      imageUrl: 'https://placehold.co/600x400/FFD700/FFF?text=Penthouse',
      category: 'suite',
      price: 700,
      inStock: true,
      onSale: false,
      isFavorite: false,
    },
  ]);

  // Search term signal.
  searchTerm = signal<string>('');
  // Filters signal, initialized with a price range.
  filters = signal<any>({ priceRange: [0, 700] });
  // Loading status signal.
  isLoading = signal<boolean>(false);

  // Computed signal for filtered items based on search term and filters.
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const f = this.filters();

    return this.allItems().filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(term);

      const categoryMatch = f.category ? item.category === f.category : true;
      const priceMatch =
        item.price >= f.priceRange[0] && item.price <= f.priceRange[1];
      const stockMatch = f.inStock ? item.inStock === true : true;
      const saleMatch = f.onSale ? item.onSale === true : true;

      return (
        titleMatch && categoryMatch && priceMatch && stockMatch && saleMatch
      );
    });
  });

  /**
   * Handles the search event from the SearchBarComponent.
   * Updates the search term and sets loading status.
   * @param term The search term.
   */
  onSearch(term: string) {
    this.isLoading.set(true);
    this.searchTerm.set(term);

    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  /**
   * Handles filter changes.
   * @param filters The new filter values.
   */
  onFilterChange(filters: any) {
    this.filters.set(filters);
  }

}
