import { Component, NgZone, OnInit } from '@angular/core';
import 'zone.js/dist/zone';
import * as ContactObj from '../../../assets/contacts.js';
import * as ContactManager from '../../../app/common/contactmanager.js';
declare var System: any;
declare var require: any;
@Component({
  selector: 'app-list',
  templateUrl: './template.html',
  styleUrls: ['./styles.css']
})
export class ListComponent implements OnInit {
    title = 'N4Contact';
    Manager = ContactManager.getManager();
    Contacts = ContactObj.getContacts();
    contactname = ContactObj.value;
    objects = [...ContactObj.getObjects()];
    template = ContactObj.getTemplate();
    results = [];
    objclass = 'text-muted';
    updateObjects () {
        console.log('In Angular is ' + NgZone.isInAngularZone());
        this.objects = [...ContactObj.getObjects()];
        this.results = [...ContactObj.getResults()];
    }
    readSingleFile(obj, tag) {
        ContactObj.readSingleFile(obj, tag);
    }
    ngOnInit() {
        console.log('AppComponent.ngOnInit();');
        ContactObj.initContacts(this)
    }
    getManager() {
        return (this.Manager);
    }
}
