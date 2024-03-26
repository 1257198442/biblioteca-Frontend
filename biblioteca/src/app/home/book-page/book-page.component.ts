import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

import {authService} from "../../authService";
import {endPoints} from "../../endPoints";
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

  constructor(private http:HttpClient,
              @Inject(MAT_DIALOG_DATA)data:any) {
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
  }

  getBookData(){
    this.http.get(endPoints.book+"/"+this.bookId).subscribe((data:any)=>{
      this.book=data;
      if(this.book?.imgUrl!=undefined){
        this.selectedImage=this.book.imgUrl
      }
      console.log(this.book)
    },(error)=>{console.log(error)});
  }

}
