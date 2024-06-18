import {Component, Inject, OnInit} from '@angular/core';
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
import {AuthorPageComponent} from "../author-page/author-page.component";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.css'],
})
export class BookPageComponent implements OnInit{
  book:any|undefined;
  isLogin:boolean=false;
  bookId:string="";
  selectedImage: string | ArrayBuffer | null = null;
  file: File | undefined;
  bookUpdate:BookUpLoadModel={name:"",description:"",publisher:"",authorId:[],bookType:[],deposit:0,language:"",isbn:"",issn:"",barcode:""};
  allLanguage:string[]=[];
  showAuthor:AuthorModel[] = [];
  showType:BookTypeModel[] = [];
  progressBar=false;
  step=0;
  confirm=false;
  wallet=0;
  isWishBook=false;
  hiddenEdit=false;
  userData:any;
  data:any;
  bookNameFormControl = new FormControl('', [Validators.required, Validators.pattern('^(?!\\s*$).+')]);

  myFilter = (d: Date | null): boolean => {
    const currentDate = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return !d || (d >= currentDate && d <= threeMonthsLater);
  };

  constructor(private http:HttpClient,
              @Inject(MAT_DIALOG_DATA)data:any,
              public user:authService,
              private snackBar: MatSnackBar,
              private dialog:MatDialog) {
    this.data = data;
  }
  ngOnInit(): void {
    this.bookId=this.data.bookId;
    this.userData = this.user.getUserData();
    this.init();
  }

  init(){
    this.getBookData();
    this.getAllBookLanguage();
    this.getCollectionListData();
    if(this.user.isNoNull(this.userData)){
      this.isLogin=true
      this.getWallet();
    }
  }

