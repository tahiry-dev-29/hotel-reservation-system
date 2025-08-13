import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to check if two form controls have matching values.
 * Commonly used for password and confirm password fields.
 * @param controlName The name of the first control.
 * @param matchingControlName The name of the control that should match the first one.
 * @returns A ValidationErrors object if values do not match, otherwise null.
 */
export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (control.value === matchingControl.value && matchingControl.hasError('passwordMismatch')) {
      matchingControl.setErrors(null);
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      if (matchingControl.hasError('passwordMismatch')) {
        const errors = { ...matchingControl.errors };
        delete errors['passwordMismatch'];
        matchingControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  };
}
