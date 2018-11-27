import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskModalComponent } from './ask-modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [AskModalComponent],
  entryComponents: [AskModalComponent]
})
export class AskModalModule { }
