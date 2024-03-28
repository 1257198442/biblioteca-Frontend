import {Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";


import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {authService} from "../../authService";
import {endPoints} from "../../endPoints";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";
import {BorrowPageComponent} from "../borrow-page/borrow-page.component";
import {ReturnPageComponent} from "./return-page/return-page.component";



@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})

export class BorrowComponent implements OnChanges{

  @ViewChild('lendingPaginator') lendingPaginator!: MatPaginator;
  @ViewChild('lendingSort') lendingSort!: MatSort;
  @ViewChild('restitutionPaginator') restitutionPaginator!: MatPaginator;
  @ViewChild('restitutionSort') restitutionSort!: MatSort;


  title="All Unreturned list";
  userAdmin:string="";
  userTelephone:string=""
  all=false;

  low=['reference','bookID','lendingTime','limitTime','telephone','return','view'];
  returnLow=['reference','bookID','returnStatus','status','telephone','view'];
  constructor(private http:HttpClient,
              private user:authService,
              private snackBar:MatSnackBar,
              private dialog:MatDialog,
              public router:Router) {
    this.user.listeningJwtToken();
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
      this.checkUserData();
    }

  }

  getAllBorrowData(){
    if(this.userAdmin=="CLIENT"){
      this.clientGetBorrowData();
    }else if(this.userAdmin=="ADMINISTRATOR"||this.userAdmin=="ROOT"){
      this.adminGetBorrowData();
    }
  }
  lendingDataSource:any;
  restitutionDataSource:any;
  clientGetBorrowData(){
    this.http.get(endPoints.lending+"/client_return_and_lending/search?telephone="+this.userTelephone,this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingDataSource=new MatTableDataSource(data.body.lendingDataList);
        this.restitutionDataSource=new MatTableDataSource(data.body.returnDataList);
        this.lendingDataInit()
      this.restitutionDataInit();
    })
  }
  adminGetBorrowData(){
    this.http.get(endPoints.lending+"/admin_return_and_lending",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingDataSource=new MatTableDataSource(data.body.lendingDataList);
      this.restitutionDataSource=new MatTableDataSource(data.body.returnDataList);
      this.lendingDataInit()
      this.restitutionDataInit();
    })
  }
  lendingDataInit() {
    this.lendingDataSource.paginator = this.lendingPaginator;
    this.lendingDataSource.sort = this.lendingSort;
    // @ts-ignore
    this.lendingDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'bookID': return item.book.bookID;
        case  'telephone':return item.user.telephone
        default: return item[property];
      }
    };
  }
  applyLendingFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.lendingDataSource.filter = filterValue.trim().toLowerCase();
    // @ts-ignore
    this.lendingDataSource.filterPredicate = (data, filter: string) => {
      const bookID = data.book.bookID.toString().toLowerCase();
      const bookName = data.book.name.toLowerCase();
      const userTelephone = data.user.telephone.toLowerCase();

      return bookID.includes(filter) || bookName.includes(filter) || userTelephone.includes(filter);
    };
    if (this.lendingDataSource.paginator) {
      this.lendingDataSource.paginator.firstPage();
    }
  }
  applyLendingAllOrNoReturnFilter(status:string) {
    this.lendingDataSource.filter = status.trim().toLowerCase();
    if (this.lendingDataSource.paginator) {
      this.lendingDataSource.paginator.firstPage();
    }
  }

  readUserByExtensionBeyond30Days(){
    this.http.get(endPoints.lending+"/read_lending_data_by_overdue_max_30day",this.user.optionsAuthorization2()).subscribe((data:any)=>{
      this.lendingDataSource=new MatTableDataSource(data.body)
      this.lendingDataInit();
    },(error)=>{
      console.log(error)
    })
  }
  sendReminderEmail(){
    this.http.post(endPoints.lending+"/send_email_to_user_by_approaching_date",'',this.user.optionsAuthorization2()).subscribe((data:any)=>{
      if(data.body.length!=0){
        const title = 'Reminders';
        const message= ':) Send email successes('+data.body.length+'  successes).';
        const confirm= false;
        const input = false;
        const dialogRef = this.openAlertDialogPage(title,message,confirm,input)
        dialogRef.afterClosed().subscribe(()=>{
          this.getAllBorrowData();
        })
      }else {
        const title = 'Reminders';
        const message= ':) There are no reminder emails that need to be sent.';
        const confirm= false;
        const input = false;
        this.openAlertDialogPage(title,message,confirm,input);
      }

    },(error)=>{
      this.showError(error.status+error.message)
    })
  }

  restitutionDataInit() {
    this.restitutionDataSource.paginator = this.restitutionPaginator;
    this.restitutionDataSource.sort = this.restitutionSort;
    // @ts-ignore
    this.restitutionDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'bookID': return item.book.bookID;
        case  'telephone':return item.user.telephone
        default: return item[property];
      }
    };
  }
  applyRestitutionFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.restitutionDataSource.filter = filterValue.trim().toLowerCase();
    // @ts-ignore
    this.restitutionDataSource.filterPredicate = (data, filter: string) => {
      const bookID = data.book.bookID.toString().toLowerCase();
      const bookName = data.book.name.toLowerCase();
      const userTelephone = data.user.telephone.toLowerCase();
      const lowerCaseFilter = filter.toLowerCase();
      if (lowerCaseFilter === 'overdue') {
        return data.limitTime < data.restitutionTime;
      } else if (lowerCaseFilter === 'normal') {
        return data.limitTime >= data.restitutionTime;
      }
      return bookID.includes(filter) || bookName.includes(filter) || userTelephone.includes(filter);
    };
    if (this.restitutionDataSource.paginator) {
      this.restitutionDataSource.paginator.firstPage();
    }
  }

  status(status: boolean): string {
    return status ? "Returned" : "Unreturned";
  }

  status2(data: string, data2: string): string {
    return this.isOverdue(data, data2) ? "Overdue" : "Normal";
  }

  return(element:any){
    this.http.post(endPoints.return,element.reference,this.user.optionsAuthorization2())
      .subscribe((data:any)=>{
        this.getAllBorrowData();
      },(error)=>{
        this.showError(error)
      })
  }

  isWithinThreeDays(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    return date >= today && date <= threeDaysLater;
  }

  isOverdue(dateString: string,time:string): boolean {
    const date = new Date(dateString);
    const date2=new Date(time)
    return date <= date2 ;
  }

  getRowClass(element:any): string {
    let classes = '';
    if (this.isWithinThreeDays(element.limitTime) && !element.status) {
      classes += ' yellow-text';
    }
    if (this.isOverdue(element.limitTime,new Date().toString()) && !element.status) {
      classes += ' red-text';
    }
    return classes;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'] && changes['userData'].currentValue['telephone'] !== '') {
      this.getAllBorrowData();
    }
  }

  checkUserData() {
    if (this.userTelephone !== '') {
      this.getAllBorrowData();
    }
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

  openReturnPage(reference:string){
    this.dialog.open(ReturnPageComponent,{
      width:"700px",
      height:"auto",
      data:{
        reference:reference
      }
    })
  }

  openBorrowPage(reference:string){
    this.dialog.open(BorrowPageComponent,{
      width:"700px",
      height:"auto",
      data:{
        reference:reference
      }
    })
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}









