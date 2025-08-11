import { Component, input, viewChild } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-menu-component',
  standalone: true,
  imports: [
    MenuModule,
    ButtonModule
  ],
  template: `
    <div class="flex justify-center gap-4 items-center">
      <p-menu #menuRef 
              [model]="items()" 
              [popup]="true" 
              [autoZIndex]="true" 
              appendTo="body" 
              showTransitionOptions="300ms ease-out" 
              hideTransitionOptions="300ms ease-in" 
      />
      
      <p-button (click)="toggleMenu($event)" 
                [icon]="buttonIcon()" 
                [class]="buttonClass()"
                [text]="true" 
                [rounded]="true"/>
    </div>
  `,
  styles: ``
})
export class MenuComponent {
  items = input<MenuItem[]>([]);

  buttonIcon = input<string>('pi pi-ellipsis-v');

  buttonClass = input<string>('');

  private menu = viewChild<Menu>('menuRef');

  toggleMenu(event: Event): void {
    this.menu()?.toggle(event);
  }
}