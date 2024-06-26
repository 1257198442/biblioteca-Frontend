import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {BookModel, BookTypeModel} from "../../model/book.model";
import {HttpClient} from "@angular/common/http";
import {endPoints} from "../../endPoints";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-book-search-page',
  templateUrl: './book-search-page.component.html',
  styleUrls: ['./book-search-page.component.css']
})

export class BookSearchPageComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 16;
  currentPage = 0;
  finds:string[]=["name","authorName","publisher","barcode","issn","isbn"]
  placeholder:string="name";
  language:string="All";
  typeS:string="All";
  books:BookModel[]=[];
  allType:BookTypeModel[] = [];
  search:string="";
  allLanguage=["All","Chinese","English","Spanish","French","German","Latin","Japanese","Arabic","Hindi","Portuguese","Korean","Ukrainian","Italian","Norwegian","Dutch","Polish"];
  ENABLEOnly=false;
  showBorrowCount=false;

  constructor(private http:HttpClient,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.searchBooks();
    this.getAllBookType();
  }

  searchBooks(){
    const searchUrl = this.search != "" ? this.placeholder + "=" + this.search : "" ;
    const lang = this.language == "All" ? "" : "language=" + this.language
    const type= this.typeS == "All"?"":"&type="+this.typeS;
    const route = searchUrl + lang + type;
    this.http.get(endPoints.book + "/search?" + route).subscribe(
      (data:any)=> {
        this.books = !this.ENABLEOnly ? data : data.filter((s:any)=> {return s.status=="ENABLE";});
        this.paginator.length = this.books.length;
        if (this.books.length <= this.pageSize) {
          this.paginator.pageIndex = 0;
          this.currentPage = 0;
        }
      },error => this.showError(error.status + error.message));
  }

  getAllBookType(){
    this.http.get(endPoints.type).subscribe(
      (data:any) => this.allType = data
        ,error=> this.showError(error.status + error.message))
  }

  onSelectPlaceholder(event: any) {
    this.placeholder = event.target.value;
  }

  onSelectChangeLanguage(event: any) {
    this.language = event.target.value;
  }

  onPageChange(event:any): void {
    this.currentPage = event.pageIndex;
  }

  get paginatedBooks(): BookModel[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.books.slice(startIndex, endIndex);
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }
}
