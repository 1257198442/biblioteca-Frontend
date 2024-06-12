import {Component, OnInit} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {endPoints} from "../endPoints";
import {ReturnDataClass} from "../model/returnData.model";
import {FormControl, Validators} from "@angular/forms";
import {countriesDialCodes} from "../model/countryDialCode.model";
import {AlertDialogComponent} from "./alert-dialog.component";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit{
  registrationData:ReturnDataClass = new ReturnDataClass("","","","");
  telephoneFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('',[Validators.required,Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$')]);
  nameFormControl = new FormControl('',[Validators.required]);
  dialCode:string="+34";

  constructor(private http:HttpClient,
              private snackBar:MatSnackBar,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<SignUpComponent>) {}

  ngOnInit(): void {}

  Registration(){
    this.registrationData.telephone = this.telephoneFormControl.value == null ? "" : this.telephoneFormControl.value;
    this.registrationData.email = this.emailFormControl.value == null ? "" : this.emailFormControl.value;
    this.registrationData.password = this.passwordFormControl.value == null ? "" : this.passwordFormControl.value;
    if(this.notNull()){
      this.http.post(endPoints.user,this.computingPhone()).subscribe(()=> {
          const title = 'Reminders';
          const message = ':) Registration Successfully.'
          const confirm = false
          const input = false
          const dialogPage = this.openAlertDialogPage(title,message,confirm,input);
          dialogPage.afterClosed().subscribe(
            ()=> this.dialogRef.close());
        },error=> this.showError(error.status+error.message));
    }else {
      this.showError("Error: Empty with data");
    }
  }

  computingPhone(){
    return {
      name:this.registrationData.name,
      telephone:this.dialCode+this.registrationData.telephone,
      email:this.registrationData.email,
      password:this.registrationData.password
    }
  }

  notNull(){
    return this.telephoneCorrectFormat(1) ? false :
      this.emailCorrectFormat(1) ? false :
        this.nameCorrectFormat() ? false :
          !this.passwordCorrectFormat(1);
  }

  public showError(notification: string) {
      this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  onSelectCountryDialCode(dialCode:any){
    this.dialCode = dialCode.target.value.dialCode;
  }
  nameCorrectFormat(){
      return this.telephoneFormControl.hasError('required')
  }

  telephoneCorrectFormat(num:number){
    if(num==1){
      return this.telephoneFormControl.hasError('pattern') && !this.telephoneFormControl.hasError('required');
    }else {
      return this.telephoneFormControl.hasError('required')
    }
  }

  emailCorrectFormat(num:number){
    if(num==1){
      return this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required');
    }else {
      return this.emailFormControl.hasError('required')
    }
  }

  passwordCorrectFormat(num:number){
    if(num==1){
      return this.passwordFormControl.hasError('pattern') && !this.passwordFormControl.hasError('required');
    }else {
      return this.passwordFormControl.hasError('required')
    }
  }

  protected readonly countriesDialCodes = countriesDialCodes;

  openAlertDialogPage( title:string,message:string,confirm:boolean,input:boolean){
    return this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:title,
        message:message,
        confirm:confirm,
        input:input}})
  }
}

