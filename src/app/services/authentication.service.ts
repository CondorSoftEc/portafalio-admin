import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState;

  constructor(public ngFireAuth: AngularFireAuth) {
  }


  setAuthState(authState): void {
    this.authState = authState;
  }

  signIn(email, password): any {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }


  signOut(): any {
    return this.ngFireAuth.signOut();
  }
}
