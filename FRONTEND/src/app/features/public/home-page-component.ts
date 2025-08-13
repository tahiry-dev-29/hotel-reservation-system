import { Component, computed, signal } from '@angular/core';
import { DynamicCardComponent } from '../../shared/components/dynamic-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchBarComponent, DynamicCardComponent],
  template: `
    <div class="space-y-12">
      <section class="flex justify-center pt-8 pb-4">
            <app-search-bar (search)="onSearch($event)" [progressspinner]="false" [height]="'h-20'" [width]="'w-120'" [customClass]="'rounded-full! shadow-lg'" [clearIconClass]="'text-[24px]!'"/>
      </section>

      <section class="w-full max-h-full h-screen bg-theme custome-border border-t! rounded-none! shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
  styles: [``],
})
export class HomePageComponent {
  private allItems = signal<any[]>([
    {
      id: 1,
      title: 'Suite Royale',
      content: 'Une suite luxueuse avec vue sur la mer.',
      imageUrl: '',
      category: 'suite',
      price: 450,
      inStock: true,
      onSale: false,
    },
    {
      id: 2,
      title: 'Chambre Double Confort',
      content: 'Parfaite pour les couples.',
      imageUrl: '',
      category: 'double',
      price: 220,
      inStock: true,
      onSale: true,
    },
    {
      id: 3,
      title: 'Chambre Simple Standard',
      content: 'Idéale pour les voyageurs solo.',
      imageUrl: '',
      category: 'single',
      price: 150,
      inStock: false,
      onSale: false,
    },
    {
      id: 4,
      title: 'Suite Familiale',
      content: 'Spacieuse et équipée pour toute la famille.',
      imageUrl: '',
      category: 'family',
      price: 350,
      inStock: true,
      onSale: true,
    },
    {
      id: 5,
      title: 'Chambre Double Éco',
      content: 'Le meilleur rapport qualité-prix.',
      imageUrl: '',
      category: 'double',
      price: 180,
      inStock: true,
      onSale: false,
    },
    {
      id: 6,
      title: 'Penthouse',
      content: 'Le luxe ultime au dernier étage.',
      imageUrl: '',
      category: 'suite',
      price: 700,
      inStock: true,
      onSale: false,
    },
  ]);

  searchTerm = signal<string>('');
  filters = signal<any>({ priceRange: [0, 700] });
  isLoading = signal<boolean>(false);

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

  onSearch(term: string) {
    this.isLoading.set(true);
    this.searchTerm.set(term);

    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  onFilterChange(filters: any) {
    this.filters.set(filters);
  }

}
