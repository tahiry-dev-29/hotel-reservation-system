import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// Customer-specific interfaces
export interface CustomerLoginRequest {
  mail: string;
  password: string;
}

export interface CustomerRegisterRequest {
  fullName: string;
  mail: string;
  password: string;
  phone?: string;
  imageUrl?: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  mail: string;
  phone: string | null;
  imageUrl: string | null;
  online: boolean;
  role: 'CUSTOMER'; // Fixed role for customers
}

export interface CustomerAuthResponse {
  token: string;
  user: CustomerProfile;
}

/**
 * Service for managing customer authentication (login, registration, token management).
 * Uses signals for reactive authentication state and customer information.
 * Uses ngx-cookie-service for persistent storage of customer authentication data.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerAuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private readonly TOKEN_KEY = 'jwt_customer_token'; // Specific cookie key for customers
  private readonly PROFILE_KEY = 'customer_profile'; // Specific cookie key for customers

  private readonly COOKIE_EXPIRY_HOURS = 5;

  private _isAuthenticated = signal<boolean>(this.hasToken());
  isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  
  private _currentCustomerProfile = signal<CustomerProfile | null>(this.getStoredCustomerProfile());
  currentCustomerProfile: Signal<CustomerProfile | null> = this._currentCustomerProfile.asReadonly();

  constructor() {
    // Signals are initialized from cookies.
  }

  /**
   * Registers a new customer.
   * Updates internal signals and handles redirection after successful registration.
   * @param userData Data for customer registration.
   * @returns An Observable of CustomerAuthResponse.
   */
  register(userData: CustomerRegisterRequest): Observable<CustomerAuthResponse> {
    return this.http.post<CustomerAuthResponse>(`${environment.apiUrl}/customer-auth/register`, userData).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // Redirection after registration
        this.router.navigate(['/my-bookings']); // Redirect customers to their bookings page or home
      })
    );
  }

  /**
   * Logs in a customer.
   * Updates internal signals and handles redirection after successful login.
   * @param credentials Customer login credentials.
   * @returns An Observable of CustomerAuthResponse.
   */
  login(credentials: CustomerLoginRequest): Observable<CustomerAuthResponse> {
    return this.http.post<CustomerAuthResponse>(`${environment.apiUrl}/customer-auth/login`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // Redirection after login
        this.router.navigate(['/my-bookings']); // Redirect customers to their bookings page or home
      })
    );
  }

  /**
   * Sets the JWT token and customer profile in cookies.
   * Updates internal authentication signals.
   * @param token The JWT token to store.
   * @param customerProfile The customer profile to store.
   */
  private setAuthData(token: string, customerProfile: CustomerProfile): void {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.COOKIE_EXPIRY_HOURS);

    this.cookieService.set(this.TOKEN_KEY, token, expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');
    this.cookieService.set(this.PROFILE_KEY, JSON.stringify(customerProfile), expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');

    this._isAuthenticated.set(true);
    this._currentCustomerProfile.set(customerProfile);
  }

  /**
   * Retrieves the stored JWT token from cookies.
   * @returns The JWT token string or null if not found.
   */
  getToken(): string | null {
    return this.cookieService.check(this.TOKEN_KEY) ? this.cookieService.get(this.TOKEN_KEY) : null;
  }

  /**
   * Removes the JWT token and customer profile from cookies.
   * Resets internal authentication signals.
   */
  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/', environment.cookieDomain);
    this.cookieService.delete(this.PROFILE_KEY, '/', environment.cookieDomain);
    this._isAuthenticated.set(false);
    this._currentCustomerProfile.set(null);
  }

  /**
   * Checks if a customer token exists in cookies.
   * @returns True if a customer token is present, false otherwise.
   */
  private hasToken(): boolean {
    const has = this.cookieService.check(this.TOKEN_KEY);
    return has;
  }

  /**
   * Retrieves the stored customer profile from cookies.
   * Handles potential JSON parsing errors if the cookie content is invalid.
   * @returns The CustomerProfile object or null if not found or parsing fails.
   */
  private getStoredCustomerProfile(): CustomerProfile | null {
    const profileString = this.cookieService.get(this.PROFILE_KEY);
    // Ensure the string is not empty and not literally 'null' before parsing
    if (profileString && profileString.length > 0 && profileString !== 'null') {
      try {
        const profile = JSON.parse(profileString);
        return profile;
      } catch (e) {
        // Keep console.error for critical parsing issues during development
        console.error('Error parsing customer profile from cookie:', e); 
        this.cookieService.delete(this.PROFILE_KEY, '/', environment.cookieDomain); // Clear bad cookie
        return null;
      }
    }
    return null;
  }

  /**
   * Logs out the customer and redirects to the customer login page.
   */
  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']); // Redirect to the customer login page
  }
}
