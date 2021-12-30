import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = "Ma Super Agence";
  isLogin = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    const auth = getAuth();
    auth.onAuthStateChanged((userSession) => {
        if(userSession) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
    })
  }

  onSignOut() {
    this.authenticationService.signOutUser();
  }
}
