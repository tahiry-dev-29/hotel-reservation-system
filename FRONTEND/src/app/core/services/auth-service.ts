import { inject, Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// Interfaces pour les DTOs d'authentification (inchangées)
export interface LoginRequest {
  mail: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  mail: string;
  password: string;
  imageUrl?: string;
  phone?: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface UserProfile {
  id: string;
  fullName: string;
  mail: string;
  imageUrl: string | null;
  online: boolean;
  phone: string | null;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'CUSTOMER';
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

/**
 * Service for managing staff user authentication (login, registration, token management).
 * Uses signals for reactive authentication state and user information.
 * Uses ngx-cookie-service for persistent storage of authentication data.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_PROFILE_KEY = 'user_profile';

  // Cookie expiry duration in hours (should match backend JWT expiry)
  private readonly COOKIE_EXPIRY_HOURS = 5;

  // Signals to track global authentication state and user information
  private _isAuthenticated = signal<boolean>(this.hasToken());
  isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  
  private _currentUserProfile = signal<UserProfile | null>(this.getStoredUserProfile());
  currentUserProfile: Signal<UserProfile | null> = this._currentUserProfile.asReadonly();

  constructor() {
    // Signals are initialized from cookies and updated by login/register/logout methods.
  }

  /**
   * Registers a new staff user.
   * Updates internal signals and handles redirection after successful registration.
   * @param userData Data for user registration.
   * @returns An Observable of AuthResponse. Components will subscribe to this.
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // Redirection handled by setAuthData
      })
    );
  }

  /**
   * Logs in a staff user.
   * Updates internal signals and handles redirection after successful login.
   * @param credentials User login credentials.
   * @returns An Observable of AuthResponse. Components will subscribe to this.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // Redirection handled by setAuthData
      })
    );
  }

  /**
   * Sets the JWT token and user profile in cookies.
   * Updates internal authentication signals.
   * Triggers redirection based on user role.
   * @param token The JWT token to store.
   * @param userProfile The user profile to store.
   */
  private setAuthData(token: string, userProfile: UserProfile): void {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.COOKIE_EXPIRY_HOURS);

    this.cookieService.set(this.TOKEN_KEY, token, expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');
    this.cookieService.set(this.USER_PROFILE_KEY, JSON.stringify(userProfile), expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');

    this._isAuthenticated.set(true);
    this._currentUserProfile.set(userProfile);

    // CENTRALIZED REDIRECTION LOGIC
    if (userProfile.role === 'VIEWER') {
      this.router.navigate(['/home']); // Redirect VIEWERs to the home page
    } else {
      this.router.navigate(['/admin/dashboard']); // Redirect ADMIN/EDITOR to the admin dashboard
    }
  }

  /**
   * Retrieves the stored JWT token from cookies.
   * @returns The JWT token string or null if not found.
   */
  getToken(): string | null {
    return this.cookieService.check(this.TOKEN_KEY) ? this.cookieService.get(this.TOKEN_KEY) : null;
  }

  /**
   * Removes the JWT token and user profile from cookies.
   * Resets internal authentication signals.
   */
  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/', environment.cookieDomain);
    this.cookieService.delete(this.USER_PROFILE_KEY, '/', environment.cookieDomain);
    this._isAuthenticated.set(false);
    this._currentUserProfile.set(null);
  }

  /**
   * Checks if a token exists in cookies.
   * @returns True if a token is present, false otherwise.
   */
  private hasToken(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }

  /**
   * Retrieves the stored user profile from cookies.
   * @returns The UserProfile object or null if not found.
   */
  private getStoredUserProfile(): UserProfile | null {
    const profileString = this.cookieService.check(this.USER_PROFILE_KEY) ? this.cookieService.get(this.USER_PROFILE_KEY) : null;
    return profileString ? JSON.parse(profileString) : null;
  }

  /**
   * Logs out the user and redirects to the login page.
   */
  logout(): void {
    this.removeToken();
    this.router.navigate(['/admin/login']);
  }
}
