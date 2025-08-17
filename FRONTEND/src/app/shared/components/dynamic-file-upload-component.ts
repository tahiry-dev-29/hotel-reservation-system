// src/app/shared/components/dynamic-file-upload-component.ts
import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { FileUploadModule, FileSelectEvent, FileRemoveEvent, FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-dynamic-file-upload',
  standalone: true,
  imports: [
    FormsModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    BadgeModule,
  ],
  template: `
    <p-toast></p-toast>
    <div class="card p-4 rounded-lg shadow-sm">
      <p-fileupload #fileUpload
                    name="imageFiles[]"
                    [url]="''"
                    [multiple]="multiple()"
                    [accept]="accept()"
                    [maxFileSize]="maxFileSize()"
                    [customUpload]="true"
                    (onSelect)="onSelectedFiles($event)"
                    (onRemove)="onRemoveTemplatingFile($event)"
                    (onClear)="onClearTemplatingUpload(fileUpload)">
        <ng-template #header let-files let-chooseCallback="chooseCallback" let-clearCallback="clearCallback">
          <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
            <div class="flex gap-2">
              <p-button (onClick)="choose($event, chooseCallback)" icon="pi pi-images" [rounded]="true" [outlined]="true" label="Choose Images" />
              <p-button (onClick)="clearCallback()" icon="pi pi-times" [rounded]="true" [outlined]="true" severity="danger" [disabled]="!files || files.length === 0" label="Clear" />
            </div>
          </div>
        </ng-template>
        <ng-template #content let-files let-uploadedFiles="uploadedFiles" let-removeFileCallback="removeFileCallback">
          <div class="flex flex-col gap-8 pt-4">
            @if (files?.length > 0) {
              <div>
                <h5>Selected Files ({{ files.length }} files)</h5>
                <div class="flex flex-wrap gap-4">
                  @for (file of files; track $index) {
                    <div class="p-4 rounded-md border border-surface flex flex-col items-center gap-4">
                      <div>
                        <img role="presentation" [alt]="file.name" [src]="file.objectURL" width="100" height="50" class="object-cover" />
                      </div>
                      <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                      <div>{{ formatSize(file.size) }}</div>
                      <p-badge value="Ready" severity="info" />
                      <p-button icon="pi pi-times" (click)="removeFileCallback($event, $index)" [outlined]="true" [rounded]="true" severity="danger" />
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </ng-template>
        <ng-template #file></ng-template>
        <ng-template #empty>
          <div class="flex items-center justify-center flex-col p-8 text-center text-gray-500">
            <i class="pi pi-cloud-upload text-5xl! text-gray-400 mb-4"></i>
            <p class="mt-2 mb-0">Drag and drop files here to upload, or click "Choose Images".</p>
          </div>
        </ng-template>
      </p-fileupload>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-fileupload-buttonbar {
      border-radius: 0.5rem;
      background: var(--surface-card);
      padding: 1rem;
    }
    :host ::ng-deep .p-fileupload-content {
      border: 1px dashed var(--surface-border);
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .rounded-md { border-radius: 0.5rem; }
  `],
  providers: [MessageService]
})
export class DynamicFileUploadComponent {
  // --- INPUTS ---
  multiple = input<boolean>(true);
  accept = input<string>('image/*');
  maxFileSize = input<number>(5 * 1024 * 1024); // 5MB by default

  // --- OUTPUTS ---
  onFilesReady = output<File[]>();

  // --- SIGNALS ---
  selectedFiles = signal<File[]>([]);

  constructor(private messageService: MessageService) {}

  choose(event: Event, chooseCallback: () => void) {
    chooseCallback();
  }

  // Handle file selection
  onSelectedFiles(event: FileSelectEvent) {
    // Add newly selected files to the existing list in the signal.
    this.selectedFiles.update(currentFiles => [...currentFiles, ...event.currentFiles]);
    this.onFilesReady.emit(this.selectedFiles());
    this.messageService.add({ severity: 'info', summary: 'Files Selected', detail: `${event.currentFiles.length} new file(s) added.` });
  }

  // Handle file removal from PrimeNG's internal list
  onRemoveTemplatingFile(event: FileRemoveEvent) {
    // Filter the current signal value to remove the specific file.
    this.selectedFiles.update(currentFiles => currentFiles.filter(file => file !== event.file));
    this.onFilesReady.emit(this.selectedFiles());
    this.messageService.add({ severity: 'warn', summary: 'File Removed', detail: `${event.file.name} has been removed.` });
  }

  // Handle clear all files
  onClearTemplatingUpload(fileUpload: FileUpload) {
    this.selectedFiles.set([]);
    this.onFilesReady.emit([]);
    this.messageService.add({ severity: 'info', summary: 'Cleared', detail: 'All files cleared.' });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return `${formattedSize} ${sizes[i]}`;
  }
}