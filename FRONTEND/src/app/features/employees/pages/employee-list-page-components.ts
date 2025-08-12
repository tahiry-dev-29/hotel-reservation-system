import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from "../../../shared/components/dynamic-table-component";

@Component({
  selector: 'app-employee-list-page-components',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    DynamicTableComponent
],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Employees Management</h2>
        <a routerLink="../new">
          <p-button label="Add Employee" icon="pi pi-plus"></p-button>
        </a>
      </div>

      <!-- Employees Table -->
      <div class="rounded-md!">
        <app-dynamic-table
          [data]="employees"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onEditEmployee($event)"
          (onDelete)="onDeleteEmployee($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``]
})
export class EmployeeListPageComponents {
  employees = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', position: 'Manager', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', position: 'Receptionist', status: 'Active' },
    { id: 3, name: 'Peter Jones', email: 'peter.j@example.com', position: 'Housekeeping', status: 'Inactive' },
    { id: 4, name: 'Mary Brown', email: 'mary.b@example.com', position: 'Chef', status: 'Active' },
  ];

  columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'position', header: 'Position', sortable: true },
    { field: 'status', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'Active': { severity: 'success', text: 'Active' },
        'Inactive': { severity: 'warning', text: 'Inactive' },
      }
    }},
  ];

  onEditEmployee(employee: any) {
    console.log('Edit employee:', employee);
    // Implement navigation or dialog for editing
  }

  onDeleteEmployee(employee: any) {
    console.log('Delete employee:', employee);
    // Implement confirmation and deletion logic
  }
}