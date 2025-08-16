import { Routes } from '@angular/router';
import { CheckoutAddComponents } from './features/checkout/components/checkout-add-components';
import { CheckoutHistoryComponents } from './features/checkout/components/checkout-history-components';
import { CheckoutPageComponents } from './features/checkout/pages/checkout-page.component';
import { CustomersAddComponents } from './features/customers/components/customers-add-components';
import { CustomersSegmentationComponents } from './features/customers/components/customers-segmentation-components';
import { CustomersListsPageComponents } from './features/customers/pages/customers-lists-page-components';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page-component';
import { EmployeeAddComponents } from './features/employees/components/employee-add-components';
import { EmployeeListPageComponents } from './features/employees/pages/employee-list-page-components';
import { HomePageComponent } from './features/public/home-page-component';
import { RoomAddComponents } from './features/rooms/components/room-add-components';
import { RoomAvailabilityComponents } from './features/rooms/components/room-availability-components';
import { RoomListPageComponents } from './features/rooms/pages/room-list-page.component';
import { PublicRoomListPageComponent } from './features/rooms/pages/public-room-list-page.component';
import { UserAddComponents } from './features/users/components/user-add-components';
import { UserReportsComponents } from './features/users/components/user-reports-components';
import { UserListPageComponents } from './features/users/Pages/user-list-page-components';
import { AdminLayoutComponent } from './layouts/admin-layout-component';
import { MainLayoutComponent } from './layouts/main-layout-component';
import { LoginComponent } from './features/auth/login-component';
import { RegisterComponents } from './features/auth/register-components';
import { RoomDetailsPageComponents } from './features/rooms/pages/room-details-page.component';
import { authGuard } from './core/guards/auth-guard';
import { LoginCustomerComponent } from './features/customers/pages/login-customer-component';
import { RegisterCustomerComponent } from './features/customers/pages/register-customer-component';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home',
        component: HomePageComponent,
      },
      {
        path: 'rooms',
        title: 'Rooms',
        component: PublicRoomListPageComponent,
      },
      {
        path: 'room-details/:id',
        title: 'Room Details',
        component: RoomDetailsPageComponents,
      },
      {
        path: 'checkout',
        title: 'Checkout',
        component: CheckoutPageComponents,
      },
      {
        path: 'login',
        title: 'Login',
        component: LoginCustomerComponent,
      },
      {
        path: 'register',
        title: 'Register',
        component: RegisterCustomerComponent,
      },
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    // Le guard est ici pour protéger TOUTES les routes qui sont le tableau de bord
    // Les pages login/register seront traitées par la logique interne du layout
    children: [
      // Routes Login et Register pour Admin, maintenant enfants de 'admin'
      {
        path: 'login',
        title: 'Admin Login',
        component: LoginComponent,
        // Pas de guard ici, car c'est la page de connexion pour les non-authentifiés
      },
      {
        path: 'register',
        title: 'Admin Register',
        component: RegisterComponents,
        // Pas de guard ici si l'enregistrement est public pour les admins.
        // Si l'enregistrement n'est accessible qu'aux admins déjà connectés, remettre le guard.
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard',
        component: DashboardPageComponent,
        canActivate: [authGuard], // Protéger la page dashboard elle-même
      },
      {
        path: 'users',
        title: 'Users Management',
        canActivate: [authGuard], // Protéger cette branche
        children: [
          {
            path: 'list',
            title: 'Users Lists',
            component: UserListPageComponents,
          },
          {
            path: 'new',
            title: 'Users new',
            component: UserAddComponents,
          },
          {
            path: 'reports',
            title: 'Users reports',
            component: UserReportsComponents,
          },
        ],
      },
      {
        path: 'rooms',
        title: 'Rooms Management',
        canActivate: [authGuard], // Protéger cette branche
        children: [
          {
            path: 'list',
            title: 'Rooms Lists',
            component: RoomListPageComponents,
          },
          {
            path: 'new',
            title: 'Rooms new',
            component: RoomAddComponents,
          },
          {
            path: 'availability',
            title: 'Room Availability',
            component: RoomAvailabilityComponents,
          },
        ],
      },
      {
        path: 'customers',
        title: 'Customers Management',
        canActivate: [authGuard], // Protéger cette branche
        children: [
          {
            path: 'list',
            title: 'Customers Lists',
            component: CustomersListsPageComponents,
          },
          {
            path: 'new',
            title: 'Customers new',
            component: CustomersAddComponents,
          },
          {
            path: 'segmentation',
            title: 'Customers segmentation',
            component: CustomersSegmentationComponents,
          },
        ],
      },
      {
        path: 'employee',
        title: 'Employee Management',
        canActivate: [authGuard], // Protéger cette branche
        children: [
          {
            path: 'list',
            title: 'Employee Lists',
            component: EmployeeListPageComponents,
          },
          {
            path: 'new',
            title: 'Employee new',
            component: EmployeeAddComponents,
          },
        ],
      },
      {
        path: 'checkout',
        title: 'Checkout Details',
        canActivate: [authGuard], // Protéger cette branche
        children: [
          {
            path: 'list',
            title: 'Checkout Lists',
            component: CheckoutPageComponents,
          },
          {
            path: 'new',
            title: 'Checkout new',
            component: CheckoutAddComponents,
          },
          {
            path: 'history',
            title: 'Checkout history',
            component: CheckoutHistoryComponents,
          },
        ],
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
