import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent, ContactComponent, HomeComponent, ListComponent } from './components';

export var states = [
];

const routes: Routes = [
{ path: 'about', component: AboutComponent },
{ path: 'home', component: HomeComponent },
{ path: 'contact', component: ContactComponent },
{ path: 'home/list', component: ListComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
