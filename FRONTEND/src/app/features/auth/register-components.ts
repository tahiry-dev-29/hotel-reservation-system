import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { matchValidator } from '../validators/match-validator'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    RouterLink
  ],
  template: `
    <div class="flex items-center justify-center mt-10">
      <div class="w-full max-w-md p-8 space-y-6 bg-theme rounded-2xl shadow-xl custome-border">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-color">
            Create Account
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Join us and start your journey!
          </p>
        </div>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <input pInputText id="username" formControlName="username" required class="w-full rounded-full" />
                <label for="username">Username</label>
            </p-floatlabel>
            @if (f['username'].invalid && (f['username'].dirty || f['username'].touched)) {
              @if (f['username'].errors?.['required']) {
                <small class="p-error">Username is required.</small>
              }
              @if (f['username'].errors?.['minlength']) {
                <small class="p-error">Username must be at least {{ f['username'].errors?.['minlength'].requiredLength }} characters.</small>
              }
              @if (f['username'].errors?.['maxlength']) {
                <small class="p-error">Username cannot exceed {{ f['username'].errors?.['maxlength'].requiredLength }} characters.</small>
              }
            }
          </div>
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <input pInputText id="email" formControlName="email" required class="w-full rounded-full" />
                <label for="email">Email</label>
            </p-floatlabel>
             @if (f['email'].invalid && (f['email'].dirty || f['email'].touched)) {
                @if (f['email'].errors?.['required']) {
                  <small class="p-error">Email is required.</small>
                }
                @if (f['email'].errors?.['email']) {
                  <small class="p-error">Please enter a valid email address.</small>
                }
            }
          </div>
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <p-password 
                    id="password" 
                    formControlName="password" 
                    [toggleMask]="true" 
                    autocomplete="new-password">
                    <ng-template #header>
                        <div class="font-semibold text-xm mb-4">Pick a password</div>
                    </ng-template>
                    <ng-template #footer>
                        <p-divider />
                        <p class="mt-2">Suggestions</p>
                        <ul class="pl-2 ml-2 my-0 leading-normal">
                            <li>At least one lowercase letter</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character (!&#64;#$%^&*)</li>
                            <li>Minimum 8 characters</li>
                        </ul>
                    </ng-template>
                </p-password>
                <label for="password">Password</label>
            </p-floatlabel>
            @if (f['password'].invalid && (f['password'].dirty || f['password'].touched)) {
                @if (f['password'].errors?.['required']) {
                  <small class="p-error">Password is required.</small>
                }
                @if (f['password'].errors?.['minlength']) {
                  <small class="p-error">Password must be at least {{ f['password'].errors?.['minlength'].requiredLength }} characters.</small>
                }
                @if (f['password'].errors?.['pattern']) {
                  <small class="p-error">Password must contain at least one uppercase, one lowercase, one number, and one special character.</small>
                }
            }
          </div>
          <div class="flex flex-col gap-2">
            <p-floatlabel variant="in">
                <p-password 
                    id="passwordVerify" 
                    formControlName="passwordVerify" 
                    [toggleMask]="true" 
                    [feedback]="false"
                    autocomplete="new-password">
                </p-password>
                <label for="passwordVerify">Confirm Password</label>
            </p-floatlabel>
             @if (f['passwordVerify'].invalid && (f['passwordVerify'].dirty || f['passwordVerify'].touched)) {
                @if (f['passwordVerify'].errors?.['required']) {
                  <small class="p-error">Password confirmation is required.</small>
                }
                @if (f['passwordVerify'].errors?.['passwordMismatch']) {
                  <small class="p-error">Passwords do not match.</small>
                }
            }
          </div>
          <button pButton type="submit" [disabled]="registerForm.invalid || loading()" class="w-full" rounded="true" [loading]="loading()">
            Sign Up
          </button>
        </form>
        <div class="text-sm text-center text-text-color-secondary">
          Already have an account? <a routerLink="/login" class="font-medium text-primary-500 hover:text-primary-600">Sign In</a>
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
export class RegisterComponents {
  private fb = inject(FormBuilder);

  loading = signal(false);

  // passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;


  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordVerify: ['', [Validators.required]]
  }, { 
    validators: matchValidator('password', 'passwordVerify') 
  });

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    console.log('🎉 Registration in progress...', this.registerForm.value);

    setTimeout(() => {
      this.loading.set(false);
      console.log('✅ Registration successful!', this.registerForm.value);
      console.log('Registration successful! Check the console for the form data.');
    }, 2000); 
  }
}
