import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'add-dialog',
  templateUrl: './add-dialog.html',
  styleUrls: ['./add-dialog.scss']
})
export class AddDialog {

  name: string;

  constructor(public dialogRef: MdDialogRef<AddDialog>,
              @Inject(MD_DIALOG_DATA) public itemName: any) {
  }

}
