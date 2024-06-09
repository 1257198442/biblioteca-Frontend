import {Injectable} from '@angular/core';
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class authService {
  constructor(public router:Router) {
  }

  public optionsAuthorization1(loginData:any,dialCode:string){
    const heard = new HttpHeaders().append('Authorization', 'Basic ' + btoa(dialCode+loginData.telephone + ":" + loginData.password))
    const options: any = {
      headers: heard,
      params: new HttpParams(),
      responseType: 'json',
      observe: 'response'
    }
    return options
  }
  public optionsAuthorization2(body?:any) {
    const heard = new HttpHeaders().append('Authorization', "Bearer " + sessionStorage.getItem('jwtToken'));
    const options: any = {
      headers: heard,
      params: new HttpParams(),
      responseType: 'json',
      observe: 'response',
      body:body
    }
    return options
  }

  public listeningJwtToken(){
    if(!sessionStorage.getItem('jwtToken')){
      this.routerHome();
    }
  }

  public routerHome(){
    this.router.navigateByUrl('/home').then(() => this.router.navigate(['/home']));
  }

  public getUserData(){
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      return {
        userTelephone:decodedPayload.user,
        userName:decodedPayload.name,
        userRole:decodedPayload.role
      }
    }
    return this.initUserData();
  }

  initUserData(){
    return {
      userTelephone:"",
      userName:"",
      userRole:""
    };
  }

  public isNoNull(userData:any){
    return userData.userTelephone !== "" && userData.userName !== "" && userData.userRole !=="";
  }
  public isAdmin(userData:any){
    return (userData.userRole === "ROOT" || userData.userRole === "ADMINISTRATOR") && this.isNoNull(userData);
  }

  public isADMINISTRATOR(userData:any){
    return userData.userRole === "ADMINISTRATOR" && this.isNoNull(userData);
  }

  public isCLIENT(userData:any){
    return userData.userRole === "CLIENT" && this.isNoNull(userData);
  }
  public isROOT(userData:any){
    return userData.userRole === "ROOT" && this.isNoNull(userData);
  }
}
