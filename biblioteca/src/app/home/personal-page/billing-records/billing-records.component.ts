import {Component, OnInit} from '@angular/core';
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
export class BillingRecordsComponent implements OnInit{
  telephone:string="";
  recordsList:Record[]=[];
  constructor(private snackBar: MatSnackBar,
              private user:authService,
              private http:HttpClient) {}

  ngOnInit(): void {
    this.telephone = this.user.getUserData().userTelephone;
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


