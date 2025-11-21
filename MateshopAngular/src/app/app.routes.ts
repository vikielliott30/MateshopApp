import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookPostFormComponent } from './bookpostform/bookpostform.component';
import { MatesComponent } from './mates/mates.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'mates', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mates', component: MatesComponent },
  { path: 'add-mate', component: BookPostFormComponent },
  { path: 'edit-mate/:id', component: BookPostFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }