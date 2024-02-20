import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <h2 mat-dialog-title>{{data.title}}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button  mat-button mat-dialog-close>Close</button>
      <button *ngIf="data.confirm" mat-button color="warn" (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `,
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title:string, message: string ,confirm:boolean}
  ) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
