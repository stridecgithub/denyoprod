import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { PasswordValidator } from '../../validators/password';
import { UserorgchartPage } from '../userorgchart/userorgchart';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AdduserPage } from '../adduser/adduser';
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
 * Generated class for the UseraccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-useraccount',
  templateUrl: 'useraccount.html',
  providers: [Config]
})
export class UseraccountPage {
  public userInfo = [];
  public first_name: any;
  public msgcount: any;
  public notcount: any;
  public last_name: any;
  public email: any;
  public userId: any;
  public country: any;
  public contact: any;
  public createdby: any;
  public photo: any;
  public username: any;
  public password: any;
  public re_password: any;
  public hashtag: any;
  public role: any;
  public roleId: any;
  public form: FormGroup;
  public hideActionButton = true;
  public pageTitle: string;
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public recordID: any = null;
  public responseResultRole;
  public responseResultRoleDropDown = [];
  public loginas: any;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;

  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, public navCtrl: NavController, public NP: NavParams, public fb: FormBuilder) {
    this.loginas = localStorage.getItem("userInfoName");
    this.roleId = localStorage.getItem("userInfoRoleId");
    this.userId = localStorage.getItem("userInfoId");
    this.form = fb.group({
      // "username": ["", Validators.required],
      "username": ["", Validators.compose([Validators.maxLength(30), Validators.required])],
      "password": ["", Validators.required],
      "re_password": ["", Validators.required],
      "hashtag": [""],
      "role": ["", Validators.required],

      /// "email": ["", Validators.required]

      //'validator': this.isMatching
    }, { validator: this.matchingPasswords('password', 're_password') });

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

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getroles";

    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultRole = res.roles;
        console.log(JSON.stringify(this.responseResultRole));
        if (this.responseResultRole.length > 0) {
          for (let role in this.responseResultRole) {

            if (this.roleId == '1') {
              this.responseResultRoleDropDown.push({
                role_id: this.responseResultRole[role].role_id,
                role_name: this.responseResultRole[role].role_name
              });
            } else {
              if (this.responseResultRole[role].role_id != '1') {
                this.responseResultRoleDropDown.push({
                  role_id: this.responseResultRole[role].role_id,
                  role_name: this.responseResultRole[role].role_name
                });
              }

            }

          }
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UseraccountPage');    
     localStorage.setItem("fromModule", "UseraccountPage");
    this.pageLoad();
  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.username = item.username;
    this.password = item.password;
    this.re_password = item.password;
    this.hashtag = item.hashtag;
    this.role = item.role;
    this.recordID = item.userid;
  }
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
    // this.getRoleListData();
    if (this.NP.get("record")) {
      console.log("User Account:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit User-Account';
      this.readOnly = false;
      this.hideActionButton = true;
      let editItem = this.NP.get("record");
      this.username = editItem.username;
      this.password = editItem.password;
      this.re_password = editItem.password;
      this.hashtag = editItem.personalhashtag;
      this.role = editItem.role_id;
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'New User-Account';
    }
    //[{"info":[{"photo":{"fileName":"1496384705815.jpg","baseURL":"denyoappv2.stridecdev.com","ext":"jpg","target_dir":"uploads/users/"}},{"first_name":"Kennan. N","last_name":"Nagarathina. K","email":"kannann@gmail.com","country":"Australia","contact":"9443976954","createdby":"6"}]}]
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
          this.first_name = info[key].first_name;
          this.last_name = info[key].last_name;
          this.email = info[key].email;
          this.country = info[key].country;
          this.contact = info[key].contact;
          this.photo = info[key].photo;
          this.createdby = info[key].createdby;
          console.log("First Name for User Account:" + this.first_name);
          //console.log(JSON.stringify(this));
        } else {
          console.log('Key' + key);
          this.first_name = info[0].first_name;
          this.last_name = info[0].last_name;
          this.email = info[0].email;
          this.country = info[0].country;
          this.contact = info[0].contact;
          this.photo = info[0].photo;
          this.createdby = info[0].createdby;
          console.log("First Name for User Account:" + this.first_name);
        }

        /* this.userInfo.push({
           info
         });
         console.log("User Information:" + JSON.stringify(this.userInfo));
         */
      }
    }
    if (this.NP.get("uservalue")) {
      let info = this.NP.get("uservalue");
      let keyindex = info.length - 1;
      this.first_name = info[keyindex]['first_name'];
      this.last_name = info[keyindex]['last_name'];
      this.email = info[keyindex]['email'];
      this.country = info[keyindex]['country'];
      this.contact = info[keyindex]['contact'];
      this.photo = info[keyindex]['photo'];
      this.username = info[keyindex]['username'];
      this.password = info[keyindex]['password'];
      this.hashtag = info[keyindex]['hashtag'];
      this.re_password = info[keyindex]['password'];
      this.role = info[keyindex]['role'];
    }
  }

  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      let username: string = this.form.controls["username"].value,
        password: string = this.form.controls["password"].value,
        hashtag: string = this.form.controls["hashtag"].value,
        role: string = this.form.controls["role"].value;

      console.log(this.form.controls);

      if (this.isEdited) {
        this.updateEntry(username, password, hashtag, role);
      }
      else {
        this.createEntry(username, password, hashtag, role);
      }
    }

  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data

  createEntry(username, password, hashtag, role) {
    this.userInfo.push({
      photo: this.photo,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      country: this.country,
      contact: this.contact,
      createdby: this.createdby,
      username: username,
      password: password,
      hashtag: hashtag,
      role: role
    });


    let body: string = "username=" + username + "&id=0",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checkusername";

    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("create" + data.json().msg[0].Error);
          if (data.json().msg[0].Error > 0) {
            //this.userInfo=[];
            this.conf.sendNotification(data.json().msg[0].result);
          } else {
            //this.conf.sendNotification(data.json().message);
            this.navCtrl.push(UserorgchartPage, {
              accountInfo: this.userInfo
            });
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
  updateEntry(username, password, hashtag, role) {
    this.userInfo.push({
      photo: this.photo,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      country: this.country,
      contact: this.contact,
      createdby: this.createdby,
      username: username,
      password: password,
      hashtag: hashtag,
      role: role
    });

    let body: string = "username=" + username + "&id=" + this.NP.get("record").staff_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checkusername";
    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("update" + data.json().msg[0].Error);
          if (data.json().msg[0].Error > 0) {
            //this.userInfo=[];
            this.conf.sendNotification(data.json().msg[0].result);
          } else {
            //this.conf.sendNotification(data.json().message);
            this.navCtrl.push(UserorgchartPage, {
              accountInfo: this.userInfo,
              record: this.NP.get("record")
            });
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


  previous() {
    this.userInfo.push({
      photo: this.photo,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      country: this.country,
      contact: this.contact,
      createdby: this.createdby,

    });
    this.navCtrl.push(AdduserPage, {
      uservalue: this.userInfo
    });
  }

  addhashtag(val) {
    this.hashtag = "@" + val;
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
