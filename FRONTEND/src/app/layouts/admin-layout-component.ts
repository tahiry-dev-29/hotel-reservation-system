import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { DashboardNavbarComponent } from '../features/dashboard/components/dashboard-navbar-component';
import { DesktopSidebarComponent } from '../features/dashboard/components/desktop-sidebar-component';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    DesktopSidebarComponent,
    DashboardNavbarComponent,
  ],
  template: `
    <div class="relative h-screen overflow-auto">
      <div class="absolute inset-0 z-10 flex pl-3">
        <!-- Afficher la sidebar uniquement si hideLayoutElements est faux -->
        @if (!hideLayoutElements()) {
          <app-desktop-sidebar [(sidebarOpen)]="isSidebarOpen"/>
        }

        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Afficher la navbar uniquement si hideLayoutElements est faux -->
          @if (!hideLayoutElements()) {
            <app-dashboard-navbar (toggleSidebar)="toggleSidebar()"/>
          }

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
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = signal(true);
  hideLayoutElements = signal(false);
  private destroy$ = new Subject<void>();

  private router = inject(Router);

  ngOnInit(): void {
    this.checkUrlForLayoutVisibility(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.checkUrlForLayoutVisibility(event.urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(val => !val);
  }

  private checkUrlForLayoutVisibility(url: string): void {
    const isAuthPage = url.startsWith('/admin/login') || url.startsWith('/admin/register');
    this.hideLayoutElements.set(isAuthPage);
  }
}
