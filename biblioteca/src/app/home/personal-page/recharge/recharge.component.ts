import {Component, Inject} from '@angular/core';

import {HttpClient} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {endPoints} from "../../../endPoints";
import {AlertDialogComponent} from "../../../sign-up/alert-dialog.component";
import {authService} from "../../../AuthService";

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
    this.rechargeBtn=true;
    this.spinner=true;
    if(this.rechargeDataIsError()) {
      this.rechargeBtn=false;
      this.spinner=false;
    }else {
      this.transactionRecord={
        purpose:"Recharge with "+this.card+" card [Card Number:*"+this.cardNumber.replace(/\s+/g, '').slice(-6)+"]",
        telephone:this.telephone,
        amount:this.sumOfMoney,
        transactionDetails:this.transactionDetails
      }
      this.http.post(endPoints.wallet+"/recharge",this.transactionRecord,this.user.optionsAuthorization2()).subscribe(()=>{
        this.rechargeBtn=false;
        this.spinner=false;
        this.dialog.open(AlertDialogComponent,{
          width:'500px',
          data:{
            title:'Successes',
            message:':) Recharge account '+this.telephone+' with '+this.sumOfMoney+'€ successfully.',
            confirm:false
          }
        })
        this.dialogRef.close();
      },(error)=>{
        this.rechargeBtn=false;
        this.spinner=false;
        if(error.status==="404"){
          this.showError(error.status+":)telephone ERROR")
        }else {
          this.showError(error)
        }
      })
    }
  }

  rechargeDataIsError(){
    if(this.sumOfMoney<=0) {
      this.showError(":) 403 Minimum recharge amount is €1")
      return true;
    }else if(this.cardNumber.length<19){
      this.showError(":) 403 Incorrectly formatted bank card number")
      return true;
    }else if(this.cvv.length<3) {
      this.showError(":) 403 CVV is incorrectly formatted")
      return true;
    }else if(this.expirationDate.length<5) {
      this.showError(":) 403 Expiration Date is incorrectly formatted")
      return true;
    }else {
      return false;
    }
  }
  public showError(notification: string): void {
      this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  getBalance(){
    this.http.get(endPoints.wallet+"/"+this.telephone,this.user.optionsAuthorization2())
      .subscribe((data:any)=>
      this.balance = data.body.balance)
  }

}
