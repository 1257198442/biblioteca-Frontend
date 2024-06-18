import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {authService} from "../../../authService";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BookTypeModel} from "../../../model/book.model";
import {endPoints} from "../../../endPoints";

@Component({
  selector: 'app-book-add-type-page',
  templateUrl: './book-add-type-page.component.html',
  styleUrls: ['./book-add-type-page.component.css']
})
export class BookAddTypePageComponent implements OnInit{
  @Output() _addType = new EventEmitter<any>();
  allType:BookTypeModel[] = [];
  selectType:any;
  constructor(private http: HttpClient,
              public user: authService,
              private snackBar: MatSnackBar) {
  }

  addType() {
    this._addType.emit(this.selectType)
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe(
      (data:any) => this.allType = data
      ,error => this.showError(error.status+error.message))
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  ngOnInit(): void {
    this.getAllBookType();
  }
}
