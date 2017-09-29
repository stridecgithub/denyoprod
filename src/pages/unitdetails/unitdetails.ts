import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
//import { UserPage } from '../user/user';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { RolePage } from '../role/role';
import { EnginedetailviewPage } from '../enginedetailview/enginedetailview';
import { ViewunitsPage } from '../viewunits/viewunits';
//import { AlarmPage } from '../alarm/alarm';
import { AlarmlogPage } from '../alarmlog/alarmlog';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { HTTP } from '@ionic-native/http';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { AlarmPage } from '../alarm/alarm';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the UnitdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
	selector: 'page-unitdetails',
	templateUrl: 'unitdetails.html',
	providers: [Config]
})
export class UnitdetailsPage {
	public pageTitle: string;
	//public userId: any;
	public item = [];
	public colorListArr = [];
	iframeContent: any;
	iframeContent1: any;
	iframeContent2: any;
	private apiServiceURL: string = "";
	private permissionMessage: string = "";
	public networkType: string;

	public serviceCount;
	public commentCount;
	public msgcount: any;
	public notcount: any;
	public chk: any;



	public unitDetailData: any = {
		unit_id: '',
		unitname: '',
		location: '',
		projectname: '',
		colorcode: '',
		gen_status: '',
		nextservicedate: '',
		alarmnotificationto: '',
		favoriteindication: '',
		userId: '',
		loginas: '',
		htmlContent: '',
		lat: '',
		lng: '',
		iframeURL: ''

	}
	constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, private sanitizer: DomSanitizer, public NP: NavParams, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
		this.unitDetailData.loginas = localStorage.getItem("userInfoName");
		this.unitDetailData.userId = localStorage.getItem("userInfoId");

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



