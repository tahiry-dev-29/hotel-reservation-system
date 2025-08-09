import { Routes } from '@angular/router';
import { LayoutComponents } from './features/dashboard/components/layout-components';
import { AdminDetailsComponents } from './features/dashboard/components/admin-details-components';
import { UserDetailsComponents } from './features/dashboard/components/user-details-components';
import { RoomDetailsComponents } from './features/dashboard/components/room-details-components';
import { CustomerDetailsComponents } from './features/dashboard/components/customer-details-components';
import { CheckoutDetailsComponents } from './features/dashboard/components/checkout-details-components';

export const routes: Routes = [
    {
        path: 'admin',
        component: LayoutComponents,
        children: [
            {
                path: 'dashboard',
                component: AdminDetailsComponents
            },
            {
                path: 'users',
                component: UserDetailsComponents
            },
            {
                path: 'rooms',
                component: RoomDetailsComponents
            },
            {
                path: 'customers',
                component: CustomerDetailsComponents
            },
            {
                path: 'checkout',
                component: CheckoutDetailsComponents
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
    }
];
