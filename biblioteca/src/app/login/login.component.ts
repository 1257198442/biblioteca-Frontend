import { Component } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {MatSnackBar} from '@angular/material/snack-bar';
import {authService} from "../authService";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {endPoints} from "../endPoints";
import {countriesDialCodes} from "../model/countryDialCode.model";
import {SignUpComponent} from "../sign-up/sign-up.component";
import {Login} from "../model/login.model";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: Login;
  dialCode:string="+34";
     constructor(private http:HttpClient,
                 private snackBar: MatSnackBar,
                 private loginService:authService,
                 private dialog:MatDialog,
                 public dialogRef: MatDialogRef<LoginComponent>) {
       this.loginData=new Login("","");
     }

     login():void {
       if (this.loginData.telephone != "" && this.loginData.password != "") {
         this.http.post(endPoints.user + "/login", {},this.loginService.optionsAuthorization1(this.loginData,this.dialCode))
           .subscribe(
             (response:any) => {
                const token = response.body.token;
                if(token!=""||token){
                  sessionStorage.setItem('jwtToken', token);
                  this.dialogRef.close();
                }
             },
             (error: any) => {
               if (error.status == 401) {
                 this.showError("The account or password is incorrect")
               } else if(error.status == 403){
                 this.showError("Your account has been banned.")
               } else{
                 this.showError("Wrong network connection")
               }
               this.dialogRef.close();
             }
           )
       }
     }

  openSignUpPage():void{
    this.dialog.open(SignUpComponent,
      {
        width:"470px",
      });
  }

  public showError(notification: string): void {
      this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  onSelectCountryDialCode($event:any){
       this.dialCode = $event.target.value.dialCode;
  }
  protected readonly countriesDialCodes = countriesDialCodes;
}
