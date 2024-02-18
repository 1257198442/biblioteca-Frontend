import {Component, OnInit} from '@angular/core';
import {EndPoints} from "./endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {UserClass} from "./model/user.model";
import {LoginComponent} from "./login/login.component";
import {authService} from "./AuthService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  avatarUrl:string = "";
  isLogin:boolean = false;
  userData:UserClass=new UserClass("","",new Date(),"","",false);
  library:any;
  userAdmin:string="";
  userTelephone:string=""
  storedToken:any;
  constructor(private http:HttpClient,
              private dialog:MatDialog,
              private transmit:authService,
              private snackBar: MatSnackBar) {

    setInterval(() => {
      const currentToken = sessionStorage.getItem('jwtToken');
      if (currentToken !== this.storedToken) {
        this.storedToken = currentToken!=null?currentToken:"";
        this.getClientData();
        if(this.userTelephone!=""){
          this.getUserData();
          this.isLogin=true;
        }
      }
    }, 1000);
  }


  login():void{
    this.dialog.open(LoginComponent, {
      width:"470px",
    })
      .afterClosed().subscribe(()=> {
      this.getClientData();
      if(this.userTelephone!=""){
        this.getUserData();
        this.isLogin=true;
      }
    });
  }
  getClientData(){
    const jwtToken = sessionStorage.getItem('jwtToken');
    if (jwtToken) {
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
    }
  }
  logout():void{
    this.userTelephone="";
    this.userAdmin="";
    sessionStorage.removeItem('jwtToken');
    this.isLogin=false;
  }

  getUserData(){
    this.http.get(EndPoints.user+"/"+this.userTelephone,this.transmit.optionsAuthorization2()).subscribe(
      (data:any)=>{
        this.userData=data.body;
      },(error)=>{
        this.showError(error)
      }
    )
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}

