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

      <div class="relative z-10 w-full h-full flex flex-col">
        <app-header></app-header>
        <main class="flex-1 p-4">
          <router-outlet/>
        </main>
      </div>
    </div>
  `,
  styles: [``]
})
export class MainLayoutComponent {}
