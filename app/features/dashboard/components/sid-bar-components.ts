import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sid-bar-components',
  
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule
  ],
  template: `
    <mat-nav-list>
      <a mat-list-item>
        <mat-icon matListItemIcon>home</mat-icon>
        <span matListItemTitle>Accueil</span>
      </a>
      <mat-expansion-panel class="mat-elevation-z0">
        <mat-expansion-panel-header>
          <mat-icon matPanelDescription>settings</mat-icon>
          <span class="font-bold">Paramètres</span>
        </mat-expansion-panel-header>
        <mat-nav-list>
          <a mat-list-item>Utilisateurs</a>
          <a mat-list-item>Rôles</a>
        </mat-nav-list>
      </mat-expansion-panel>
    </mat-nav-list>
  `,
  styles: ``
})
export class SidBarComponents {}