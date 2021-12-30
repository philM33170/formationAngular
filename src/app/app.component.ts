import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'monAgence';
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDzfQVc745l9Nqz_ujXW1RvyBRqJGIGdyU",
      authDomain: "monagence-69874.firebaseapp.com",
      databaseURL: "https://monagence-69874-default-rtdb.europe-west1.firebasedatabase.app/",
      projectId: "monagence-69874",
      storageBucket: "monagence-69874.appspot.com",
      messagingSenderId: "175909034187",
      appId: "1:175909034187:web:a4c13226d459c84464a34e"
    };
    firebase.initializeApp(firebaseConfig);
  }
}
