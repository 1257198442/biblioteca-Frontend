import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {authService} from "../../authService";
import {AuthorAddData, AuthorModel, BookTypeModel, BookUpLoadModel} from "../../model/book.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../endPoints";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.css']
})
export class AddBookPageComponent implements OnInit{
  bookUpload:BookUpLoadModel={name:"",description:"",publisher:"",authorId:[],bookType:[],deposit:0,language:"",isbn:"",issn:"",barcode:""}
  showAuthor:AuthorModel[]=[];
  showType:BookTypeModel[]=[];
  allLanguage=[];
  type:BookTypeModel = {name:"",description:""}
  author:AuthorAddData = {name:"", description:"", nationality:""}
  bookNameFormControl = new FormControl('', [Validators.required, Validators.pattern('^(?!\\s*$).+')]);
  constructor(private http:HttpClient,
              private user:authService,
              private dialog:MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllBookLanguage();
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book+"/all_language").subscribe(
      (data:any) => this.allLanguage = data
    ,error => this.showError(error.status+error.message))
  }

  bookAddType(selectType:any){
    if(!selectType){
      this.showError("Book add type error");
      return}
    if(this.bookUpload.bookType != undefined){
      let index = this.bookUpload.bookType.findIndex((type:string)=> type === selectType?.name);
      if(index==-1){
        this.bookUpload.bookType.push(selectType.name);
        this.showType.push(selectType);
      }
    }else {
      this.bookUpload.bookType=[selectType.name]
      this.showType=[selectType]
    }
  }

  bookAddAuthor(selectAuthor:any){
    if(!selectAuthor){
      this.showError("Book add author error");
      return}
    if(this.bookUpload.authorId!=undefined){
      let index = this.bookUpload.authorId.findIndex((author:string)=>author===selectAuthor?.authorId);
      if(index==-1){
        this.bookUpload.authorId.push(selectAuthor.authorId);
        this.showAuthor.push(selectAuthor)
      }
    }else {
      this.bookUpload.authorId=[selectAuthor.authorId]
      this.showAuthor=[selectAuthor]
    }
  }

  bookNameCorrectFormat(num:number){
    if(num==1){
      return this.bookNameFormControl.hasError('pattern') && !this.bookNameFormControl.hasError('required');
    }else {
      return this.bookNameFormControl.hasError('required')
    }
  }

  uploadBook(){
    this.bookUpload.name = this.bookNameFormControl.value == null ? "" : this.bookNameFormControl.value;
    if(this.bookUpload.name.trim().length===0){
      this.showError("Please fill in the name of the book");
      return}
    if(this.bookUpload.deposit < 0){
      this.showError("Deposit cannot be less that ZERO")
      return}
    if(this.bookUpload.isbn===""&&this.bookUpload.issn==="") {
      this.showError("Isbn or issn can not be empty");
      return;}
    if(this.bookUpload.language===''){
      this.showError("Language can not be empty")
      return;}
    this.http.post(endPoints.book,this.bookUpload,this.user.optionsAuthorization2()).subscribe(
      () => this.dialog.closeAll()
      ,error => this.showError(error.status+error.message))
  }

  postBtn(){
    return !this.bookNameCorrectFormat(1)&&
      !this.bookNameCorrectFormat(2)&&
      (this.bookUpload.issn!==""|| this.bookUpload.isbn!=="")&&
      this.bookUpload.language!==""&&
      this.bookUpload.deposit >= 0;
  }

  removeType(type:BookTypeModel){
    let index = this.bookUpload.bookType.indexOf(type.name);
    this.bookUpload.bookType.splice(index,1);
    index = this.showType.indexOf(type)
    this.showType.splice(index,1);
  }

  removeAuthor(author:AuthorModel){
    let index = this.bookUpload.authorId.indexOf(author.authorId);
    this.bookUpload.authorId.splice(index,1);
    index = this.showAuthor.indexOf(author)
    this.showAuthor.splice(index,1);
  }

  openAlertDialogPage( title:string,message:string,confirm:boolean,input:boolean){
    return this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:title,
        message:message,
        confirm:confirm,
        input:input}})
  }

  public showError(notification: string){
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
