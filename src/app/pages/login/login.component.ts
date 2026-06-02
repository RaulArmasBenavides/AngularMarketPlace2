import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential
} from 'firebase/auth';
import { ActivatedRoute } from '@angular/router';

import { Sweetalert } from '../../functions';
import { UsersModel } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  user: UsersModel = new UsersModel();
  rememberMe = false;

  constructor(
    private readonly usersService: UsersService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Remember me
    if (localStorage.getItem('rememberMe') === 'yes') {
      this.user.email = localStorage.getItem('email') ?? '';
      this.rememberMe = true;
    }

    // Verificación de correo por oobCode
    const oobCode = this.activatedRoute.snapshot.queryParams['oobCode'];
    const mode = this.activatedRoute.snapshot.queryParams['mode'];

    if (oobCode && mode === 'verifyEmail') this.verifyEmail(oobCode);
    if (oobCode && mode === 'resetPassword') this.openResetPasswordModal();
  }

  // ---------- Helpers ----------
  private ensureFirebaseAuth() {
    if (!getApps().length) initializeApp(environment.firebase);
    return getAuth();
  }

  private setAuthLocalStorage(idToken: string, email: string, seconds = 3600) {
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('email', email);

    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + seconds);
    localStorage.setItem('expiresIn', String(expiry.getTime()));

    localStorage.setItem('rememberMe', this.rememberMe ? 'yes' : 'no');
  }

  private handleLoginSuccessRedirect() {
    window.open('account', '_top');
  }

  // ---------- Verificación email ----------
  private verifyEmail(oobCode: string) {
    const body = { oobCode };
    this.usersService.confirmEmailVerificationFnc(body).subscribe({
      next: (resp: any) => {
        if (resp.emailVerified && resp.email) {
          this.usersService.getFilterData('email', resp.email).subscribe((u: any) => {
            const id = Object.keys(u).toString();
            this.usersService.patchData(id, { needConfirm: true }).subscribe((p: any) => {
              if (p.needConfirm) Sweetalert.fnc('success', '¡Email confirm, login now!', 'login');
            });
          });
        }
      },
      error: (err) => {
        if (err?.error?.error?.message === 'INVALID_OOB_CODE') {
          Sweetalert.fnc('error', 'The email has already been confirmed', 'login');
        }
      }
    });
  }

  private openResetPasswordModal() {
    const el = document.getElementById('newPassword');
    if (el) {
      new (window as any).bootstrap.Modal(el).show();
    }
  }

  // ---------- Formulario ----------
  onSubmit(f: NgForm) {
    if (f.invalid) return;

    Sweetalert.fnc('loading', 'Loading...', null);

    // Verificar que el correo esté confirmado en DB
    this.usersService.getFilterData('email', this.user.email!).subscribe((resp1: any) => {
      for (const key of Object.keys(resp1)) {
        const record = resp1[key];
        if (record.needConfirm) {
          // Login Firebase Auth
          this.user.returnSecureToken = true;
          this.usersService.loginAuth(this.user).subscribe({
            next: (resp2: any) => {
              const idToken: string = resp2.idToken;
              const email: string = resp2.email;
              const expiresInSeconds = Number(resp2.expiresIn ?? 3600);

              // Actualizar idToken en DB
              const id = Object.keys(resp1).toString();
              this.usersService.patchData(id, { idToken }).subscribe(() => {
                this.setAuthLocalStorage(idToken, email, expiresInSeconds);
                this.handleLoginSuccessRedirect();
              });
            },
            error: (err) => {
              Sweetalert.fnc('error', err?.error?.error?.message ?? 'Login error', null);
            }
          });
        } else {
          Sweetalert.fnc('error', 'Need Confirm your email', null);
        }
      }
    });
  }

  resetPassword(email: string) {
    Sweetalert.fnc('loading', 'Loading...', null);
    this.usersService.getFilterData('email', email).subscribe((resp: any) => {
      if (Object.keys(resp).length > 0) {
        this.usersService
          .sendPasswordResetEmailFnc({ requestType: 'PASSWORD_RESET', email })
          .subscribe((r: any) => {
            if (r.email === email) {
              Sweetalert.fnc('success', 'Check your email to change the password', 'login');
            }
          });
      } else {
        Sweetalert.fnc('error', 'The email does not exist in our database', null);
      }
    });
  }

  newPassword(value: string) {
    if (!value) return;
    Sweetalert.fnc('loading', 'Loading...', null);

    const oobCode = this.activatedRoute.snapshot.queryParams['oobCode'];
    this.usersService.confirmPasswordResetFnc({ oobCode, newPassword: value }).subscribe((r: any) => {
      if (r.requestType === 'PASSWORD_RESET') {
        Sweetalert.fnc('success', 'Password change successful, login now', 'login');
      }
    });
  }

  // ---------- Social Login (Facebook / Google) ----------
  async facebookLogin() {
    try {
      Sweetalert.fnc('loading', 'Loading...', null);

      const auth = this.ensureFirebaseAuth();
      const provider = new FacebookAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);

      await this.afterSocialLogin(result, 'facebook');
    } catch (error: any) {
      Sweetalert.fnc('error', error?.message ?? 'Facebook login error', 'login');
    }
  }

  async googleLogin() {
    try {
      Sweetalert.fnc('loading', 'Loading...', null);

      const auth = this.ensureFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result: UserCredential = await signInWithPopup(auth, provider);

      await this.afterSocialLogin(result, 'google');
    } catch (error: any) {
      Sweetalert.fnc('error', error?.message ?? 'Google login error', 'login');
    }
  }

  private async afterSocialLogin(result: UserCredential, expectedMethod: 'facebook' | 'google') {
    const firebaseUser = result.user;
    const email = firebaseUser.email!;
    const idToken = await firebaseUser.getIdToken(/* forceRefresh */ true);

    // Buscar usuario en DB por email
    this.usersService.getFilterData('email', email).subscribe((resp: any) => {
      if (Object.keys(resp).length === 0) {
        Sweetalert.fnc('error', 'This account is not registered', 'register');
        return;
      }

      const id = Object.keys(resp).toString();
      const record = resp[id];

      if (record.method !== expectedMethod) {
        Sweetalert.fnc(
          'error',
          `You're already signed in, please login with ${record.method} method`,
          'login'
        );
        return;
      }

      // Actualiza token en DB y guarda en localStorage
      this.usersService.patchData(id, { idToken }).subscribe(() => {
        this.setAuthLocalStorage(idToken, email, 3600);
        this.handleLoginSuccessRedirect();
      });
    });
  }
}
