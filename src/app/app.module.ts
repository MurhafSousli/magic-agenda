import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { AgendaService } from './services/agenda/agenda.service';
import { FilesService } from './services/files/files.service';
import { AgendaListComponent } from './agenda-list/agenda-list.component';
import { RemoveDialog } from './dialogs/remove-dialog/remove-dialog';
import { UploadDialog } from './dialogs/upload-dialog/upload-dialog';
import { AddDialog } from "./dialogs/add-dialog/add-dialog";
import { SelectDialog } from './dialogs/select-dialog/select-dialog';
import { AlgorithmService } from './services/algorithm/algorithm';
import { NFormatterPipe } from './pipes/n-formatter.pipe';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  maxFilesize: 5,
  uploadMultiple: false
};

@NgModule({
  entryComponents: [
    RemoveDialog,
    AddDialog,
    SelectDialog,
    UploadDialog
  ],
  declarations: [
    AppComponent,
    AgendaListComponent,
    UploadDialog,
    RemoveDialog,
    AddDialog,
    SelectDialog,
    NFormatterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    FilterPipeModule
  ],
  providers: [
    AgendaService,
    FilesService,
    AlgorithmService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
