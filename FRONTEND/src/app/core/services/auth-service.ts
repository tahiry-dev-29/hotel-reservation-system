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
 * Service pour gérer l'authentification des utilisateurs (connexion, enregistrement, gestion des tokens).
 * Utilise des signaux pour un état d'authentification et des informations utilisateur réactifs.
 * Utilise ngx-cookie-service pour le stockage persistant des données d'authentification.
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

  // Durée d'expiration du cookie en heures (doit correspondre à l'expiration du JWT du backend)
  private readonly COOKIE_EXPIRY_HOURS = 5;

  // Signaux pour suivre l'état d'authentification global et les informations utilisateur
  private _isAuthenticated = signal<boolean>(this.hasToken());
  isAuthenticated: Signal<boolean> = this._isAuthenticated.asReadonly();
  
  private _currentUserProfile = signal<UserProfile | null>(this.getStoredUserProfile());
  currentUserProfile: Signal<UserProfile | null> = this._currentUserProfile.asReadonly();

  constructor() {
    // Les signaux sont initialisés à partir des cookies et mis à jour par les méthodes login/register/logout.
  }

  /**
   * Enregistre un nouvel utilisateur staff.
   * Met à jour les signaux internes après un enregistrement réussi.
   * @param userData Données pour l'enregistrement de l'utilisateur.
   * @returns Un Observable de AuthResponse. Les composants s'abonneront à cela.
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, userData).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // La redirection sera maintenant gérée dans setAuthData après que les signaux soient mis à jour
      })
    );
  }

  /**
   * Connecte un utilisateur staff.
   * Met à jour les signaux internes après une connexion réussie.
   * @param credentials Identifiants de connexion de l'utilisateur.
   * @returns Un Observable de AuthResponse. Les composants s'abonneront à cela.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        // La redirection sera maintenant gérée dans setAuthData après que les signaux soient mis à jour
      })
    );
  }

  /**
   * Définit le token JWT et le profil utilisateur dans les cookies.
   * Met à jour les signaux internes d'authentification.
   * Déclenche la redirection basée sur le rôle de l'utilisateur.
   * @param token Le token JWT à stocker.
   * @param userProfile Le profil utilisateur à stocker.
   */
  private setAuthData(token: string, userProfile: UserProfile): void {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.COOKIE_EXPIRY_HOURS);

    this.cookieService.set(this.TOKEN_KEY, token, expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');
    this.cookieService.set(this.USER_PROFILE_KEY, JSON.stringify(userProfile), expiryDate, '/', environment.cookieDomain, environment.production, 'Lax');

    this._isAuthenticated.set(true);
    this._currentUserProfile.set(userProfile);

    // LOGIQUE DE REDIRECTION CENTRALISÉE ICI
    if (userProfile.role === 'VIEWER') {
      this.router.navigate(['/home']); // Redirige les VIEWER vers la page home
    } else {
      this.router.navigate(['/admin/dashboard']); // Redirige les ADMIN/EDITOR vers le dashboard admin
    }
  }

  /**
   * Récupère le token JWT stocké depuis les cookies.
   * @returns La chaîne du token JWT ou null si non trouvé.
   */
  getToken(): string | null {
    return this.cookieService.check(this.TOKEN_KEY) ? this.cookieService.get(this.TOKEN_KEY) : null;
  }

  /**
   * Supprime le token JWT et le profil utilisateur des cookies.
   * Réinitialise les signaux internes d'authentification.
   */
  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/', environment.cookieDomain);
    this.cookieService.delete(this.USER_PROFILE_KEY, '/', environment.cookieDomain);
    this._isAuthenticated.set(false);
    this._currentUserProfile.set(null);
  }

  /**
   * Vérifie si un token existe dans les cookies.
   * @returns Vrai si un token est présent, faux sinon.
   */
  private hasToken(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }

  /**
   * Récupère le profil utilisateur stocké depuis les cookies.
   * @returns L'objet UserProfile ou null si non trouvé.
   */
  private getStoredUserProfile(): UserProfile | null {
    const profileString = this.cookieService.check(this.USER_PROFILE_KEY) ? this.cookieService.get(this.USER_PROFILE_KEY) : null;
    return profileString ? JSON.parse(profileString) : null;
  }

  /**
   * Déconnecte l'utilisateur et redirige vers la page de connexion.
   */
  logout(): void {
    this.removeToken();
    this.router.navigate(['/admin/login']);
  }
}
