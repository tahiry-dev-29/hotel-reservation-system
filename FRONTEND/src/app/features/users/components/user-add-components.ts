import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms'; // Import AbstractControl
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { ButtonComponent } from "../../../shared/components/button-component";
import { matchValidator } from '../../validators/match-validator';


@Component({
  selector: 'app-user-add',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    FloatLabelModule,
    MessageModule,
    PasswordModule,
    DividerModule,
    ButtonComponent
  ],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-text-color">Create New User</h2>
        <a routerLink="../list">
          <p-button label="Back to List" icon="pi pi-arrow-left" styleClass="p-button-text"></p-button>
        </a>
      </div>

      <div class="rounded-md!">
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div class="flex flex-col">
              <p-floatlabel variant="in">
                <p-autoComplete 
                  [suggestions]="filteredRoles" 
                  (completeMethod)="filterRoles($event)" 
                  formControlName="role" 
                  field="name" 
                  [dropdown]="true" 
                  [showClear]="true" 
                  placeholder="Select a Role"
                  class="w-full">
                  <ng-template let-role pTemplate="item">
                    <div>{{ role.name }}</div>
                  </ng-template>
                </p-autoComplete>
                <label for="role">Role</label>
              </p-floatlabel>
              <div class="h-5 overflow-hidden">
                @if (isFieldInvalid(f['role'])) {
                  @if (f['role'].errors?.['required']) {
                    <p-message severity="error" variant="simple" size="small">Role is required</p-message>
                  }
                }
              </div>
            </div>
          </div>
          <p-divider />

          <div class="flex justify-end gap-4 mt-8">
            <p-button label="Cancel" styleClass="p-button-text" routerLink="../list"></p-button>
            <app-button 
                [loading]="loading()" 
                [disabled]="userForm.invalid || loading()"  
                [type]="'submit'" 
                [buttonText]="'Save '+ userForm.value.fullName" 
                icon="pi pi-check"
                [severity]="'success'"
            />
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-password input {
      width: 100%;
      border-radius: 9999px; 
    }
    :host ::ng-deep .p-inputtext  {
        border-radius: 9999px !important; 
    }
    /* Override rounded corners for p-autocomplete input specifically */
    :host ::ng-deep .p-autocomplete input.p-inputtext {
      border-radius: 0px !important; 
    }
    :host ::ng-deep .p-floatlabel > .p-inputtext,
    :host ::ng-deep .p-floatlabel > .p-password,
    :host ::ng-deep .p-floatlabel > .p-autocomplete {
        width: 100%;
    }
    :host ::ng-deep .p-password .p-password-toggle {
      cursor: pointer; 
    }
  `]
})
export class UserAddComponents {
  private fb = inject(FormBuilder);

  loading = signal(false);

  userForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8), 
      // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
    ]],
    passwordVerify: ['', [Validators.required]],
    role: [null, [Validators.required]]
  }, { 
    validators: matchValidator('password', 'passwordVerify')
  });

  roles = [
    { name: 'Admin', value: 'admin' },
    { name: 'Editor', value: 'editor' },
    { name: 'Viewer', value: 'viewer' }
  ];

  filteredRoles: any[] = [];

  get f() {
    return this.userForm.controls;
  }

  /**
   * Checks if a form control should display validation errors.
   * A control is considered invalid for display if it's invalid and has been touched or dirtied.
   * @param control The AbstractControl to check.
   * @returns True if the control should display errors, false otherwise.
   */
  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  filterRoles(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.roles.length; i++) {
      let role = this.roles[i];
      if (role.name.toLowerCase().includes(query.toLowerCase())) {
        filtered.push(role);
      }
    }
    this.filteredRoles = filtered;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    console.log('🎉 User creation in progress...', this.userForm.value);

    setTimeout(() => {
      this.loading.set(false);
      console.log('✅ User created successfully!', this.userForm.value);
      alert('User created successfully!');
    }, 2000); 
  }
}
