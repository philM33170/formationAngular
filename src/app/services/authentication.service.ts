import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  signUpUser(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
                              .then(() => {
                                console.log("Connecté");
                                resolve();
                              })
                              .catch((error) => {
                                reject(error);
                              })
    })
  }

  signInUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
                              .then((data) => {
                                resolve(data);
                              })
                              .catch((error) => {
                                reject(error);
                              })
    })
  }

  signOutUser() {
    const auth = getAuth();
    signOut(auth);
  }
}
