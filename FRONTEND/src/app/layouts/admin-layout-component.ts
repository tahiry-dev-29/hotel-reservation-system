// src/app/layouts/admin-layout-component.ts

import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DashboardNavbarComponent} from "../features/dashboard/components/dashboard-navbar-component";
import {DesktopSidebarComponent} from "../features/dashboard/components/desktop-sidebar-component";

// Composants de Layout et de Features
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DesktopSidebarComponent,
    DashboardNavbarComponent,
  ],
  template: `
    <!-- Commentaire professionnel: Conteneur principal avec une couleur de fond globale (hexadécimale). -->
    <div class="flex h-screen bg-[#F9FAFB] dark:bg-[#111827] overflow-hidden">

      <!-- Commentaire professionnel: Sidebar unique gérée par DesktopSidebarComponent. -->
      <app-desktop-sidebar [(sidebarOpen)]="isSidebarOpen"/>

      <!-- Zone de contenu principale -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Commentaire professionnel: Composant de la Navbar du Dashboard. -->
        <app-dashboard-navbar (toggleSidebar)="toggleSidebar()"/>

        <!-- Commentaire professionnel: Zone de contenu principale avec flou et bordures (couleurs hexadécimales). -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto
                     bg-white/80 dark:bg-[#374151]/80
                     backdrop-blur-md
                     border border-[#E5E7EB] dark:border-[#4B5563]
                     rounded-lg shadow-xl m-4 p-4 md:p-6">
          <router-outlet/>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Commentaire professionnel: Styles pour assurer que le layout prend toute la hauteur. */
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
    }
  `]
})
export class AdminLayoutComponent {
  isSidebarOpen = signal(true);

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }
}
