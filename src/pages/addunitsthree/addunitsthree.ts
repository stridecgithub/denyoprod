import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AddunitsfourPage } from '../addunitsfour/addunitsfour';
import { AddunitstwoPage } from '../addunitstwo/addunitstwo';
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
  selector: 'page-addunitsthree',
  templateUrl: 'addunitsthree.html',
  providers: [Config]
})
export class AddunitsthreePage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public alarmhashtags: any;
  public contact_name_1: any;
  public contact_number_1: any;
  public contact_name_2: any;
  public contact_number_2: any;
  public contact_name_3: any;
  public contact_number_3: any;
  public contact_name_4: any;
  public contact_number_4: any;
  public contact_name_5: any;
  public contact_number_5: any;
  public gethashtag: any;
  public userId: any;
  public unitname: any;
  public createdby: any;
  public location: any;
  public latitude: any;
  public msgcount: any;
  public notcount: any;
  public longitude: any;
  public projectname: any;
  public controllerid: any;
  public neaplateno: any;
  public models_id: any;
  public responseResultCountry: any;
  public responseResultStaff: any;
  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public cont2: boolean = false;
  public cont3: boolean = false;
  public cont4: boolean = false;
  public cont5: boolean = false;
  public primary: any;
  public primary_2: any;
  public primary_3: any;
  public primary_4: any;
  public primary_5: any;
  public addedImgLists: any;
  public userInfo = [];
  public contactInfo = [];
  public contactnameArray = [];
  public contactnumberArray = [];
  public borderbottomredvalidation: any;
  public borderbottomredvalidation2: any;
  public borderbottomredvalidation3: any;
  public borderbottomredvalidation4: any;
  public borderbottomredvalidation5: any;
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
    // Create form builder validation rules
    this.form = fb.group({
      "alarmhashtags": ["", Validators.required],
      "contact_name_1": [""],
      'contact_number_1': [""],
      "contact_name_2": [""],
      'contact_number_2': [""],
      "contact_name_3": [""],
      'contact_number_3': [""],
      "contact_name_4": [""],
      'contact_number_4': [""],
      "contact_name_5": [""],
      'contact_number_5': [""],
      "contact_name": [""],
      'contact_number': [""],
      "primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      "primary_2": [""],
      "primary_3": [""],
      "primary_4": [""],
      "primary_5": [""],

    });
    this.userId = localStorage.getItem("userInfoId");
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
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
    console.log('ionViewDidLoad AddunitsonePage');
    this.pageLoad();

  }
  getPrimaryContact(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation = '';
    }
  }

  getPrimaryContact2(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation2 = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation2 = '';
    }
  }

  getPrimaryContact3(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation3 = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation3 = '';
    }
  }

  getPrimaryContact4(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation4 = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation4 = '';
    }
  }


  getPrimaryContact5(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation5 = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation5 = '';
    }
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
    this.getJsonCountryListData();
    if (this.NP.get("record")) {
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
      this.alarmhashtags = editItem.alarmnotificationto;
      let contactArr = editItem.contacts;
      if (contactArr != undefined && contactArr != 'undefined' && contactArr != '') {
        let hashhypenhash = contactArr.split("#");
        for (let i = 0; i < hashhypenhash.length; i++) {

          let contDataArr = hashhypenhash[i].split("|");
          let contactName;
          let contactNumber;
          contactName = contDataArr[0];
          contactNumber = contDataArr[1];

          console.log("incr:" + i);
          console.log("contactName:" + contactName);
          console.log("contactNumber:" + contactNumber);
          if (i == 0) {
            this.contact_name_1 = contactName;
            this.contact_number_1 = contactNumber;

            if (this.contact_number_1 != undefined) {
              let contactSplitSpace = this.contact_number_1.split(" ");
              this.primary = contactSplitSpace[0];
              this.contact_number_1 = contactSplitSpace[1];
            }
          }
          if (i == 1 && contactName != '') {
            this.cont2 = true;
            this.contact_name_2 = contactName;
            this.contact_number_2 = contactNumber;

            if (this.contact_number_2 != undefined) {
              let contactSplitSpace = this.contact_number_2.split(" ");
              this.primary_2 = contactSplitSpace[0];
              this.contact_number_2 = contactSplitSpace[1];
              console.log("primary_2:" + this.primary_2);
              console.log("contact_number_2:" + this.contact_number_2);
            }


          }
          if (i == 2 && contactName != '') {
            this.cont3 = true;
            this.contact_name_3 = contactName;
            this.contact_number_3 = contactNumber;

            if (this.contact_number_3 != undefined) {
              let contactSplitSpace = this.contact_number_3.split(" ");
              this.primary_3 = contactSplitSpace[0];
              this.contact_number_3 = contactSplitSpace[1];
            }
          }
          if (i == 3 && contactName != '') {
            this.cont4 = true;
            this.contact_name_4 = contactName;
            this.contact_number_4 = contactNumber;
            if (this.contact_number_4 != undefined) {
              let contactSplitSpace = this.contact_number_4.split(" ");
              this.primary_4 = contactSplitSpace[0];
              this.contact_number_4 = contactSplitSpace[1];
            }
          }
          if (i == 4 && contactName != '') {
            this.cont5 = true;
            this.contact_name_5 = contactName;
            this.contact_number_5 = contactNumber;

            if (this.contact_number_5 != undefined) {
              let contactSplitSpace = this.contact_number_5.split(" ");
              this.primary_5 = contactSplitSpace[0];
              this.contact_number_5 = contactSplitSpace[1];
            }

          }
        }


      }
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'New  Units';
      if (localStorage.getItem("atMentionResult") != '') {
        this.alarmhashtags = localStorage.getItem("atMentionResult");
      }

    }


    if (this.NP.get("accountInfo")) {
      let info = this.NP.get("accountInfo");

      //var objects = JSON.parse(info);

      for (var key in info) {

        let keyindex;
        if (this.NP.get("record")) {
          keyindex = 0;
        } else {
          keyindex = 1;
        }

        if (key == keyindex) {
          this.unitname = info[key].unitname;
          this.createdby = info[key].createdby;
          this.projectname = info[key].projectname;
          this.controllerid = info[key].controllerid;
          this.neaplateno = info[key].neaplateno;
          this.models_id = info[key].models_id;
          this.location = info[key].location;
          this.latitude = info[key].latitude;
          this.longitude = info[key].longitude;

        } else {
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

        }

      }
    }

  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.alarmhashtags = item.alarmnotificationto;
    this.recordID = item.unit_id;
  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(alarmhashtags, contactInfo, createdby) {
    // this.alarmhashtags = localStorage.setItem("alarmhashtags", alarmhashtags);

    this.userInfo.push({
      alarmhashtags: alarmhashtags,
      contactInfo: contactInfo,
      unitname: this.unitname,
      createdby: this.createdby,
      projectname: this.projectname,
      controllerid: this.controllerid,
      neaplateno: this.neaplateno,
      models_id: this.models_id,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude
    });
    this.nav.push(AddunitsfourPage, {
      accountInfo: this.userInfo
    });

  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(alarmhashtags, contactInfo, createdby) {
    if (localStorage.getItem("atMentionResult") != '') {
      alarmhashtags = localStorage.getItem("atMentionResult");
    }
    this.userInfo.push({
      alarmhashtags: alarmhashtags,
      contactInfo: contactInfo,
      unitname: this.unitname,
      createdby: this.createdby,
      projectname: this.projectname,
      controllerid: this.controllerid,
      neaplateno: this.neaplateno,
      models_id: this.models_id,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude

    });
    this.nav.push(AddunitsfourPage, {
      accountInfo: this.userInfo,
      record: this.NP.get("record")
    });
  }



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {
    let alarmhashtags: string = this.form.controls["alarmhashtags"].value,
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
          this.conf.sendNotification(`Congratulations the company group: ${alarmhashtags} was successfully deleted`);
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
      let alarmhashtags: string = this.form.controls["alarmhashtags"].value,
        primary: string = this.form.controls["primary"].value;
      let contact = primary + " " + this.form.controls["contact_number_1"].value;
      console.log(contact);
      contact = contact.replace("+", "%2B");
      this.contactInfo.push({
        contact_name: this.form.controls["contact_name_1"].value,
        contact_number: contact
      });

      if (this.cont2 = true) {
        if (this.form.controls["contact_name_2"].value != undefined) {
          let contact;
          contact = this.form.controls["primary_2"].value + " " + this.form.controls["contact_number_2"].value;
          console.log(contact);
          contact = contact.replace("+", "%2B");


          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_2"].value,
            contact_number: contact
          });
        }
      }
      if (this.cont3 = true) {
        if (this.form.controls["contact_name_3"].value != undefined) {
          let contact;
          contact = this.form.controls["primary_3"].value + " " + this.form.controls["contact_number_3"].value;
          console.log(contact);
          contact = contact.replace("+", "%2B");

          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_3"].value,
            contact_number: contact
          });
        }
      }
      if (this.cont4 = true) {
        if (this.form.controls["contact_name_4"].value != undefined) {
          let contact;
          contact = this.form.controls["primary_4"].value + " " + this.form.controls["contact_number_4"].value;
          console.log(contact);
          contact = contact.replace("+", "%2B");

          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_4"].value,
            contact_number: contact
          });
        }
      }
      if (this.cont5 = true) {
        if (this.form.controls["contact_name_5"].value != undefined) {
          let contact;
          contact = this.form.controls["primary_5"].value + " " + this.form.controls["contact_number_5"].value;
          console.log(contact);
          contact = contact.replace("+", "%2B");
          this.contactInfo.push({
            contact_name: this.form.controls["contact_name_5"].value,
            contact_number: contact
          });
        }
      }



      /*if (this.addedImgLists) {
        this.isUploadedProcessing = true;
      }*/
      if (this.isUploadedProcessing == false) {
        if (this.isEdited) {
          this.updateEntry(alarmhashtags, this.contactInfo, this.userId);
        }
        else {
          this.createEntry(alarmhashtags, this.contactInfo, this.userId);
        }
      }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.alarmhashtags = "";
  }


  getJsonCountryListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getCountries";
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCountry = res.countries;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }




  previous() {
    this.nav.push(AddunitstwoPage, {
      accountInfo: this.userInfo,
      record: this.NP.get("record")
    });
  }

  address1get(hashtag) {
    console.log(hashtag);
    this.gethashtag = hashtag;
  }

  addmore() {
    let len = this.contactnameArray.length;
    let incr;
    console.log("1" + len);
    if (len == 0) {
      len = 1;
    } else {
      console.log("2" + len);
      len = len + 1;
      //len = parseInt(incr) + parseInt(len);
    }
    if (len > 4) {
      console.log("3" + len);
      console.log('Contact details only five item')
    } else {
      console.log("4" + len);
      console.log("5" + len);
      incr = len + 1;
      console.log("6incr" + incr);
      this.contactnameArray.push({
        name: 'contact_name_' + incr,
        placeholder: "Name"
      });

      this.contactnumberArray.push({
        name: 'contact_number_' + incr,
        placeholder: "Number"
      });
    }
    console.log("7" + len);

    if (len == 1) {
      this.cont2 = true;
    }
    if (len == 2) {
      this.cont3 = true;
    }
    if (len == 3) {
      this.cont4 = true;
    }
    if (len == 4) {
      this.cont5 = true;
    }



  }
  remove(val) {
    if (val == '2') {
      this.contact_name_2 = '';
      this.contact_number_2 = '';
      this.cont2 = false;
    }
    if (val == '3') {
      this.contact_name_3 = '';
      this.contact_number_3 = '';
      this.cont3 = false;
    }
    if (val == '4') {
      this.cont4 = false;
      this.contact_name_4 = '';
      this.contact_number_4 = '';
    }
    if (val == '5') {
      this.cont5 = false;
      this.contact_name_5 = '';
      this.contact_number_5 = '';
    }
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

