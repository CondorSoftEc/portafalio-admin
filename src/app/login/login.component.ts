import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService,
              private router: Router) {
  }

  logIn(email, password): void {
    this.authService.signIn(email.value, password.value)
      .then((res) => {
        // console.log(res);

        this.router.navigate(['']);

      }).catch((error) => {
        let message = error.message;
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          message = 'Usuario no encontrado!';
        } else if (errorCode === 'auth/wrong-password') {
          message = 'Contraseña incorrecta!';
        } else if (errorCode === 'auth/invalid-email') {
          message = 'Este correo esta asociado a otra cuenta!';
        } else if (errorCode === 'auth/user-disabled') {
          message = 'Usuario inhabilitado!';
        }
        window.alert(message);
      }
    );
  }

  ngOnInit(): void {
  }

}
