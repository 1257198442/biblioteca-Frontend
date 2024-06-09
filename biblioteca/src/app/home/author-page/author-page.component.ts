import {Component, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorModel, BookModel} from "../../model/book.model";
import {authService} from "../../authService";
import {endPoints} from "../../endPoints";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";


@Component({
  selector: 'app-author-page',
  templateUrl: './author-page.component.html',
  styleUrls: ['./author-page.component.css']
})
export class AuthorPageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  authorsBooksData:BookModel[]=[];
  authorData:AuthorModel={authorId:"",name:"",nationality:"",description:"",imgUrl:""};
  authorDataByModify={name:"",nationality:"",description:""};
  pageSize = 16;
  currentPage = 0;
  authorId="";
  isEdit= false;
  file: File | undefined;
  authorImageUrl:string = ""
  authorImageSelectedUrl: string = "";
  userData:any;

constructor(@Inject(MAT_DIALOG_DATA)data:any,
            private http:HttpClient,
            public user:authService,
            private dialog:MatDialog,) {

      this.userData = user.getUserData();
      this.getAuthorData(data.authorId);
      this.getAuthorsBooks(data.authorId);
      this.authorId = data.authorId;
  }

  getAuthorData(authorId:string){
  this.http.get(endPoints.author + "/" + authorId).subscribe(
    (data:any)=> {
    this.authorData = data;
    this.authorImageUrl = this.authorData.imgUrl;
    this.authorImageSelectedUrl = this.authorImageUrl
    this.authorDataByModify = this.modifyAuthorData();})
  }
  modifyAuthorData(){
    return {name:this.authorData.name,
            nationality:this.authorData.nationality,
            description:this.authorData.description}
  }

  getAuthorsBooks(authorId:string){
  this.http.get(endPoints.book + "/search?authorId=" + authorId).subscribe(
    (data:any)=> {
    this.authorsBooksData = data;
    this.paginator.length = data.length;})
  }

  onPageChange(event:any): void {
    this.currentPage = event.pageIndex;
  }

  get paginatedBooks(): BookModel[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.authorsBooksData.slice(startIndex, endIndex);
  }

  onImageSelected(event:any): void {
    this.file = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      this.authorImageSelectedUrl = e.target.result;
    };
    // @ts-ignore
    if(this.file){
      reader.readAsDataURL(this.file);
    }else {
      this.authorImageSelectedUrl = this.authorImageUrl;
    }
  }

  putAuthor(){
    this.http.put(endPoints.author + "/" + this.authorId,this.authorDataByModify,this.user.optionsAuthorization2())
      .subscribe(()=> {
        if(this.authorImageSelectedUrl !== this.authorImageUrl && this.authorImageSelectedUrl !== ""){
         this.putImage();
        }else {
          this.getAuthorData(this.authorId);
        }
      },error => console.log(error))
  }

  putImage(){
    const formData = new FormData();
    formData.append('file', this.file as Blob);
    this.http.put(endPoints.author + "/" + this.authorId + "/image",formData,this.user.optionsAuthorization2()).subscribe(
      () => this.getAuthorData(this.authorId)
      ,error => console.log(error))
  }

  edit(){
    if(this.authorDataByModify.name!=this.authorData.name||this.authorDataByModify.description!=this.authorData.description||this.authorDataByModify.nationality!=this.authorData.nationality||this.authorImageSelectedUrl!=this.authorData.imgUrl){
      if(this.isEdit){
        const title = 'Warning';
        const message = 'Are you sure you want to save this revision? This will put the article back up for review.';
        const confirm = true;
        const input = false;
        const dialogRef= this.openAlertDialogPage(title,message,confirm,input)
        dialogRef.afterClosed().subscribe(res => {
          if(res === 'confirm'){
            this.putAuthor();
          }else {
            this.authorImageSelectedUrl = this.authorImageUrl;
          }})}}
    this.isEdit=!this.isEdit
  }

  // isAdmin(rol:string){
  //   return rol === 'ADMINISTRATOR' || rol === 'ROOT'
  // }

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
