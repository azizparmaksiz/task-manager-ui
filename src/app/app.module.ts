import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TaskService} from './service/task.service';
import {ListTaskComponent} from './components/list/list.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {OptionService} from './service/option-service';
import {BaseHttpService} from './service/base-service';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent,
    ListTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3500
    }),
    BrowserAnimationsModule,
    CalendarModule,

  ],
  providers: [TaskService, OptionService, BaseHttpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
