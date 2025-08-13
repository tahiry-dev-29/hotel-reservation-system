import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ToolbarModule, ButtonModule],
  template: `
    <header class="top-0 left-0 p-2 sm:p-4">
      <nav
        class="max-w-screen-xl mx-auto bg-surface-50/60 dark:bg-surface-800/60 backdrop-blur-xl flex justify-between items-center shadow-2xl border border-surface-200/50 dark:border-surface-700/50 p-2 sm:p-3 rounded-full h-16 md:h-20"
      >
        <div class="flex items-center space-x-2 pl-2 md:pl-4">
          <a
            routerLink="/"
            class="text-xl font-bold hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-300 md:text-2xl"
            >HotelApp</a
          >
        </div>

        <div class="hidden md:flex flex-grow justify-center">
          <ul class="flex items-center space-x-2">
            @for (item of navItems; track item.label) {
            <li>
              <a
                [routerLink]="item.link"
                routerLinkActive="bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-md font-medium text-surface-600 dark:text-surface-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-150 py-2 px-3 rounded-full"
                >{{ item.label }}</a
              >
            </li>
            }
          </ul>
        </div>

        <div class="hidden md:flex items-center space-x-2 pr-2">
          <p-button
            label="Connexion"
            styleClass="p-button-text text-surface-700 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-surface-700/50"
            routerLink="/login"
          ></p-button>
          <p-button
            label="S'inscrire"
            styleClass="p-button-raised p-button-sm"
            routerLink="/register" [rounded]="true"
          ></p-button>
        </div>

        <div class="md:hidden pr-1">
          <p-button
            (click)="toggleMobileMenu()"
            icon="pi pi-bars"
            styleClass="p-button-text text-surface-700 dark:text-surface-300"
          >
          </p-button>
        </div>
      </nav>

      @if (isMobileMenuOpen()) {
      <div class="md:hidden absolute top-full left-0 w-full p-2 z-20">
        <div
          class="bg-surface-100/95 dark:bg-surface-800/95 backdrop-blur-md shadow-lg rounded-2xl p-4"
        >
          <nav class="flex flex-col items-center space-y-1">
            @for (item of navItems; track item.label) {
            <a
              [routerLink]="item.link"
              routerLinkActive="bg-surface-200 dark:bg-surface-700 text-primary-600 dark:text-primary-400"
              [routerLinkActiveOptions]="{ exact: true }"
              (click)="toggleMobileMenu()"
              class="py-3 w-full text-center text-md font-medium text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700"
              >{{ item.label }}</a
            >
            }
            <hr class="my-2 w-full border-surface-200/80 dark:border-surface-700/80" />
            <div class="w-full flex flex-col space-y-2">
               <p-button
                label="Connexion"
                styleClass="p-button-text w-full text-surface-700 dark:text-surface-300"
                routerLink="/login" (onClick)="toggleMobileMenu()"
              ></p-button>
              <p-button
                label="S'inscrire"
                styleClass="p-button-raised w-full"
                routerLink="/register" (onClick)="toggleMobileMenu()"
              ></p-button>
            </div>
          </nav>
        </div>
      </div>
      }
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  navItems = [
    { label: 'Home', link: '/home' },
    { label: 'Rooms', link: '/rooms' },
  ];

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((val) => !val);
  }
}
