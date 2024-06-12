import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../authService";
import {setting, UserClass} from "../../model/user.model";
import {endPoints} from "../../endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";
import {RechargeComponent} from "./recharge/recharge.component";
import {WithdrawMoneyComponent} from "./withdraw-money/withdraw-money.component";
import {BillingRecordsComponent} from "./billing-records/billing-records.component";
import {BookModel} from "../../model/book.model";
import {BookPageComponent} from "../book-page/book-page.component";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit{
  userInf:UserClass = new UserClass("","",new Date(),"","","",false,"",new setting(false,false,false,false));
  wallet:number = 0;
  maxDate: Date = new Date();
  userUpdate:any;
  avatarUrl:string = "";
  avatarSelectUrl:string = "";
  file: File | undefined;
  settingUpdate:any;
  newPassword:string = "";
  confirmPassword:string = "";
  editProfileState= 0;
  editSettingState= 0;
  editPasswordState= 0;
  collectionList:BookModel[] = [];
  lowForBookList:string[] = ["bookID","name","entryTime","status","view","management"];
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  nameFormControl = new FormControl('', [Validators.required]);
  userData:any;
  data:any;
  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              public user:authService,
              private http:HttpClient,
              private dialog:MatDialog,
              private snackBar: MatSnackBar) {
    this.data = data;
  }

  ngOnInit(): void {
    this.userData = this.user.getUserData();
    this.getUserInf(this.data.telephone);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
  }

  getUserInf(telephone:string){
    this.http.get(endPoints.user+"/"+telephone + "/profile",this.user.optionsAuthorization2()).subscribe(
      (data:any)=> {
      this.userInf = data.body;
      this.emailFormControl.setValue(this.userInf.email);
      this.nameFormControl.setValue(this.userInf.name)
      this.getAvatar();
      this.getWallet();
      this.getCollectionList();
      this.userUpdate=this.generateUserUpdate();
      this.settingUpdate = this.generateSettingUpdate();
    },error => this.showError(error.status+error.message))
  }

  generateUserUpdate(){
    return{
      name:this.userInf.name,
      description:this.userInf.description,
      email:this.userInf.email,
      birthdays:this.userInf.birthdays,
      setting:this.userInf.setting
    }
  }

  generateSettingUpdate (){
    return{
      emailWhenSuccessfulTransaction:this.userInf.setting.emailWhenSuccessfulTransaction,
      emailWhenOrderIsPaid:this.userInf.setting.emailWhenOrderIsPaid,
      emailWhenOrdersAboutToExpire:this.userInf.setting.emailWhenOrdersAboutToExpire,
      emailWhenOrdersUpdates:this.userInf.setting.emailWhenOrdersUpdates,
    }
  }

  getWallet(){
    if(this.isLoginUser() || this.user.isROOT(this.userData)){
      this.http.get(endPoints.wallet + "/" + this.userInf.telephone,this.user.optionsAuthorization2()).subscribe(
        (data:any)=> this.wallet = data.body.balance
      ,error => this.showError(error.status+error.message));
    }
  }

  isLoginUser(){
    return this.userData.userTelephone === this.userInf.telephone;
  }

  updateInformation(){
    this.userUpdate.email = this.emailFormControl.value == null ? "" : this.emailFormControl.value;
    this.userUpdate.name =  this.nameFormControl.value == null ? "" : this.nameFormControl.value;
    const userOrigen = {
      name:this.userInf.name,
      description:this.userInf.description,
      email:this.userInf.email,
      birthdays:this.userInf.birthdays}
    if(this.userUpdate !== userOrigen){
      const datePipe = new DatePipe('en-US');
      this.userUpdate.birthdays = datePipe.transform(this.userUpdate.birthdays, 'yyyy-MM-dd');
      this.http.put(endPoints.user + "/" + this.userInf.telephone,this.userUpdate,this.user.optionsAuthorization2()).subscribe(
        () => this.getUserInf(this.userInf.telephone)
      ,error => this.showError(error.status+error.message)
      )
    }
  }

  updateSetting(){
    const settingOrigen = this.userInf.setting;
    if(this.settingUpdate !== settingOrigen){
      this.http.put(endPoints.user + "/" + this.userInf.telephone + "/setting",this.settingUpdate,this.user.optionsAuthorization2()).subscribe(
        () => this.getUserInf(this.userInf.telephone)
        ,error=>this.showError(error.status+error.message)
      )
    }
  }

  changePassword(){
    if(this.confirmPassword === this.newPassword){
      const title = 'Password verification';
      const message = 'Old Password';
      const confirm = true;
      const input = true;
      const dialogPage = this.openAlertDialogPage(title,message,confirm,input);
      dialogPage.afterClosed().subscribe(res => {
        if(res.confirm === 'confirm'){
          const changePassword= {
            oldPassword:res.input,
            newPassword:this.newPassword
          }
          this.http.put(endPoints.user + "/" + this.userInf.telephone + "/password",changePassword,this.user.optionsAuthorization2()).subscribe((data:any)=>{
            const title = 'Reminders';
            const message ='Password modified successfully';
            const confirm = false;
            const input = false;
            const dialogPage1 =this.openAlertDialogPage(title,message,confirm,input);
            dialogPage1.afterClosed().subscribe(()=> this.initPassword());
            },error => this.showError(error.status+error.message))
        }
      });
    }else {
      this.showError("Confirm Password is not the same as the new password")
    }
  }

  initPassword(){
    this.newPassword = "";
    this.confirmPassword = "";
    this.editPasswordState = 0;
  }

  resetPassword(){
    const title = 'Reminders';
    const message = 'Clicking confirm will reset the password for user ('+this.userInf.telephone+').';
    const confirm = true;
    const input = false;
    const dialogPage= this.openAlertDialogPage(title,message,confirm,input)
    dialogPage.afterClosed().subscribe(res => {
      if(res == "confirm"){
        this.http.put(endPoints.user + "/" + this.userInf.telephone + "/resetPassword",{},this.user.optionsAuthorization2()).subscribe(()=> {
          const title = 'Reminders';
          const message = 'Password reset successfully';
          const confirm = false;
          const input = false;
          const dialogPage1 = this.openAlertDialogPage(title,message,confirm,input)
          dialogPage1.afterClosed().subscribe(()=> this.initPassword())
        },error => this.showError(error.status+error.message));
      }
    });
  }
  noNull(){
      return  this.emailCorrectFormat(1) ? false :
        !this.nameCorrectFormat();
  }
  getAvatar(){
    this.http.get(endPoints.avatar + "/" + this.userInf.telephone).subscribe(
      (data:any)=>{
      this.avatarUrl = data.url;
      this.avatarSelectUrl = this.avatarUrl;
    },error=> this.showError(error.status+error.message))
  }

  emailCorrectFormat(num:number){
    if(num==1){
      return this.emailFormControl.hasError('email') && !this.emailFormControl.hasError('required');
    }else {
      return this.emailFormControl.hasError('required')
    }
  }
  nameCorrectFormat(){
    return this.nameFormControl.hasError('required');
  }

  onFileSelected(event: any){
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
    if(this.avatarSelectUrl !== ""){
      const formData = new FormData();
      formData.append('file', this.file as Blob);
      this.http.put(endPoints.avatar + "/" + this.userInf.telephone,formData,this.user.optionsAuthorization2()).subscribe(
        () => this.getUserInf(this.userInf.telephone)
      ,error => this.showError(error.status+error.message))
    }
  }

  getCollectionList(){
    if(this.userInf.role === "CLIENT"){
      this.http.get(endPoints.collection + "/" + this.userInf.telephone + "/book",this.user.optionsAuthorization2()).subscribe(
        (data:any)=>this.collectionList = data.body
      ,(error) => {
          if (error.status === 403) {
            console.log("This user has hidden sus favorites list")
          }else {
            this.showError(error.status+error.message)
          }
        })
    }
  }

  remove(bookId:string){
    this.http.put(endPoints.collection+"/"+this.userInf.telephone+"/remove_book",bookId,this.user.optionsAuthorization2()).subscribe(
      ()=> this.getUserInf(this.userInf.telephone)
      ,error => this.showError(error.status+error.message))
  }

  openRechargePage(){
    this.dialog.open(RechargeComponent,{
      width:"600px",
      minWidth:"600px",
      height:"auto",
      maxHeight:"800px",
      data:{
        telephone:this.userInf.telephone
      }
    }).afterClosed().subscribe(
      () => this.getWallet());
  }

  openWithdrawMoneyPage(){
    this.dialog.open(WithdrawMoneyComponent,{
      width:"600px",
      minWidth:"600px",
      height:"auto",
      maxHeight:"800px",
      data:{
        telephone:this.userInf.telephone
      }
    }).afterClosed().subscribe(
      () => this.getWallet());
  }

  openBillingRecordsPage(){
    this.dialog.open(BillingRecordsComponent,{
      width:"600px",
      minWidth:"600px",
      height:"auto",
      maxHeight:"600px",
    })
  }

  openAlertDialogPage( title:string,message:string,confirm:boolean,input:boolean){
    return this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:title,
        message:message,
        confirm:confirm,
        input:input
      }
    })
  }

  openBookPage(bookId:string){
    this.dialog.open(BookPageComponent,{
      width:"800px",
      minWidth:"800px",
      height:"auto",
      maxHeight:"600px",
      data:{
        bookId:bookId
      }
    }).afterClosed().subscribe(()=>this.getCollectionList());
  }

  wishListIsDisplay(){
    return this.collectionList.length !== 0
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}
