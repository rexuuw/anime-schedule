import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { ScheduleEntryComponent } from './components/schedule-entry/schedule-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedulePageComponent,
    ScheduleEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