  getBookData(){
    this.http.get(endPoints.book + "/" + this.bookId).subscribe((data:any)=> {
      this.book = data;
      this.bookUpdate = JSON.parse(JSON.stringify(data));
      this.bookUpdate.authorId = data.author == undefined?[] : data.author.map((item:any) => item.authorId);
      this.bookUpdate.bookType = data.type == undefined?[] : data.type.map((item:any) => item.name);
      this.bookNameFormControl.setValue(this.book.name);
      this.showAuthor = data.author;
      this.showType = data.type;
      if(this.book?.imgUrl != undefined){
        this.selectedImage = this.book.imgUrl
      }
    },error => this.showError(error.status+error.message));
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book + "/all_language").subscribe(
      (data:any) => this.allLanguage = data
      ,error => this.showError(error.status+error.message))
  }

  bookAddType(selectType:any){
    if(this.bookUpdate.bookType != undefined && this.bookUpdate.bookType && this.showType != undefined){
      let index = this.bookUpdate.bookType.findIndex((type:string)=> type === selectType?.name);
      if(index == -1 && selectType != undefined){
        this.bookUpdate.bookType.push(selectType.name);
        this.showType.push(selectType)
      }
    }else {
      this.bookUpdate.bookType=[selectType.name]
      this.showType = [selectType]
    }
  }

  bookAddAuthor(selectAuthor:any){
    if(this.bookUpdate.authorId != undefined && this.bookUpdate.authorId && this.showAuthor != undefined){
      let index = this.bookUpdate.authorId.findIndex((author:string)=> author === selectAuthor?.authorId);
      if(index == -1 && selectAuthor != undefined){
        this.bookUpdate.authorId.push(selectAuthor.authorId);
        this.showAuthor.push(selectAuthor);
      }
    }else {
      this.bookUpdate.authorId=[selectAuthor.authorId]
      this.showAuthor = [selectAuthor]
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
    this.bookUpdate.name = this.bookNameFormControl.value == null ? "" : this.bookNameFormControl.value;
    if(this.bookUpdate.name.trim().length===0){
      this.showError("Book name is empty")
      return}
    if(this.bookUpdate.issn===""&&this.bookUpdate.isbn===""){
      this.showError("Isbn or issn can not be empty")
      return}
    if(this.bookUpdate.deposit < 0){
      this.showError("Deposit cannot be less that ZERO")
      return}
    this.http.put(endPoints.book + "/" + this.bookId,this.bookUpdate,this.user.optionsAuthorization2()).subscribe(()=>{
      this.updateImage();
      this.init();
      this.step=0
    },(error)=> {
      this.showError(error.status+error.message);
      this.step=0;
    })
  }

  updateBtn(){
    return !this.bookNameCorrectFormat(1)&&
      !this.bookNameCorrectFormat(2)&&
      (this.bookUpdate.issn!==""|| this.bookUpdate.isbn!=="")&&
      this.bookUpdate.language!==""&&
      this.bookUpdate.deposit >= 0;
  }

  updateImage(){
    if(this.selectedImage !== this.book?.imgUrl && this.selectedImage != null){
      const formData = new FormData();
      formData.append('file', this.file as Blob);
      this.http.put(endPoints.book + "/" + this.bookId + "/image",formData,this.user.optionsAuthorization2()).subscribe(
        ()=> this.init()
        , error=>this.showError(error.status+error.message))}
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
    if(date === ""){
      this.showError("Please select a return time!")
      return;
    }
    if(this.book.deposit>this.wallet){
      this.showError("Your wallet balance is low.")
      return
    }
    if(this.confirm){
      const title='A deposit of €' + this.book.deposit + ' will be deducted from the ' + this.userData.userTelephone + ' account after confirmation.';
      const message = 'Account password';
      const confirm = true;
      const input = true;
      const dialogPage = this.openAlertDialogPage(title,message,confirm,input);
      dialogPage.afterClosed().subscribe(res => {
        if(res?.confirm === 'confirm') {
          this.progressBar = true;
          this.postLendingData(this.lendingData(date,res.input));
        }
      })
    }else {
      this.showError("Please tick the box to confirm the terms and conditions.")
    }

  }

  lendingData(date:string,password:string){
    const datePipe = new DatePipe('en-US');
    const time = datePipe.transform(date, 'yyyy-MM-dd');
    return {
      bookId: this.book?.bookID,
      telephone: this.userData.userTelephone,
      limitTime: time + " 23:59:59",
      password: password
    }
  }

  postLendingData(data:any){
    this.http.post(endPoints.lending,data,this.user.optionsAuthorization2()).subscribe(
      (data:any)=> {
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
    this.http.get(endPoints.wallet + "/" + this.userData.userTelephone,this.user.optionsAuthorization2()).subscribe(
      (data:any) => this.wallet = data.body.balance
    ,error => this.showError(error.status + error.message))
  }

  getCollectionListData(){
    if(this.isLogin&&this.user.isCLIENT(this.userData)){
      this.http.get(endPoints.collection + "/" + this.userData.userTelephone,this.user.optionsAuthorization2()).subscribe(
        (data:any)=>{
        const index = data.body.bookId.indexOf(this.bookId);
        this.isWishBook = index != -1;
      },error => this.showError(error.status + error.message))
    }
  }

  addWishList(){
    this.http.put(endPoints.collection + "/" + this.userData.userTelephone + "/add_book",this.bookId,this.user.optionsAuthorization2()).subscribe(
      () => this.getCollectionListData()
    ,error => this.showError(error.status + error.message))
  }

  removeWishList(){
    this.http.put(endPoints.collection + "/" + this.userData.userTelephone + "/remove_book",this.bookId,this.user.optionsAuthorization2()).subscribe(
      () => this.getCollectionListData()
    ,error => this.showError(error.status + error.message))
  }

  bookNameCorrectFormat(num:number){
    if(num==1){
      return this.bookNameFormControl.hasError('pattern') && !this.bookNameFormControl.hasError('required');
    }else {
      return this.bookNameFormControl.hasError('required')
    }
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
        telephone:this.userData.userTelephone
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

  openAuthorPage(authorId:string){
    this.hiddenEdit = true;
    this.dialog.open(AuthorPageComponent,{
      width:"1000px",
      minWidth:"1000px",
      height:"auto",
      maxHeight:"600px",
      data:{
        authorId:authorId
      }
    }).afterClosed().subscribe(()=> {
      this.init()
      this.hiddenEdit=false;
    })
  }


  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
