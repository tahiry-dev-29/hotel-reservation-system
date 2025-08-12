import {
  Component,
  input,
  output,
  computed,
  model,
  OnInit,
  viewChild,
  ElementRef,
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

  getSeverityForStatus(status: string): string {
    const statusConfig = this.columns().find((c) => c.type === 'status')
      ?.statusConfig?.map;
    if (statusConfig && statusConfig[status]) {
      return statusConfig[status].severity;
    }
    switch (status?.toLowerCase()) {
      case 'instock':
      case 'completed':
      case 'active':
        return 'success';
      case 'lowstock':
      case 'pending':
        return 'warning';
      case 'outofstock':
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }
}
