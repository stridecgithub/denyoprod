import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { EnginedetailPage } from '../enginedetail/enginedetail';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';

@Component({
  selector: 'page-engineview',
  templateUrl: 'engineview.html',
  providers: [Config]
})
export class EngineviewPage {
  public pageTitle: string;

  public item = [];
  public msgcount: any;
  public notcount: any;
  public colorListArr = [];
  iframeContent: any;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public serviceCount;
  public commentCount;
  public devicewidth;
  public unitDetailData: any = {
    model_id: '',
    iframeURL: '',
    loginas: ''
  }
  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.previous();
      });
      console.log('Device Resolution Width: ' + platform.width() + 16);
      console.log('Device Resolution Height: ' + platform.height());
      this.devicewidth = platform.width() + 16;
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
    console.log('ionViewDidLoad EngineviewPage');
    localStorage.setItem("fromModule", "EngineviewPage");
  }
  ionViewWillEnter() {
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
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
    console.log(JSON.stringify(this.NP.get("record")));
    let editItem = this.NP.get("record");
    this.iframeContent = "<iframe style='position: absolute;margin-left: -32px; width: " + this.devicewidth + "px'  src=" + this.apiServiceURL + "/webview_enginedetails/" + editItem.model_id + " height=400 frameborder=0></iframe>";

    //this.iframeContent = "<iframe style='position: absolute;margin-left: -16px;' src=" + this.apiServiceURL + "/" + this.unitid + "/1/enginedetails height=350 frameborder=0></iframe>";

  }
  notification() {
    this.navCtrl.push(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.push(UnitsPage);
  }
  redirectToMessage() {
    this.nav.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.push(CalendarPage);
  }
  redirectToMaps() {
    this.nav.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.navCtrl.push(OrgchartPage);
  }

  previous() {
    this.navCtrl.push(EnginedetailPage);
  }
}
