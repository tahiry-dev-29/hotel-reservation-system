import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-reports',
  standalone: true,
  imports: [
    ButtonModule,
    SplitButtonModule
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">User Reports</h2>
        <div class="flex items-center gap-2">
          <p-button label="Last 30 Days" styleClass="p-button-outlined"></p-button>
          <p-splitButton label="Export" icon="pi pi-download" [model]="exportOptions" styleClass="p-button-outlined"></p-splitButton>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-md!">
          <p class="text-sm font-medium text-text-color-secondary">Total Users</p>
          <p class="text-3xl font-bold text-text-color">1,258</p>
        </div>
        <div class="rounded-md!">
          <p class="text-sm font-medium text-text-color-secondary">Active This Month</p>
          <p class="text-3xl font-bold text-text-color">890</p>
        </div>
        <div class="rounded-md!">
          <p class="text-sm font-medium text-text-color-secondary">New Signups (30d)</p>
          <p class="text-3xl font-bold text-text-color">102</p>
        </div>
      </div>

      <!-- Chart Placeholder -->
      <div class="rounded-md!">
        <h3 class="text-lg font-semibold text-text-color">User Growth</h3>
        <div class="mt-4 h-80 flex items-center justify-center text-text-color-secondary">
          <p>User growth chart will be displayed here.</p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class UserReportsComponents {
  exportOptions: MenuItem[];

  constructor() {
    this.exportOptions = [
      { label: 'PDF', icon: 'pi pi-file-pdf' },
      { label: 'CSV', icon: 'pi pi-file-excel' }
    ];
  }
}
