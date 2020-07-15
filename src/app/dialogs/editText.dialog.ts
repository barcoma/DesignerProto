import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

export interface DialogData {
  text: string;
}

@Component({
  selector: 'edit-text-dialog',
  templateUrl: './editText.dialog.html',
})
export class EditTextDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onSubmit(data): void {
    this.dialogRef.close(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
