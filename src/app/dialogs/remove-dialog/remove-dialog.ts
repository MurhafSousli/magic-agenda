import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'remove-dialog',
  templateUrl: './remove-dialog.html',
  styleUrls: ['./remove-dialog.scss']
})
export class RemoveDialog {

  constructor(public dialogRef: MdDialogRef<RemoveDialog>,
              @Inject(MD_DIALOG_DATA) public itemName: string) {
  }

}
