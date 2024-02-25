import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {authService} from "../AuthService";
import {endPoints} from "../endPoints";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {AlertDialogComponent} from "../sign-up/alert-dialog.component";

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent{
  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;
  lowForUserList:string[]=["telephone","name","email","admin","modify_permissions","view"];
  rolesListROOT:string[]=["ADMINISTRATOR","CLIENT","BAN"];
  rolesListADMINISTRATOR:string[]=["ADMINISTRATOR","CLIENT"];
  selectRolesList:string[]=[];
  private errorNotification = undefined;
  userAdmin:string="";
  userTelephone:string=""
  origenLibraryData:any;
  updateLibraryData:any;
  constructor(private http:HttpClient,
              private user:authService,
              private dialog:MatDialog,
              public router:Router,
              private snackBar: MatSnackBar) {
    this.user.listeningJwtToken();
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
    }
    this.init();
  }
  init(){
    if(this.userTelephone != ""){
      this.getAllUserList();
      this.getLibraryData();
    }
  }
  userDataSource:any;
  getAllUserList(){
    if(this.userAdmin==="ROOT"){
      this.selectRolesList=this.rolesListROOT
    }else if(this.userAdmin==="ADMINISTRATOR"){
      this.selectRolesList=this.rolesListADMINISTRATOR
    }
      this.http.get(endPoints.user,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.userDataSource = new MatTableDataSource(data.body);
        this.userDataInit();
      },(error)=>{console.log(error)})
    }

  getLibraryData(){
    this.http.get(endPoints.library+"/BIBLIOTECA").subscribe((data:any)=>{
      this.origenLibraryData = data;
      this.updateLibraryData = Object.assign({}, this.origenLibraryData);
    },(error)=>{
      console.log(error)
    })
  }

  userDataInit() {
    this.userDataSource.paginator = this.userPaginator;
    this.userDataSource.sort = this.userSort;
  }

  applyUserFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();
    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

  isRoot():boolean{
    return this.userAdmin=="ROOT";
  }

  isAdministrators():boolean{
    return this.userAdmin=="ADMINISTRATOR";
  }

  toAdministrators(telephone:string){
        const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
          width:'500px',
          data:{
            title:'Reminders',
            message:'Confirm changing the permissions of user '+telephone+' to admin?..',
            confirm:true
          }
        })
        dialogRef.afterClosed().subscribe(res=>{
          if(res==='confirm'){
            this.http.put(endPoints.user+"/"+telephone+"/role","ADMINISTRATOR",this.user.optionsAuthorization2()).subscribe(
              (data:any)=>{this.getAllUserList()},(error)=>{
                console.log(error)
              }
            )
          }
        })
  }

  toUser(telephone:string){
    const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:'Reminders',
        message:'Are you sure you want to change the permissions on '+telephone+' to client?',
        confirm:true
      }
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.put(endPoints.user+"/"+telephone+"/role","CLIENT",this.user.optionsAuthorization2()).subscribe(
          (data:any)=>{this.getAllUserList()},(error)=>{
            console.log(error)
          }
        )
      }
    })
  }

  toBan(telephone:string){
    const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:'Warning',
        message:'Are you sure you want to disable this account? If you disable it, the account holder will not be able to use the account.',
        confirm:true
      }
    })
    dialogRef.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.put(endPoints.user+"/"+telephone+"/role","BAN",this.user.optionsAuthorization2()).subscribe(
          (data:any)=>{
            this.getAllUserList()},(error)=>{
            console.log(error)
          }
        )
      }
    })
  }

  toModifyAdmin(telephone:string,admin:string){
    if(admin=="ADMINISTRATOR"){
      this.toAdministrators(telephone);
    }else if(admin=="CLIENT"){
      this.toUser(telephone);
    }else if(admin=="BAN"){
        this.toBan(telephone)
    } else {
      this.showError("operating error.")
    }
  }

  public showError(notification: string): void {
    if (this.errorNotification) {
      this.snackBar.open(this.errorNotification, 'Error', {duration: 5000});
      this.errorNotification = undefined;
    } else {
      this.snackBar.open(notification, 'Error', {duration: 5000});
    }
  }

  modifyRoleButtonIsDisplay(role:string,modifyRole:string):boolean{
    if(this.isRoot()&&role!=modifyRole){
      return true;
    }else if(this.isAdministrators() && role != modifyRole && modifyRole=="ADMINISTRATOR"){
      return true;
    }else {
      return false;
    }
  }

  shouldDisplayElement(element:any): boolean {
    if (this.userTelephone === element.telephone) {
      return false;
    }
    if (element.admin === 'ROOT') {
      return false;
    }
    if (this.userAdmin === 'ADMINISTRATOR' && (element.admin === 'ADMINISTRATOR' || element.admin === 'BAN')) {
      return false;
    }
    return true;
  }

  updateLibrary(){
    if(this.origenLibraryData !== this.updateLibraryData){
      const dialogRef:MatDialogRef<any>=this.dialog.open(AlertDialogComponent,{
        width:'500px',
        data:{
          title:'Reminders',
          message:'Confirmation of changes to library data? This will modify the data displayed in the footer!!',
          confirm:true
        }
      })
      dialogRef.afterClosed().subscribe(res=>{
        if(res==='confirm'){
          this.http.put(endPoints.library+"/BIBLIOTECA",this.updateLibraryData,this.user.optionsAuthorization2())
            .subscribe((data:any)=>{
                const dialogRef1 =this.dialog.open(AlertDialogComponent,{
                  width:"500px",
                  data:{
                    title:'Reminders',
                    message:'Modified successfully',
                    confirm:false
                  }
                })
              dialogRef1.afterClosed().subscribe(()=>{
                this.router.navigateByUrl('/home');
              })
              this.getLibraryData();
                }
              ,(error)=>{console.log(error)})
        }
      })
    }
  }

}

