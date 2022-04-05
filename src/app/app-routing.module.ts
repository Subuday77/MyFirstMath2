import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GamePageComponent } from './components/game-page/game-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

const routes: Routes = [
  { path: "game-page", component: GamePageComponent },
  { path: '', component: LoginPageComponent },
  { path: "", component: LoginPageComponent },
  { path: '**', component: LoginPageComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
