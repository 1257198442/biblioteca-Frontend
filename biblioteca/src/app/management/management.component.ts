import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {authService} from "../authService";
import {endPoints} from "../endPoints";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {AlertDialogComponent} from "../sign-up/alert-dialog.component";
import {PersonalPageComponent} from "../home/personal-page/personal-page.component";
import {AddBookPageComponent} from "./add-book-page/add-book-page.component";
import {BookPageComponent} from "../home/book-page/book-page.component";


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent{
  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('bookPaginator') bookPaginator!: MatPaginator;
  @ViewChild('userSort') userSort!: MatSort;
  @ViewChild('bookSort') bookSort!: MatSort;
  lowForUserList:string[]=["telephone","name","email","admin","modify_permissions","view"];
  lowForBookList:string[]=["bookID","name","status","view","delete"];
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
      this.getAllBookList();
    }
  }
  userDataSource:any;
  bookDataSource:any;
  getAllUserList(){
    if(this.isRoot()){
      this.selectRolesList=this.rolesListROOT
    }else if(this.isAdministrators()){
      this.selectRolesList=this.rolesListADMINISTRATOR
    }
      this.http.get(endPoints.user,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.userDataSource = new MatTableDataSource(data.body);
        this.userDataInit();
      },error=> this.showError(error.status+error.message))
    }

  getAllBookList(){
    this.http.get(endPoints.book).subscribe((data:any)=>{
      this.bookDataSource = new MatTableDataSource(data);
      this.bookDataInit()
    },(error)=>{console.log(error)})
  }

  getLibraryData(){
    this.http.get(endPoints.library).subscribe((data:any)=>{
      this.origenLibraryData = data;
      this.updateLibraryData = Object.assign({}, this.origenLibraryData);
    },error=> this.showError(error.status+error.message))
  }

  userDataInit() {
    this.userDataSource.paginator = this.userPaginator;
    this.userDataSource.sort = this.userSort;
  }

  bookDataInit() {
    this.bookDataSource.paginator = this.bookPaginator;
    this.bookDataSource.sort = this.bookSort;
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
    const title = 'Reminders';
    const message ='Confirm changing the permissions of user '+telephone+' to ADMINISTRATOR?..';
    const confirm = true;
    const input = false;
    const dialogPage =this.openAlertDialogPage(title,message,confirm,input);
    dialogPage.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.put(endPoints.user+"/"+telephone+"/role","ADMINISTRATOR",this.user.optionsAuthorization2()).subscribe(
          (data:any)=>{this.getAllUserList()},
          error=> this.showError(error.status+error.message)
        )
      }
    })
  }

  toUser(telephone:string){
    const title = 'Reminders';
    const message ='Are you sure you want to change the permissions on '+telephone+' to CLIENT?';
    const confirm = true;
    const input = false;
    const dialogPage =this.openAlertDialogPage(title,message,confirm,input);
    dialogPage.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.put(endPoints.user+"/"+telephone+"/role","CLIENT",this.user.optionsAuthorization2()).subscribe(
          (data:any)=>{this.getAllUserList()},
            error=> this.showError(error.status+error.message)
        )
      }
    })
  }

  toBan(telephone:string){
    const title = 'Warning';
    const message ='Are you sure you want to disable this account? If you disable it, the account holder will not be able to use the account.';
    const confirm = true;
    const input = false;
    const dialogPage =this.openAlertDialogPage(title,message,confirm,input);
    dialogPage.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.put(endPoints.user+"/"+telephone+"/role","BAN",this.user.optionsAuthorization2()).subscribe(
          (data:any)=>{
            this.getAllUserList()},
          error=> this.showError(error.status+error.message)
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

  modifyRoleButtonIsDisplay(role:string,modifyRole:string):boolean{
    if(this.isRoot()&&role!=modifyRole){
      return true;
    }else return this.isAdministrators() && role != modifyRole && modifyRole == "ADMINISTRATOR";
  }

  shouldDisplayElement(element:any): boolean {
    if (this.userTelephone === element.telephone) {
      return false;
    }
    if (element.role === 'ROOT') {
      return false;
    }
    return !(this.userAdmin === 'ADMINISTRATOR' && (element.role === 'ADMINISTRATOR' || element.role === 'BAN'));

  }

  updateLibrary(){
    if(this.origenLibraryData !== this.updateLibraryData){
      const title = 'Reminders';
      const message = 'Confirmation of changes to library data? This will modify the data displayed in the footer!!';
      const confirm = true;
      const input = false;
      const dialogPage =this.openAlertDialogPage(title,message,confirm,input);
      dialogPage.afterClosed().subscribe(res=>{
        if(res==='confirm'){
          this.http.put(endPoints.library,this.updateLibraryData,this.user.optionsAuthorization2())
            .subscribe((data:any)=>{
                const title = 'Reminders';
                const message = 'Modified successfully';
                const confirm = false;
                const input = false;
                const dialogPage1 =this.openAlertDialogPage(title,message,confirm,input)
              dialogPage1.afterClosed().subscribe(()=>{
                this.router.navigateByUrl('/home');
              })
              this.getLibraryData();
                }
              ,(error)=>{this.showError(error.message)})
        }
      })
    }
  }

  applyBookFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bookDataSource.filter = filterValue.trim().toLowerCase();
    if (this.bookDataSource.paginator) {
      this.bookDataSource.paginator.firstPage();
    }
  }

  deleteBook(bookID:string){
    const title = 'Warning';
    const message = 'Are you sure you want to delete the data from this book? If the book is on loan, the deletion will fail.';
    const confirm = true;
    const input = false;
    const dialogRef =this.openAlertDialogPage(title,message,confirm,input);
    dialogRef.afterClosed().subscribe(res=>{
      if(res==='confirm'){
        this.http.delete(endPoints.book+"/"+bookID,this.user.optionsAuthorization2()).subscribe((data:any)=>{
          this.getAllBookList();
        },(error)=>{
            this.showError(error.status+error.message);
        })
      }
    })
  }

  locked(bookID:string){
    this.http.put(endPoints.book+"/"+bookID+"/status","DISABLE",this.user.optionsAuthorization2())
      .subscribe((data:any)=>{
        this.getAllBookList();
      },(error)=>{
        this.showError(error.status+error.message);
      })
  }

  available(bookID:string){
    this.http.put(endPoints.book+"/"+bookID+"/status","ENABLE",this.user.optionsAuthorization2())
      .subscribe((data:any)=>{
        this.getAllBookList()
      },(error)=>{
        this.showError(error.status+error.message);
      })
  }

  openPersonalPage(telephone:string){
    this.dialog.open(PersonalPageComponent,{
      width:"800px",
      minWidth:"800px",
      height:"auto",
      maxHeight:"600px",
      data:{
        telephone:telephone,
      }
    }).afterClosed().subscribe(()=>{
      this.getAllUserList()
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
    }).afterClosed().subscribe(()=>this.getAllBookList());
  }

  openAddBookPage(){
    this.dialog.open(AddBookPageComponent,{
      width:"700px",
      minWidth:"700px",
      height:"auto",
      maxHeight:"600px",
      data:{
      }
    }).afterClosed().subscribe(()=>{
      this.getAllBookList()
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

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
