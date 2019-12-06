import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AuthGuard } from './auth/auth-guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home/home.component';
import {
  HOME_PAGE, LOGIN_PAGE, NOTFOUND_PAGE,
  DETAILED_GAME_PAGE, PROFILE_PAGE, INBOX_PAGE,
  SEARCH_PAGE, FIND_USERS_PAGE, SETTINGS_PAGE, LEADERBOARD, MESSAGES_PAGE, FEED_PAGE
} from './constants/constants.pages';
import { DetailedGameComponent } from './detailed-game/detailed-game.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { InboxComponent } from './inbox/inbox/inbox.component';
import { SearchComponent } from './search/search/search.component';
import { SettingsComponent } from './settings/settings/settings.component';
import { FindUsersComponent } from './find-users/find-users/find-users.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { FeedComponent } from './feed/feed/feed.component';
import { MessageComponent } from './message/message/message.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: HOME_PAGE,
    pathMatch: 'full'
  },
  {
    path: HOME_PAGE,
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: LOGIN_PAGE,
    component: LoginComponent
  },
  {
    path: DETAILED_GAME_PAGE + '/:id',
    component: DetailedGameComponent,
    canActivate: [AuthGuard]
  },
  {
    path: PROFILE_PAGE + '/:username',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: SEARCH_PAGE,
    component: SearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: SEARCH_PAGE + '/:searchQuery',
    component: SearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: INBOX_PAGE,
    component: InboxComponent,
    canActivate: [AuthGuard]
  },
  {
    path: SETTINGS_PAGE,
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: FIND_USERS_PAGE,
    component: FindUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: LEADERBOARD,
    component: LeaderboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: FEED_PAGE,
    component: FeedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: MESSAGES_PAGE,
    component: MessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: NOTFOUND_PAGE,
    component: PageNotFoundComponent
  },
  {
    // 404
    path: '**',
    redirectTo: NOTFOUND_PAGE,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
