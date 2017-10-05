import { Component } from '@angular/core';
import { NavController, MenuController, Platform, AlertController} from 'ionic-angular';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { CalendardetailPage } from '../calendardetail/calendardetail';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  providers: [Config]
})
export class DashboardPage {
  public loginas: any;
  public userInf: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  alert: any;
  public networkType: string = '';
  private apiServiceURL: string = "";
  constructor(private conf: Config, public alertCtrl: AlertController, public platform: Platform, public http: Http, public menuCtrl: MenuController, private network: Network, public navCtrl: NavController, public nav: NavController) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.menuCtrl.swipeEnable(true);
    this.apiServiceURL = conf.apiBaseURL();
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
      let userId = localStorage.getItem("userInfoId");
      if (userId == '') {
        console.log("User id logged out action from dashboard.ts");
        this.navCtrl.setRoot(HomePage);
      }
      this.network.onConnect().subscribe(data => {
        console.log("dashboard.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("dashboard.ts Platform ready-onDisconnect:" + data.type);
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

  goPage(page) {
    console.log(page);
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
      return false;
    } else {
      this.networkType = '';
      if (page == 'MapsPage') {
        this.nav.setRoot(MapsPage);
      } else if (page == 'ReportsPage') {
        this.nav.push(ReportsPage);
      } else if (page == 'CalendarPage') {
        this.nav.push(CalendarPage);
      } else if (page == 'UnitsPage') {
        this.nav.push(UnitsPage);
      }
    }

  }


  pushMessagePage() {
    this.nav.push(CalendardetailPage, {
      event_id: 4,
      act: 'Push'
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
    //this.nav.push(DashboardmapPage);
  }
  redirectToSettings() {
    this.nav.push(OrgchartPage);
  }
  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menuCtrl.enable(true);
  }
  ionViewWillEnter() {


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
    if (this.userInf == 0) {
      console.log("E");
      this.navCtrl.setRoot(HomePage);
    }

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
  }
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
