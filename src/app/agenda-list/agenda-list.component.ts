import { Component, Input, Renderer2 } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AgendaService } from '../services/agenda/agenda.service';
import { RemoveDialog } from '../dialogs/remove-dialog/remove-dialog';
import { AddDialog } from '../dialogs/add-dialog/add-dialog';
import { AgendaItem } from '../services/agenda/agenda.model';

@Component({
  selector: 'agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.scss']
})
export class AgendaListComponent {

  @Input() list: AgendaItem[];

  /** Use Agenda tab by default */
  selectedTabIndex = 1;

  /** Dummy text */
  demoText = demo;

  /** New item input value */
  newItemName: string;

  constructor(private dialog: MdDialog, public agenda: AgendaService, private renderer: Renderer2) {

  }

  /** Add agenda item to the list */
  addItem() {
    if(this.newItemName.length) {
      this.agenda.add(this.newItemName);
      this.newItemName = '';
    }
  }

  /** Add child agenda item */
  addChildItem(item: AgendaItem) {

    /** Show add dialog */
    const dialogRef = this.dialog.open(AddDialog, {
      width: '375px',
      data: item.name
    });

    dialogRef.afterClosed().subscribe(newAgendaName => {
      if (newAgendaName) {
        this.agenda.add(newAgendaName, item);
      }
    });
  }

  /** Remove agenda item */
  removeItem(item: AgendaItem, parent: AgendaItem) {
    /** Show confirmation dialog */
    const dialogRef = this.dialog.open(RemoveDialog, {
      width: '375px',
      data: item.name || item
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.agenda.remove(item, parent);
      }
    });
  }

  /** Download agenda's files */
  downloadFiles(item: AgendaItem) {

    item.files.map((file: any) => {
      console.log('Downloading', file, '...');
      const element = this.renderer.createElement('a');
      this.renderer.setAttribute(element, 'href', file.dataURL);
      this.renderer.setAttribute(element,'download', file.name);
      this.renderer.setStyle(element, 'display', 'none');
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });

  }
}

const demo = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,  sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
  <br><br>
Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
`;
