import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DashboardNavbarComponent} from "../features/dashboard/components/dashboard-navbar-component";
import {DesktopSidebarComponent} from "../features/dashboard/components/desktop-sidebar-component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    DesktopSidebarComponent,
    DashboardNavbarComponent,
  ],
  template: `
    <div class="flex h-screen overflow-hidden relative">
      <div class="absolute inset-0 z-0 matrix-container"></div>

      <div class="relative z-10 w-full h-full flex ml-4">
        <app-desktop-sidebar [(sidebarOpen)]="isSidebarOpen"/>

        <div class="flex-1 flex flex-col overflow-hidden">
          <app-dashboard-navbar (toggleSidebar)="toggleSidebar()"/>

          <main class="flex-1 overflow-x-hidden overflow-y-auto
                       bg-theme custome-border shadow-xl m-4 p-4 md:p-6">
            <router-outlet/>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
