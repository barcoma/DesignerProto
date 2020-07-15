import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { DialogData } from './editText.dialog';

@Component({
  selector: 'app-save-project',
  templateUrl: './save-project.dialog.html'
})

export class SaveProjectDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    onSubmit(data): void {
      this.dialogRef.close(data);
    }

}
