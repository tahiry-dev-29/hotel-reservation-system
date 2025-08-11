import { Component, input, forwardRef, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

export interface SelectOption {
  label: string;
  value: any;
  icon?: string;
}

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [SelectButtonModule, FormsModule],
  template: `

    <div class="flex items-center">
    @if (label()) {  
    <label class="mr-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ label() }}
      </label>
    }
      <p-selectButton
        [options]="options()"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="selectedOption"
        (ngModelChange)="onSelectChange($event)"
        [class]="{'opacity-50 cursor-not-allowed': isDisabled()}"
      >
        <ng-template pTemplate="item" let-option>
          <div class="flex items-center gap-2">
            @if (option.icon) {
              <i class="{{ option.icon }}"></i>
            }
            <span>{{ option.label }}</span>
          </div>
        </ng-template>
      </p-selectButton>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicSelectComponent),
      multi: true
    }
  ]
})
export class DynamicSelectComponent implements ControlValueAccessor {

  options = input.required<SelectOption[]>();
  label = input<string | null>(null);
  isDisabled = signal(false); 
  selectedOption: any = null;

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.selectedOption = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched();
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled); 
  }

  onSelectChange(value: any) {
    this.onChange(value);
    this.onTouched();
  }
}
