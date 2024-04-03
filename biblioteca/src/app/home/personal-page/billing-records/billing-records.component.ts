import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../../authService";
import {endPoints} from "../../../endPoints";
import {Record} from "../../../model/record.model";


@Component({
  selector: 'app-billing-records',
  templateUrl: './billing-records.component.html',
  styleUrls: ['./billing-records.component.css']
})
export class BillingRecordsComponent {
  telephone:string="";
  recordsList:Record[]=[];
  constructor(@Inject(MAT_DIALOG_DATA)data:any, private snackBar: MatSnackBar, private user:authService, private http:HttpClient) {
    this.telephone = data.telephone;
    this.getRecords();
  }

  getRecords(){
    this.http.get(endPoints.transaction + "/search?telephone=" + encodeURIComponent(this.telephone),this.user.optionsAuthorization2()).subscribe(
      (data:any) => this.recordsList = data.body
      ,error => this.showError(error.status+error.message));
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  protected readonly Math = Math;
}


