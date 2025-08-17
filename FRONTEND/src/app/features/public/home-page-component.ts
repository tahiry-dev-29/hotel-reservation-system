import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { DynamicCardComponent } from '../../shared/components/dynamic-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { ScrollHide } from '../../shared/directives/scroll-hide';
import { Room, RoomService } from '../../core/services/room-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchBarComponent, DynamicCardComponent, ScrollHide],
  template: `
    <div class="space-y-12 flex flex-col items-center gap-y-5">
      <section
        appScrollHide #scrollHide="appScrollHide"
        class="fixed top-30 left-0 right-0 z-40
               flex items-center justify-center w-full
               transform transition-transform duration-200 ease-in-out-4"
        [style.transform]="scrollHide.visible() ? 'translateY(0)' : 'translateY(-80px)'"
        [style.opacity]="scrollHide.visible() ? '1' : '0'"
        [style.pointer-events]="scrollHide.visible() ? 'auto' : 'none'"
      >
        <app-search-bar
          (search)="onSearch($event)"
          [progressspinner]="false"
          [customClass]="'rounded-full! h-20 min-w-full! shadow-lg'"
          [clearIconClass]="'text-[24px]!'"
          class="w-full px-5"
        />
      </section>

      <!-- Adding padding-top to main content to compensate for the fixed bar -->
      <!-- Padding should match the total height of fixed elements (Header + Search Bar) -->
      <section class="w-full max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 mt-34">
        @for (item of filteredItems(); track item.id) {
          <app-dynamic-card
            [title]="item.title"
            [content]="item.description"
            [imageUrl]="getImageUrl(item.imageUrls)"
            [price]="item.basePrice"
            [roomType]="item.roomType"
            (click)="onCardClick(item.id)"
            class="cursor-pointer"
          >
          </app-dynamic-card>
        } @empty {
          <p class="col-span-full text-center py-12 text-surface-500 dark:text-surface-400">Aucun résultat trouvé.</p>
        }
      </section>
    </div>
  `,
  styles: [`
    /* No need for custom styles here, Tailwind handles everything */
  `],
})
export class HomePageComponent {
  // Inject Router for programmatic navigation
  private router = inject(Router);
  private roomService = inject(RoomService);

  // All items data, initialized as a signal for reactivity.
  private allItems = toSignal(this.roomService.getPublicRooms(), { initialValue: [] as Room[] });


  // Search term signal.
  searchTerm = signal<string>('');
  // Filters signal, initialized with a price range.
  filters = signal<any>({ priceRange: [0, 1000] });
  // Loading status signal.
  isLoading = signal<boolean>(false);

  // Computed signal for filtered items based on search term and filters.
  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const f = this.filters();

    return this.allItems().filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(term);
      const categoryMatch = f.category ? item.roomType === f.category : true;
      const priceMatch =
        item.basePrice >= f.priceRange[0] && item.basePrice <= f.priceRange[1];
      const stockMatch = f.inStock ? item.roomStatus === 'AVAILABLE' : true;
      const saleMatch = f.onSale ? item.onSale === true : true;

      return (
        titleMatch && categoryMatch && priceMatch && stockMatch && saleMatch
      );
    });
  });

  getImageUrl(imageUrls: string[]): string {
    if (imageUrls && imageUrls.length > 0) {
      return `${environment.fileUrl}/${imageUrls[0]}`;
    }
    return 'https://placehold.co/600x400/AD907B/FFF?text=No+Image';
  }

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

  /**
   * Handles card click event and navigates to the room detail page.
   * @param itemId The ID of the clicked item.
   */
  onCardClick(itemId: string) {
    this.router.navigate(['/room-details', itemId]);
  }
}
