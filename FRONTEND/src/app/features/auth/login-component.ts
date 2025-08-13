import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login-page',
  imports: [
    ButtonModule,
    InputTextModule,
    RouterLink,
    ReactiveFormsModule,
    FloatLabelModule,
    PasswordModule
  ],
  template: `
    <div class="flex items-center justify-center mt-10">
      <div class="w-full max-w-md p-8 space-y-6 bg-theme rounded-2xl shadow-xl custome-border">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-color">
            Login
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Access your dashboard
          </p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <input pInputText id="username" formControlName="username" required class="w-full rounded-full" />
                <label for="username">Username</label>
            </p-floatlabel>
            @if (f['username'].invalid && (f['username'].dirty || f['username'].touched)) {
              @if (f['username'].errors?.['required']) {
                <small class="p-error">Username is required.</small>
              }
            }
          </div>
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <p-password 
                    id="password" 
                    formControlName="password" 
                    [toggleMask]="true" 
                    [feedback]="false"
                    autocomplete="current-password">
                </p-password>
                <label for="password">Password</label>
            </p-floatlabel>
            @if (f['password'].invalid && (f['password'].dirty || f['password'].touched)) {
              @if (f['password'].errors?.['required']) {
                <small class="p-error">Password is required.</small>
              }
            }
          </div>
          <button pButton type="submit"  [disabled]="loginForm.invalid || loading()" class="w-full" rounded="true" [loading]="loading()">Login
          </button>
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
    :host ::ng-deep .p-button .pi {
      margin: 0 auto; 
    }
    :host ::ng-deep .p-password .p-password-toggle {
      cursor: pointer; 
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  loading = signal(false);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    console.log('Login in progress...', this.loginForm.value);

    setTimeout(() => {
      this.loading.set(false);
      console.log('Login successful!', this.loginForm.value);
    }, 2000); 
  }
}
