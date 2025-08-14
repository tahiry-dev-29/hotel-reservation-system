import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header-component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header
        class="fixed top-0 left-0 right-0 z-50 bg-none"
      />
      <main class="flex-1 mt-24">
        <router-outlet/>
      </main>
    </div>
  `,
  styles: [
    `
    `,
  ],
})
export class MainLayoutComponent {}
