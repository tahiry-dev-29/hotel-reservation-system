import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete'; // Changed from DropdownModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule // Changed from DropdownModule
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Create New User</h2>
        <a routerLink="../list">
          <p-button label="Back to List" icon="pi pi-arrow-left" styleClass="p-button-text"></p-button>
        </a>
      </div>

      <!-- Add User Form -->
      <div class="rounded-md!">
        <form class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div class="flex flex-col gap-2">
              <label for="fullName" class="font-medium text-text-color-secondary">Full Name</label>
              <input pInputText id="fullName" name="fullName" required />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="font-medium text-text-color-secondary">Email</label>
              <input pInputText type="email" id="email" name="email" required />
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <label for="password" class="font-medium text-text-color-secondary">Password</label>
              <input pInputText type="password" id="password" name="password" required />
            </div>

            <!-- Role -->
            <div class="flex flex-col gap-2">
              <label for="role" class="font-medium text-text-color-secondary">Role</label>
              <p-autoComplete 
                [suggestions]="filteredRoles" 
                (completeMethod)="filterRoles($event)" 
                [(ngModel)]="selectedRole" 
                name="role" 
                field="name" 
                [dropdown]="true" 
                [showClear]="true" 
                placeholder="Select a Role">
              </p-autoComplete>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-4 mt-8">
            <p-button label="Cancel" styleClass="p-button-text" routerLink="../list"></p-button>
            <p-button label="Save User" icon="pi pi-check" type="submit"></p-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [``]
})
export class UserAddComponents {
  roles = [
    { name: 'Admin', value: 'admin' },
    { name: 'Editor', value: 'editor' },
    { name: 'Viewer', value: 'viewer' }
  ];

  selectedRole: any; // Changed type to any for autoComplete

  filteredRoles: any[] = []; // Added for autoComplete

  filterRoles(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.roles.length; i++) {
      let role = this.roles[i];
      if (role.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(role);
      }
    }
    this.filteredRoles = filtered;
  }
}
