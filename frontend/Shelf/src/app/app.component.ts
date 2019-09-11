import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './servies/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shelf';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.checkAuthenticationStatus();
  }

  logout() {
    this.authService.logoutUser().then(res => {
      this.authService.logout();
    });
  }

}
