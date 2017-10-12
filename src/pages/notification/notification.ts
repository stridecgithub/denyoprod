import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { UserPage } from '../user/user';

//import { MyaccountPage } from '../myaccount/myaccount';
import { AddserviceinfoPage } from '../addserviceinfo/addserviceinfo';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
import { UnitsPage } from '../units/units';
//import { UnitdetailsPage } from '../unitdetails/unitdetails';
//import { RolePage } from '../role/role';
import { CalendarPage } from '../calendar/calendar';
import { AlarmdetailsPage } from '../alarmdetails/alarmdetails';
import { ServicedetailsPage } from '../servicedetails/servicedetails';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { EmailPage } from '../email/email';
import { MapsPage } from '../maps/maps';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrequestsupportPage } from '../addrequestsupport/addrequestsupport';
//import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { DomSanitizer } from '@angular/platform-browser';
import { OrgchartPage } from '../orgchart/orgchart';
import { CalendardetailPage } from '../calendardetail/calendardetail';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers: [Config]
})
export class NotificationPage {
  public pageTitle: string;
  public atMentionedInfo = [];
  public reportData: any =
  {
    status: '',
    sort: 'companygroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public userId: any;
  public notificationAllLists = [];
  public loginas: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  constructor(private conf: Config, public platform: Platform, private network: Network, private sanitizer: DomSanitizer, public http: Http,
     public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public nav: NavController) {
    this.pageTitle = 'Notifications';
    this.loginas = localStorage.getItem("userInfoName");
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
    console.log('ionViewDidLoad NotificationPage');
    localStorage.setItem("fromModule", "NotificationPage");
  }
  notificationdetails(item, nottype) {
    console.log(nottype);
    console.log(JSON.stringify(item));


    let body: string = "is_mobile=1&loginid=" + this.userId +
      "&table_id=" + item.table_id,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/changestatusapibell_list";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));

        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Comment count successfully removed`);

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    /*
        if (nottype == 'Alarm') {
          this.nav.push(AlarmdetailsPage, {
            record: item
          });
        }
      
        if (nottype == 'Service') {
          this.nav.push(ServicedetailsPage, {
            record: item
          });
        }
        if (nottype == 'Comment') {
          this.nav.push(CommentdetailsPage, {
            record: item
          });
        }
    */



    if (nottype == 'M') {
      // this.nav.setRoot(EmailPage);

      this.nav.push(EmailPage, {
        record: item.table_id,
        act: 'Push'
      });

    } else if (nottype == 'OA') {
      this.nav.push(AlarmdetailsPage, {
        record: item.table_id,
        act: 'Push'
      });
    } else if (nottype == 'A') {
      //this.nav.push(AlarmdetailsPage);

      this.nav.push(AlarmdetailsPage, {
        record: item.table_id,
        act: 'Push'
      });

    } else if (nottype == 'C') {
      //this.nav.push(CommentdetailsPage);
      this.nav.push(CommentdetailsPage, {
        record: item.table_id,
        act: 'Push'
      });
    } else if (nottype == 'E') {
      this.nav.push(CalendardetailPage, {
        event_id: item.table_id,
        act: 'Push'
      });
    } else if (nottype == 'S') {
      // this.nav.push(ServicedetailsPage);
      this.nav.push(ServicedetailsPage, {
        record: item.table_id,
        act: 'Push'
      });
    }

  }
  ionViewWillEnter() {

    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
    }
    this.reportData.startindex = 0;
    this.reportData.sort = "service_id";
    this.doNotification();

    // Atmentioned Tag Storage
  }

  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.notificationAllLists = [];
    this.doNotification();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doNotification();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doNotification() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    // let editItem = this.NP.get("record");

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      // url: any = this.apiServiceURL + "/reporttemplate?is_mobile=1";
      url: any = this.apiServiceURL + "/getpushnotification_app?ses_login_id=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log("UCS" + JSON.stringify(res))
        if (res.notification != undefined) {
          if (res.notification.length > 0) {
            for (let notifications in res.notification) {
              // let isphoto = 0;
              // if (res.notification[notifications].id != 'null') {
              //   isphoto = 1;
              // }
              // if (res.notification[notifications].id != null) {
              //   isphoto = 1;
              // }
              // if (res.notification[notifications].id != '') {
              //   isphoto = 1;
              // }
              let usericon
              if (res.notification[notifications].usericon != '') {
                usericon = this.apiServiceURL + "/staffphotos/" + res.notification[notifications].usericon;
              } else {
                usericon = this.apiServiceURL + "/images/default.png";
              }
              this.notificationAllLists.push({
                table_id: res.notification[notifications].table_id,
                notify_to_readstatus: res.notification[notifications].notify_to_readstatus,
                photo: usericon,
                notify_type: res.notification[notifications].notify_type,
                content: res.notification[notifications].content,
                date_time: res.notification[notifications].date_time
              });
              console.log(JSON.stringify(this.notificationAllLists));
            }
            this.totalCount = res.totalCount;
            this.reportData.startindex += this.reportData.results;
          } else {
            //this.totalCount = 0;
          }
        }
        // console.log("Total Record:2" + this.totalCount);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  doAdd() {
    localStorage.setItem("microtime", "");
    this.nav.setRoot(AddserviceinfoPage, {
      record: this.NP.get("record"),
      act: 'Add'
    });
  }


  doRequest() {
    localStorage.setItem("microtime", "");
    this.nav.push(AddrequestsupportPage, {
      record: this.NP.get("record"),
      act: 'Add'
    });
  }



  doEdit(item, act) {
    localStorage.setItem("microtime", "");
    this.nav.setRoot(AddserviceinfoPage, {
      record: item,
      act: 'Edit'
    });
  }

  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this unit group?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.notificationAllLists.length; q++) {
            if (this.notificationAllLists[q] == item) {
              this.notificationAllLists.splice(q, 1);
            }
          }
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Services info was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  notification() {
    this.nav.push(NotificationPage);
  }


  previous() {
    this.nav.setRoot(DashboardPage);
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

