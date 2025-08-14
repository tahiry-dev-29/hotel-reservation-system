import { Component, input, InputSignal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-toggle-switch-with-label',
  standalone: true,
  imports: [ToggleSwitchModule, ReactiveFormsModule],
  template: `
    <div class="flex items-center gap-2">
      <label [for]="computedId()" class="font-medium text-text-color-secondary">{{ label() }}</label>
      <p-toggleswitch [formControl]="control()" [inputId]="computedId()">
        <ng-template pTemplate="handle" let-checked="checked">
            <i [class]="['!text-xs', 'pi', checked ? 'pi-check' : 'pi-times']"></i>
        </ng-template>
      </p-toggleswitch>
    </div>
  `,
  styles: [`
    
    :host ::ng-deep .p-toggleswitch .p-toggleswitch-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
    }
  `]
})
export class ToggleSwitchWithLabelComponent {
  control: InputSignal<FormControl<any>> = input.required<FormControl<any>>();
  label: InputSignal<string> = input.required<string>();
  uniqueId: InputSignal<string | undefined> = input();

  computedId = computed(() => this.uniqueId() || `toggle-${Math.random().toString(36).substring(2, 9)}`);
}
