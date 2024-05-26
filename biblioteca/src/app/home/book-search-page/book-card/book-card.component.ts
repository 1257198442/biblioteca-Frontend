import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookPageComponent} from "../../book-page/book-page.component";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../../authService";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book: any;
  @Input() showBorrowCount: boolean = false;
  @Output() dialogClosed = new EventEmitter<void>();

  constructor(private http:HttpClient,
              private user:authService,
              private dialog:MatDialog) {}

  openBookPage(bookId:string){
    this.dialog.open(BookPageComponent,{
      width:"800px",
      minWidth:"800px",
      height:"auto",
      maxHeight:"900px",
      data:{
        bookId:bookId,
      }
    }).afterClosed().subscribe(()=>{
      this.dialogClosed.emit();
    })
  }
}
