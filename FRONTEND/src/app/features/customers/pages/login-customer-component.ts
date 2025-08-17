import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonComponent } from '../../../shared/components/button-component';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerAuthService, CustomerLoginRequest } from '../../../core/services/customer-auth-service';

@Component({
  standalone: true,
  selector: 'app-login-customer-page',
  imports: [
    ButtonModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule,
    ButtonComponent
  ],
  template: `
    <div class="flex items-center justify-center mt-10">
      <div class="w-full max-w-md p-8 space-y-6 bg-theme rounded-2xl shadow-xl custome-border">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-color">
            Login Customer
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Access your customer account
          </p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <input pInputText id="username" formControlName="username" [invalid]="isFieldInvalid(f['username'])" required class="w-full rounded-full" />
                <label for="username">Email</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['username'])) {
              @if (f['username'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Email is required</p-message>
              }
              @if (f['username'].errors?.['email']) {
                <p-message severity="error" variant="simple" size="small">Enter a valid email address</p-message>
              }
            }
            </div>
          </div>
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <p-password 
                    id="password" 
                    formControlName="password" 
                    [invalid]="isFieldInvalid(f['password'])"
                    [toggleMask]="true" 
                    [feedback]="false"
                    autocomplete="current-password">
                </p-password>
                <label for="password">Password</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['password'])) {
              @if (f['password'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Password is required</p-message>
              }
            }
            </div>
          </div>
          <!-- Display API error message -->
          @if (errorMessage()) {
            <div class="h-5 overflow-hidden">
              <p-message severity="error" variant="simple" size="small">{{ errorMessage() }}</p-message>
            </div>
          }
          <app-button [loading]="loading()" [disabled]="loginForm.invalid || loading()"  [type]="'submit'" [buttonText]="'Login'" [variant]="'outlined'"/>
        </form>
        <div class="text-sm text-center text-text-color-secondary">
          Don't have an account? <a routerLink="/register" class="font-medium text-primary-500 hover:text-primary-600">Sign Up</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-password input {
      width: 100%;
      border-radius: 9999px; 
    }
    :host ::ng-deep .p-inputtext {
        border-radius: 9999px !important; 
    }
    :host ::ng-deep .p-floatlabel > .p-inputtext,
    :host ::ng-deep .p-floatlabel > .p-password {
        width: 100%;
    }
    :host ::ng-deep .p-password .p-password-toggle {
      cursor: pointer; 
    }
  `]
})
export class LoginCustomerComponent {
  private fb = inject(FormBuilder);
  private customerAuthService = inject(CustomerAuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
  
  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set(null);
      return;
    }
    
    this.loading.set(true);
    this.errorMessage.set(null);

    const loginRequest: CustomerLoginRequest = {
      mail: this.loginForm.value.username as string,
      password: this.loginForm.value.password as string
    };

    this.customerAuthService.login(loginRequest).subscribe({
      next: () => { // Removed 'response' as it's not directly used here for logging
        this.loading.set(false);
        // Redirection is handled by CustomerAuthService.setAuthData
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 401 || err.status === 403) {
          this.errorMessage.set('Invalid email or password.');
        } else if (err.error && err.error.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('An unexpected error occurred during login.');
        }
      }
    });
  }
}
