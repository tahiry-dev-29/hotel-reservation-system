import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavBarComponents } from './nav-bar-components';
import { SidBarComponents } from './sid-bar-components';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-components',
  imports: [
    CommonModule,
    MatSidenavModule,
    NavBarComponents,
    SidBarComponents,
    RouterModule
  ],
  template: `
    <app-nav-bar-components (toggleSidenav)="sidenav.toggle()"></app-nav-bar-components>
    <mat-sidenav-container class="h-[calc(100vh-64px)]">
      <mat-sidenav #sidenav mode="side" opened class="w-64 bg-amber-300">
        <app-sid-bar-components></app-sid-bar-components>
      </mat-sidenav>
      <mat-sidenav-content class="p-6">
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: ` `
})
export class LayoutComponents {
  sidenav = viewChild.required<MatSidenav>('sidenav');
}