	ionViewDidLoad() {


		this.pageTitle = "Unit Detail";
		this.colorListArr = [
			"FBE983",
			"5584EE",
			"A4BDFD",
			"47D6DC",
			"7AE7BE",
			"51B749",
			"FBD75C",
			"FFB878",
			"FF877C",
			"DC2128",
			"DAADFE",
			"E1E1E1"
		];
		let editItem = this.NP.get("record");
		/*if (this.NP.get("stopinterval")) {
			let stopinterval = this.NP.get("stopinterval");
			stopinterval.unsubscribe();
		}*/

		let iframeunitid = localStorage.getItem("iframeunitId");
		console.log("iframeunitid:" + iframeunitid);
		if (iframeunitid == 'undefined') {
			iframeunitid = '0';
		}
		if (iframeunitid == undefined) {
			iframeunitid = '0';
		}
		if (iframeunitid != '0') {
			this.unitDetailData.unit_id = iframeunitid
		} else {
			if (this.NP.get("record").unit_id > 0) {
				this.unitDetailData.unit_id = this.NP.get("record").unit_id;
			} else {
				this.unitDetailData.unit_id = editItem.unit_id;
			}
		}
		console.log('ionViewDidLoad UnitdetailsPage');
		// UnitDetails Api Call		
		let
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/getunitdetailsbyid?is_mobile=1&loginid=" + this.unitDetailData.userId +
				"&unitid=" + this.unitDetailData.unit_id;
		console.log(url);
		this.http.get(url, options)
			.subscribe((data) => {					// If the request was successful notify the user
				if (data.status === 200) {
					this.unitDetailData.unitname = data.json().units[0].unitname;
					this.unitDetailData.projectname = data.json().units[0].projectname;
					this.unitDetailData.location = data.json().units[0].location;
					this.unitDetailData.colorcodeindications = data.json().units[0].colorcode;
					this.unitDetailData.gen_status = data.json().units[0].genstatus;
					this.unitDetailData.nextservicedate = data.json().units[0].nextservicedate;
					this.unitDetailData.alarmnotificationto = data.json().units[0].nextservicedate;
					if (data.json().units[0].lat == undefined) {
						this.unitDetailData.lat = '';
					} else {
						this.unitDetailData.lat = data.json().units[0].lat;
					}

					if (data.json().units[0].lat == 'undefined') {
						this.unitDetailData.lat = '';
					} else {
						this.unitDetailData.lat = data.json().units[0].lat;
					}


					if (data.json().units[0].lng == undefined) {
						this.unitDetailData.lng = '';
					} else {
						this.unitDetailData.lng = data.json().units[0].lng;
					}

					if (data.json().units[0].lng == 'undefined') {
						this.unitDetailData.lng = '';
					} else {
						this.unitDetailData.lng = data.json().units[0].lng;
					}


					let colorcode;
					let index = this.colorListArr.indexOf(this.unitDetailData.colorcodeindications);
					let colorvalincrmentone = index + 1;
					colorcode = "button" + colorvalincrmentone;
					this.unitDetailData.colorcodeindications = colorcode;
					let favorite;
					if (data.json().units[0].favorite == '1') {
						favorite = "favorite";
					}
					else {
						favorite = "unfavorite";

					}
					this.unitDetailData.favoriteindication = favorite;

				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
		// Unit Details API Call	
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
		this.chk = localStorage.getItem("viewlist")

		localStorage.setItem("unitdetailsclicked", '');
		this.iframeContent = "<iframe id='filecontainer' src=" + this.apiServiceURL + "/" + this.unitDetailData.unit_id + "/1/unitdetails height=1000 width=100% frameborder=0></iframe>";
		let body: string = "is_mobile=1&loginid=" + this.unitDetailData.userId +
			"&unitid=" + this.unitDetailData.unit_id,
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/getcount";
		console.log(url);
		console.log(body);

		this.http.post(url, body, options)
			.subscribe((data) => {
				console.log("Count Response Success:" + JSON.stringify(data.json()));
				let res = data.json();
				this.serviceCount = res.servicecount;
				this.commentCount = res.commentcount;
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
		let //body: string = "loginid=" + this.userId,
			type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers1: any = new Headers({ 'Content-Type': type1 }),
			options1: any = new RequestOptions({ headers: headers1 }),
			url1: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.unitDetailData.userId;
		console.log(url1);
		// console.log(body);

		this.http.get(url1, options1)
			.subscribe((data) => {
				console.log("Count Response Success:" + JSON.stringify(data.json()));
				this.msgcount = data.json().msgcount;
				this.notcount = data.json().notifycount;
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
	}
	servicingInfo(unitId) {
		let body: string = "is_mobile=1&userid=" + this.unitDetailData.userId +
			"&unitid=" + unitId,
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/removeservicecount";
		console.log(url);
		console.log(body);

		this.http.post(url, body, options)
			.subscribe((data) => {
				if (data.status === 200) {
					console.log("Service count successfully removed");
				}
				// Otherwise let 'em know anyway
				else {
					console.log("Something went wrong!");
				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});
		this.nav.push(ServicinginfoPage, {
			record: this.NP.get("record")
		});
	}
	alamInfo() {
		this.nav.push(AlarmPage, {
			record: this.NP.get("record")
		});
	}
	commentsInfo(unitId) {

		let body: string = "is_mobile=1&userid=" + this.unitDetailData.userId +
			"&unitid=" + unitId,
			type: string = "application/x-www-form-urlencoded; charset=UTF-8",
			headers: any = new Headers({ 'Content-Type': type }),
			options: any = new RequestOptions({ headers: headers }),
			url: any = this.apiServiceURL + "/removecommentcount";
		console.log(url);
		console.log(body);

		this.http.post(url, body, options)
			.subscribe((data) => {

				// If the request was successful notify the user
				if (data.status === 200) {
					console.log("Comment count successfully removed");

				}
				// Otherwise let 'em know anyway
				else {
					console.log("Something went wrong!");
				}
			}, error => {
				this.networkType = this.conf.serverErrMsg();// + "\n" + error;
			});

		this.nav.push(CommentsinfoPage, {
			record: this.NP.get("record")
		});
	}
	alarm() {
		this.nav.push(AlarmlogPage, {
			record: this.NP.get("record")
		});
	}
	enginedetail() {
		this.nav.push(EnginedetailviewPage, {
			record: this.NP.get("record")
		});
	}
	previous() {
		this.nav.push(UnitsPage);
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
	viewunit() {
		this.nav.push(ViewunitsPage, {
			record: this.NP.get("record")
		});
	}
}
