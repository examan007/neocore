import { Component, NgZone, OnInit } from '@angular/core';
import * as UIRouterModule from '../../assets/UIRouter.js';
import * as ContactManager from '../../app/common/contactmanager.js';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  UIRouter = UIRouterModule.getUIRouter();
  Manager = ContactManager.getManager();
  objects = [];
  results = [];
  constructor() { }
  ngOnInit() {
    console.log('toolbar');
    UIRouterModule.initUIRouter(this);
    this.UIRouter.update();
  }
  updateObjects () {
      console.log('In Angular is ' + NgZone.isInAngularZone());
      this.objects = [...UIRouterModule.getObjects()];
      this.results = [...UIRouterModule.getResults()];
  }
  getManager() {
      return (this.Manager);
  }
}
