import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DatePipe} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {LoginComponent} from "./login/login.component";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {AlertDialogComponent} from "./sign-up/alert-dialog.component";
import {HomeComponent} from "./home/home.component";
import {ManagementComponent} from "./management/management.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {PersonalPageComponent} from "./home/personal-page/personal-page.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {RechargeComponent} from "./home/personal-page/recharge/recharge.component";
import {ExpirationDateDirective} from "./home/personal-page/recharge/expiration-date.directive";
import {CardNumberDirective} from "./home/personal-page/recharge/card-number.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {WithdrawMoneyComponent} from "./home/personal-page/withdraw-money/withdraw-money.component";
import {BillingRecordsComponent} from "./home/personal-page/billing-records/billing-records.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {BookPageComponent} from "./home/book-page/book-page.component";
import {BookSearchPageComponent} from "./home/book-search-page/book-search-page.component";
import {MatListModule} from "@angular/material/list";
import {AddBookPageComponent} from "./management/add-book-page/add-book-page.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {BorrowPageComponent} from "./home/borrow-page/borrow-page.component";
import {BorrowComponent} from "./home/borrow/borrow.component";
import {ReturnPageComponent} from "./home/borrow/return-page/return-page.component";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    AlertDialogComponent,
    HomeComponent,
    ManagementComponent,
    PersonalPageComponent,
    AlertDialogComponent,
    RechargeComponent,
    ExpirationDateDirective,
    CardNumberDirective,
    WithdrawMoneyComponent,
    BillingRecordsComponent,
    BookPageComponent,
    BookSearchPageComponent,
    AddBookPageComponent,
    BorrowPageComponent,
    BorrowComponent,
    ReturnPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatOptionModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatListModule,
    MatProgressBarModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
