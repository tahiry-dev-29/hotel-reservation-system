import { Component, output, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { MenuComponent } from '../../../shared/components/menu-component';


@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    AvatarModule,
    MenuComponent
],
  template: `
    <header class="bg-[#FFFFFF] dark:bg-transparent opacity-80 border border-gray-400/40 p-4 flex justify-between items-center rounded-full m-4">
      <div class="flex items-center">
        <p-button icon="pi pi-bars"
                  (onClick)="toggleSidebar.emit()"
                  styleClass="mr-4 md:hidden flex items-center justify-center h-10 w-10 text-[#6B7280] hover:bg-[#F3F4F6] dark:text-[#D1D5DB] dark:hover:bg-[#4B5563] rounded-full"
                  [text]="true" [rounded]="true"></p-button>
        <h1 class="text-3xl font-semibold text-[#374151] dark:text-[#F3F4F6]">Admin Panel</h1>
      </div>

      <div class="flex items-center gap-4">
        <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" class="cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"></p-avatar>

        <app-menu-component 
          [items]="profileMenuItems()"
          [buttonIcon]="'pi pi-ellipsis-v'" 
          [buttonClass]="'p-button-text p-button-rounded'"
        />
      </div>
    </header>
  `,
  styles: ``
})
export class DashboardNavbarComponent {
  toggleSidebar = output<void>();

  profileMenuItems = signal<MenuItem[]>([
    { label: 'Profile', icon: 'pi pi-user', command: () => this.navigateToProfile() },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.navigateToSettings() },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() }
  ]);

  constructor(private router: Router) {}

  onLogout(): void {
    console.log('User logging out...');
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    console.log('Navigating to profile...');
  }

  navigateToSettings(): void {
    console.log('Navigating to settings...');
  }
}