import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TableComponent} from './table/table.component';
import {TableCellComponent} from './table/table-cell/table-cell.component';
import {AskModalModule} from './ask-modal/ask-modal.module';
import {ActionsModule} from './actions/actions.module';
import {ActionService} from './shared/services/action.service';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TableCellComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AskModalModule,
    ActionsModule
  ],
  providers: [ActionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
