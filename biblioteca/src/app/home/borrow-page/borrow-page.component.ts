import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {endPoints} from "../../endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";
import {authService} from "../../authService";

@Component({
  selector: 'app-borrow-page',
  templateUrl: './borrow-page.component.html',
  styleUrls: ['./borrow-page.component.css']
})
export class BorrowPageComponent {
  borrowData:any;
  reference:string="";

  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private http:HttpClient,
              private snackBar:MatSnackBar,
              private user:authService) {
    this.reference = data.reference;
    this.getBorrowData();
}
getBorrowData(){
  this.http.get(endPoints.lending+"/"+this.reference,this.user.optionsAuthorization2())
    .subscribe((data:any)=>{
      this.borrowData=data.body;
    },error=>
      this.showError(error.status+error.message))
  }
  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}
