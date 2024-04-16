import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../../endPoints";
import {AlertDialogComponent} from "../../../sign-up/alert-dialog.component";
import {authService} from "../../../authService";

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent {
  sumOfMoney:number=0;
  transactionRecord:any;
  telephone:string="";
  balance:number=0;
  card:string="visa"
  cardNumber:string=""
  transactionDetails={lastName:"", firstName:"", city:"", billingAddress:"", postalCode:""}
  rechargeBtn=false;
  spinner=false;
  cvv="";
  expirationDate="";
  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private snackBar: MatSnackBar,
              private user:authService,
              private http:HttpClient,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<RechargeComponent>) {
    this.telephone = data.telephone;
    this.getBalance();
  }

  recharge(){
    this.btnStatus(true)
    if(this.rechargeDataIsError()) {
      this.btnStatus(false)
    }else {
      this.transactionRecord={
        purpose:"Recharge with " + this.card + " card [Card Number:*" + this.cardNumber.replace(/\s+/g, '').slice(-6) + "]",
        telephone:this.telephone,
        amount:this.sumOfMoney,
        transactionDetails:this.transactionDetails
      }
      this.http.post(endPoints.wallet+"/recharge",this.transactionRecord,this.user.optionsAuthorization2()).subscribe(()=> {
        this.btnStatus(false)
        const title = 'Successes';
        const message= ':) Recharge account '+this.telephone+' with '+this.sumOfMoney+'€ successfully.';
        const confirm= false;
        const input = false;
        this.openAlertDialogPage(title,message,confirm,input)
        this.dialogRef.close();
      },error => {
        this.btnStatus(false)
        this.showError(error.status+error.message)
      });
    }
  }

  rechargeDataIsError(){
    if(this.sumOfMoney<=0) {
      this.showError(":) 422 Minimum recharge amount is €1")
      return true;
    }else if(this.cardNumber.length<19){
      this.showError(":) 422 Incorrectly formatted bank card number")
      return true;
    }else if(this.cvv.length<3) {
      this.showError(":) 422 CVV is incorrectly formatted")
      return true;
    }else if(this.expirationDate.length<5) {
      this.showError(":) 422 Expiration Date is incorrectly formatted")
      return true;
    }else {
      return false;
    }
  }

  public showError(notification: string): void {
      this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  getBalance(){
    this.http.get(endPoints.wallet+"/"+this.telephone,this.user.optionsAuthorization2()).subscribe(
        (data:any)=> this.balance = data.body.balance,
        error => this.showError(error.status+error.message))
  }

  btnStatus(status:boolean){
    this.rechargeBtn=status;
    this.spinner=status;
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

}
