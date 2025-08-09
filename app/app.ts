import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  template: `
    <div class="card bg-red-500 flex justify-center">
      <p-button label="label"></p-button>
      <i class="pi pi-check"></i>
      <i class="pi pi-times"></i>
      <span class="pi pi-search"></span>
      <span class="pi pi-user"></span>
  </div>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected title = 'Frontend';
}
