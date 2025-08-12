import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-6">
      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Card 1: Revenue -->
        <div class="p-6 custome-border rounded-xl! shadow-md">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-text-color-secondary">Total Revenue</p>
              <p class="text-2xl font-bold text-text-color">$45,231.89</p>
            </div>
            <div class="p-3 bg-primary-500/20 rounded-lg">
              <i class="pi pi-dollar text-2xl text-primary-500"></i>
            </div>
          </div>
        </div>

        <!-- Card 2: Bookings -->
        <div class="p-6 custome-border rounded-xl! shadow-md">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-text-color-secondary">Bookings</p>
              <p class="text-2xl font-bold text-text-color">+2350</p>
            </div>
            <div class="p-3 bg-primary-500/20 rounded-lg">
              <i class="pi pi-bookmark text-2xl text-primary-500"></i>
            </div>
          </div>
        </div>

        <!-- Card 3: New Customers -->
        <div class="p-6 custome-border rounded-xl! shadow-md">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-text-color-secondary">New Customers</p>
              <p class="text-2xl font-bold text-text-color">+120</p>
            </div>
            <div class="p-3 bg-primary-500/20 rounded-lg">
              <i class="pi pi-users text-2xl text-primary-500"></i>
            </div>
          </div>
        </div>

        <!-- Card 4: Occupancy -->
        <div class="p-6 custome-border rounded-xl! shadow-md">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-text-color-secondary">Occupancy Rate</p>
              <p class="text-2xl font-bold text-text-color">75.5%</p>
            </div>
            <div class="p-3 bg-primary-500/20 rounded-lg">
              <i class="pi pi-chart-bar text-2xl text-primary-500"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="p-6 custome-border rounded-xl! shadow-md">
        <h3 class="text-lg font-semibold text-text-color">Recent Activity</h3>
        <div class="mt-4 h-64 flex items-center justify-center text-text-color-secondary">
          <!-- Placeholder for a chart or table -->
          <p>Chart will be displayed here.</p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class DashboardPageComponent {

}
