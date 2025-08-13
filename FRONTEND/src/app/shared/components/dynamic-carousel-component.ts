import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-dynamic-carousel',
  imports: [Carousel, ButtonModule],
  template: `
    <div class="card">
      
      @if (products()) {
          <p-carousel [value]="products()" [numVisible]="6">
        <ng-template let-product #item>
          <div
            class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4"
          >
            <div class="mb-4">
              <div class="relative mx-auto">
                <img
                  src="{{ product.imageUrl }}"
                  [alt]="product.title"
                  class="w-full rounded-border"
                />
                <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product.inventoryStatus)" class="absolute dark:!bg-surface-900" [class]="{ 'left.px': 5, 'top.px': 5 }" /> -->
              </div>
            </div>
            <div class="mb-4 font-medium">{{ product.name }}</div>
            <div class="flex justify-between items-center">
              <div class="mt-0 font-semibold text-xl">
                {{ '$' + product.content }}
              </div>
              <span>
                <p-button
                  icon="pi pi-heart"
                  severity="secondary"
                  [outlined]="true"
                />
                <p-button icon="pi pi-shopping-cart" styleClass="ml-2" />
              </span>
            </div>
          </div>
        </ng-template>
      </p-carousel>
      }
    </div>
  `,
  styles: ``,
})
export class DynamicCarouselComponent {
  products = input<any>();
}
