import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

import {HttpClient} from "@angular/common/http";
import {authService} from "../../AuthService";
import {setting, UserClass} from "../../model/user.model";
import {endPoints} from "../../endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent {
  userData:UserClass=new UserClass("","",new Date(),"","","",false,"",new setting(false,false));
  userAdmin:string="";
  userTelephone:string=""
  wallet:number=0;
  maxDate: Date;
  userUpdate:any;
  editProfileState= 0;

  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private user:authService,
              private http:HttpClient,
              private snackBar: MatSnackBar) {
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
    }
    this.getUserData(data.telephone);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
  }

  getUserData(telephone:string){
    this.http.get(endPoints.user+"/"+telephone,this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.userData = data.body;
      this.getWallet();
      this.userUpdate={
        name:this.userData.name,
        description:this.userData.description,
        email:this.userData.email,
        birthdays:this.userData.birthdays,
        setting:this.userData.setting
      }
    },error => this.showError(error))
  }

  getWallet(){
    this.http.get(endPoints.wallet+"/"+this.userData.telephone,this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.wallet = data.body.balance;
    },(error)=>{
      this.showError(error)
    })
  }

  isLoginUser(){
    return this.userTelephone==this.userData.telephone;
  }
  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  upDateUser(){
    const userOrigen = {
      name:this.userData.name,
      description:this.userData.description,
      email:this.userData.email,
      birthdays:this.userData.birthdays}
    if(this.userUpdate!==userOrigen){
      const datePipe = new DatePipe('en-US');
      const time = datePipe.transform(this.userUpdate.birthdays, 'yyyy-MM-dd');
      this.userUpdate.birthdays=time;
      console.log(time)
      this.http.put(endPoints.user+"/"+this.userData.telephone,this.userUpdate,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.getUserData(this.userData.telephone);
      },(error)=>{
        console.log(error);
      })
    }
  }

}
