import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from "../../shared/components/button-component";

@Component({
  selector: 'app-not-found-page',
  imports: [
    CardModule,
    ButtonModule,
    ButtonComponent
],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-theme">
      <p-card styleClass="p-card-shadow text-center p-6 md:p-8 rounded-lg shadow-xl custome-border">
        <div class="mb-6">
          <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4 block animate-bounce-slow"></i>
          <h1 class="text-5xl font-bold mb-2">404</h1>
          <h2 class="text-2xl font-semibold mb-4">Page not found</h2>
          <p class="text-lg">
            Sorry, the page you are looking for does not exist.
          </p>
        </div>
        <app-button [icon]="'pi pi-home'" [type]="'button'" [buttonText]="'Turn Home'" [variant]="'outlined'" (buttonClick)="goToHome()" />
      </p-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .animate-bounce-slow {
      animation: bounce-slow 2s infinite ease-in-out;
    }
    @keyframes bounce-slow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    /* Styles pour la carte, assure la responsivité */
    .p-card-shadow {
      max-width: 90%;
      width: 400px; /* Taille fixe pour l'exemple, à adapter avec des classes Tailwind */
    }
    /* Assurer que la carte est centrée sur mobile aussi */
    .flex.items-center.justify-center {
      min-height: 100vh; /* Full viewport height */
      width: 100vw; /* Full viewport width */
    }
    .bg-gray-100 { /* Tailwind background color */
      background-color: #f3f4f6;
    }
    .text-center {
      text-align: center;
    }
    .rounded-lg {
      border-radius: 0.5rem; /* Equivalent to Tailwind's rounded-lg */
    }
    .shadow-xl {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Equivalent to Tailwind's shadow-xl */
    }
    .bg-white {
      background-color: #ffffff;
    }
    .p-6 { padding: 1.5rem; }
    .md\\:p-8 { /* For medium screens and up */ padding: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .pi { /* PrimeIcons base style */
      font-family: PrimeIcons;
      speak: none;
      font-style: normal;
      font-weight: normal;
      font-variant: normal;
      text-transform: none;
      line-height: 1;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .pi-exclamation-triangle:before { content: "\\e931"; /* Example icon code */ }
    .text-6xl { font-size: 3.75rem; line-height: 1; }
    .text-orange-500 { color: #f97316; }
    .mb-4 { margin-bottom: 1rem; }
    .block { display: block; }
    .text-5xl { font-size: 3rem; line-height: 1; }
    .font-bold { font-weight: 700; }
    .text-gray-800 { color: #1f2937; }
    .dark:text-gray-100 { /* Placeholder for dark mode */ }
    .mb-2 { margin-bottom: 0.5rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .font-semibold { font-weight: 600; }
    .text-gray-700 { color: #374151; }
    .dark:text-gray-200 { /* Placeholder for dark mode */ }
    .p-button-raised { /* PrimeNG button styling */
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    }
    .p-button-primary { /* PrimeNG button styling */
        background: #007bff;
        border-color: #007bff;
        color: #ffffff;
    }
    .mt-4 { margin-top: 1rem; }
    .pi-home:before { content: "\\e900"; /* Example icon code */ }
  `]
})
export class NotFoundPageComponent {
  constructor(private router: Router) {}

  /**
   * Navigates the user back to the home page.
   */
  goToHome(): void {
    this.router.navigate(['/']); // Redirect to the root of your application
  }
}
