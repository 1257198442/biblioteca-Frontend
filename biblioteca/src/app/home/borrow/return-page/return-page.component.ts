import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../../endPoints";
import {authService} from "../../../authService";

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent {
returnData:any;
reference:string="";
  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private http:HttpClient,
              private snackBar:MatSnackBar,
              private user:authService,) {
    this.reference = data.reference;
    this.getReturnData();
  }

  getReturnData(){
    this.http.get(endPoints.return+"/"+this.reference,this.user.optionsAuthorization2())
      .subscribe((data:any)=>{
        this.returnData=data.body;
      },error=> this.showError(error))
  }
  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}
