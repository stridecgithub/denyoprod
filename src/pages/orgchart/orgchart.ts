import { Component } from '@angular/core';
import { NavController, AlertController, NavParams , Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddorgchartonePage } from '../addorgchartone/addorgchartone';

import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { PopoverPage } from '../popover/popover';

import { EmailPage } from '../email/email';
import { PopoverController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the UnitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-orgchart',
  templateUrl: 'orgchart.html',
  providers: [Config]
})
export class OrgchartPage {
  public responseResultCompanyGroup: any;
  public pageTitle: string;
  public loginas: any;
  public htmlContent;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public msgcount: any;
  public notcount: any;
  public reportData: any =
  {
    status: '',
    sort: 'unitgroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public parents = [];
  public colorListArr: any;
  public userId: any;
  public companyId: any;
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  iframeContent: any;
  constructor(private conf: Config, public platform: Platform, private network: Network, public NP: NavParams, public popoverCtrl: PopoverController, public http: Http, public nav: NavController,
     public alertCtrl: AlertController, public navParams: NavParams) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.apiServiceURL = this.apiServiceURL;

    //Authorization Get Value




    this.VIEWACCESS = localStorage.getItem("SETTINGS_ORGCHART_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("SETTINGS_ORGCHART_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);


    //Authorization Get Value
     this.networkType = '';
     this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.networkType = '';
    this.platform.ready().then(() => {
       this.platform.registerBackButtonAction(() => {
          this.previous();
        });
      this.network.onConnect().subscribe(data => {
        console.log("orgchar.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("orgchar.ts Platform ready-onDisconnect:" + data.type);
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
  presentPopover(myEvent, item) {
    let popover = this.popoverCtrl.create(PopoverPage, { item: item });
    popover.present({
      ev: myEvent,
    });
    popover.onWillDismiss(data => {
      console.log(JSON.stringify(data));
      if (data != null) {
        if (data.length == 1) {
          this.doDelete(data);
        } else {
          this.doEdit(data, 'edit');
        }
      }
    });
  }
  doDelete(item) {
    console.log("Deleted Id" + item[0].staff_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item[0].staff_id);
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
      url: any = this.apiServiceURL + "/staff/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Orgchart was successfully deleted`);
          this.parents = [];
          this.doOrgChart();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OrgchartPage');
  }


  onSegmentChanged(val) {
    this.companyId = val;
    this.parents = [];
    this.doOrgChart();
  }

  ionViewWillEnter() {
    this.getCompanyGroupListData();


    let compId = this.NP.get("companyId")
    if (compId > 0) {
      this.pet = compId;
      this.companyId = compId;
    } else {
      this.pet = this.companyId;
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
    this.pageTitle = "Org Chart";
    this.reportData.startindex = 0;
    this.reportData.sort = "unitgroup_id";
    if (this.VIEWACCESS > 0) {
      this.doOrgChart();
    }

    console.log(this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1");
    }
  doOrgChart() {
    //this.conf.presentLoading(1);
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1&id=" + this.userId;
    console.log(url);
    // console.log(body);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        // this.conf.presentLoading(0);
        // console.log("Orgchart Response Success:" + JSON.stringify(data.json()));
        res = data.json();
        console.log("Parent" + JSON.stringify(res));
        if (res.parents.length > 0) {
          this.parents = res.parents;
          // this.responseResultCompany = res.companies;
          //console.log("1:"+JSON.stringify(this.responseResultCompany));
        } else {
          //this.totalCount = 0;
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg() ;//+ "\n" + error;
      });

  }

  getCompanyGroupListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/getcompanies?loginid=" + this.userId;
    let res;
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCompanyGroup = res.companies;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }


  doAdd() {
    this.nav.push(AddorgchartonePage);
  }
  previous() {
    this.nav.push(MyaccountPage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.nav.push(AddorgchartonePage, {
        record: item,
        act: act
      });
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
    //this.nav.push(OrgchartPage);
  }
}


