import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {endPoints} from "../../endPoints";
import {AuthorAddData} from "../../model/book.model";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../authService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";

@Component({
  selector: 'app-add-author-page',
  templateUrl: './add-author-page.component.html',
  styleUrls: ['./add-author-page.component.css']
})
export class AddAuthorPageComponent {
  step= 0;
  authorNameFormControl = new FormControl('', [Validators.required, Validators.pattern('^(?!\\s*$).+')]);
  author:AuthorAddData = {name:"", description:"", nationality:""}
  @Output() uploadOk = new EventEmitter<void>();
  constructor(private http:HttpClient,
              public user:authService,
              private dialog:MatDialog,
              public router:Router,
              private snackBar: MatSnackBar) {}

  clear(){
    this.author = {
      name:"",
      description:"",
      nationality:""
    };
  }

  authorNameCorrectFormat(num:number){
    if(num==1){
      return this.authorNameFormControl.hasError('pattern') && !this.authorNameFormControl.hasError('required');
    }else {
      return this.authorNameFormControl.hasError('required')
    }
  }

  notNull(){
    return !this.authorNameCorrectFormat(1)&&!this.authorNameCorrectFormat(2);
  }

  addAuthor(){
    this.author.name = this.authorNameFormControl.value == null ? "" : this.authorNameFormControl.value;
    if (this.author.name.trim().length !== 0){
      this.http.post(endPoints.author,this.author,this.user.optionsAuthorization2()).subscribe((authorData:any)=> {
        const title = 'Reminders';
        const message = ':) Author ' + authorData.body.name + ' added successfully.';
        const confirm = false;
        const input = false;
        const dialogRef = this.openAlertDialogPage(title,message,confirm,input)
        dialogRef.afterClosed().subscribe(()=> {
          this.uploadOk.emit();
          this.clear();
          this.step = 0;});
      },error => this.showError(error.status + error.message));
    }else this.showError("The author's name cannot be empty");
  }

  openAlertDialogPage( title:string,message:string,confirm:boolean,input:boolean){
    return this.dialog.open(AlertDialogComponent,{
      width:'500px',
      data:{
        title:title,
        message:message,
        confirm:confirm,
        input:input}})
  }

  public showError(notification: string): void {
    this.snackBar.open(notification, 'Error', {duration: 5000});
  }

}
