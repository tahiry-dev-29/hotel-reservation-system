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
import { Table, TableModule } from 'primeng/table'; // TableModule contains ColumnFilter, TableHeaderCheckbox, TableCheckbox
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext'; // Corrected import
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';

// Custom Components
import { SearchBarComponent } from './search-bar.component';

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
    | 'size';
  format?: string;
  imageConfig?: { width?: string; height?: string; class?: string };
  statusConfig?: {
    map?: { [key: string]: { severity: string; text: string } };
  };
  sortable?: boolean;
  resizable?: boolean;
  visible?: boolean;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule, // Provides p-table, p-columnFilter, p-tableHeaderCheckbox, p-tableCheckbox directives
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
  showActions = input(false);

  // --- MODELS ---
  selectedItems = model<any[]>([]);
  visibleColumns = model<TableColumn[]>([]);

  // --- OUTPUTS ---
  onEdit = output<any>();
  onDelete = output<any>();

  // --- SIGNALS ---
  // Get a reference to the p-table component.
  dt = viewChild<Table>('dt');
  // Define fields for global filtering based on columns.
  globalFilterFields = computed(() => this.columns().map((col) => col.field));

  ngOnInit(): void {
    // Initialize visibleColumns based on the 'columns' input's initial value.
    this.visibleColumns.set(
      this.columns().filter((col) => col.visible !== false)
    );
  }

  // --- HELPERS ---
  /**
   * Handles the global filter search event from the SearchBarComponent.
   * Calls the filterGlobal method on the PrimeNG table instance.
   * @param value The search string.
   */
  onGlobalFilter(value: string): void {
    const tableInstance = this.dt(); // Get the actual p-table instance from the signal
    if (tableInstance) {
      tableInstance.filterGlobal(value, 'contains');
    }
  }

  /**
   * Formats a number of bytes into a human-readable size string.
   * @param bytes The number of bytes to format.
   * @returns A string representing the formatted size (e.g., "1.23 MB").
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Determines the severity (color) for a status tag based on predefined mappings or a switch case.
   * @param status The status string to evaluate.
   * @returns A string representing the severity ('success', 'warning', 'danger', 'info').
   */
  getSeverityForStatus(status: string): string {
    const statusConfig = this.columns().find((c) => c.type === 'status')
      ?.statusConfig?.map;
    if (statusConfig && statusConfig[status]) {
      return statusConfig[status].severity;
    }
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

  /**
   * Safely retrieves a nested property value from an object using a dot-separated path.
   * Example: getNestedPropertyValue(room, 'capacity.adults')
   * @param obj The object to traverse.
   * @param path The dot-separated path to the nested property.
   * @returns The value of the nested property, or undefined if not found.
   */
  getNestedPropertyValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
