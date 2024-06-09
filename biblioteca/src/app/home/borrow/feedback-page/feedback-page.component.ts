import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {authService} from "../../../authService";
import {endPoints} from "../../../endPoints";
import {AlertDialogComponent} from "../../../sign-up/alert-dialog.component";
import {BookDamageDegreeData} from "../../../model/book-damage-degree.model";

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent {
  bookDamageDegree:BookDamageDegreeData={ degree:"PERFECT", addendum:"The books are very well protected"};
  progressBar=false;
  reference:string="";
  userData:any;
  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private http:HttpClient,
              private user:authService,
              private snackBar:MatSnackBar,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<FeedbackPageComponent>) {
    this.reference = data.reference;
    this.userData = user.getUserData();
  }
  submit(){
    if(this.user.isNoNull(this.userData)){
      this.progressBar=true;
      this.http.put(endPoints.return + "/" + this.reference+"/isReturn",this.bookDamageDegree,this.user.optionsAuthorization2())
        .subscribe(()=> {
          const title ='Reminders';
          const message = ':) Feedback successful.';
          const confirm = false;
          const input = false;
          const dialogRef = this.openAlertDialogPage(title,message,confirm,input)
          dialogRef.afterClosed().subscribe(()=> {
            this.progressBar = false;
            this.dialogRef.close();
          })
        },error => this.showError(error));
    }

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

