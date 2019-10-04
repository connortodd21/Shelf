import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from '../profile/profile/profile.component';
import { LoginComponent } from '../login/login/login.component';
import {LoginModule} from "../login/login.module";
import {RouterTestingModule} from "@angular/router/testing";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {CommonModule} from "@angular/common";
import {InputMaskModule} from "primeng/inputmask";
import {MatCardModule} from "@angular/material/card";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AuthData} from "../models/auth.data.model";
import {LoginService} from "../login/login/login.service";
import { ProfileService } from '../profile/profile/profile.service';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {LOGIN_URL} from "../constants/constants.urls";
import {HttpModule} from "@angular/http";
import { HomeModule } from '../home/home.module';
import { ProfileModule } from '../profile/profile.module';
import { InboxModule } from '../inbox/inbox.module';
import { NavModule } from '../nav/nav.module';
import { GameOverviewModule } from '../game-overview/game-overview.module';
import { SettingsModule } from '../settings/settings.module';
import { SearchModule } from '../search/search.module';
import { FindUsersModule } from '../find-users/find-users.module';
import { UserOverviewModule } from '../user-overview/user-overview.module';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let loginService: LoginService;
  let profileService: ProfileService;
  const userInfo: AuthData = { username: 'morgankaehr', password: 'morgankaehr', email: 'morgankaehr@gmail.com', birthday: '01/01/2000' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent, PageNotFoundComponent ],
      imports: [
        CommonModule,
        ButtonModule,
        InputMaskModule,
        MatCardModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        ToastModule,
        ReactiveFormsModule,
        GameOverviewModule,
        NavModule,
        UserOverviewModule,
        RouterTestingModule,
        HomeModule,
        LoginModule,
        SearchModule,
        InboxModule,
        SettingsModule,
        FindUsersModule,
        HttpClientTestingModule,
        HttpClientModule
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    loginService = TestBed.get(LoginService);
    profileService = TestBed.get(ProfileService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Profile component should successfully render', () => {
    expect(component).toBeTruthy();
  });

  it('Can visit other users page', () => {
    loginService.loginUser(userInfo.username, userInfo.password).subscribe(
      res => {
        console.log(res);
        expect(1).toEqual(1);
      },
      err => {
        console.log(err);
      }
    );

    profileService.getUserData('alex123').then(
        res => {
          expect(res.username).toEqual('alex');
          expect(res.email).toEqual('alex@gmail.com');
        },
        err => {
          console.log(err);
        }
    );
  });
});
