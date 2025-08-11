import { Component, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-dynamic-tiered-menu',
  imports: [
    TieredMenuModule,
    BadgeModule,
    RippleModule
  ],
  template: `
    <div class="card flex justify-center">
      <p-tieredMenu [model]="items()">
        <ng-template #item let-item let-hasSubmenu="hasSubmenu">
          <a pRipple class="flex items-center p-tieredmenu-item-link">
            <span [class]="item.icon" class="p-tieredmenu-item-icon"></span>
            <span class="ml-2">{{ item.label }}</span>
            @if (item.badge) {
              <p-badge class="ml-auto" [value]="item.badge" />
            }
            @if (item.shortcut) {
              <span class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">
                {{ item.shortcut }}
              </span>
            }
            @if (hasSubmenu) {
              <i class="pi pi-angle-right ml-auto"></i>
            }
          </a>
        </ng-template>
      </p-tieredMenu>
    </div>
  `,
  styles: [`
    .p-tieredmenu {
      width: 100%;
      min-width: 12rem;
    }
  `]
})
export class DynamicTieredMenuComponent {
  items = input.required<MenuItem[]>();
}
