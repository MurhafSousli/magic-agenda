import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AgendaService } from '../../services/agenda/agenda.service';
import { AgendaItem } from '../../services/agenda/agenda.model';
import { fadeInOut } from '../upload-dialog/upload-dialog.animations';

@Component({
  selector: 'select-dialog',
  templateUrl: './select-dialog.html',
  styleUrls: ['./select-dialog.scss'],
  animations: [fadeInOut]
})
export class SelectDialog {

  /** Filter document files */
  filter = {name: ''};

  /** Selected agenda item */
  selectedItem: AgendaItem;

  constructor(public dialogRef: MdDialogRef<SelectDialog>, public agenda: AgendaService) {
  }

  selectItem(item: AgendaItem, radio) {
    radio.checked = true;
    this.selectedItem = item;
  }

}
