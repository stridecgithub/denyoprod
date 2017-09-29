import { Component } from '@angular/core';
import { NavController, AlertController, NavParams,Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { AddalarmlistPage } from '../addalarmlist/addalarmlist';
import { TrendlinePage } from '../trendline/trendline';
import { AlarmPage } from '../alarm/alarm';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { OrgchartPage} from '../orgchart/orgchart';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AlarmlistdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-alarmlistdetail',
  templateUrl: 'alarmlistdetail.html',
  providers:[Config]
})
export class AlarmlistdetailPage {
 public loginas: any;
  public unitDetailData: any = {
    hashtag:''
  }
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public totalCount;
  pet: string = "ALL";
  public sortby = 2;
  public userId: any;
  public alarmid:any;
  public alarm_assginedby_name: any;
  public alarm_assginedto_name: any;
  public alarm_name: any;
  public estatus;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public reportData: any =
  {
    status: '',
    sort: 'unit_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  constructor(private conf: Config, public platform: Platform, private network: Network,public http: Http, public nav: NavController,
     public alertCtrl: AlertController, public NP: NavParams) {
    this.pageTitle = 'Units';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
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
  trendlineInfo(alarmid) {
    this.nav.push(TrendlinePage, {
      alarmid: alarmid
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmlistdetailPage');
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
        this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
    this.unitDetailData.rh = localStorage.getItem("runninghr");
    this.unitDetailData.ns = localStorage.getItem("nsd");
     this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
    if (this.NP.get("record")) {
      console.log("Alarm Details" + JSON.stringify(this.NP.get("record")));
      console.log(this.NP.get("record").alarm_name);
      this.alarmid=this.NP.get("record").alarm_id;
      this.alarm_name = this.NP.get("record").alarm_name;
      this.alarm_assginedby_name = this.NP.get("record").alarm_assginedby_name;
      this.alarm_assginedto_name = this.NP.get("record").alarm_assginedto_name;
      if (this.alarm_assginedby_name == "") {
        this.estatus = 1;
        console.log("!!!"+this.estatus);
      }
      // this.selectEntry(this.NP.get("record"));
    }

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  selectEntry(item) {

    this.alarm_name = item.alarm_name;
    this.alarm_assginedby_name = item.alarm_assginedby_name;
    this.alarm_assginedto_name = item.alarm_assginedto_name;
  }
  editalarm() {
    this.nav.setRoot(AddalarmlistPage,
    {
      record: this.NP.get("record")
    });
  }
  previous()
  {
      if(this.NP.get("record")=='alarm')
    {
    this.nav.push(AlarmPage,
    {
      record: this.NP.get("record")
    });
  }
  else
  {
 this.nav.push(CommentsinfoPage);
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
