import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from './servies/auth.service';

@Injectable({ providedIn: 'root' })
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
      console.log(res);
      this.authService.logout();
    });
  }

}
