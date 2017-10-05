import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { HomePage } from '../home/home';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { DomSanitizer } from '@angular/platform-browser';
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
 * Generated class for the EnginedetailviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-enginedetailview',
  templateUrl: 'enginedetailview.html',
  providers: [Config]
})
export class EnginedetailviewPage {
  public pageTitle: string;
  public loginas: any;
  public unitid: any;
  public htmlContent;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public reportData: any =
  {
    status: '',
    sort: 'unitgroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public unitDetailData: any = {
    userId: '',   
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId: any;
  iframeContent: any;
  public msgcount: any;
  public notcount: any;
  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, public nav: NavController, private sanitizer: DomSanitizer,
     public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.unitid = localStorage.getItem("unitId");
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
    console.log('ionViewDidLoad EnginedetailviewPage');
  }
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }
  favoriteaction(unit_id) {
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.unitDetailData.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        let favorite;
        if (data.json().favorite == '1') {
          favorite = "favorite";
        }
        else {
          favorite = "unfavorite";

        }
        this.unitDetailData.favoriteindication = favorite;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }

  ionViewWillEnter() {
    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
      let editItem = this.NP.get("record");
      //this.unitDetailData.unit_id = editItem.unit_id;
      //this.unitDetailData.unitname = editItem.unitname;
      //this.unitDetailData.location = editItem.location;
      //this.unitDetailData.projectname = editItem.projectname;
      this.unitDetailData.runninghr = editItem.runninghr;
      this.unitDetailData.gen_status = editItem.gen_status;
      this.unitDetailData.nextservicedate = editItem.nextservicedate;
      let favorite;
      if (this.NP.get("record").favoriteindication == 'favorite') {
        favorite = "favorite";
      }
      else {
        favorite = "unfavorite";

      }
      this.unitDetailData.favoriteindication = favorite;

      this.unitDetailData.unit_id = localStorage.getItem("unitId");
      if (this.unitDetailData.unit_id == undefined) {
        this.unitDetailData.unit_id = editItem.unit_id;
      }
      if (this.unitDetailData.unit_id == 'undefined') {
        this.unitDetailData.unit_id = editItem.unit_id;
      }
      this.unitDetailData.unitname = localStorage.getItem("unitunitname");
      this.unitDetailData.location = localStorage.getItem("unitlocation");
      this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
      this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
      console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
      this.unitDetailData.lat = localStorage.getItem("unitlat");
      this.unitDetailData.lng = localStorage.getItem("unitlng");
      this.unitDetailData.rh = localStorage.getItem("runninghr");
      this.unitDetailData.ns = localStorage.getItem("nsd");

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


    console.log(this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1");
    this.iframeContent = "<iframe style='position: absolute;margin-left: -16px;' src=" + this.apiServiceURL + "/" + this.unitid + "/1/enginedetails height=350 frameborder=0></iframe>";

    //this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/webview_enginedetails/"+this.unitid + " height=500px width=100% frameborder=0></iframe>";
 
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
  previous() {
    this.nav.push(UnitdetailsPage, {
      record: this.NP.get("record")
    });
  }
}
