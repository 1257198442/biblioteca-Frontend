import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

import {authService} from "../../authService";
import {endPoints} from "../../endPoints";
import {AuthorModel, BookTypeModel, BookUpLoadModel} from "../../model/book.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RechargeComponent} from "../personal-page/recharge/recharge.component";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";
import {DatePipe} from "@angular/common";
import {BorrowPageComponent} from "../borrow-page/borrow-page.component";
@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
})
export class BookPageComponent {
  book:any|undefined;
  isLogin:boolean=false;
  bookId:string;
  selectedImage: string | ArrayBuffer | null = null;
  file: File | undefined;
  userAdmin:string="";
  userTelephone:string=""
  bookUpdate:BookUpLoadModel={name:"",description:"",publisher:"",authorId:[],bookType:[],deposit:0,language:"",isbn:"",issn:"",barcode:""};
  allLanguage=[];
  allAuthor:AuthorModel[]=[];
  allType:BookTypeModel[] = [];
  selectAuthor:AuthorModel = {authorId:"",name:"",nationality:"",description:"",imgUrl:""};
  selectType:BookTypeModel = {name:"",description:""};
  showAuthor:AuthorModel[] = [];
  showType:BookTypeModel[] = [];
  progressBar=false;
  step=0;
  isOk=false;
  wallet=0;

  myFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return !d || (d >= currentDate && d <= threeMonthsLater);
  };

  constructor(private http:HttpClient,
              @Inject(MAT_DIALOG_DATA)data:any,
              private user:authService,
              private snackBar: MatSnackBar,
              private dialog:MatDialog) {
    this.bookId=data.bookId;
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      this.isLogin=true;
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
      this.getWallet();
    }
    this.init();
  }

  init(){
    this.getBookData();
    this.getAllAuthor();
    this.getAllBookType();
    this.getAllBookLanguage();
  }

  getBookData(){
    this.http.get(endPoints.book + "/" + this.bookId).subscribe((data:any)=> {
      this.book = data;
      this.bookUpdate = JSON.parse(JSON.stringify(data));
      this.bookUpdate.authorId = data.author == undefined?[] : data.author.map((item:any) => item.authorId);
      this.bookUpdate.bookType = data.type == undefined?[] : data.type.map((item:any) => item.name);
      this.showAuthor = data.author;
      this.showType = data.type;
      if(this.book?.imgUrl != undefined){
        this.selectedImage = this.book.imgUrl
      }
    },error => this.showError(error.status+error.message));
  }

  getAllAuthor(){
    this.http.get(endPoints.author).subscribe(
      (data:any) => this.allAuthor = data
      ,error => this.showError(error.status+error.message)
    )
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe(
      (data:any) => this.allType = data
    ,error => this.showError(error.status+error.message))
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book + "/all_language").subscribe(
      (data:any) => this.allLanguage = data
      ,error => this.showError(error.status+error.message))
  }

  addType(){
    if(this.bookUpdate.bookType != undefined && this.bookUpdate.bookType && this.showType != undefined){
      let index = this.bookUpdate.bookType.findIndex((type:string)=> type === this.selectType?.name);
      if(index == -1 && this.selectType != undefined){
        this.bookUpdate.bookType.push(this.selectType.name);
        this.showType.push(this.selectType)
      }
    }else {
      this.bookUpdate.bookType=[this.selectType.name]
      this.showType = [this.selectType]
    }
  }

  addAuthor(){
    if(this.bookUpdate.authorId != undefined && this.bookUpdate.authorId && this.showAuthor != undefined){
      let index = this.bookUpdate.authorId.findIndex((author:string)=> author === this.selectAuthor?.authorId);
      if(index == -1 && this.selectAuthor != undefined){
        this.bookUpdate.authorId.push(this.selectAuthor.authorId);
        this.showAuthor.push(this.selectAuthor);
      }
    }else {
      this.bookUpdate.authorId=[this.selectAuthor.authorId]
      this.showAuthor = [this.selectAuthor]
    }
  }

  removeType(type:BookTypeModel){
    let index = this.bookUpdate.bookType.indexOf(type.name)
    this.bookUpdate.bookType.splice(index,1)
    index = this.showType.indexOf(type)
    this.showType.splice(index,1);
  }

  removeAuthor(author:AuthorModel){
    let index = this.bookUpdate.authorId.indexOf(author.authorId)
    this.bookUpdate.authorId.splice(index,1)
    index = this.showAuthor.indexOf(author)
    this.showAuthor.splice(index,1)
  }

  update(){
    this.http.put(endPoints.book + "/" + this.bookId,this.bookUpdate,this.user.optionsAuthorization2()).subscribe((data:any)=>{
      if(this.selectedImage !== this.book?.imgUrl && this.selectedImage != null){
        const formData = new FormData();
        formData.append('file', this.file as Blob);
        this.http.put(endPoints.book + "/" + this.bookId + "/image",formData,this.user.optionsAuthorization2()).subscribe(
          ()=> {
            this.init()
            this.step=0
          },
            error=>this.showError(error.status+error.message))
      }
    },(error)=> {
      this.showError(error.status+error.message);
      this.step=0;
    })
  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    // @ts-ignore
    reader.readAsDataURL(this.file);
  }

  borrow(date:string){
    if(date !== ""){
      if(this.isOk){
        const title='A deposit of €' + this.book.deposit + ' will be deducted from the ' + this.userTelephone + ' account after confirmation.';
        const message = 'Account password';
        const confirm = true;
        const input = true;
        const dialogPage = this.openAlertDialogPage(title,message,confirm,input);
        dialogPage.afterClosed().subscribe(res => {
          if(res?.confirm === 'confirm') {
            this.progressBar = true;
            const datePipe = new DatePipe('en-US');
            const time = datePipe.transform(date, 'yyyy-MM-dd');
            const data= {
              bookId: this.book?.bookID,
              telephone: this.userTelephone,
              limitTime: time + " 23:59:59",
              password: res.input
            }
            this.postLendingData(data);
          }
        })
      }else {
        this.snackBar.open("Please tick the box to confirm the terms and conditions", 'Error', {duration: 5000});
      }
    }else {
      this.snackBar.open("Please select a return time!", 'Error', {duration: 5000});
    }
  }
  postLendingData(data:any){
    this.http.post(endPoints.lending,data,this.user.optionsAuthorization2()).subscribe((data:any)=> {
      this.progressBar = false;
      this.init();
      this.openBorrowPage(data.body.reference)
    },error => {
      if(error.status === 403){
        const event = this.snackBar.open("Your account balance is less than "+this.book?.deposit+" €",'Recharge',{duration: 5000})
        event.onAction().subscribe(() => {this.openRechargePage()});
      }else if(error.status === 401){
        this.showError("401 Incorrect account password")
      }else {
        this.showError(error.status+error.message)
      }
      this.progressBar = false;
    })
  }

  getWallet(){
    this.http.get(endPoints.wallet + "/" + this.userTelephone,this.user.optionsAuthorization2()).subscribe(
      (data:any) => this.wallet = data.body.balance
    ,error => this.showError(error.status + error.message))
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

  openRechargePage(){
    this.dialog.open(RechargeComponent,{
      width:"600px",
      minWidth:"600px",
      height:"auto",
      maxHeight:"600px",
      data:{
        telephone:this.userTelephone
      }
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
