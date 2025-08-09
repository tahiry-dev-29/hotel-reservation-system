import { Component } from '@angular/core';
import { LayoutComponents } from "../../dashboard/components/layout-components";

@Component({
  selector: 'app-home-component',
  imports: [LayoutComponents],
  template: `
    <app-layout-components />
  `,
  styles: ``
})
export class HomeComponent {

}
