import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button'; 

@Component({
  selector: 'app-button',
  imports: [ButtonModule],
  template: `
    <p-button [variant]="variant()"
            [type]="type()"
            [disabled]="disabled()"
            [styleClass]="btnStyle()+ 'w-full!'"
            [rounded]="true"
            [loading]="loading()"
            [label]="buttonText()"
            [icon]="icon()"
            [severity]="severity()"
            (onClick)="onButtonClick()"
            >
    </p-button>
  `,
  styles: ``
})
export class ButtonComponent {
  loading = input<boolean>(false);
  icon = input<string>('');
  buttonText = input<string>('Submit');
  type = input<string>('button');
  disabled = input<boolean>(false);
  btnStyle = input<string>('')
  variant = input<"outlined" | "text" | undefined>();
  severity = input<'contrast' | 'danger' | 'help' | 'warn' | 'info' | 'success' | 'secondary' | 'primary'>('primary');
  
  buttonClick = output<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }

}
