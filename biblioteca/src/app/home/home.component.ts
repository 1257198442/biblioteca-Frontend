import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {endPoints} from "../endPoints";
import {MatDialog} from "@angular/material/dialog";
import {BookPageComponent} from "./book-page/book-page.component";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  storedToken:any;
  userTelephone="";
  userAdmin="";
  currentDate: Date = new Date()
  randomBook:any;
  monthAbbreviations: { [key: number]: string } = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
  };
  constructor(private http:HttpClient,
              private dialog:MatDialog,
              private snackBar: MatSnackBar,) {
    setInterval(() => {
      const currentToken = sessionStorage.getItem('jwtToken');
      if (currentToken !== this.storedToken) {
        this.storedToken = currentToken!=null?currentToken:"";
        if(currentToken){
          const [header, payload, signature] = this.storedToken.split('.');
          const decodedPayload = JSON.parse(atob(payload));
          this.userTelephone = decodedPayload.user;
          this.userAdmin = decodedPayload.role;
        }
      }
    }, 1000);
    this.getRandomBook();
  }

  getRandomBook(){
    this.http.get(endPoints.book+"/random").subscribe((data:any)=>{
      this.randomBook = data;
    },(error)=>{
      this.showError(error.status+error.message)
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
    })
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
