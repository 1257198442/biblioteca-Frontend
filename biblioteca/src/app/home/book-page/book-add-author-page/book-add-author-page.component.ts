import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthorModel} from "../../../model/book.model";
import {endPoints} from "../../../endPoints";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../../authService";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-book-add-author-page',
  templateUrl: './book-add-author-page.component.html',
  styleUrls: ['./book-add-author-page.component.css']
})

export class BookAddAuthorPageComponent implements OnInit{
  @Output() _addAuthor = new EventEmitter<any>();
  allAuthor: AuthorModel[] = [];
  selectAuthor:any;

  constructor(private http: HttpClient,
              public user: authService,
              private snackBar: MatSnackBar) {}

  addAuthor() {
    this._addAuthor.emit(this.selectAuthor)
  }

  getAllAuthor() {
    this.http.get(endPoints.author).subscribe(
      (data: any) => this.allAuthor = data
      , error => this.showError(error.status + error.message)
    )}

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

  ngOnInit(): void {
    this.getAllAuthor()
  }

}
