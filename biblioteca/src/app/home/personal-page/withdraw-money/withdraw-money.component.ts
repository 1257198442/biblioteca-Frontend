import {Component, Inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RechargeComponent} from "../recharge/recharge.component";
import {authService} from "../../../authService";
import {AlertDialogComponent} from "../../../sign-up/alert-dialog.component";
import {endPoints} from "../../../endPoints";

@Component({
  selector: 'app-withdraw-money',
  templateUrl: './withdraw-money.component.html',
  styleUrls: ['./withdraw-money.component.css']
})
export class WithdrawMoneyComponent {
  sumOfMoney:number=0;
  transactionRecord:any;
  telephone:string="";
  balance:number=0;
  card:string="visa"
  cardNumber:string=""
  transactionDetails={lastName:"", firstName:"", city:"", billingAddress:"", postalCode:""}
  WithdrawMoneyBtn=false;
  spinner=false;

  constructor(@Inject(MAT_DIALOG_DATA)data:any,
              private snackBar: MatSnackBar,
              private user:authService,
              private http:HttpClient,
              private dialog:MatDialog,
              public dialogRef: MatDialogRef<RechargeComponent>) {

    this.telephone = data.telephone;
    this.getBalance();
  }

  withdrawMoney(){
    this.btnStatus(true)
    if(this.rechargeDataIsError()) {
      this.btnStatus(false)
    }else {
      this.transactionRecord = this.generateTransactionRecord()
      const title='Password verification';
      const message='Account Password.';
      const input=true;
      const confirm=true;
      const dialog = this.openAlertDialogPage(title,message,confirm,input)
      dialog.afterClosed().subscribe(res => {
        if(res.confirm == "confirm"){
          this.transactionRecord.password=res.input;
          this.http.post(endPoints.wallet+"/withdrawal",this.transactionRecord,this.user.optionsAuthorization2()).subscribe(()=> {
            this.btnStatus(false)
            const title= 'Successes';
            const message= ':) Cash out '+this.telephone+' with '+this.sumOfMoney+'€ successfully.';
            const confirm= false;
            const input = false;
            this.openAlertDialogPage(title,message,confirm,input)
            this.dialogRef.close();
          },error=>{
            this.btnStatus(false)
            this.showError(error.status+error.message)
          })
        };
      })
    }
  }

  generateTransactionRecord(){
    return {
      password:"",
      purpose:"Transfer to "+this.card+" card [Card Number:*"+this.cardNumber.replace(/\s+/g, '').slice(-6)+"]",
      telephone:this.telephone,
      amount:this.sumOfMoney,
      transactionDetails:this.transactionDetails
    }
  }

  btnStatus(status:boolean){
    this.WithdrawMoneyBtn=status;
    this.spinner=status;
  }

  rechargeDataIsError(){
    if(this.sumOfMoney<=0) {
      this.showError(":) 403 Minimum withdraw money amount is €0")
      return true;
    }else if(this.cardNumber.length<19){
      this.showError(":) 403 Incorrectly formatted bank card number")
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
