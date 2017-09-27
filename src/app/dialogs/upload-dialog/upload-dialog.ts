import { ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MdDialog, MdSelectionList } from '@angular/material';
import { DropzoneDirective } from 'ngx-dropzone-wrapper';
import { fadeInOut, fadeOverlay, openDialog, slideUp } from './upload-dialog.animations';
import { AgendaItem } from '../../services/agenda/agenda.model';
import { SelectDialog } from '../select-dialog/select-dialog';

import { FilesService } from '../../services/files/files.service';
import { AgendaService } from '../../services/agenda/agenda.service';
import { AlgorithmService } from '../../services/algorithm/algorithm';

import { Subject } from 'rxjs/Subject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

@Component({
  selector: 'upload-dialog',
  templateUrl: './upload-dialog.html',
  styleUrls: ['./upload-dialog.scss'],
  animations: [fadeInOut, slideUp, openDialog, fadeOverlay]
})
export class UploadDialog implements OnInit, OnDestroy {

  /** Filter document files */
  filter = {name: ''};

  fileUpload$ = new Subject<string>();
  selectedAgenda: AgendaItem;
  obs$;

  /** To show loading while algorithm is searching */
  loading = false;
  showDialog = true;

  componentRef: ComponentRef<UploadDialog>;

  @ViewChild(DropzoneDirective) dropZoneDirective: DropzoneDirective;
  @ViewChild(MdSelectionList) filesList: MdSelectionList;

  constructor(public files: FilesService,
              public agenda: AgendaService,
              private dialog: MdDialog,
              private renderer: Renderer2,
              private cd: ChangeDetectorRef,
              private algorithm: AlgorithmService) {

  }

  ngOnInit() {
    /** When file is uploaded, use the file name to search for the related agenda items
     * This is algorithm works async for better performance
     *
     * Added a small delay to convince the user that something is happening (better UX) */

    this.obs$ = combineLatest(this.fileUpload$, this.agenda.data)
      .delay(1000)
      .do(([fileName, agendaList]) => {

        const matchKey = this.algorithm.didYouMean(fileName, agendaList, 'name');
        const matchItem = agendaList.filter(item => item.name === matchKey);

        /** turn off loading */
        this.loading = false;
        if (matchItem && matchItem.length) {
          this.selectedAgenda = matchItem[0];
        }
        this.cd.detectChanges();
      }).subscribe();
  }

  ngOnDestroy() {
    this.obs$.unsubscribe();
    this.fileUpload$.unsubscribe();
  }

  onUploadSuccess(e) {
    this.loading = true;
    const newFile = e[0];

    /** Add the new file to our files storage */
    this.files.add(newFile);

    /** Refresh the view */
    this.cd.detectChanges();

    /** Strip extension out from file name */
    const fileName = newFile.name.replace(/\.[^/.]+$/, '');

    /** Add file to memory */
    this.fileUpload$.next(fileName);

    /** Add click event to the uploaded file thumbnail */
    this.renderer.listen(newFile.previewElement, 'click', () => {

      /** Remove file thumbnail on click from the drop zone */
      this.dropZoneDirective.dropzone.removeFile(newFile);
    });
  }

  onUploadError(e) {
    console.warn('File upload failed!', e);
  }

  /** Manually select agenda if no related items found */
  changeAgenda() {
    const dialogRef = this.dialog.open(SelectDialog, {
      width: '400px',
      panelClass: 'select-dialog'
    });

    dialogRef.afterClosed().subscribe((selectedItem: AgendaItem) => {
      if (selectedItem) {
        this.selectedAgenda = selectedItem;
        this.cd.markForCheck();
      }
    });
  }

  /** Select/Deselect file items */
  toggleSelection(e) {
    e.checked ? this.filesList.selectAll() : this.filesList.deselectAll();
  }

  closeDialog(ok: boolean) {

    /** Add selected files to the selected agenda item */
    if (ok && this.selectedAgenda && this.filesList.selectedOptions.selected.length) {

      /** Extract selected files from the selected file items */
      const selectedFiles: File[] = this.filesList.selectedOptions.selected.map(item => item.value);

      /** Add selected files to the selected agenda item */
      this.agenda.addFiles(this.selectedAgenda, selectedFiles);
    }


    /** Destroy the dialog after 400ms delay (To get the animation to work) */
    this.showDialog = false;
    this.componentRef.destroy();
    setTimeout(() => {
      this.componentRef.destroy();
    }, 300);
  }

  /** Update item checkbox on click */
  fileItemClick() {
    this.cd.detectChanges();
  }

}
