import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    ToolbarModule,
    ButtonModule
  ],
  template: `
    <nav class="relative max-w-screen-xl mx-auto">
  <div class="bg-theme custome-border flex justify-between items-center rounded-full! m-4 p-2 shadow-lg">
    <div class="flex items-center space-x-4 pl-2">
      <a routerLink="/" class="text-2xl font-bold hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300">HotelApp</a>
    </div>
    
    <div class="hidden md:flex flex-grow justify-center">
      <ul class="flex items-center space-x-2">
        @for (item of navItems; track item.label) {
          <li>
            <a [routerLink]="item.link" 
               routerLinkActive="bg-surface-200/90 dark:bg-surface-700 text-green-600"
               [routerLinkActiveOptions]="{exact: true}" 
               class="text-md font-medium dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-150 py-2 px-4 rounded-full">{{ item.label }}</a>
          </li>
        }
      </ul>
    </div>

    <div class="hidden md:flex items-center space-x-2 pr-2">
      <p-button label="Connexion" styleClass="p-button-text text-surface-700 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-surface-700/50" routerLink="/login"></p-button>
      <p-button label="S'inscrire" styleClass="p-button-raised p-button-sm bg-primary-500 text-white hover:bg-primary-600" routerLink="/register"></p-button>
    </div>

    <div class="md:hidden pr-2">
      <button (click)="toggleMobileMenu()" class="p-2 rounded-full text-surface-700 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-surface-700/50">
        <i class="pi pi-bars text-xl"></i>
      </button>
    </div>
  </div>

  @if (isMobileMenuOpen()) {
    <div class="md:hidden absolute top-full left-0 w-full p-4">
       <div class="bg-surface-100/90 dark:bg-surface-800/90 backdrop-blur-md shadow-lg rounded-2xl p-4">
        <nav class="flex flex-col items-center">
          @for (item of navItems; track item.label) {
            <a [routerLink]="item.link" 
               routerLinkActive="bg-surface-200 dark:bg-surface-700 text-primary-600 dark:text-primary-400" 
               [routerLinkActiveOptions]="{exact: true}" 
               (click)="toggleMobileMenu()" 
               class="py-2 w-full text-center text-md font-medium text-surface-700 dark:text-surface-300 rounded-md hover:bg-surface-200 dark:hover:bg-surface-700">{{ item.label }}</a>
          }
          <hr class="my-2 w-full border-surface-200/20">
          <p-button label="Connexion" styleClass="p-button-text w-full" routerLink="/login" (click)="toggleMobileMenu()"></p-button>
          <p-button label="S'inscrire" styleClass="p-button-raised w-full mt-2" routerLink="/register" (click)="toggleMobileMenu()"></p-button>
        </nav>
      </div>
    </div>
  }
</nav>
  `,
  styles: []
})
export class HeaderComponent {
  navItems = [
    { label: 'Home', link: '/home' },
    { label: 'Rooms', link: '/rooms' },
  ];

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }
}
