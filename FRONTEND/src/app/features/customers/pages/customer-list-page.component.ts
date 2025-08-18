import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from "../../../shared/components/dynamic-table-component";

@Component({
  selector: 'app-customer-list-page',
  standalone: true,
  imports: [
    RouterLink,
    ButtonModule,
    DynamicTableComponent
],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Customers Management</h2>
        <a routerLink="../new">
          <p-button label="Add Customer" icon="pi pi-plus"></p-button>
        </a>
      </div>

      <!-- Customers Table -->
      <div class="rounded-md!">
        <app-dynamic-table
          [data]="customers"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onEditCustomer($event)"
          (onDelete)="onDeleteCustomer($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``]
})
export class CustomerListPageComponent {
  customers = [
    { id: 1, name: 'Alice Brown', email: 'alice.b@example.com', phone: '111-222-3333', status: 'Active' },
    { id: 2, name: 'Bob White', email: 'bob.w@example.com', phone: '444-555-6666', status: 'Inactive' },
    { id: 3, name: 'Charlie Green', email: 'charlie.g@example.com', phone: '777-888-9999', status: 'Active' },
    { id: 4, name: 'Diana Blue', email: 'diana.b@example.com', phone: '123-456-7890', status: 'Active' },
  ];

  columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'phone', header: 'Phone', sortable: true },
    { field: 'status', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'Active': { severity: 'success', text: 'Active' },
        'Inactive': { severity: 'warning', text: 'Inactive' },
      }
    }},
  ];

  onEditCustomer(customer: any) {
    console.log('Edit customer:', customer);
    // Implement navigation or dialog for editing
  }

  onDeleteCustomer(customer: any) {
    console.log('Delete customer:', customer);
    // Implement confirmation and deletion logic
  }
}