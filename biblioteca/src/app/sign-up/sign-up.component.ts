import { Component } from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {EndPoints} from "../endPoints";
import {RegistrationClass} from "../model/registration.model";

import {FormControl, Validators} from "@angular/forms";
import {countriesDialCodes} from "../model/countryDialCode.model";
import {AlertDialogComponent} from "./alert-dialog.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  registrationData:RegistrationClass;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  dialCode:string="+34";
  constructor(private http:HttpClient,
              private snackBar:MatSnackBar,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<SignUpComponent>) {
    this.registrationData = new RegistrationClass("","","","");
  }
  Registration(){
    this.registrationData.email=this.emailFormControl.value==null?"":this.emailFormControl.value;
    this.registrationData.telephone=this.dialCode+this.registrationData.telephone;

    if(this.notNull()){
      this.http.post(EndPoints.user,this.registrationData)
        .subscribe((data:any)=>{
          const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
            width:'500px',
            data:{
              title:'Reminders',
              message:':) Successful registration.',
              confirm:false
            }
          })
          dialogRef.afterClosed().subscribe(()=>{
            this.dialogRef.close();
          })
        },(error:any)=>{
          if(error.status==409){
            this.showError("Conflict Exception. Telephone "+this.registrationData.telephone +" is exist")
          }else {
            this.showError("Unknown error")
          }
        })
    }else {
      alert("Empty with data")
    }
  }
  notNull(){
    return this.registrationData.telephone==''?false:
      this.emailCorrectFormat(1)?false:
        this.registrationData.name==''?false:
          this.registrationData.password != '';
  }
  public showError(notification: string): void {
      this.snackBar.open(notification, 'Error', {duration: 5000});
  }
  onSelectCountryDialCode(dialCode:any){
    this.dialCode = dialCode.target.value.dialCode;
  }

  emailCorrectFormat(num:number){
    if(num==1){
      return this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required');
    }else {
      return this.emailFormControl.hasError('required')
    }
  }

  protected readonly countriesDialCodes = countriesDialCodes;
}

