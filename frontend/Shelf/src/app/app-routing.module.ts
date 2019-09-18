import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { AuthGuard } from './auth/auth-guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home/home.component';
import { HOME_PAGE, LOGIN_PAGE, NOTFOUND_PAGE, DETAILED_GAME_PAGE } from './constants/constants.pages';
import { DetailedGameComponent } from './detailed-game/detailed-game.component';

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
