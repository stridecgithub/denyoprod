import {  Output, EventEmitter, ElementRef, Input, Component } from '@angular/core';
import { NavController, Platform, MenuController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DashboardPage } from '../dashboard/dashboard';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { DatePicker } from '@ionic-native/date-picker';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
import { Keyboard } from '@ionic-native/keyboard';
/*@Directive({
  selector: '[br-data-dependency]' // Attribute selector
})*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Device, DatePicker, Config, Keyboard]
})
export class HomePage {

  @Output() input: EventEmitter<string> = new EventEmitter<string>();
  @Input('br-data-dependency') nextIonInputId: any = null;

  mapElement: HTMLElement;
  public form: FormGroup;
  public userId: any;
  public passWrd: any;
  networkType: any;
  public userInf: any;
  header_data: any;
  private apiServiceURL: string = '';
  alert: any;
  constructor(public Keyboard: Keyboard, public alertCtrl: AlertController,
    public elementRef: ElementRef, private conf: Config, public platform: Platform, private network: Network, public menuCtrl: MenuController, public navCtrl: NavController, private datePicker: DatePicker, public fb: FormBuilder, public device: Device, private http: Http) {
    this.form = fb.group({
      //"userid": ["", Validators.required],
      //"password": ["", Validators.required]
      "userid": ["", Validators.compose([Validators.maxLength(50), Validators.required])],
      "password": ["", Validators.compose([Validators.maxLength(50), Validators.required])]
    });
    this.apiServiceURL = conf.apiBaseURL();
    this.networkType = '';
    this.menuCtrl.swipeEnable(false);
    this.header_data = { ismenu: true, ishome: false, title: "Home" };
    this.userInf = localStorage.getItem("userInfoId");
    console.log("UserId Localtorage" + this.userInf);
    console.log("A");
    if (this.userInf == 'null') {
      this.userInf = 0;
      console.log("B");
    }
    if (this.userInf == null) {
      this.userInf = 0;
      console.log("C");
    }
    if (this.userInf == '') {
      this.userInf = 0;
      console.log("D");
    }
    console.log(this.userInf);
    if (this.userInf > 0) {
      this.navCtrl.setRoot(DashboardPage);
    }

    this.platform.ready().then(() => {

      this.platform.registerBackButtonAction(() => {
        let userId = localStorage.getItem("userInfoId");
        if (userId == '') {
          console.log("User id logged out");
          this.navCtrl.setRoot(HomePage);
        }
        console.log('3:registerBackButtonAction');
        if (this.navCtrl.canGoBack()) {
          console.log('4:canGoBack if');
          this.navCtrl.pop();
        } else {
          console.log('5:canGoBack else');
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlertExist();
          }
        }
      });
      this.network.onConnect().subscribe(data => {
        console.log("home.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("home.ts Platform ready-onDisconnect:" + data.type);
        localStorage.setItem("isNet", 'offline');
        this.networkType = this.conf.networkErrMsg();
      }, error => console.error(error));
    });
  }





  login() {
    let userid: string = this.form.controls["userid"].value,
      password: string = this.form.controls["password"].value;
    let isEmpty = 1;
    if (this.form.controls["userid"].value == '') {
      isEmpty = 0;
    }
    if (this.form.controls["password"].value == '') {
      isEmpty = 0;
    }
    let isNet = localStorage.getItem("isNet");
    console.log("Is Status for Network Home Page:" + isNet);
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      this.networkType = '';
      if (isEmpty > 0) {
        this.loginEntry(userid, password);
      }
    }
    //}
  }
  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menuCtrl.enable(false);
  }
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      minDate: "2017-08-15",
      maxDate: "2017-08-19",
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  loginEntry(username, password) {
    console.log("H");
    let device_token = localStorage.getItem("deviceTokenForPushNotification");
    let res;
    let body: string = "username=" + username +
      "&password=" + password +
      "&device_token=" + device_token +
      "&isapp=1",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/checklogin";
    console.log(url + '?' + body);
    this.http.post(url, body, options)
      .subscribe(data => {
        res = data.json();
        if (res.msg[0]['Error'] > 0) {
          this.conf.sendNotification(res.msg[0]['result']);
          return false;
        } else {
          res = data.json();
          console.log("Logged in Response:" + JSON.stringify(res));
          localStorage.setItem("userInfo", res['staffdetails'][0]);
          localStorage.setItem("userInfoId", res['staffdetails'][0].staff_id);
          localStorage.setItem("userInfoName", res['staffdetails'][0].firstname);
          localStorage.setItem("userInfoEmail", res['staffdetails'][0].email);
          localStorage.setItem("userInfoCompanyId", res['staffdetails'][0].company_id);
          localStorage.setItem("userInfoRoleId", res['staffdetails'][0].role_id);
          console.log("Role Permssion Array:" + JSON.stringify(res['roledata']));
          localStorage.setItem("RolePermissionData", JSON.stringify(res['roledata']));
          let roleData = localStorage.getItem("RolePermissionData");
          let roleparseData = JSON.parse(roleData);
          for (let rle = 0; rle < roleparseData.length; rle++) {
            // 8 - Child Module Map

            if (res['staffdetails'][0].staff_id == '1') {
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '8' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_MAP_VIEW", '1');
                localStorage.setItem("DASHBOARD_MAP_CREATE", '1');
                localStorage.setItem("DASHBOARD_MAP_EDIT", '1');
                localStorage.setItem("DASHBOARD_MAP_DELETE", '1');
                localStorage.setItem("DASHBOARD_MAP_HIDE", '1');
              }

              // 12 - Child Module Unit
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '12' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_UNITS_VIEW", '1');
                localStorage.setItem("DASHBOARD_UNITS_CREATE", '1');
                localStorage.setItem("DASHBOARD_UNITS_EDIT", '1');
                localStorage.setItem("DASHBOARD_UNITS_DELETE", '1');
                localStorage.setItem("DASHBOARD_UNITS_HIDE", '1');
              }

              // 1 - Child Module My Account
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '1' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_MYACCOUNT_VIEW", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_CREATE", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_EDIT", '1');
                localStorage.setItem("SETTINGS_MYACCOUNT_DELETE", '1');
              }


              // 2 - Child Module User List
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '2' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERLIST_VIEW", '1');
                localStorage.setItem("SETTINGS_USERLIST_CREATE", '1');
                localStorage.setItem("SETTINGS_USERLIST_EDIT", '1');
                localStorage.setItem("SETTINGS_USERLIST_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '3' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_COMPANYGROUP_VIEW", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_CREATE", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_EDIT", '1');
                localStorage.setItem("SETTINGS_COMPANYGROUP_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '4' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERROLE_VIEW", '1');
                localStorage.setItem("SETTINGS_USERROLE_CREATE", '1');
                localStorage.setItem("SETTINGS_USERROLE_EDIT", '1');
                localStorage.setItem("SETTINGS_USERROLE_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '5' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_VIEW", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_CREATE", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_EDIT", '1');
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '6' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_ORGCHART_VIEW", '1');
                localStorage.setItem("SETTINGS_ORGCHART_CREATE", '1');
                localStorage.setItem("SETTINGS_ORGCHART_EDIT", '1');
                localStorage.setItem("SETTINGS_ORGCHART_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '7' && roleparseData[rle]['module_name'] == '2') {
                localStorage.setItem("CALENDAR_EVENTS_VIEW", '1');
                localStorage.setItem("CALENDAR_EVENTS_CREATE", '1');
                localStorage.setItem("CALENDAR_EVENTS_EDIT", '1');
                localStorage.setItem("CALENDAR_EVENTS_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '9' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_LISTING_VIEW", '1');
                localStorage.setItem("UNITS_LISTING_CREATE", '1');
                localStorage.setItem("UNITS_LISTING_EDIT", '1');
                localStorage.setItem("UNITS_LISTING_DELETE", '1');  // Implementation Done by Kannan.N
              }
              if (roleparseData[rle]['page_name'] == '13' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_ALARM_VIEW", '1');
                localStorage.setItem("UNITS_ALARM_CREATE", '1');
                localStorage.setItem("UNITS_ALARM_EDIT", '1');
                localStorage.setItem("UNITS_ALARM_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '14' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_SERVICINGINFO_VIEW", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_CREATE", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_EDIT", '1');
                localStorage.setItem("UNITS_SERVICINGINFO_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '15' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_COMMENTS_VIEW", '1');
                localStorage.setItem("UNITS_COMMENTS_CREATE", '1');
                localStorage.setItem("UNITS_COMMENTS_EDIT", '1');
                localStorage.setItem("UNITS_COMMENTS_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '16' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_UNITGROUP_VIEW", '1');
                localStorage.setItem("UNITS_UNITGROUP_CREATE", '1');
                localStorage.setItem("UNITS_UNITGROUP_EDIT", '1');
                localStorage.setItem("UNITS_UNITGROUP_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '10' && roleparseData[rle]['module_name'] == '4') {
                localStorage.setItem("REPORTS_VIEW", '1');
                localStorage.setItem("REPORTS_CREATE", '1');
              }
              if (roleparseData[rle]['page_name'] == '11' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_INBOX_VIEW", '1');
                localStorage.setItem("MESSAGE_INBOX_CREATE", '1');
                localStorage.setItem("MESSAGE_INBOX_EDIT", '1');
                localStorage.setItem("MESSAGE_INBOX_DELETE", '1');
              }
              if (roleparseData[rle]['page_name'] == '17' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_SENT_VIEW", '1');
                localStorage.setItem("MESSAGE_SENT_CREATE", '1');
                localStorage.setItem("MESSAGE_SENT_EDIT", '1');
                localStorage.setItem("MESSAGE_SENT_DELETE", '1');

              }
            } else {


              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '8' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_MAP_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("DASHBOARD_MAP_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("DASHBOARD_MAP_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("DASHBOARD_MAP_DELETE", roleparseData[rle]['delete_action']);
                localStorage.setItem("DASHBOARD_MAP_HIDE", roleparseData[rle]['hide_action']);
              }

              // 12 - Child Module Unit
              // 1 - Parent Module Dashboard
              if (roleparseData[rle]['page_name'] == '12' && roleparseData[rle]['module_name'] == '1') {
                localStorage.setItem("DASHBOARD_UNITS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("DASHBOARD_UNITS_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("DASHBOARD_UNITS_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("DASHBOARD_UNITS_DELETE", roleparseData[rle]['delete_action']);
                localStorage.setItem("DASHBOARD_UNITS_HIDE", roleparseData[rle]['hide_action']);
              }

              // 1 - Child Module My Account
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '1' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_MYACCOUNT_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_MYACCOUNT_DELETE", roleparseData[rle]['delete_action']);
              }


              // 2 - Child Module User List
              // 6 - Parent Module Settings
              if (roleparseData[rle]['page_name'] == '2' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERLIST_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_USERLIST_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_USERLIST_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_USERLIST_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '3' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_COMPANYGROUP_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_COMPANYGROUP_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '4' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_USERROLE_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_USERROLE_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_USERROLE_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_USERROLE_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '5' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_REPORTTEMPLATE_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '6' && roleparseData[rle]['module_name'] == '6') {
                localStorage.setItem("SETTINGS_ORGCHART_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("SETTINGS_ORGCHART_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("SETTINGS_ORGCHART_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("SETTINGS_ORGCHART_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '7' && roleparseData[rle]['module_name'] == '2') {
                localStorage.setItem("CALENDAR_EVENTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("CALENDAR_EVENTS_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("CALENDAR_EVENTS_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("CALENDAR_EVENTS_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '9' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_LISTING_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_LISTING_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_LISTING_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_LISTING_DELETE", roleparseData[rle]['delete_action']);  // Implementation Done by Kannan.N
              }
              if (roleparseData[rle]['page_name'] == '13' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_ALARM_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_ALARM_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_ALARM_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_ALARM_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '14' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_SERVICINGINFO_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_SERVICINGINFO_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '15' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_COMMENTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_COMMENTS_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_COMMENTS_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_COMMENTS_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '16' && roleparseData[rle]['module_name'] == '3') {
                localStorage.setItem("UNITS_UNITGROUP_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("UNITS_UNITGROUP_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("UNITS_UNITGROUP_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("UNITS_UNITGROUP_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '10' && roleparseData[rle]['module_name'] == '4') {
                localStorage.setItem("REPORTS_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("REPORTS_CREATE", roleparseData[rle]['create_action']);
              }
              if (roleparseData[rle]['page_name'] == '11' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_INBOX_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("MESSAGE_INBOX_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("MESSAGE_INBOX_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("MESSAGE_INBOX_DELETE", roleparseData[rle]['delete_action']);
              }
              if (roleparseData[rle]['page_name'] == '17' && roleparseData[rle]['module_name'] == '5') {
                localStorage.setItem("MESSAGE_SENT_VIEW", roleparseData[rle]['view_action']);
                localStorage.setItem("MESSAGE_SENT_CREATE", roleparseData[rle]['create_action']);
                localStorage.setItem("MESSAGE_SENT_EDIT", roleparseData[rle]['edit_action']);
                localStorage.setItem("MESSAGE_SENT_DELETE", roleparseData[rle]['delete_action']);

              }
            }
          }
          this.navCtrl.setRoot(DashboardPage);
        }

      },
      error => {
        this.networkType = this.conf.serverErrMsg();//+"\n"+error;
      });
    console.log("I");
  }

  doMove() {
    this.navCtrl.push(ForgotpasswordPage);
  }
  /*
    @HostListener('keydown', ['$event'])
    keyEvent(event) {
      console.log(JSON.stringify(event));
      console.log(event.srcElement.tagName)
      if (event.srcElement.tagName !== "INPUT") {
        return;
      }
  
      var code = event.keyCode || event.which;
      if (code === TAB_KEY_CODE) {
        event.preventDefault();
        this.onNext();
        let previousIonElementValue = this.elementRef.nativeElement.children[0].value;
        this.input.emit(previousIonElementValue)
      } else if (code === ENTER_KEY_CODE) {
        event.preventDefault();
        this.onEnter();
        let previousIonElementValue = this.elementRef.nativeElement.children[0].value;
        this.input.emit(previousIonElementValue)
      }
    }
  
    onEnter() {
      console.log("onEnter()-kannan");
      this.Keyboard.close();
      console.log('1');
      if (!this.nextIonInputId) {
        console.log("2" + this.nextIonInputId);
        return;
      }
      console.log('3');
      let nextInputElement = document.getElementById(this.nextIonInputId);
      console.log('4' + nextInputElement);
      // On enter, go to next input field
      if (nextInputElement && nextInputElement.children[0]) {
        console.log('5' + nextInputElement);
        let element: any = nextInputElement.children[0];
        console.log('6' + element);
        if (element.tagName === "INPUT") {
          console.log('7' + element.tagName);
          element.focus();
          console.log('8' + element.tagName);
        }
      }
    }
  
    onNext() {
      console.log("onNext()");
      this.Keyboard.close();
      if (!this.nextIonInputId) {
        return;
      }
  
      let nextInputElement = document.getElementById(this.nextIonInputId);
  
      // On enter, go to next input field
      if (nextInputElement && nextInputElement.children[0]) {
        let element: any = nextInputElement.children[0];
        if (element.tagName === "INPUT") {
          element.focus();
        }
      }
    }
    */
  showAlertExist() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
}
//const TAB_KEY_CODE = 9;
//const ENTER_KEY_CODE = 13;

