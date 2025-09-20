// src/app/config.ts
import { environment } from '../environments/environment';

type Endpoint = { url: string };
type ServerEndpoints = { url: string; delete: string };
type PayuConfig = {
  action: string;
  merchantId: string;
  accountId: string; // Colombia
  responseUrl: string;
  confirmationUrl: string;
  apiKey: string;
  test: 0 | 1;
};
type MercadoPagoConfig = {
  public_key: string;
  access_token: string;
};

const domain = environment.production ? '' /* TODO: tu dominio */ : 'http://localhost:4200/';
const domain2 = environment.production ? domain : 'http://localhost:4200/src/';

/** Ruta base para assets (imágenes, css, etc.) */
export const Path: Endpoint = {
  url: `${domain}assets/`
  // Si necesitas SSL local:
  // url: 'https://localhost:4200/assets/'
};

/** Endpoints para administrar archivos (subir/borrar) */
export const Server: ServerEndpoints = {
  url: `${domain2}assets/img/index.php?key=${environment.apiKey || '[YOUR_API_KEY]'}`,
  delete: `${domain2}assets/img/delete.php?key=${environment.apiKey || '[YOUR_API_KEY]'}`
};

/** Endpoint para envío de correos */
export const Email: Endpoint = {
  url: `${domain2}assets/email/index.php?key=${environment.apiKey || '[YOUR_API_KEY]'}`
};

/** Firebase Realtime DB/Firestore REST base (debe terminar en / si usas .json) */
export const Api: Endpoint = {
  url: environment.firebase.databaseURL || '' // e.g. 'https://<project>.firebaseio.com/'
};

/** Firebase Auth endpoints */
export const Register: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const Login: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const SendEmailVerification: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const ConfirmEmailVerification: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const GetUserData: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const SendPasswordResetEmail: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const VerifyPasswordResetCode: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const ConfirmPasswordReset: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};
export const ChangePassword: Endpoint = {
  url: `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.firebaseApiKey || '[YOUR_API_KEY]'}`
};

/** PAYU (sandbox por defecto) */
export const Payu: PayuConfig = {
  action: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
  merchantId: environment.payuMerchantId || '508029',
  accountId: environment.payuAccountId || '512321',
  responseUrl: `${domain}account/my-shopping`,
  confirmationUrl: `${domain}assets/payu/index.php`,
  apiKey: environment.payuApiKey || '4Vj8eK4rloUd272L48hsrarnUA',
  test: 1
  // Para live, lee valores desde environment.prod.ts y set test: 0
};

/** MERCADO PAGO */
export const MercadoPago: MercadoPagoConfig = {
  public_key: environment.mpPublicKey || '',
  access_token: environment.mpAccessToken || ''
};
