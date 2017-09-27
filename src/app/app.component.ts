import { Component, ComponentFactoryResolver, OnInit, ViewContainerRef } from '@angular/core';
import { AgendaService } from './services/agenda/agenda.service';
import { FilesService } from "./services/files/files.service";
import { UploadDialog } from "./dialogs/upload-dialog/upload-dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public agenda: AgendaService,
              public files: FilesService,
              public viewContainerRef: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit() {
    this.agenda.add('Admin');
    this.agenda.add('Minutes Last Meeting');
    this.agenda.add('Management Update');
    const agendaItem = this.agenda.add('Country Managers Outlook');
    this.agenda.add('Sales Marketing');
    this.agenda.add('Switzerland / Austria / Italy', agendaItem);
    this.agenda.add('Germany', agendaItem);
    this.agenda.add('France', agendaItem);
  }

  openUploadDialog(){
    const factory = this.componentFactoryResolver.resolveComponentFactory(UploadDialog);
    const componentRef = this.viewContainerRef.createComponent(factory);
    (<UploadDialog>componentRef.instance).componentRef = componentRef;
  }

}
