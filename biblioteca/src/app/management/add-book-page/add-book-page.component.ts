import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {authService} from "../../authService";
import {AuthorModel, BookTypeModel} from "../../model/book.model";

import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../endPoints";

@Component({
  selector: 'app-add-book-page',
  templateUrl: './add-book-page.component.html',
  styleUrls: ['./add-book-page.component.css']
})
export class AddBookPageComponent {
  bookUpload:BookUpLoadModel={name:"",description:"",publisher:"",authorId:[],bookType:[],deposit:0,language:"",isbn:"",issn:"",barcode:""}
  allAuthor:AuthorModel[]=[];
  allType:BookTypeModel[]=[];
  showAuthor:AuthorModel[]=[];
  showType:BookTypeModel[]=[];
  allLanguage=[];
  selectType:BookTypeModel|undefined;
  selectAuthor:AuthorModel|undefined;
  step=0;
  author:AuthorAddData={name:"", description:"", nationality:""}

  userAdmin:string="";
  userTelephone:string=""
  constructor(private http:HttpClient, @Inject(MAT_DIALOG_DATA)data:any, private user:authService, private dialog:MatDialog, private snackBar: MatSnackBar) {
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
    this.getAllAuthor();
    this.getAllBookType();
    this.getAllBookLanguage();
  }

  getAllAuthor(){
    this.http.get(endPoints.author).subscribe((data:any)=>{
      this.allAuthor = data;
    },(error)=>{
      console.log(error)
    })
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe((data:any)=>{
      this.allType = data;
    },(error)=>{
      console.log(error)
    })
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book+"/all_language").subscribe((data:any)=>{
      this.allLanguage = data;
    })
  }


  addType(){
    if(this.selectType){
      if(this.bookUpload.bookType!=undefined){
        let index = this.bookUpload.bookType.findIndex((type:string)=>type===this.selectType?.name);
        if(index==-1){
          this.bookUpload.bookType.push(this.selectType.name);
          this.showType.push(this.selectType);
        }
      }else {
        this.bookUpload.bookType=[this.selectType.name]
        this.showType=[this.selectType]
      }
    }else {
      alert("error");
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
      alert("error");
    }
  }

  uploadBook(){
    console.log(this.bookUpload)
    if(this.bookUpload.name){
        this.http.post(endPoints.book,this.bookUpload,this.user.optionsAuthorization2()).subscribe((data:any)=>{
          this.dialog.closeAll();
          console.log(data);
        },(error)=>{
          console.log(error)
        })
    }else {
      this.snackBar.open("Please fill in the name of the book", 'Error', {duration: 5000});
    }
  }

  addAuthor(){
    if (this.author.name!=""){
      this.http.post(endPoints.author,this.author,this.user.optionsAuthorization2()).subscribe((data:any)=>{
        this.getAllAuthor();
        this.step=0;
      },(error) => {
        console.log(error)
      })
    }
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

}

export interface BookUpLoadModel{
  name: string,
  description: string,
  publisher: string,
  authorId:string[],
  bookType:string[],
  deposit:number,
  language:string,
  isbn:string,
  issn:string,
  barcode:string;
}
export interface AuthorAddData{
   name:String,
   description:String,
   nationality:String
}
