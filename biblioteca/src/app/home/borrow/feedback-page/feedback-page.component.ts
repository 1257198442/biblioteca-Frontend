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
  userAdmin:string="";
  userTelephone:string="";
  reference:string="";
  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private http:HttpClient,
              private user:authService,
              private snackBar:MatSnackBar,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<FeedbackPageComponent>) {
    this.reference= data.reference;
    const jwtToken=sessionStorage.getItem("jwtToken");
    if(jwtToken){
      const [header, payload, signature] = jwtToken.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      this.userTelephone = decodedPayload.user;
      this.userAdmin = decodedPayload.role;
    }
  }
  submit(){
    this.progressBar=true;
    this.http.put(endPoints.return+"/"+this.reference+"/isReturn",this.bookDamageDegree,this.user.optionsAuthorization2())
      .subscribe((data)=>{
        const title ='Reminders';
        const message = ':) Feedback successful.';
        const confirm = false;
        const input = false;
        const dialogRef:MatDialogRef<any> = this.openAlertDialogPage(title,message,confirm,input)
        dialogRef.afterClosed().subscribe(()=>{
          this.progressBar=false;
          this.dialogRef.close();
        })
      },(error)=>{
        this.showError(error)
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

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}

