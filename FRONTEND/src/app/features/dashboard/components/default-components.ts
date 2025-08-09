import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default-components',
  imports: [CommonModule],
  template: `
    <h2>Bienvenue sur le tableau de bord</h2>
    <p>Cette zone affichera les widgets et les données de ton tableau de bord.</p>
  `,
    styles: ``
})
export class DefaultComponents {}