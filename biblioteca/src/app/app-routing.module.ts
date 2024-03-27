import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManagementComponent} from "./management/management.component";
import {HomeComponent} from "./home/home.component";
import {BookSearchPageComponent} from "./home/book-search-page/book-search-page.component";

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'book',component:BookSearchPageComponent},
  {path:'management',component:ManagementComponent},
  {path: '',   redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
