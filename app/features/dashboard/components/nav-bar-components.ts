import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-nav-bar-components',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar color="primary" class="flex justify-between items-center">
      <button mat-icon-button (click)="toggleSidenav.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="flex-grow">Mon Tableau de Bord</span>
      <div class="flex items-center">
        <button mat-icon-button>
          <mat-icon>person</mat-icon>
        </button>
        <button mat-button [matMenuTriggerFor]="profileMenu">
          <span>Nom de l'utilisateur</span> 
        </button>
        <mat-menu #profileMenu="matMenu">
          <button mat-menu-item>Profil</button>
          <button mat-menu-item>Déconnexion</button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles:``
})
export class NavBarComponents {
  toggleSidenav = output();
}