import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

import {HttpClient} from "@angular/common/http";
import {authService} from "../../AuthService";
import {setting, UserClass} from "../../model/user.model";
import {endPoints} from "../../endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";
import {RechargeComponent} from "./recharge/recharge.component";

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
  avatarUrl:string="";
  avatarSelectUrl:string="";
  file: File | undefined;
  settingUpdate:any;
  newPassword:string="";
  confirmPassword:string="";
  editProfileState= 0;
  editSettingState=0;
  editPasswordState=0;

  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private user:authService,
              private http:HttpClient,
              private dialog:MatDialog,
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
      this.getAvatar();
      this.getWallet();
      this.userUpdate={
        name:this.userData.name,
        description:this.userData.description,
        email:this.userData.email,
        birthdays:this.userData.birthdays,
        setting:this.userData.setting
      }
      this.settingUpdate = {
        hideMyProfile: this.userData.setting.hideMyProfile,
        emailWhenOrderIsGenerated:this.userData.setting.emailWhenOrderIsGenerated
      };
    },error => this.showError(error))
  }

  getWallet(){
    if(this.isLoginUser()||this.userAdmin=='ROOT'){
      this.http.get(endPoints.wallet+"/"+this.userData.telephone,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.wallet = data.body.balance;
      },error=> this.showError(error))
    }

  }

  isLoginUser(){
    return this.userTelephone==this.userData.telephone;
  }
  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  updateInformation(){
    const userOrigen = {
      name:this.userData.name,
      description:this.userData.description,
      email:this.userData.email,
      birthdays:this.userData.birthdays}
    if(this.userUpdate!==userOrigen){
      const datePipe = new DatePipe('en-US');
      this.userUpdate.birthdays=datePipe.transform(this.userUpdate.birthdays, 'yyyy-MM-dd');
      this.http.put(endPoints.user+"/"+this.userData.telephone,this.userUpdate,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.getUserData(this.userData.telephone);
      },error=>this.showError(error)
      )
    }
  }

  updateSetting(){
    const settingOrigen = this.userData.setting;
    console.log(settingOrigen,this.settingUpdate)
    if(this.settingUpdate!==settingOrigen){
      this.http.put(endPoints.user+"/"+this.userData.telephone+"/setting",this.settingUpdate,this.user.optionsAuthorization2()).subscribe((data:any)=>{
          this.getUserData(this.userData.telephone);
        },error=>this.showError(error)
      )
    }
  }

  changePassword(){
    if(this.confirmPassword===this.newPassword){
      const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
        width:'500px',
        data:{
          title:'Password verification',
          message:'Old Password',
          input:true,
          confirm:true
        }
      })
      dialogRef.afterClosed().subscribe(res=>{
        if(res.confirm==='confirm'){
          const changePassword={
            oldPassword:res.input,
            newPassword:this.newPassword
          }
          this.http.put(endPoints.user+"/"+this.userData.telephone+"/password",changePassword,this.user.optionsAuthorization2()).subscribe((data:any)=>{
            const dialogRef1 =this.dialog.open(AlertDialogComponent,{
              width:"500px",
              data:{
                title:'Reminders',
                message:'Password modified successfully',
                confirm:false
              }
            })
            dialogRef1.afterClosed().subscribe(()=>{
              this.newPassword="";
              this.confirmPassword="";
              this.editPasswordState=0;
            })
            },error=>this.showError(error)
          )
        }
      })
    }else {
      this.showError("Confirm Password is not the same as the new password")
    }
  }

  resetPassword(){
    const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:'Reminders',
        message:'Clicking confirm will reset the password for user ('+this.userData.telephone+').',
        input:false,
        confirm:true
      }
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res=="confirm"){
        this.http.put(endPoints.user+"/"+this.userData.telephone+"/resetPassword",{},this.user.optionsAuthorization2())
          .subscribe((data:any)=>{
              const dialogRef1 =this.dialog.open(AlertDialogComponent,{
                width:"500px",
                data:{
                  title:'Reminders',
                  message:'Password reset successfully',
                  confirm:false
                }
              })
              dialogRef1.afterClosed().subscribe(()=>{
                this.newPassword="";
                this.confirmPassword="";
                this.editPasswordState=0;
              })
            },error=>this.showError(error)
          )
      }
    })
  }

  getAvatar(){
    this.http.get(endPoints.avatar+"/"+this.userData.telephone).subscribe((data:any)=>{
      this.avatarUrl = data.url;
      this.avatarSelectUrl = this.avatarUrl;
    },error=> this.showError(error)
    )
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.avatarSelectUrl = e.target.result;
    };
    // @ts-ignore
    if(this.file){
      reader.readAsDataURL(this.file);
    }else {
      this.avatarSelectUrl = this.avatarUrl;
    }
  }

  avatarUpdate(){
    if(this.avatarSelectUrl!=""){
      const formData = new FormData();
      formData.append('file', this.file as Blob);
      this.http.put(endPoints.avatar+"/"+this.userData.telephone,formData,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.getUserData(this.userData.telephone);
      },error => this.showError(error))
    }
  }

  openRechargePage(){
    this.dialog.open(RechargeComponent,{
      width:"600px",
      minWidth:"600px",
      height:"auto",
      maxHeight:"600px",
      data:{
        telephone:this.userData.telephone
      }
    }).afterClosed().subscribe(()=>{
      this.getWallet();
    })
  }
}
