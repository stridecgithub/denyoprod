import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { UserPage } from '../user/user';
//import { UseraccountPage } from '../useraccount/useraccount';
import 'rxjs/add/operator/map';
//import { FileChooser } from '@ionic-native/file-chooser';
//import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
//import { File } from '@ionic-native/file';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';
/**
 * Generated class for the ViewcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-viewcompanygroup',
  templateUrl: 'viewcompanygroup.html',
})
export class ViewcompanygroupPage {
  public companygroup_name: any;
  public address: any;
  public country: any;
  public contact: any;
  public userId: any;
  public totaluser:any;
  public totalunit:any;
  public responseResultCountry: any;
  public recordID: any = null;
  public pageTitle: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public NP: NavParams) {
  }

  ionViewWillEnter() {
    console.log(this.NP.get("record"));
    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'View Company Group';
    }
  }
  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    
    this.companygroup_name = item.companygroup_name;
    this.address = item.address;
    this.country = item.country;
    this.contact = item.contact;   
    this.totaluser = item.totaluser;
    this.totalunit = item.totalunit;
    this.recordID = item.companygroup_id;
   
  }
   notification() {
    this.navCtrl.push(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.push(UnitsPage);
  }
  redirectToMessage() {
    this.navCtrl.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.push(CalendarPage);
  }
  redirectToMaps() {
    this.navCtrl.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.navCtrl.push(OrgchartPage);
  }
}
