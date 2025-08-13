import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: `
    <router-outlet />

  `,
  styles: `
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      box-sizing: border-box;
    }
  `
})
export class App {
}
