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
  userData:UserClass = new UserClass("","",new Date(),"","","",true,"",new setting(true,true,true,true,true));
  library:any;
  userRole:string="";
  userTelephone:string=""
  storedToken:any;
  avatarUrl:string = "";

  constructor(private http: HttpClient,
              private dialog: MatDialog,
              private transmit: authService,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.getLibraryData();
    setInterval(() => {
      const currentToken = sessionStorage.getItem('jwtToken');
      if(currentToken==null){
        this.isLogin= false;
        this.userRole="";
        this.userTelephone="";
        this.storedToken = "";
        this.router.navigate(['/home']);
      }
      if (currentToken !== this.storedToken) {
        this.storedToken = currentToken !== null ? currentToken : "";
        this.getToken();
        if(this.userTelephone !== ""){
          this.getUserData();
          this.isLogin=true;
        }
      }
    }, 1000);
  }

  login(){
    this.dialog.open(LoginComponent, {
      width:"470px",
    }).afterClosed().subscribe(()=> {
      this.getToken();
      if(this.userTelephone !== ""){
        this.getUserData();
        this.isLogin=true;
      }
    });
  }

  getToken(){
    const jwtToken = sessionStorage.getItem('jwtToken');
    if (jwtToken) {
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userRole = decodedPayload.role;
    }
  }

  logout(){
    this.userTelephone = "";
    this.userRole = "";
    sessionStorage.removeItem('jwtToken');
    this.isLogin = false;
  }

  getUserData(){
    this.http.get(endPoints.user + "/" + this.userTelephone,this.transmit.optionsAuthorization2()).subscribe(
      (data:any)=> {
        this.userData = data.body;
        this.getAvatar();
      },error => this.showError(error.message))
  }

  admin(){
    return this.userData.role === "ADMINISTRATOR" || this.userData.role === "ROOT";
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
    this.http.get(endPoints.avatar + "/" + this.userTelephone).subscribe(
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
        telephone:this.userData.telephone,
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
