import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { UserPage } from '../user/user';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { AlarmlogPage } from '../alarmlog/alarmlog';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { RolePage } from '../role/role';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
import { DomSanitizer } from '@angular/platform-browser';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the UnitdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
	selector: 'page-trendline',
	templateUrl: 'trendline.html',
   providers:[Config]
})
export class TrendlinePage {
	public pageTitle: string;
	iframeContent: any;
	public userid: any;
	public loginas: any;
	private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;


	constructor(private conf: Config, public platform: Platform, private network: Network,private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {

		this.loginas = localStorage.getItem("userInfoName");
		this.userid = localStorage.getItem("userInfoId");

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
		this.pageTitle = "Trendline";
		console.log('ionViewDidLoad TrendlinePage');
		localStorage.setItem("fromModule", "TrendlinePage");
	}

	ionViewWillEnter() {
		console.log("Alaram Id" + this.NP.get("alarmid"));
		let alarmID = this.NP.get("alarmid");
		this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/" + "alarmlogtrendline?loginid=" + this.userid + "&alarm_id=" + alarmID + " height=350 width=100% frameborder=0></iframe > ";

	}

	clickcall() {
		console.log('Enter kannan kris thibi1');
	}
	previous() {
		this.nav.push(AlarmlogPage);
	}
	redirectToUser() {
		this.nav.push(UserPage);
	}

	
	redirectToUnits() {
		this.nav.push(UnitsPage);
	}
	

	redirectToRole() {
		this.nav.push(RolePage);
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

