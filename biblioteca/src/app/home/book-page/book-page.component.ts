import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

import {authService} from "../../authService";
import {endPoints} from "../../endPoints";
import {AuthorModel, BookTypeModel} from "../../model/book.model";
import {BookUpLoadModel} from "../../management/add-book-page/add-book-page.component";
import {MatSnackBar} from "@angular/material/snack-bar";
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
  private errorNotification = undefined;
  step=0;

  constructor(private http:HttpClient,
              @Inject(MAT_DIALOG_DATA)data:any,
              private user:authService,
              private snackBar: MatSnackBar) {
    this.bookId=data.bookId;
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      this.isLogin=true;
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;

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
    this.http.get(endPoints.book+"/"+this.bookId).subscribe((data:any)=>{
      this.book = data;
      this.bookUpdate = JSON.parse(JSON.stringify(data));
      this.bookUpdate.authorId = data.author == undefined?[]:data.author.map((item:any)=>item.authorId);
      this.bookUpdate.bookType = data.type == undefined?[]:data.type.map((item:any)=>item.name);
      this.showAuthor = data.author;
      this.showType = data.type;
      if(this.book?.imgUrl!=undefined){
        this.selectedImage=this.book.imgUrl
      }
    },error=>this.showError(error.status+error.message));
  }

  getAllAuthor(){
    this.http.get(endPoints.author).subscribe((data:any)=>{
      this.allAuthor = data;
    },error=>
      this.showError(error.status+error.message)
    )
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe((data:any)=>{
      this.allType = data;
    },error=>
      this.showError(error.status+error.message))
  }

  getAllBookLanguage(){
    this.http.get(endPoints.book+"/all_language").subscribe((data:any)=>{
      this.allLanguage = data;
    })
  }

  addType(){
    if(this.bookUpdate.bookType!=undefined){
      let index = this.bookUpdate.bookType.findIndex((type:string)=>type===this.selectType?.name);
      if(index==-1&&this.selectType!==undefined){
        this.bookUpdate.bookType.push(this.selectType.name);
        this.showType.push(this.selectType)
      }
    }else {
      this.bookUpdate.bookType=[this.selectType.name]
      this.showType = [this.selectType]
    }
  }
  addAuthor(){
    if(this.bookUpdate.authorId!=undefined){
      let index = this.bookUpdate.authorId.findIndex((author:string)=>author===this.selectAuthor?.authorId);
      if(index==-1&&this.selectAuthor!==undefined){
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
    console.log(this.bookUpdate)
    this.http.put(endPoints.book+"/"+this.bookId,this.bookUpdate,this.user.optionsAuthorization2()).subscribe((data:any)=>{
      if(this.selectedImage!==this.book?.imgUrl&&this.selectedImage!=null){
        const formData = new FormData();
        formData.append('file', this.file as Blob);
        this.http.put(endPoints.book+"/"+this.bookId+"/image",formData,this.user.optionsAuthorization2()).subscribe((data:any)=>{
          this.init();
        },(error)=>{
          this.init();
          this.showError(error.status+error.message);
        })
      }else {
        this.init()
      }
      this.step=0;
    },(error)=>{
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

  public showError(notification: string): void {
    if (this.errorNotification) {
      this.snackBar.open(this.errorNotification, 'Error', {duration: 5000});
      this.errorNotification = undefined;
    } else {
      this.snackBar.open(notification, 'Error', {duration: 5000});
    }
  }
}
