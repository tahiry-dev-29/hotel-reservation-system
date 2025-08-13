import { Component, output, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
    <header class="bg-theme custome-border rounded-full! dark:border-surface-700 p-2 flex justify-between items-center m-4 shadow-lg">
  <div class="flex items-center pl-2">
    <p-button icon="pi pi-bars"
              (onClick)="toggleSidebar.emit()"
              styleClass="md:hidden flex items-center justify-center h-10 w-10 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700/50"
              [text]="true" [rounded]="true"></p-button>
    <h1 class="text-xl ml-2">Admin Panel</h1>
  </div>

  <div class="flex items-center gap-2 pr-2">
    <a href="/home" target="_blank" title="Go to Home Page">
      <p-button icon="pi pi-home"
                [rounded]="true"
                [text]="true"
                styleClass="p-button-secondary h-10 w-10 flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700/50"></p-button>
    </a>
    
    <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" shape="circle" class="cursor-pointer hover:scale-105 transition-transform duration-200"></p-avatar>
    <app-menu-component 
      [items]="profileMenuItems()"
      [buttonIcon]="'pi pi-ellipsis-v'" 
      [buttonClass]="'p-button-text p-button-rounded text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700/50'"
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