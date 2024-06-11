import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {authService} from "../../authService";
import {AuthorAddData, AuthorModel, BookTypeModel, BookUpLoadModel} from "../../model/book.model";

import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../endPoints";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.css']
})
export class AddBookPageComponent implements OnInit{
  bookUpload:BookUpLoadModel={name:"",description:"",publisher:"",authorId:[],bookType:[],deposit:0,language:"",isbn:"",issn:"",barcode:""}
  allAuthor:AuthorModel[]=[];
  allType:BookTypeModel[]=[];
  showAuthor:AuthorModel[]=[];
  showType:BookTypeModel[]=[];
  allLanguage=[];
  selectType:BookTypeModel|undefined;
  selectAuthor:AuthorModel|undefined;
  stepAuthor=0;
  stepType= 0;
  type:BookTypeModel = {name:"",description:""}
  author:AuthorAddData = {name:"", description:"", nationality:""}

  constructor(private http:HttpClient,
              private user:authService,
              private dialog:MatDialog,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getAllAuthor();
    this.getAllBookType();
    this.getAllBookLanguage();
  }

  getAllAuthor(){
    this.http.get(endPoints.author).subscribe(
      (data:any) => this.allAuthor = data
    ,error => this.showError(error.status+error.message))
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe(
      (data:any) => this.allType = data
    ,error => this.showError(error.status+error.message))
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book+"/all_language").subscribe(
      (data:any) => this.allLanguage = data
    ,error => this.showError(error.status+error.message))
  }

  addType(){
    if(this.selectType){
      if(this.bookUpload.bookType != undefined){
        let index = this.bookUpload.bookType.findIndex((type:string)=> type === this.selectType?.name);
        if(index==-1){
          this.bookUpload.bookType.push(this.selectType.name);
          this.showType.push(this.selectType);
        }
      }else {
        this.bookUpload.bookType=[this.selectType.name]
        this.showType=[this.selectType]
      }
    }else {
      this.showError("error");
    }
  }

  bookAddAuthor(){
    if(this.selectAuthor){
      if(this.bookUpload.authorId!=undefined){
        let index = this.bookUpload.authorId.findIndex((author:string)=>author===this.selectAuthor?.authorId);
        if(index==-1){
          this.bookUpload.authorId.push(this.selectAuthor.authorId);
          this.showAuthor.push(this.selectAuthor)
        }
      }else {
        this.bookUpload.authorId=[this.selectAuthor.authorId]
        this.showAuthor=[this.selectAuthor]
      }
    }else {
      this.showError("error");
    }
  }

  uploadBook(){
    if(this.bookUpload.name){
        this.http.post(endPoints.book,this.bookUpload,this.user.optionsAuthorization2()).subscribe(
          () => this.dialog.closeAll()
        ,error => this.showError(error.status+error.message))
    }else {
      this.snackBar.open("Please fill in the name of the book", 'Error', {duration: 5000});
    }
  }

  addAuthor(){
    if (this.author.name!=""){
      this.http.post(endPoints.author,this.author,this.user.optionsAuthorization2()).subscribe(()=> {
        this.stepAuthor=0;
        this.getAllAuthor();
        const title = 'Successfully';
        const message = 'Author [' + this.author.name + '] added successfully';
        const confirm = false;
        const input = false;
        this.author = {name:"", description:"", nationality:""};
        this.openAlertDialogPage(title,message,confirm,input)
      },error => this.showError(error.status+error.message));
    }
  }

  addBookType(){
    this.http.post(endPoints.type,this.type,this.user.optionsAuthorization2()).subscribe(()=>{
      this.stepType = 0;
      this.getAllBookType();
      const title = 'Successfully';
      const message = 'Book type [' + this.type.name + '] added successfully';
      const confirm = false;
      const input = false;
      this.type = {name:"",description:""};
      this.openAlertDialogPage(title,message,confirm,input)
    },error => this.showError(error.status+error.message));
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
        input:input
      }
    })
  }

  public showError(notification: string){
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
