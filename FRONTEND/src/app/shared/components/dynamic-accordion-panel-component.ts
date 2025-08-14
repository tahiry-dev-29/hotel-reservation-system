import { Component, input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-dynamic-accordion-panel',
  imports: [AccordionModule],
  template: `
    <p-accordion-panel [value]="value()">
      <p-accordion-header>{{ header() }}</p-accordion-header>
      <p-accordion-content>
        <ng-content></ng-content>
      </p-accordion-content>
    </p-accordion-panel>
  `,
})
export class DynamicAccordionPanelComponent {
  header = input.required<string>();
  value = input.required<string | number>();
}
