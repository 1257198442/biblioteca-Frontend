import {Component, OnInit} from '@angular/core';

import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {setting, UserClass} from "./model/user.model";
import {LoginComponent} from "./login/login.component";
import {authService} from "./authService";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {endPoints} from "./endPoints";
import {NavigationEnd, Router} from "@angular/router";
import {PersonalPageComponent} from "./home/personal-page/personal-page.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isLogin:boolean = false;
  userInf:UserClass = new UserClass("","",new Date(),"","","",true,"",new setting(false,false,false,false));
  library:any;
  storedToken:any;
  avatarUrl:string = "";
  userData:any

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private user: authService,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.getLibraryData();
    setInterval(() => {
      const currentToken = sessionStorage.getItem('jwtToken');
      if(currentToken==null){
        this.isLogin= false;
        this.storedToken = "";
        this.router.navigate(['/home']);
      }
      if (currentToken !== this.storedToken) {
        this.storedToken = currentToken !== null ? currentToken : "";
        this.userData = this.user.getUserData();
        if(this.user.isNoNull(this.userData)){
          this.getUserData();
          this.isLogin=true;}}
    }, 1000);
  }

  login(){
    this.dialog.open(LoginComponent, {
      width:"470px",
    }).afterClosed().subscribe(()=> {
      // this.getToken();
      this.userData = this.user.getUserData();
      if(this.user.isNoNull(this.userData)){
        this.getUserData();
        this.isLogin=true;
      }
    });
  }

  logout(){
    // this.userTelephone = "";
    // this.userRole = "";
    this.userData = this.user.initUserData();
    sessionStorage.removeItem('jwtToken');
    this.isLogin = false;
  }

  getUserData(){
    this.http.get(endPoints.user + "/" + this.userData.userTelephone + "/profile",this.user.optionsAuthorization2()).subscribe(
      (data:any)=> {
        this.userInf = data.body;
        this.getAvatar();
      },error => this.showError(error.message))
  }

  admin(){
    return this.userInf.role === "ADMINISTRATOR" || this.userInf.role === "ROOT";
  }

  getLibraryData(){
    this.http.get(endPoints.library).subscribe(
      (data:any) => this.library = data
      , error => this.showError(error.message))
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getLibraryData();
      }
    });
  }

  getAvatar(){
    this.http.get(endPoints.avatar + "/" + this.userData.userTelephone).subscribe(
        (data:any) => this.avatarUrl = data.url
        , error => this.showError(error.status+error.message))
  }

  openPersonalPage(){
    this.dialog.open(PersonalPageComponent,{
      width:"800px",
      minWidth:"800px",
      height:"auto",
      maxHeight:"600px",
      data:{
        telephone:this.userInf.telephone,
      }
    }).afterClosed().subscribe(() => this.getUserData())
  }

  openSignUpPage(){
    this.dialog.open(SignUpComponent,
      {
        width:"470px",
      }).afterClosed().subscribe(() => this.login());
  }

  public showError(notification: string) {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}
