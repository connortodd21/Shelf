import { Component, OnInit, Injectable } from '@angular/core';
import { LoginService } from './login/login/login.service';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Shelf';

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.checkAuthenticationStatus();
  }

}
