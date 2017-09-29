import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';

//import { UnitdetailsPage } from '../pages/unitdetails/unitdetails';
import { Unitgrouplist } from '../pages/unitgrouplist/unitgrouplist';
import { CompanygroupPage } from '../pages/companygroup/companygroup';
import { CompanydetailPage } from '../pages/companydetail/companydetail';
import { UserPage } from '../pages/user/user';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { UnitgroupPage } from '../pages/unitgroup/unitgroup';
import { RolePage } from '../pages/role/role';
import { ReporttemplatePage } from '../pages/reporttemplate/reporttemplate';
import { CalendardetailPage } from '../pages/calendardetail/calendardetail';
import { UnitsPage } from '../pages/units/units';
import { OrgchartPage } from '../pages/orgchart/orgchart';
//import { AlarmPage } from '../pages/alarm/alarm';
import { AlarmlogPage } from '../pages/alarmlog/alarmlog';
import { AddalarmPage } from '../pages/addalarm/addalarm';
//import { MessagesPage } from '../pages/messages/messages';
import { CalendarPage } from '../pages/calendar/calendar';
import { MapsPage } from '../pages/maps/maps';
import { ReportsPage } from '../pages/reports/reports';
import { AddenginedetailPage } from '../pages/addenginedetail/addenginedetail';
import { ServicedetailsPage } from '../pages/servicedetails/servicedetails';
import { AlarmdetailsPage } from '../pages/alarmdetails/alarmdetails';
import { CommentdetailsPage } from '../pages/commentdetails/commentdetails';
import { EnginedetailPage } from '../pages/enginedetail/enginedetail';
import { EmailPage } from '../pages/email/email';
import { EngineviewPage } from '../pages/engineview/engineview';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { CountryflagPage } from '../pages/countryflag/countryflag';
@Component({
  templateUrl: 'app.html',
  providers: [Push, LocalNotifications]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navCtrl: NavController;
  rootPage: any = DashboardPage;
  pages: any;
  alert: any;
  showLevel1 = null;
  showLevel2 = null;
  ///private push: Push,
  constructor(private localNotifications: LocalNotifications, public alertCtrl: AlertController, private push: Push, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public dataService: DataServiceProvider, public menuCtrl: MenuController) {

    this.initializeApp();
    this.dataService.getMenus()
      .subscribe((response) => {

        this.pages = response;
      });
    this.pages = [

      { title: 'Dashboard', component: HomePage },
      { title: 'Company Group', component: CompanygroupPage },
      { title: 'Users', component: UserPage },
      { title: 'Unit Group', component: UnitgroupPage },
      { title: 'Units', component: UnitsPage },
      { title: 'Role', component: RolePage },
      { title: 'My Account', component: MyaccountPage },
      { title: 'Report Template', component: ReporttemplatePage },
      { title: 'Org Chart', component: OrgchartPage },

      { title: 'Maps', component: MapsPage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Reports', component: ReportsPage },
      // { title: 'Alarm List', component: AlarmPage },
      { title: 'Alarm', component: AddalarmPage },
      { title: 'Alarm Log', component: AlarmlogPage },
      { title: 'Service Details', component: ServicedetailsPage },
      { title: 'Comment Details', component: CommentdetailsPage },
      { title: 'Alarm Details', component: AlarmdetailsPage },
      { title: 'Engine Details', Component: EnginedetailPage },
      { title: 'Add Engine Details', Component: AddenginedetailPage },
      { title: 'Engine Details', Component: EngineviewPage },
      { title: 'ForgotPassword', Component: ForgotpasswordPage },
      { title: 'Company Group Detail', Component: CompanydetailPage },
      { title: 'Unit Group List', Component: Unitgrouplist },

      // { title: 'Map Demo', component: MapdemoPage },


    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('1:Platform ready');
      this.platform.registerBackButtonAction(() => {
        let userId = localStorage.getItem("userInfoId");
        if (userId == '') {
          console.log("User id logged out");
          this.navCtrl.setRoot(HomePage);
        }
        console.log('3:registerBackButtonAction');
        if (this.nav.canGoBack()) {
          console.log('4:canGoBack if');
          this.nav.pop();
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
      this.initPushNotification();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    });



  }

  // Manage notifying the user of the outcome
  // of remote operations

  openPage(page) {
    if (page.component == 'UnitsPage') {
      this.nav.push(UnitsPage);
    } else if (page.component == 'UnitgroupPage') {
      this.nav.push(UnitgroupPage);
    } else if (page.component == 'MyaccountPage') {
      this.nav.push(MyaccountPage);
    } else if (page.component == 'UserPage') {
      this.nav.push(UserPage);
    } else if (page.component == 'CompanygroupPage') {
      this.nav.push(CompanygroupPage);
    } else if (page.component == 'RolePage') {
      this.nav.push(RolePage);
    } else if (page.component == 'ReporttemplatePage') {
      this.nav.push(ReporttemplatePage);
    } else if (page.component == 'OrgchartPage') {
      this.nav.push(OrgchartPage);
    } else if (page.title == 'Message') {
      this.menuCtrl.close();
      this.nav.setRoot(EmailPage);
    } else if (page.title == 'Logout') {
      this.logout();
      this.menuCtrl.close();
      //this.nav.push(LogoutPage);
    } else if (page.title == 'Dashboard') {
      this.menuCtrl.close();
      this.nav.push(HomePage);
    } else if (page.title == 'Calendar') {
      this.menuCtrl.close();
      this.nav.push(CalendarPage);
    } else if (page.title == 'Maps') {
      this.menuCtrl.close();
      this.nav.setRoot(MapsPage);
    } else if (page.title == 'Reports') {
      this.menuCtrl.close();
      this.nav.push(ReportsPage);
    }
    else if (page.title == 'Alarm') {
      this.menuCtrl.close();
      //this.nav.push(AlarmPage);
    }
    else if (page.component == 'AddalarmPage') {
      this.nav.push(AddalarmPage);
    }
    else if (page.component == 'MapdemoPage') {
      //this.nav.push(MapdemoPage);
    }
    else if (page.component == 'EnginedetailPage') {
      this.nav.push(EnginedetailPage);
    }
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  logout() {
    localStorage.setItem("userInfo", "");
    localStorage.setItem("userInfoId", "");
    localStorage.setItem("userInfoName", "");
    localStorage.setItem("userInfoEmail", "");
    localStorage.setItem("userInfoCompanyId", "");
    localStorage.setItem("atMentionedStorage", "");
    localStorage.setItem("userPhotoFile", "");

    localStorage.setItem("DASHBOARD_MAP_VIEW", '');
    localStorage.setItem("DASHBOARD_MAP_CREATE", '');
    localStorage.setItem("DASHBOARD_MAP_EDIT", '');
    localStorage.setItem("DASHBOARD_MAP_DELETE", '');
    localStorage.setItem("DASHBOARD_MAP_HIDE", '');


    localStorage.setItem("DASHBOARD_UNITS_VIEW", '');
    localStorage.setItem("DASHBOARD_UNITS_CREATE", '');
    localStorage.setItem("DASHBOARD_UNITS_EDIT", '');
    localStorage.setItem("DASHBOARD_UNITS_DELETE", '');
    localStorage.setItem("DASHBOARD_UNITS_HIDE", '');


    this.nav.push(HomePage);
  }
  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '218019355699',
        forceShow: false,
        vibrate: true,
        sound: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };


    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a new notification', notification);
      //this.conf.sendNotification('Received a new notification' + JSON.stringify(notification));
      //this.showAlert(notification.title, notification.message);
      this.schedule(notification);
    }
    );

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration);
      console.log('Device Json registered', JSON.stringify(registration));
      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));




  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
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
  public schedule(notification) {
    this.localNotifications.schedule({
      title: notification.title,
      text: notification.message,
      at: new Date(new Date()),
      sound: null
    });

    localStorage.setItem("navtype", notification.additionalData.arrayval.type);
    localStorage.setItem("navtid", notification.additionalData.arrayval.id);

    this.localNotifications.on("click", (notification, state) => {
      console.log("Local notification clicked...");
      console.log("1" + notification);
      console.log("2" + state);
      console.log("3" + JSON.stringify(notification));
      console.log("4" + JSON.stringify(state));
      /*console.log("5" + notification.additionalData);
      console.log("6" + notification.additionalData.arrayval.id);
      console.log("7" + notification.additionalData.arrayval.type);
      */
      let navids = localStorage.getItem("navtid");
      let navtypes = localStorage.getItem("navtype");
      console.log(navids);
      console.log(navtypes);

      if (navtypes == 'M') {
        // this.nav.setRoot(EmailPage);

        this.nav.push(EmailPage, {
          record: navids,
          act: 'Push'
        });

      } else if (navtypes == 'OA') {
        this.nav.push(AlarmdetailsPage, {
          record: navids,
          act: 'Push'
        });
      } else if (navtypes == 'A') {
        //this.nav.push(AlarmdetailsPage);

        this.nav.push(AlarmdetailsPage, {
          record: navids,
          act: 'Push'
        });

      } else if (navtypes == 'C') {
        //this.nav.push(CommentdetailsPage);
        this.nav.push(CommentdetailsPage, {
          record: navids,
          act: 'Push'
        });
      } else if (navtypes == 'E') {
        this.nav.push(CalendardetailPage, {
          event_id: navids,
          act: 'Push'
        });
      } else if (navtypes == 'S') {
        // this.nav.push(ServicedetailsPage);
        this.nav.push(ServicedetailsPage, {
          record: navids,
          act: 'Push'
        });
      }
    });

  }



}

