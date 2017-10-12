import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { CompanygroupPage } from '../companygroup/companygroup';
import 'rxjs/add/operator/map';
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
import { DatePicker } from '@ionic-native/date-picker';
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
  selector: 'page-addcalendar',
  templateUrl: 'addcalendar.html',
  providers: [DatePicker, Config]
})
export class AddcalendarPage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public type_name: any;
  public event_project: any;
  public event_subject: any;
  public event_location: any;
  public gethashtag: any;
  public event_unitid: any;
  public companyId: any;
  public event_date: any;
  public event_time: any;
  public msgcount: any;
  public notcount: any;
  public month1: any;
  public date1: any;
  public event_title: any;
  public isSubmitted: boolean = false;
  public event_type: any;
  public event_notes: any;
  public service_remark: any;
  public userId: any;
  public responseResultType = [];
  public responseResultTime = [];
  public responseResultCompany: any;
  public unitfield: any;
  disunit: any;


  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network, private datePicker: DatePicker, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    // let curDateStr = new Date();
    // this.event_date = curDateStr.getMonth() + "/" + curDateStr.getDate() + "/" + curDateStr.getFullYear();
    //console.log("Top Current Date:"+this.event_date);
    // this.event_date ="07/17/2017";
    //this.event_date = "2017-07-17";
    //console.log("Current Date is:" + this.event_date);
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "event_location": ["", Validators.required],
      "event_subject": ["", Validators.required],
      "event_unitid": [""],
      //  "event_title": ["", Validators.required],
      "event_project": [""],
      "event_date": [""],
      "event_type": [""],
      "event_notes": ["", Validators.required],
      "event_time": [""]
    });
    this.disunit = false;
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");





    this.responseResultTime.push(

      { id: '6:00 AM', time_name: '6:00 AM' }
      , { id: '6:15 AM', time_name: '6:15 AM' }
      , { id: '6:30 AM', time_name: '6:30 AM' }
      , { id: '6:45 AM', time_name: '6:45 AM' }
      , { id: '7:00 AM', time_name: '7:00 AM' }
      , { id: '7:15 AM', time_name: '7:15 AM' }
      , { id: '7:30 AM', time_name: '7:30 AM' }
      , { id: '7:45 AM', time_name: '7:45 AM' }
      , { id: '8:00 AM', time_name: '8:00 AM' }
      , { id: '8:15 AM', time_name: '8:15 AM' }
      , { id: '8:30 AM', time_name: '8:30 AM' }
      , { id: '8:45 AM', time_name: '8:45 AM' }
      , { id: '9:00 AM', time_name: '9:00 AM' }
      , { id: '9:15 AM', time_name: '9:15 AM' }
      , { id: '9:30 AM', time_name: '9:30 AM' }
      , { id: '9:45 AM', time_name: '9:45 AM' }
      , { id: '10:00 AM', time_name: '10:00 AM' }
      , { id: '10:15 AM', time_name: '10:15 AM' }
      , { id: '10:30 AM', time_name: '10:30 AM' }
      , { id: '10:45 AM', time_name: '10:45 AM' }
      , { id: '11:00 AM', time_name: '11:00 AM' }
      , { id: '11:15 AM', time_name: '11:15 AM' }
      , { id: '11:30 AM', time_name: '11:30 AM' }
      , { id: '11:45 AM', time_name: '11:45 AM' }
      , { id: '12:00 PM', time_name: '12:00 PM' }
      , { id: '12:15 PM', time_name: '12:15 PM' }
      , { id: '12:30 PM', time_name: '12:30 PM' }
      , { id: '12:45 PM', time_name: '12:45 PM' }
      , { id: '1:00 PM', time_name: '1:00 PM' }
      , { id: '1:15 PM', time_name: '1:15 PM' }
      , { id: '1:30 PM', time_name: '1:30 PM' }
      , { id: '1:45 PM', time_name: '1:45 PM' }
      , { id: '2:00 PM', time_name: '2:00 PM' }
      , { id: '2:15 PM', time_name: '2:15 PM' }
      , { id: '2:30 PM', time_name: '2:30 PM' }
      , { id: '2:45 PM', time_name: '2:45 PM' }
      , { id: '3:00 PM', time_name: '3:00 PM' }
      , { id: '3:15 PM', time_name: '3:15 PM' }
      , { id: '3:30 PM', time_name: '3:30 PM' }
      , { id: '3:45 PM', time_name: '3:45 PM' }
      , { id: '4:00 PM', time_name: '4:00 PM' }
      , { id: '4:15 PM', time_name: '4:15 PM' }
      , { id: '4:30 PM', time_name: '4:30 PM' }
      , { id: '4:45 PM', time_name: '4:45 PM' }
      , { id: '5:00 PM', time_name: '5:00 PM' }
      , { id: '5:15 PM', time_name: '5:15 PM' }
      , { id: '5:30 PM', time_name: '5:30 PM' }
      , { id: '5:45 PM', time_name: '5:45 PM' }
      , { id: '6:00 PM', time_name: '6:00 PM' }
      , { id: '6:15 PM', time_name: '6:15 PM' }
      , { id: '6:30 PM', time_name: '6:30 PM' }
      , { id: '6:45 PM', time_name: '6:45 PM' }
      , { id: '7:00 PM', time_name: '7:00 PM' }
      , { id: '7:15 PM', time_name: '7:15 PM' }
      , { id: '7:30 PM', time_name: '7:30 PM' }
      , { id: '7:45 PM', time_name: '7:45 PM' }
      , { id: '8:00 PM', time_name: '8:00 PM' }
      , { id: '8:15 PM', time_name: '8:15 PM' }
      , { id: '8:30 PM', time_name: '8:30 PM' }
      , { id: '8:45 PM', time_name: '8:45 PM' }
      , { id: '9:00 PM', time_name: '9:00 PM' }
      , { id: '9:15 PM', time_name: '9:15 PM' }
      , { id: '9:30 PM', time_name: '9:30 PM' }
      , { id: '9:45 PM', time_name: '9:45 PM' }
      , { id: '10:00 PM', time_name: '10:00 PM' }
      , { id: '10:15 PM', time_name: '10:15 PM' }
      , { id: '10:30 PM', time_name: '10:30 PM' }
      , { id: '10:45 PM', time_name: '10:45 PM' }
      , { id: '11:00 PM', time_name: '11:00 PM' }
      , { id: '11:15 PM', time_name: '11:15 PM' }
      , { id: '11:30 PM', time_name: '11:30 PM' }
      , { id: '11:45 PM', time_name: '11:45 PM' }
    );
    let dateStr = new Date();




    this.month1 = dateStr.getUTCMonth() + 1;


    if (this.getlength(this.month1) == 1) {
      this.month1 = '0' + this.month1;
    } else {
      this.month1 = this.month1;
    }


    this.date1 = dateStr.getDate();


    if (this.getlength(this.date1) == 1) {
      this.date1 = '0' + this.date1;
    } else {
      this.date1 = this.date1;
    }



    // this.event_date = dateStr.getFullYear() + "-" + this.month1 + "-" + this.date1;
    this.event_date = localStorage.getItem("eventDate");
    console.log("Bottom UTC Format Current Date:" + this.event_date);

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
  getlength(number) {
    return number.toString().length;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad  AddcalendarPage');
    localStorage.setItem("fromModule", "AddcalendarPage");
  }


  address1get(hashtag) {
    console.log(hashtag);
    this.gethashtag = hashtag;
  }
  getType(type) {
    console.log("Event Type:" + type);
    if (type == "Service") {
      this.unitfield = true;
      this.disunit = true;
    } else {
      this.unitfield = false;
      this.disunit = false;
    }
  }
  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
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
    //this.event_date=localStorage.getItem("sdate");
    this.getUnitListData();
    this.resetFields();
    if (this.NP.get("item")) {
      console.log(this.NP.get("type"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("item"));
      this.pageTitle = 'Edit Calendar';
      this.readOnly = false;
      this.hideActionButton = true;
      if (this.NP.get("type").toLowerCase() == 'event') {
        this.responseResultType.push({
          id: '1',
          type_name: 'Event',
        }
        );
      }
      else {
        this.responseResultType.push({
          id: '1',
          type_name: 'Service',
        }
        );
      }
    }
    else {
      this.responseResultType.push({
        id: '1',
        type_name: 'Service',
      }, {
          id: '2',
          type_name: 'Event'
        });
      this.isEdited = false;
      this.pageTitle = 'Add Calendar';
    }
  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    console.log("Edit Select Entry Response" + JSON.stringify(item));
    this.event_subject = item.event_title;
    console.log("Event Date:" + item.event_date);
    console.log("Event Date Substr:" + item.event_date.substr(0, 10));
    /*console.log("Event Date Split:" + item.event_date.split("-"));
    console.log("Event Date Split:" + item.event_date.split("-"));*/
    //this.event_date = item.event_date;
    this.event_date = item.event_date.substr(0, 10);
    this.event_time = item.event_time;
    this.event_location = item.event_location
    this.event_notes = item.event_remark;
    if (item.event_type == 'S') {
      this.type_name = "Service";
      this.event_type = 'Service';
    }
    if (item.event_type == 'E') {
      this.type_name = "Event";
      this.event_type = 'Event';
    }

    ///this.event_subject = item.event_subject;
    this.event_unitid = item.event_unitid;
    this.recordID = item.event_id;
    this.getType(this.type_name);
    if (this.event_unitid > 0) {
      this.getProjectLocation(this.event_unitid)
    }
    this.address1get(this.event_notes);
  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, createdby) {
    //let updatedby = createdby;
    this.isSubmitted = true;
    service_remark = localStorage.getItem("atMentionResult");
    let field;
    if (type_name == 'Service') {
      field = "&event_title=" + event_subject;
    } else {
      field = "&event_title=" + event_subject;
    }
    let body: string = "is_mobile=1&event_type="
      + type_name + field + "&event_date=" + this.event_date + "&event_time=" + event_time + "&service_unitid=" + event_unitid + "&event_location=" + event_location + "&service_remark=" + service_remark + "&event_added_by=" + createdby + "&serviced_by=" + createdby,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/storeevent";
    console.log(url + "?" + body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
          } else {
            this.conf.sendNotification(res.msg[0].result);
            localStorage.setItem("atMentionResult", '');
            this.nav.push(CalendarPage);
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



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data

  
  updateEntry(type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, createdby) {
    this.isSubmitted = true;
    if (localStorage.getItem("atMentionResult") != '') {
      service_remark = localStorage.getItem("atMentionResult");
    }
    let field;
    if (type_name == 'Service') {
      field = "&event_title=" + event_subject;
    } else {
      field = "&event_title=" + event_subject;
    }
    let body: string = "is_mobile=1&event_type="
      + type_name + field + "&event_date=" + this.event_date + "&event_time=" + event_time + "&service_unitid=" + event_unitid + "&event_location=" + event_location + "&event_remark=" + service_remark + "&ses_login_id=" + createdby + "&id=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar/update";
    console.log(url + "?" + body);
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        console.log(data.json());
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
            localStorage.setItem("atMentionResult", '');
          } else {
            this.conf.sendNotification(res.msg[0].result);
            this.nav.push(CalendarPage);
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



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {

    
    let type_name: string = this.form.controls["type_name"].value,
      //body: string = "key=delete&recordID=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + this.recordID + "/1/delete";
    console.log(url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.conf.sendNotification(`Congratulations the company group: ${type_name} was successfully deleted`);
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
      let type_name: string = this.form.controls["event_type"].value,
        event_project: string = this.form.controls["event_project"].value,
        event_subject: string = this.form.controls["event_subject"].value,
        event_unitid: string = this.form.controls["event_unitid"].value,
        // event_title: string = this.form.controls["event_title"].value,
        event_time: string = this.form.controls["event_time"].value,
        event_location: string = this.form.controls["event_location"].value,
        service_remark: string = this.form.controls["event_notes"].value;

      if (this.isEdited) {
        this.updateEntry(type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, this.userId);
      }
      else {
        this.createEntry(type_name, event_project, event_subject, event_unitid, event_time, event_location, service_remark, this.userId);
      }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.type_name = "";
    this.event_project = "";
    this.event_subject = "";
    this.event_unitid = "";
  }

  getUnitListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        this.responseResultCompany = res.units;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  getProjectLocation(unitid) {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + unitid + "/1/getunitdata";
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("Project Name:" + res.unitdata[0].projectname);
        console.log("Project Location:" + res.unitdata[0].location);
        this.event_project = res.unitdata[0].projectname;
        this.event_location = res.unitdata[0].location;
        //this.responseResultCompany = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }





  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.event_date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        console.log('Got date: ', this.event_date);
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  previous() {
    this.nav.push(CalendarPage);
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

