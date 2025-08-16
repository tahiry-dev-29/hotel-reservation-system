import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms'; // Import AbstractControl
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ButtonComponent } from '../../../shared/components/button-component';

@Component({
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
            Login
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Access your dashboard
          </p>
        </div>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <input pInputText id="username" formControlName="username" [invalid]="isFieldInvalid(f['username'])" required class="w-full rounded-full" />
                <label for="username">Username</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['username'])) {
              @if (f['username'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Username is required</p-message>
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

  loading = signal(false);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get f() {
    return this.loginForm.controls;
  }
  
  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
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
