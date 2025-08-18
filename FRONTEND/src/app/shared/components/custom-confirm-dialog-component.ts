import { Component, inject, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-custom-confirm-dialog',
  imports: [
    ButtonModule
],
  template: `
    <div class="p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">{{ message() }}</h2>
      <div class="flex justify-center gap-4">
        <p-button (onClick)="confirm(true)" label="Confirmer" styleClass="p-button-success w-36 py-2"></p-button>
        <p-button (onClick)="confirm(false)" label="Annuler" styleClass="p-button-secondary w-36 py-2"></p-button>
      </div>
    </div>
  `,
  styles: ``
})
export class CustomConfirmDialogComponent {
  private dialogConfig = inject(DynamicDialogConfig);
  private dialogRef = inject(DynamicDialogRef);

  message = signal<string>('Êtes-vous sûr de cette action ?');

  constructor() {
    if (this.dialogConfig.data && this.dialogConfig.data['message']) {
      this.message.set(this.dialogConfig.data['message']);
    }
  }

  confirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
