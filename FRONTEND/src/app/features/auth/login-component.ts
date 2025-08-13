
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    RouterLink
  ],
  template: `
    <div class="flex items-center justify-center bg-surface-ground my-20">
      <div class="w-full max-w-md p-8 space-y-8 bg-theme rounded-2xl shadow-xl custome-border">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-text-color">
            Connexion
          </h2>
          <p class="mt-2 text-sm text-text-color-secondary">
            Accédez à votre tableau de bord
          </p>
        </div>
        <form class="space-y-6">
          <div class="flex flex-col gap-2">
            <label for="username" class="text-sm font-medium text-text-color-secondary">Nom d'utilisateur</label>
            <input pInputText id="username" name="username" required class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-text-color-secondary">Mot de passe</label>
            <input pInputText type="password" id="password" name="password" required class="w-full" />
          </div>
          <button pButton label="Se connecter" type="submit" class="w-full"></button>
        </form>
        <div class="text-sm text-center text-text-color-secondary">
          Pas encore de compte ? <a routerLink="/register" class="font-medium text-primary-500 hover:text-primary-600">Inscrivez-vous</a>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
}
