import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { HomeComponent } from './components';
import { AboutComponent } from './components';
import { ContactComponent } from './components';
import { ListComponent } from './components';

@NgModule({
  declarations: [
  ListComponent,
  AppComponent,
  HomeComponent,
  AboutComponent,
  ContactComponent,
  ToolbarComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
