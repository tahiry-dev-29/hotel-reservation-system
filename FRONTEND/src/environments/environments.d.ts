// environment.d.ts
export interface Environment {
    production: boolean;
    apiUrl: string;
    fileUrl: string;
    appVersion: string;
    enableDebug: boolean;
    cookieDomain: string;
  }