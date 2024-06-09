import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ManagementComponent} from "./management/management.component";
import {HomeComponent} from "./home/home.component";
import {BorrowComponent} from "./home/borrow/borrow.component";

const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'management',component:ManagementComponent},
  {path:'borrow',component:BorrowComponent},
  {path: '',   redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
