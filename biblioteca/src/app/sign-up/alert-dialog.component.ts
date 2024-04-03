import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content *ngIf="!data.input">{{ data.message }}</mat-dialog-content>
    <mat-form-field *ngIf="data.input" style="margin-left:24px;width: 70% ">
      <mat-label>{{ data.message }}</mat-label>
      <input matInput type="password" [(ngModel)]="inputString"  >
    </mat-form-field>
    <mat-dialog-actions align="end">
      <button  mat-button mat-dialog-close>Close</button>
      <button *ngIf="data.confirm" mat-button color="warn" (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class AlertDialogComponent {
  inputString:string="";
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title:string, message: string , input:boolean, confirm:boolean},
  ) {}

  onConfirm(): void {
    if(this.data.input){
      this.dialogRef.close({input:this.inputString,confirm:'confirm'});
    }else {
      this.dialogRef.close('confirm');
    }
  }

}
