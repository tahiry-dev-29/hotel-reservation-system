import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { RouterLink, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button-component';
import { matchValidator } from '../../validators/match-validator';
import { CustomerAuthService, CustomerRegisterRequest } from '../../../core/services/customer-auth-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-register-customer',
  imports: [
    ReactiveFormsModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    RouterLink,
    MessageModule,
    ButtonComponent
  ],
  template: `
    <div class="flex items-center justify-center mt-10">
      <div class="w-full max-w-md p-8 space-y-6 bg-theme rounded-2xl shadow-xl custome-border">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-color">
            Create Customer Account
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Join us and start your journey as a valued customer!
          </p>
        </div>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <input pInputText id="fullName" formControlName="fullName" [invalid]="isFieldInvalid(f['fullName'])" required class="w-full rounded-full" />
                <label for="fullName">Full Name</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['fullName'])) {
              @if (f['fullName'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Full Name is required</p-message>
              }
              @if (f['fullName'].errors?.['minlength']) {
                <p-message severity="error" variant="simple" size="small">Full Name must be at least {{ f['fullName'].errors?.['minlength'].requiredLength }} characters</p-message>
              }
              @if (f['fullName'].errors?.['maxlength']) {
                <p-message severity="error" variant="simple" size="small">Full Name cannot exceed {{ f['fullName'].errors?.['maxlength'].requiredLength }} characters</p-message>
              }
            }
            </div>
          </div>
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <input pInputText id="email" formControlName="email" [invalid]="isFieldInvalid(f['email'])" required class="w-full rounded-full" />
                <label for="email">Email</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['email'])) {
              @if (f['email'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Email is required</p-message>
              }
              @if (f['email'].errors?.['email']) {
                <p-message severity="error" variant="simple" size="small">Please enter a valid email address</p-message>
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
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['password'])) {
              @if (f['password'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Password is required</p-message>
              }
              @if (f['password'].errors?.['minlength']) {
                <p-message severity="error" variant="simple" size="small">Password must be at least {{ f['password'].errors?.['minlength'].requiredLength }} characters</p-message>
              }
              @if (f['password'].errors?.['pattern']) {
                <p-message severity="error" variant="simple" size="small">Password must contain at least one uppercase, one lowercase, one number, and one special character</p-message>
              }
            }
            </div>
          </div>
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <input pInputText id="phone" formControlName="phone" class="w-full rounded-full" />
                <label for="phone">Phone (Optional)</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
              <!-- No error message for phone if it's optional and without validation -->
            </div>
          </div>
          <div class="flex flex-col">
            <p-floatlabel variant="in">
                <p-password 
                    id="passwordVerify" 
                    formControlName="passwordVerify" 
                    [invalid]="isFieldInvalid(f['passwordVerify'])"
                    [toggleMask]="true" 
                    [feedback]="false"
                    autocomplete="new-password">
                </p-password>
                <label for="passwordVerify">Confirm Password</label>
            </p-floatlabel>
            <div class="h-5 overflow-hidden">
            @if (isFieldInvalid(f['passwordVerify'])) {
              @if (f['passwordVerify'].errors?.['required']) {
                <p-message severity="error" variant="simple" size="small">Password confirmation is required</p-message>
              }
              @if (f['passwordVerify'].errors?.['passwordMismatch']) {
                <p-message severity="error" variant="simple" size="small">Passwords do not match</p-message>
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
          <app-button [loading]="loading()" [disabled]="registerForm.invalid || loading()"  [type]="'submit'" [buttonText]="'Sign Up'" [variant]="'outlined'"/>
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
    :host ::ng-deep .p-password .p-password-toggle {
      cursor: pointer; 
    }
  `]
})
export class RegisterCustomerComponent {
  private fb = inject(FormBuilder);
  private customerAuthService = inject(CustomerAuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), 
      // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/) // Uncomment if you need strict password pattern
    ]],
    phone: [''],
    passwordVerify: ['', [Validators.required]]
  }, { 
    validators: matchValidator('password', 'passwordVerify') 
  });

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set(null);
      return;
    }
    
    this.loading.set(true);
    this.errorMessage.set(null);

    const registerRequest: CustomerRegisterRequest = {
      fullName: this.registerForm.value.fullName as string,
      mail: this.registerForm.value.email as string,
      password: this.registerForm.value.password as string,
      phone: this.registerForm.value.phone || undefined,
      imageUrl: undefined,
    };

    this.customerAuthService.register(registerRequest).subscribe({
      next: () => { // Removed 'response'
        this.loading.set(false);
        // Redirection is handled by CustomerAuthService.setAuthData
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('An account with this email already exists.');
        } else if (err.error && err.error.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('An unexpected error occurred during registration.');
        }
      }
    });
  }
}
