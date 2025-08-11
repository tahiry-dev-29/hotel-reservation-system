    ```
        src
        │   ├── app
        │   │   ├── app-component.ts // La racine de ton app
        │   │   ├── app-config.ts
        │   │   ├── app-routes.ts
        │   │   ├── core // Les services et éléments globaux, chargés une seule fois
        │   │   │   ├── guards
        │   │   │   │   └── auth-guard.ts
        │   │   │   ├── interceptors
        │   │   │   │   └── auth-interceptor.ts
        │   │   │   └── services
        │   │   │       ├── auth-service.ts
        │   │   │       └── registers-service.ts
        │   │   ├── features // Les grandes fonctionnalités de ton app
        │   │   │   ├── auth // La partie authentification
        │   │   │   │   └── login-page-component.ts
        │   │   │   ├── dashboard // Le dashboard admin, avec ses pages et composants
        │   │   │   │   ├── dashboard-page-component.ts
        │   │   │   │   └── components
        │   │   │   │       └── dashboard-card-component.ts
        │   │   │   ├── public // La partie front-office, accessible sans connexion
        │   │   │   │   └── home-page-component.ts
        │   │   │   └── not-found-page-component.ts
        │   │   ├── layouts // Les templates de page, comme le layout pour le dashboard
        │   │   │   ├── admin-layout-component.ts
        │   │   │   └── main-layout-component.ts
        │   │   └── shared // Les composants, directives, ou pipes réutilisables
        │   │       ├── components
        │   │       │   ├── button-component.ts
        │   │       │   ├── card-component.ts
        │   │       │   └── header-component.ts
        │   │       └── services
        │   │           └── api-service.ts
    ```