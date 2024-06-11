import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BookPageComponent} from "../../book-page/book-page.component";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../../authService";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnInit{
  @Input() book: any={};
  @Input() showBorrowCount: boolean = false;
  @Output() dialogClosed = new EventEmitter<void>();

  constructor(private dialog:MatDialog) {}

  ngOnInit(): void {}

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
