import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { initializeApp } from 'firebase/app';
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Capitalize, Sweetalert } from '../../functions';

import { UsersModel } from '../../models/users.model';

import { UsersService } from '../../services/users.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  user: UsersModel;

  constructor(private usersService: UsersService) {
    this.user = new UsersModel();
  }

  ngOnInit(): void {
    /*=============================================
    Validar formulario de Bootstrap 4
    =============================================*/

    // Disable form submissions if there are invalid fields
    (function () {
      'use strict';
      window.addEventListener(
        'load',
        function () {
          // Get the forms we want to add validation styles to
          var forms = document.getElementsByClassName('needs-validation');
          // Loop over them and prevent submission
          var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener(
              'submit',
              function (event:any) {
                if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                form.classList.add('was-validated');
              },
              false
            );
          });
        },
        false
      );
    })();
  }

  /*=============================================
  Capitalizar la primera letra de nombre y apellido
  =============================================*/

  capitalize(input:any) {
    input.value = Capitalize.fnc(input.value);
  }

  /*=============================================
  Validación de expresión regular del formulario
  =============================================*/
  validate(input:any) {
    let pattern;

    if ($(input).attr('name') == 'username') {
      pattern = /^[A-Za-z]{2,8}$/;

      input.value = input.value.toLowerCase();

      this.usersService.getFilterData('username', input.value).subscribe((resp) => {
        if (Object.keys(resp).length > 0) {
          $(input).parent().addClass('was-validated');

          input.value = '';

          Sweetalert.fnc('error', 'Username already exists', null);

          return;
        }
      });
    }

    if ($(input).attr('name') == 'password') {
      pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
    }

    if (!pattern.test(input.value)) {
      $(input).parent().addClass('was-validated');

      input.value = '';
    }
  }

  /*=============================================
  Envío del formulario
  =============================================*/

  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }

    /*=============================================
    Alerta suave mientras se registra el usuario
    =============================================*/

    Sweetalert.fnc('loading', 'Loading...', null);

    /*=============================================
  	Registro en Firebase Authentication
  	=============================================*/

    this.user.returnSecureToken = true;

    this.usersService.registerAuth(this.user).subscribe(
      (resp) => {
        if (resp['email'] == this.user.email) {
          /*=============================================
        Enviar correo de verificación
        =============================================*/

          let body = {
            requestType: 'VERIFY_EMAIL',
            idToken: resp['idToken']
          };

          this.usersService.sendEmailVerificationFnc(body).subscribe((resp) => {
            if (resp['email'] == this.user.email) {
              /*=============================================
            Registro en Firebase Database
            =============================================*/

              this.user.displayName = `${this.user.first_name} ${this.user.last_name}`;
              this.user.method = 'direct';
              this.user.needConfirm = false;
              this.user.username = this.user.username.toLowerCase();

              this.usersService.registerDatabase(this.user).subscribe((resp) => {
                Sweetalert.fnc(
                  'success',
                  'Confirm your account in your email (check spam)',
                  'login'
                );
              });
            }
          });
        }
      },
      (err) => {
        Sweetalert.fnc('error', err.error.error.message, null);
      }
    );
  }

  /*=============================================
  Registro con Facebook
  =============================================*/

  facebookRegister() {
    let localUsersService = this.usersService;
    let localUser = this.user;

    // https://firebase.google.com/docs/web/setup
    // Crea una nueva APP en Settings
    // npm install --save firebase
    // Agregar import * as firebase from "firebase/app";
    // import "firebase/auth";

    /*=============================================
    Inicializa Firebase en tu proyecto web
    =============================================*/

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: 'api-key',
      authDomain: 'project-id.firebaseapp.com',
      projectId: 'project-id',
      storageBucket: 'project-id.appspot.com',
      messagingSenderId: 'sender-id',
      appId: 'app-id'
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    //https://firebase.google.com/docs/auth/web/facebook-login

    /*=============================================
    Crea una instancia del objeto proveedor de Facebook
    =============================================*/

    // var provider = new firebase.auth.FacebookAuthProvider();

    /*=============================================
    acceder con una ventana emergente y con certificado SSL (https)
    =============================================*/
    //ng serve --ssl true --ssl-cert "/path/to/file.crt" --ssl-key "/path/to/file.key"

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // ... tu lógica con localUser y localUsersService
      })
      .catch((error) => {
        Sweetalert.fnc('error', error.message, 'login');
      });

    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function registerFirebaseDatabase(result:any, localUser:any, localUsersService:any) {
      var user = result.user;

      if (user.P) {
        localUser.displayName = user.displayName;
        localUser.email = user.email;
        localUser.idToken = user.b.b.g;
        localUser.method = 'facebook';
        localUser.username = user.email.split('@')[0];
        localUser.picture = user.photoURL;

        /*=============================================
        Evitar que se dupliquen los registros en Firebase Database
        =============================================*/

        localUsersService.getFilterData('email', user.email).subscribe((resp:any) => {
          if (Object.keys(resp).length > 0) {
            Sweetalert.fnc(
              'error',
              `You're already signed in, please login with ${resp[Object.keys(resp)[0]].method} method`,
              'login'
            );
          } else {
            localUsersService.registerDatabase(localUser).subscribe((resp:any) => {
              if (resp['name'] != '') {
                Sweetalert.fnc('success', 'Please Login with facebook', 'login');
              }
            });
          }
        });
      }
    }
  }

  /*=============================================
  Registro con Google
  =============================================*/

  googleRegister() {
    let localUsersService = this.usersService;
    let localUser = this.user;

    // https://firebase.google.com/docs/web/setup
    // Crea una nueva APP en Settings
    // npm install --save firebase
    // Agregar import * as firebase from "firebase/app";
    // import "firebase/auth";

    /*=============================================
    Inicializa Firebase en tu proyecto web
    =============================================*/

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: 'api-key',
      authDomain: 'project-id.firebaseapp.com',
      projectId: 'project-id',
      storageBucket: 'project-id.appspot.com',
      messagingSenderId: 'sender-id',
      appId: 'app-id'
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // ... tu lógica con localUser y localUsersService
      })
      .catch((error) => {
        Sweetalert.fnc('error', error.message, 'login');
      });
    /*=============================================
    Registramos al usuario en Firebase Database
    =============================================*/

    function registerFirebaseDatabase(result:any, localUser:any, localUsersService:any) {
      var user = result.user;

      if (user.P) {
        localUser.displayName = user.displayName;
        localUser.email = user.email;
        localUser.idToken = user.b.b.g;
        localUser.method = 'google';
        localUser.username = user.email.split('@')[0];
        localUser.picture = user.photoURL;

        /*=============================================
        Evitar que se dupliquen los registros en Firebase Database
        =============================================*/

        localUsersService.getFilterData('email', user.email).subscribe((resp:any) => {
          if (Object.keys(resp).length > 0) {
            Sweetalert.fnc(
              'error',
              `You're already signed in, please login with ${resp[Object.keys(resp)[0]].method} method`,
              'login'
            );
          } else {
            localUsersService.registerDatabase(localUser).subscribe((resp:any) => {
              if (resp['name'] != '') {
                Sweetalert.fnc('success', 'Please Login with google', 'login');
              }
            });
          }
        });
      }
    }
  }
}
