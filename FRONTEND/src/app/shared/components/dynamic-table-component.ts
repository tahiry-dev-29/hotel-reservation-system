// src/app/shared/components/dynamic-table-component.ts
import {
  Component,
  input,
  output,
  computed,
  model,
  OnInit,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';

// Custom Components
import { SearchBarComponent } from './search-bar.component';
import { CommonModule } from '@angular/common'; // For ngFor, ngIf in template

export interface TableColumn {
  field: string;
  header: string;
  filterable?: boolean;
  type?:
    | 'text'
    | 'numeric'
    | 'date'
    | 'boolean'
    | 'image'
    | 'rating'
    | 'progress'
    | 'status'
    | 'size'
    | 'tags' // New type for array of strings (amenities)
    | 'custom'; // New type for custom action button
  format?: string;
  imageConfig?: { width?: string; height?: string; class?: string };
  statusConfig?: {
    map?: { [key: string]: { severity: string; text: string } };
  };
  sortable?: boolean;
  resizable?: boolean;
  visible?: boolean; // Controls default visibility and in column selector
  customAction?: boolean; // Indicates if this column should render a custom action button
  buttonIcon?: string; // Icon for the custom action button (e.g., 'pi pi-images')
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    ProgressBarModule,
    RatingModule,
    TagModule,
    MultiSelectModule,
    ToolbarModule,
    TooltipModule,
    CardModule,
    SearchBarComponent,
    CommonModule // Required for @for, @if, etc.
  ],
  templateUrl: './dynamic-table-component.html',
  styles: ``,
})
export class DynamicTableComponent implements OnInit {
  // --- INPUTS ---
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  tableTitle = input<string>('Data Table');
  showGlobalFilter = input(true);
  showColumnFilters = input(false);
  selectionMode = input<'single' | 'multiple' | null>(null);
  clientSidePaginator = input(true);
  showColumnSelect = input(true);
  showActions = input(false); // Controls standard edit/delete actions

  // --- MODELS ---
  selectedItems = model<any[]>([]);
  // Initialize with an empty array. The actual filtering will happen in ngOnInit.
  visibleColumns = model<TableColumn[]>([]); 

  // --- OUTPUTS ---
  onEdit = output<any>();
  onDelete = output<any>();
  onCustomAction = output<any>(); // NEW: Output for custom column actions

  // --- SIGNALS ---
  dt = viewChild<Table>('dt');
  globalFilterFields = computed(() => this.columns().map((col) => col.field));

  ngOnInit(): void {
    // Now, in ngOnInit, 'columns' input is guaranteed to have a value.
    this.visibleColumns.set(
      this.columns().filter((col) => col.visible !== false)
    );
  }

  // --- HELPERS ---
  onGlobalFilter(value: string): void {
    const tableInstance = this.dt();
    if (tableInstance) {
      tableInstance.filterGlobal(value, 'contains');
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getSeverityForStatus(status: string): string {
    const statusColumn = this.columns().find((c) => c.type === 'status');
    const statusConfig = statusColumn?.statusConfig?.map;

    if (statusConfig && statusConfig[status]) {
      return statusConfig[status].severity;
    }
    // Fallback to default severities if no specific config is found for the status
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
      case 'COMPLETED':
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
      case 'LOWSTOCK':
      case 'MAINTENANCE':
        return 'warning';
      case 'OCCUPIED':
      case 'OUTOFSTOCK':
      case 'CANCELLED':
        return 'danger';
      default:
        return 'info';
    }
  }

  getNestedPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // NEW: Handle custom button click
  handleCustomAction(rowData: any, column: TableColumn): void {
    if (column.customAction) {
      this.onCustomAction.emit(rowData); // Emit the rowData for the custom action
    }
  }
}
