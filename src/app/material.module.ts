import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatProgressSpinnerModule
} from '@angular/material';

const MODULES = [
  MatToolbarModule,
  MatListModule,
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatTabsModule,
  MatCheckboxModule,
  MatRadioModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES]
})
export class MaterialModule {
}
