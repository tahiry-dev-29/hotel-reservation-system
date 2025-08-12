import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DynamicTableComponent, TableColumn } from "../../../shared/components/dynamic-table-component";

@Component({
  selector: 'app-user-list-page',
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
        <h2 class="text-2xl font-bold text-text-color">Users Management</h2>
        <a routerLink="../new">
          <p-button label="Add User" icon="pi pi-plus"></p-button>
        </a>
      </div>

      <!-- User Table -->
      <div class="rounded-md!">
        <app-dynamic-table
          [data]="users"
          [columns]="columns"
          [showGlobalFilter]="true"
          (onEdit)="onEditUser($event)"
          (onDelete)="onDeleteUser($event)"
        ></app-dynamic-table>
      </div>
    </div>
  `,
  styles: [``]
})
export class UserListPageComponents {
  users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active' },
    { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'Viewer', status: 'Inactive' },
    { id: 4, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Editor', status: 'Active' },
    { id: 5, name: 'Bob Brown', email: 'bob.b@example.com', role: 'Viewer', status: 'Banned' },
  ];

  columns: TableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'role', header: 'Role', sortable: true },
    { field: 'status', header: 'Status', type: 'status', sortable: true, statusConfig: {
      map: {
        'Active': { severity: 'success', text: 'Active' },
        'Inactive': { severity: 'warning', text: 'Inactive' },
        'Banned': { severity: 'danger', text: 'Banned' },
      }
    }},
  ];

  onEditUser(user: any) {
    console.log('Edit user:', user);
    // Implement navigation or dialog for editing
  }

  onDeleteUser(user: any) {
    console.log('Delete user:', user);
    // Implement confirmation and deletion logic
  }
}
