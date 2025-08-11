import { Component, model, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
  badge?: number;
  expanded?: WritableSignal<boolean>;
}

@Component({
  selector: 'app-desktop-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  template: `
    <!-- Main sidebar with direct hexadecimal colors. -->
    <aside [class.w-64]="sidebarOpen()" [class.w-24]="!sidebarOpen()"
           class="transition-all duration-300 hidden md:flex flex-col bg-[#1F2937] text-[#E5E7EB] p-6 shadow-xl rounded-2xl my-4 h-[calc(100vh-2rem)]">

      <h2 class="text-2xl font-bold mb-8 text-[#60A5FA] text-center flex-shrink-0">
        @if(sidebarOpen()){
          Admin Dashboard
        } @else {
          <i class="pi pi-shield text-4xl text-[#60A5FA]"></i>
        }
      </h2>

      <nav class="flex-grow overflow-y-auto">
        <ul class="list-none p-0 m-0">
          @for (item of menuItems; track item.label) {
            <li class="mb-2">
              @if (!item.children) {
                <a [routerLink]="item.link" routerLinkActive="bg-[#2563EB] text-white"
                   class="flex items-center py-3 px-4 text-lg font-medium rounded-lg hover:bg-[#4B5563]/50 transition-colors duration-200 ease-in-out group">
                  <i class="{{item.icon}} mr-3 text-[#D1D5DB] group-hover:text-[#BFDBFE] transition-colors duration-200"></i>
                  @if(sidebarOpen()){
                    <span>{{item.label}}</span>
                  }
                </a>
              } @else {
                <div (click)="toggleDropdown(item)"
                     class="flex items-center py-3 px-4 text-lg font-medium rounded-lg hover:bg-[#4B5563]/50 transition-colors duration-200 ease-in-out cursor-pointer group">
                  <i class="{{item.icon}} mr-3 text-[#D1D5DB] group-hover:text-[#BFDBFE] transition-colors duration-200"></i>
                  @if(sidebarOpen()){
                    <span class="flex-grow">{{item.label}}</span>
                    @if (item.expanded) {
                      <i class="pi ml-auto text-[#D1D5DB]" [class]="item.expanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    }
                  }
                </div>
                @if (item.expanded) {
                  <ul class="list-none p-0 m-0 pl-4 mt-2 overflow-hidden" [@collapse]="item.expanded() ? 'expanded' : 'collapsed'">
                    @for (child of item.children; track child.label) {
                      <li class="mb-1">
                        <a [routerLink]="child.link" routerLinkActive="bg-[#3B82F6] text-white"
                           class="flex items-center py-2 px-3 text-base font-normal rounded-lg hover:bg-[#4B5563]/40 transition-colors duration-200 ease-in-out group">
                          <i class="{{child.icon}} mr-2 text-[#D1D5DB] group-hover:text-[#BFDBFE] transition-colors duration-200"></i>
                          @if(sidebarOpen()){
                            <span>{{child.label}}</span>
                          }
                        </a>
                      </li>
                    }
                  </ul>
                }
              }
            </li>
          }
        </ul>
      </nav>

      <div class="mt-auto text-center pt-8 border-t border-[#4B5563] flex-shrink-0">
        @if(sidebarOpen()){
          <p class="text-sm text-[#9CA3AF]">Powered by Tahiry's Angular 20 magic</p>
        }
      </div>
    </aside>
  `,
  styles: [`
    /* No major custom CSS styles required here thanks to Tailwind. */
  `],
  animations: [
    trigger('collapse', [
      state('expanded', style({ height: '*' })),
      state('collapsed', style({ height: '0px', overflow: 'hidden' })),
      transition('expanded <=> collapsed', animate('150ms ease-in-out'))
    ])
  ]
})
export class DesktopSidebarComponent {
  sidebarOpen = model(true);

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', link: '/admin/dashboard' },
    {
      label: 'Users', icon: 'pi pi-users',
      children: [
        { label: 'View All Users', icon: 'pi pi-list', link: '/admin/users/list' },
        { label: 'Add New User', icon: 'pi pi-user-plus', link: '/admin/users/new' },
        { label: 'User Reports', icon: 'pi pi-chart-bar', link: '/admin/users/reports' },
      ],
      expanded: signal(false)
    },
    {
      label: 'Rooms', icon: 'pi pi-building',
      children: [
        { label: 'View All Rooms', icon: 'pi pi-list', link: '/admin/rooms/list' },
        { label: 'Add New Room', icon: 'pi ' +
            'pi-plus', link: '/admin/rooms/new' },
        { label: 'Room Availability', icon: 'pi pi-calendar', link: '/admin/rooms/availability' },
      ],
      expanded: signal(false)
    },
    {
      label: 'Customers', icon: 'pi pi-user-plus',
      children: [
        { label: 'View All Customers', icon: 'pi pi-list', link: '/admin/customers/list' },
        { label: 'Add New Customer', icon: 'pi ' +
            'pi-plus', link: '/admin/customers/new' },
        { label: 'Customer Segmentation', icon: 'pi pi-users', link: '/admin/customers/segmentation' },
      ],
      expanded: signal(false)
    },
    {
      label: 'Employee', icon: 'pi pi-id-card',
      children: [
        { label: 'View All Employee', icon: 'pi pi-briefcase', link: '/admin/employee/list' },
        { label: 'Add New Employee', icon: 'pi ' +
            'pi-plus', link: '/admin/employee/new' }
      ],
      expanded: signal(false)
    },
    {
      label: 'Checkout', icon: 'pi pi-shopping-cart',
      children: [
        { label: 'View Checkouts', icon: 'pi pi-list', link: '/admin/checkout/list' },
        { label: 'New Checkout', icon: 'pi ' +
            'pi-plus', link: '/admin/checkout/new' },
        { label: 'Payment History', icon: 'pi pi-history', link: '/admin/checkout/history' },
      ],
      expanded: signal(false)
    },
    { label: 'Settings', icon: 'pi pi-cog', link: '/admin/settings' },
  ];

  // selectedTheme model and themeOptions array removed
  // themeOptions: SelectOption[] removed

  toggleDropdown(item: MenuItem): void {
    if (item.expanded) {
      this.menuItems.forEach(menuItem => {
        if (menuItem.expanded && menuItem !== item) {
          menuItem.expanded.set(false);
        }
      });
      item.expanded.update(val => !val);
    }
  }
}
