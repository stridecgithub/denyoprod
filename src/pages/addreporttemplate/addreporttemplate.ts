import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Http, Headers, RequestOptions } from '@angular/http';
//import { AddunitgroupPage } from '../addunitgroup/addunitgroup';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';

/**
 * Generated class for the AddreporttemplatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Io//nic pages and navigation.
 */
@Component({
  selector: 'page-addreporttemplate',
  templateUrl: 'addreporttemplate.html',
  providers: [Config]
})
export class AddreporttemplatePage {
  public items = [];
  public template_data = [];
  public getCheckboxData = [];
  public loginas: any;
  public userId: any;
  public templatename: any;
  public templatedata: any;
  public form: FormGroup;
  public selectoption: any;
  public availableheading = [];
  public availableheadingitem = [];
  pageTitle: string;
  public recordID: any = null;
  public isEdited: boolean = false;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "templatename": ["", Validators.required]

    });

    this.userId = localStorage.getItem("userInfoId");
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
        this.previous();
      });
      this.network.onConnect().subscribe(data => {
        console.log("maps.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("maps.ts Platform ready-onDisconnect:" + data.type);
        localStorage.setItem("isNet", 'offline');
        this.networkType = this.conf.networkErrMsg();
      }, error => console.error(error));

       let isNet = localStorage.getItem("isNet");
      if (isNet == 'offline') {
        this.networkType = this.conf.networkErrMsg();
      } else {
        this.networkType = '';
      }
    });
  }
  /*
insertUserToArray(id,item){
//check item.user and do stuff

console.log("Current Available Loop Data"+JSON.stringify(this.availableheadingitem));
console.log("Id"+id+"<==>"+item._value);

console.log("Selected DAta:"+JSON.stringify(this.getCheckboxData));
}*/
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddreporttemplatePage');
    
    localStorage.setItem("fromModule", "AddreporttemplatePage");
  }
  ionViewWillEnter() {
    if (this.NP.get("record")) {
      this.pageTitle = "Edit Template";
      console.log(this.NP.get("record"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
    }
    else {
      this.pageTitle = "Add Template";
      this.isEdited = false;

    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getavailableheading";
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        let checkvalue = false;
        if (res.templatedata.length > 0) {

          for (let tempdata in res.templatedata) {

            if (this.NP.get("record")) {
              if (this.in_array(res.templatedata[tempdata].availabledata, this.NP.get("record").availableheading) != -1) {
                //is in array
                checkvalue = true;

                this.getCheckboxData.push({
                  availabledata: res.templatedata[tempdata].availabledata
                });
              } else {
                checkvalue = false;
              }
            }
            this.availableheadingitem.push({
              id: res.templatedata[tempdata].id,
              availabledata: res.templatedata[tempdata].availabledata,
              check: checkvalue
            });
          }
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  in_array(needle, haystack) {
    var found = 0;
    for (var i = 0, len = haystack.length; i < len; i++) {
      if (haystack[i] == needle) return i;
      found++;
    }
    return -1;
  }


  /*getCheckBoxValue(name) {
    console.log("Available data" + name);


    this.getCheckboxData.push({
      availabledata: name
    })
    console.log(JSON.stringify(this.getCheckboxData));
  }*/

  getCheckBoxValue(id, item, value) {

  }
  insertUserToArray(id, item, value) {

    /* console.log("Available data" + name);
 
 
     this.getCheckboxData.push({
       availabledata: name
     })
     console.log(JSON.stringify(this.getCheckboxData));
     */


    //check item.user and do stuff

    console.log("Current Available Loop Data" + JSON.stringify(this.availableheadingitem));
    console.log("Id:" + id + "<==>Checkbox Boolean:" + item._value + "<==>Checkbox value:" + value);

    //console.log("Selected DAta:"+JSON.stringify(this.getCheckboxData));
    //this.getCheckboxData.splice(1,1);
    //console.log("Filter DAta:"+JSON.stringify(this.getCheckboxData));

    if (item._value == true) {
      this.getCheckboxData.push({ "availabledata": value });
    } else {
      for (var i = 0; i < this.getCheckboxData.length; i++) {
        if (this.getCheckboxData[i].availabledata == value) {
          this.getCheckboxData.splice(i, 1);
          break;
        }
      }
    }
    console.log("Edited Data" + JSON.stringify(this.getCheckboxData));
  }


  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      if (this.isEdited) {

        this.updateEntry();
      }
      else {
        this.createEntry();
      }

    }
  }
  updateEntry() {
    if (this.getCheckboxData.length == 0) {
      this.conf.sendNotification('Checkbox ateast one should be selected');
    } else {
      //let getCheckbox = this.remove_duplicates(this.getCheckboxData);
      //console.log("Check" + getCheckbox);
      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&data=" + JSON.stringify(this.getCheckboxData) + "&id=" + this.recordID + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/update";
      console.log(url + "?" + body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();
          console.log(JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            console.log("Msg Results:-" + res.msg[0].result);
            if (res.msg[0].result > 0) {
              this.conf.sendNotification(res.msg[0].result);
              this.nav.push(ReporttemplatePage);
            } else {
              this.conf.sendNotification(res.msg[0].result);
              this.nav.push(ReporttemplatePage);
            }
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
  }
  selectEntry(item) {

    this.templatename = item.templatename;
    console.log("Id:" + item.id);
    this.recordID = item.id;
    console.log("Available Heading:" + JSON.stringify(item.availableheading));
    console.log(item.availableheading);
    for (let ava = 0; ava < item.availableheading; ava++) {
      console.log(item.availableheading[ava]);
    }

  }
  createEntry() {
    if (this.getCheckboxData.length == 0) {
      this.conf.sendNotification('Checkbox ateast one should be selected');
    } else {
      console.log(JSON.stringify(this.getCheckboxData));
      let templatename: string = this.form.controls["templatename"].value
      let body: string = "is_mobile=1&templatename=" + templatename + "&data=" + JSON.stringify(this.getCheckboxData) + "&ses_login_id=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reporttemplate/store";
      console.log(url + "?" + body);

      this.http.post(url, body, options)
        .subscribe((data) => {
          let res = data.json();
          console.log(JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            console.log("Msg Results:-" + res.msg[0].result);
            if (res.msg[0].result > 0) {
              this.conf.sendNotification(res.msg[0].result);
              this.nav.push(ReporttemplatePage);
            } else {
              this.conf.sendNotification(res.msg[0].result);
              this.nav.push(ReporttemplatePage);
            }
          }
          // Otherwise let 'em know anyway
          else {
            this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
    }
  }

  previous() {
    this.nav.push(ReporttemplatePage);
  }
  notification() {
    this.nav.push(NotificationPage);
  }
  redirectToUser() {
    this.nav.push(UnitsPage);
  }
  redirectToMessage() {
    this.nav.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.nav.push(CalendarPage);
  }
  redirectToMaps() {
    this.nav.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.nav.push(OrgchartPage);
  }
}
