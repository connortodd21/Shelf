import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from '../login/login/login.component';
import { RouterTestingModule } from "@angular/router/testing";
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { CommonModule } from "@angular/common";
import { InputMaskModule } from "primeng/inputmask";
import { MatCardModule } from "@angular/material/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ProfileComponent } from '../profile/profile/profile.component';
import { NavModule } from '../nav/nav.module';
import { HomeModule } from '../home/home.module';
import { LoginModule } from '../login/login.module';
import { SearchModule } from '../search/search.module';
import { InboxModule } from '../inbox/inbox.module';
import { SettingsModule } from '../settings/settings.module';
import { FindUsersModule } from '../find-users/find-users.module';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { GameOverviewModule } from '../game-overview/game-overview.module';
import { UserOverviewModule } from '../user-overview/user-overview.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

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
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Profile component should successfully render', () => {
    expect(component).toBeTruthy();
  });
});
