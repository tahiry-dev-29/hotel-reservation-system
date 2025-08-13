import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header-component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden relative">
      <div class="absolute inset-0 z-0 matrix-container"></div>

      <div class="relative z-10 w-full h-full flex">
        <div class="flex flex-col overflow-hidden">
          <app-header />
          <main
            class="flex-1 overflow-x-hidden overflow-y-auto mx-0 mt-23 p-0"
          >
            <router-outlet />
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [``],
})
export class MainLayoutComponent {}
