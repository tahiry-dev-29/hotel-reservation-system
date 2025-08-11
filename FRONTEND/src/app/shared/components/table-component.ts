// // custom-table.component.ts
// import { Component, input, output, computed, model } from '@angular/core';
// import { TableModule } from 'primeng/table';
// import { ButtonModule } from 'primeng/button';
// import { PaginatorModule } from 'primeng/paginator';
// import { CommonModule } from '@angular/common'; // Required for @for, @if
// import { InputTextModule } from 'primeng/inputtext'; // Required for pInputText
// import { Table } from 'primeng/table'; // For type inference of #dt

// interface TableColumn {
//   field: string;
//   header: string;
//   filterable?: boolean; // Added filterable property for column filters
// }

// @Component({
//   selector: 'app-custom-table',
//   standalone: true, // Marking as standalone explicitly as per modern Angular practices
//   imports: [
//     TableModule,
//     ButtonModule,
//     PaginatorModule,
//     CommonModule, // For @for and @if structural directives
//     InputTextModule, // For global filter input
//   ],
//   template: `
//     <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
//       @if (showGlobalFilter()) {
//         <div class="mb-4 flex justify-end">
//           <span class="p-input-icon-left w-full sm:w-auto">
//             <i class="pi pi-search"></i>
//             <input
//               pInputText
//               type="text"
//               (input)="dt.filterGlobal($event.target.value!, 'contains')"
//               placeholder="Recherche globale..."
//               class="w-full sm:w-72 p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
//             />
//           </span>
//         </div>
//       }

//       <p-table
//         #dt
//         [value]="data()"
//         [paginator]="clientSidePaginator()"
//         [rows]="10"
//         [rowsPerPageOptions]="[5, 10, 20]"
//         [tableStyle]="{ 'min-width': '50rem' }"
//         styleClass="p-datatable-striped p-datatable-sm w-full"
//         [globalFilterFields]="globalFilterFields()"
//         [selectionMode]="selectionMode()"
//         [(selection)]="selectedItems"
//       >
//         <ng-template pTemplate="header">
//           <tr>
//             @if (selectionMode() === 'multiple') {
//               <th style="width: 3rem">
//                 <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
//               </th>
//             }
//             @for (col of columns(); track col.field) {
//               <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 {{ col.header }}
//                 @if (showColumnFilters() && col.filterable) {
//                   <p-columnFilter
//                     [type]="'text'"
//                     [field]="col.field"
//                     display="menu"
//                     class="ml-2"
//                   ></p-columnFilter>
//                 }
//               </th>
//             }
//             @if (hasActions()) {
//               <th class="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             }
//           </tr>
//         </ng-template>

//         <ng-template pTemplate="body" let-rowData>
//           <tr [pSelectableRow]="rowData">
//             @if (selectionMode() === 'multiple') {
//               <td>
//                 <p-tableCheckbox [value]="rowData"></p-tableCheckbox>
//               </td>
//             }
//             @for (col of columns(); track col.field) {
//               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
//                 {{ rowData[col.field] }}
//               </td>
//             }
//             @if (hasActions()) {
//               <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                 <p-button
//                   icon="pi pi-pencil"
//                   styleClass="p-button-rounded p-button-text p-button-info"
//                   (click)="onEdit.emit(rowData)"
//                 ></p-button>
//                 <p-button
//                   icon="pi pi-trash"
//                   styleClass="p-button-rounded p-button-text p-button-danger ml-2"
//                   (click)="onDelete.emit(rowData)"
//                 ></p-button>
//               </td>
//             }
//           </tr>
//         </ng-template>

//         <ng-template pTemplate="emptymessage">
//           <tr>
//             <td [attr.colspan]="columns().length + (hasActions() ? 1 : 0) + (selectionMode() === 'multiple' ? 1 : 0)" class="text-center p-4 text-gray-500">
//               Aucune donnée trouvée.
//             </td>
//           </tr>
//         </ng-template>
//       </p-table>
//     </div>
//   `,
// })
// export class CustomTableComponent {
//   // Required input signals (do not take default values with input.required())
//   data = input.required<any[]>();
//   columns = input.required<TableColumn[]>();

//   // Optional input signals with default values
//   showGlobalFilter = input(false);
//   showColumnFilters = input(false);
//   selectionMode = input<'single' | 'multiple' | null>(null);
//   clientSidePaginator = input(true); // Control PrimeNG's internal paginator

//   // Model signal for two-way binding (replaces [(selection)] binding and EventEmitter)
//   selectedItems = model<any[]>([]);

//   // Output signals (new function-based outputs)
//   onEdit = output<any>();
//   onDelete = output<any>();

//   globalFilterFields = computed(() => this.columns().map(col => col.field));

//   hasActions = computed(() => this.onEdit.observed || this.onDelete.observed);
// }
