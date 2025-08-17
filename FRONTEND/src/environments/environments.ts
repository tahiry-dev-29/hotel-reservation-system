import { Environment } from './environments.d';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  fileUrl: 'http://localhost:8080/api/media',
  appVersion: '1.0.0',
  enableDebug: true,
  cookieDomain: "localhost"
};
