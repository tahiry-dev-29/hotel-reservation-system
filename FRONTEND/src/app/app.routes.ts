import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout-component';
import { MainLayoutComponent } from './layouts/main-layout-component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page-component';
import { RoomAddComponents } from './features/rooms/components/room-add-components';
import { RoomAvailabilityComponents } from './features/rooms/components/room-availability-components';
import { RoomListPageComponents } from './features/rooms/pages/room-list-page.component';
import { UserAddComponents } from './features/users/components/user-add-components';
import { UserReportsComponents } from './features/users/components/user-reports-components';
import { UserListPageComponents } from './features/users/Pages/user-list-page-components';
import { CustomersAddComponents } from './features/customers/components/customers-add-components';
import { CustomersSegmentationComponents } from './features/customers/components/customers-segmentation-components';
import { CustomersListsPageComponents } from './features/customers/pages/customers-lists-page-components';
import { EmployeeListPageComponents } from './features/employees/pages/employee-list-page-components';
import { EmployeeAddComponents } from './features/employees/components/employee-add-components';
import { CheckoutAddComponents } from './features/checkout/components/checkout-add-components';
import { CheckoutHistoryComponents } from './features/checkout/components/checkout-history-components';
import { CheckoutPageComponents } from './features/checkout/pages/checkout-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full',
  },

  {
    path: 'Home',
    title: 'Home',
    component: MainLayoutComponent,
    children: [],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'users',
        title: 'Users Management',
        children: [
          {
            path: 'list',
            title: 'Users Lists',
            component: UserListPageComponents,
          },{
            path: 'new',
            title: 'Users new',
            component: UserAddComponents,
          },{
            path: 'reports',
            title: 'Users reports',
            component: UserReportsComponents,
          },
        ],
      },
      {
        path: 'rooms',
        title: 'Rooms Management',
        children: [
          {
            path: 'list',
            title: 'Rooms Lists',
            component: RoomListPageComponents,
          },{
            path: 'new',
            title: 'Rooms new',
            component: RoomAddComponents,
          },{
            path: 'availability',
            title: 'Room Availability',
            component: RoomAvailabilityComponents,
          },
        ]
      },
      {
        path: 'customers',
        title: 'Customers Management',
        children: [
          {
            path: 'list',
            title: 'Customers Lists',
            component: CustomersListsPageComponents,
          },{
            path: 'new',
            title: 'Customers new',
            component: CustomersAddComponents,
          },{
            path: 'segmentation',
            title: 'Customers segmentation',
            component: CustomersSegmentationComponents,
          },
        ]
      },
      {
        path: 'employee',
        title: 'Employee Management',
        children: [
          {
            path: 'list',
            title: 'Employee Lists',
            component: EmployeeListPageComponents,
          },{
            path: 'new',
            title: 'Employee new',
            component: EmployeeAddComponents,
          }
        ]
      },
      {
        path: 'checkout',
        title: 'Checkout Details',
        children: [
          {
            path: 'list',
            title: 'Checkout Lists',
            component: CheckoutPageComponents,
          },{
            path: 'new',
            title: 'Checkout new',
            component: CheckoutAddComponents,
          },{
            path: 'history',
            title: 'Checkout history',
            component: CheckoutHistoryComponents,
          },
        ]
      },
    ],
  },

  {
    path: '**',
    title: 'Page Not Found',
    loadComponent: () =>
      import('./features/not-found/not-found-page-component').then(
        (c) => c.NotFoundPageComponent
      ),
  },
];
