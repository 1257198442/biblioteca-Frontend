import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {BookTypeModel} from "../../model/book.model";
import {endPoints} from "../../endPoints";
import {HttpClient} from "@angular/common/http";
import {authService} from "../../authService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AlertDialogComponent} from "../../sign-up/alert-dialog.component";

@Component({
  selector: 'app-add-type-page',
  templateUrl: './add-type-page.component.html',
  styleUrls: ['./add-type-page.component.css']
})
export class AddTypePageComponent {
  type:BookTypeModel = {name:"",description:""}
  stepType= 0;
  typeNameFormControl = new FormControl('', [Validators.required, Validators.pattern('^(?!\\s*$).+')]);
  @Output() uploadOk = new EventEmitter<void>();
  constructor(private http:HttpClient,
              public user:authService,
              private dialog:MatDialog,
              public router:Router,
              private snackBar: MatSnackBar) {}

  typeNameCorrectFormat(num:number){
    if(num==1){
      return this.typeNameFormControl.hasError('pattern') && !this.typeNameFormControl.hasError('required');
    }else {
      return this.typeNameFormControl.hasError('required')
    }
  }

  noNull(){
    return !this.typeNameCorrectFormat(1) && !this.typeNameCorrectFormat(2)&&this.type.description.length!==0;
  }

  clear(){
    this.type = {name:"",description:""};
  }

  addBookType(){
    this.type.name = this.typeNameFormControl.value == null ? "" : this.typeNameFormControl.value;
    if(this.type.name.trim().length!==0){
      this.http.post(endPoints.type,this.type,this.user.optionsAuthorization2()).subscribe(()=>{
        const title = 'Successfully';
        const message = 'Book type [' + this.type.name + '] added successfully';
        const confirm = false;
        const input = false;
        const dialogRef = this.openAlertDialogPage(title,message,confirm,input)
        dialogRef.afterClosed().subscribe(()=> {
          this.uploadOk.emit();
          this.clear();
          this.stepType = 0;});
        this.type = {name:"",description:""};
      });}else this.showError("The type's name cannot be empty")
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
