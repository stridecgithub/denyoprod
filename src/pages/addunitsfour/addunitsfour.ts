import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AddunitsthreePage } from '../addunitsthree/addunitsthree';
//import { UserPage } from '../user/user';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addunitsfour',
  templateUrl: 'addunitsfour.html',
  providers: [Config]
})
export class AddunitsfourPage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public unitgroups_id: any;
  public companys_id: any;
  public compId: any;
  public userId: any;
  public unitname: any;
  public isSubmitted: boolean = false;
  public projectname: any;
  public createdby: any;
  public responseResultCompany: any;
  public responseResultUnitGroup: any;
  public timezone;
  progress: number;
  public controllerid: any;
  public neaplateno: any;
  public models_id: any;
  public location: any;
  public latitude: any;
  public longitude: any;
  public contact_name: any;
  public alarmhashtags: any;
  public contact_number: any;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public addedImgLists: any;
  public userInfo = [];
  public contactInfo = [];
  public msgcount: any;
  public notcount: any;
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  public isUploadedProcessing: boolean = false;
  public uploadResultBase64Data;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.loginas = localStorage.getItem("userInfoName");
    this.compId = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "unitgroups_id": [""],
      //"companys_id": ["", Validators.required],
      // "unitgroups_id": ["", Validators.required],
      "companys_id": ["", Validators.required]
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddunitsfourPage');
    localStorage.setItem("fromModule", "AddunitsfourPage");
    this.pageLoad();

  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    this.pageLoad();
  }
  pageLoad() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    this.resetFields();
    this.getCompanyListData();
    this.getUnitGroupListData();
    console.log(JSON.stringify(this.NP.get("record")));
    if (this.NP.get("record")) {
      console.log("Add User:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit  Units';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("record").photo) {
        this.addedImgLists = this.apiServiceURL + "/public/staffphotos/" + this.NP.get("record").photo;
        console.log(this.addedImgLists);
      }
      let editItem = this.NP.get("record");
      this.unitgroups_id = editItem.unitgroups_id;
      this.companys_id = editItem.companys_id;
    }
    else {
      this.isEdited = false;
      /* if (localStorage.getItem("unitgroups_id")) {
         this.unitgroups_id = localStorage.getItem("unitgroups_id");
       }
       if (localStorage.getItem("companys_id")) {
         this.companys_id = localStorage.getItem("companys_id");
       }*/
      this.pageTitle = 'New  Units';
    }

    if (this.NP.get("accountInfo")) {
      let info = this.NP.get("accountInfo");

      //var objects = JSON.parse(info);
      console.log("JSON.stringify:" + JSON.stringify(info));
      console.log("Length:" + info.length);
      console.log('A');
      for (var key in info) {
        console.log('B');
        let keyindex;
        if (this.NP.get("record")) {
          keyindex = 0;
        } else {
          keyindex = 1;
        }
        console.log("Key:" + key);
        console.log("Key Index:" + keyindex);
        if (key == keyindex) {
          console.log('Key' + key);
          this.unitname = info[key].unitname;
          this.createdby = info[key].createdby;
          this.projectname = info[key].projectname;
          this.controllerid = info[key].controllerid;
          this.neaplateno = info[key].neaplateno;
          this.models_id = info[key].models_id;
          this.location = info[key].location;
          this.latitude = info[key].latitude;
          this.longitude = info[key].longitude;
          this.contact_name = info[key].contact_name;
          this.alarmhashtags = info[key].alarmhashtags;
          this.contact_number = info[key].contact_number;
          console.log("Unit Name:" + this.unitname);
          console.log("Contact Details1" + info[key].contactInfo);
          console.log("Contact Details2" + JSON.stringify(info[key].contactInfo));
          //console.log(JSON.stringify(this));
          this.contactInfo = info[key].contactInfo;
        } else {
          console.log('Key' + key);
          this.unitname = info[0].unitname;
          this.createdby = info[0].createdby;
          this.unitname = info[0].unitname;
          this.createdby = info[0].createdby;
          this.projectname = info[0].projectname;
          this.controllerid = info[0].controllerid;
          this.neaplateno = info[0].neaplateno;
          this.models_id = info[0].models_id;
          this.location = info[0].location;
          this.latitude = info[0].latitude;
          this.longitude = info[0].longitude;
          this.contact_name = info[0].contact_name;
          this.alarmhashtags = info[0].alarmhashtags;
          this.contact_number = info[0].contact_number;
          this.contactInfo = info[0].contactInfo;
          console.log("Unit Name:" + this.unitname);
          console.log("Contact Details1" + info[0].contactInfo);
          console.log("Contact Details2" + JSON.stringify(info[0].contactInfo));
        }
        /* this.userInfo.push({
           info
         });
         console.log("User Information:" + JSON.stringify(this.userInfo));
         */
      }
    }
  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.unitgroups_id = item.unitgroups_id;
    this.companys_id = item.companys_id;
    this.latitude = item.latitude;
    this.longitude = item.longitude;
    this.recordID = item.unit_id;

  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(unitgroups_id, companys_id, createdby) {



    //this.unitgroups_id = localStorage.setItem("unitgroups_id", unitgroups_id);


    //this.companys_id = localStorage.setItem("companys_id", companys_id);



    this.isSubmitted = true;
    if (localStorage.getItem("atMentionResult") != '') {
      this.alarmhashtags = localStorage.getItem("atMentionResult");
    }

    this.timezone = '2017-06-15 00:00:00';
    //this.longitude = "9.918418";
    //this.latitude = "78.148566";


    console.log("Final User Info 1:" + this.userInfo);
    console.log("Final User Info 2:" + JSON.stringify(this.userInfo));

    if (this.latitude == 'undefined' && this.longitude == 'undefined') {
      this.latitude = '';
      this.longitude = '';
    }
    if (this.latitude == undefined && this.longitude == undefined) {
      this.latitude = '';
      this.longitude = '';
    }
    let body: string = "is_mobile=1&unitname=" + this.unitname +
      "&projectname=" + this.projectname +
      "&controllerid=" + this.controllerid +
      "&neaplateno=" + this.neaplateno +
      "&models_id=" + this.models_id +
      "&location=" + this.location +
      "&createdby=" + this.createdby +
      "&longitude=" + this.longitude +
      "&latitude=" + this.latitude +
      "&updatedby=" + this.createdby +
      "&contactInfo=" + JSON.stringify(this.contactInfo) +
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      "&alarmnotificationto=" + this.alarmhashtags +
      "&timezone=" + this.timezone +
      "&companys_id=" + this.companys_id +
      "&unitgroups_id=" + this.unitgroups_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/units/store";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          localStorage.setItem("atMentionResult", '');
          localStorage.setItem("location", "");
          localStorage.setItem("unitgroups_id", '');
          localStorage.setItem("companys_id", '');
          localStorage.setItem("unitname", '');
          localStorage.setItem("projectname", '');
          localStorage.setItem("controllerid", '');
          localStorage.setItem("models_id", '');
          localStorage.setItem("neaplateno", '');
          this.conf.sendNotificationTimer(`Units created was successfully added`);
          this.nav.push(UnitsPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    /* this.nav.push(UnitsPage, {
       accountInfo: this.userInfo
     });*/


  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(unitgroups_id, companys_id, createdby) {
    this.isSubmitted = true;
    this.userInfo.push({
      //unitgroups_id: unitgroups_id,
      companys_id: companys_id,
      createdby: createdby,

    });
    //this.longitude = "9.918418";
    //this.latitude = "78.148566";
    if (localStorage.getItem("atMentionResult") != '') {
      this.alarmhashtags = localStorage.getItem("atMentionResult");
    }
    this.timezone = '2017-06-15 00:00:00';


    if (this.latitude == 'undefined' && this.longitude == 'undefined') {
      this.latitude = '';
      this.longitude = '';
    }
    if (this.latitude == undefined && this.longitude == undefined) {
      this.latitude = '';
      this.longitude = '';
    }

    let body: string = "is_mobile=1&unit_id=" + this.recordID +
      "&unitname=" + this.unitname +
      "&projectname=" + this.projectname +
      "&controllerid=" + this.controllerid +
      "&neaplateno=" + this.neaplateno +
      "&models_id=" + this.models_id +
      "&location=" + this.location +
      "&createdby=" + this.createdby +
      "&updatedby=" + this.createdby +
      "&longitude=" + this.longitude +
      "&latitude=" + this.latitude +
      "&contactInfo=" + JSON.stringify(this.contactInfo) +
      //"&contact_number=" + this.contact_number +
      // "&contact_name=" + this.contact_name +
      "&alarmnotificationto=" + this.alarmhashtags +
      //"&unitgroups_id=" + this.unitgroups_id +
      "&timezone=" + this.timezone +
      "&companys_id=" + this.companys_id +
      "&unitgroups_id=" + this.unitgroups_id,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/units/update";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          localStorage.setItem("atMentionResult", '');
          this.conf.sendNotificationTimer(`Units was successfully updated`);
          this.nav.push(UnitsPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {
    let unitgroups_id: string = this.form.controls["unitgroups_id"].value,
      body: string = "key=delete&recordID=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "api/companygroup.php";

    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user       
        if (data.status === 200) {
          this.hideForm = true;
          this.conf.sendNotification(`Congratulations the unit: ${unitgroups_id} was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      let unitgroups_id: string = this.form.controls["unitgroups_id"].value,
        companys_id: string = this.form.controls["companys_id"].value
      console.log(this.form.controls);

      if (this.isUploadedProcessing == false) {
        if (this.isEdited) {
          this.updateEntry(unitgroups_id, companys_id, this.userId);
        }
        else {
          this.createEntry(unitgroups_id, companys_id, this.userId);
        }
      }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.unitgroups_id = "";
    this.companys_id = "";
  }


  getCompanyListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultCompany = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  getUnitGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getunitgroups?loginid=" + this.userId + "&company_id=" + this.compId;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultUnitGroup = res.unitgroups;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }






  previous() {
    this.nav.setRoot(AddunitsthreePage, {
      accountInfo: this.userInfo,
      record: this.NP.get("record")
    });
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

