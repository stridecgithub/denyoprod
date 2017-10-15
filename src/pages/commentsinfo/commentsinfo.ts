import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,Platform } from 'ionic-angular';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { UserPage } from '../user/user';
import { AddcommentsinfoPage } from '../addcommentsinfo/addcommentsinfo';
import { AddserviceinfoPage } from '../addserviceinfo/addserviceinfo';
import { AddalarmlistPage } from '../addalarmlist/addalarmlist';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { CommentdetailsPage } from '../commentdetails/commentdetails';
import { ServicedetailsPage } from '../servicedetails/servicedetails';
//import { RolePage } from '../role/role';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { AlarmlistdetailPage } from '../alarmlistdetail/alarmlistdetail';
import { OrgchartPage} from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-commentsinfo',
  templateUrl: 'commentsinfo.html',
   providers:[Config]
})
export class CommentsinfoPage {
  public pageTitle: string;
  public unit_id: any;
  public msgcount: any;
  public notcount: any;
  public atMentionedInfo = [];
  public reportData: any =
  {
    status: '',
    sort: 'companygroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 50
  }
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: '',
    colorcodeindications:''
  }
  public userId: any;
  public reportAllLists = [];
  public loginas: any;
  public udetails: any;  
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public comments: any;
  public service_subject: any;
  public addedImgLists = [];
  public loadingMoreDataContent: string;
 private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  constructor(private conf: Config, public platform: Platform, private network: Network,public http: Http,
     public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public nav: NavController) {
    this.pageTitle = 'Comments';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.udetails = localStorage.getItem("unitdetails");
    this.VIEWACCESS = localStorage.getItem("UNITS_COMMENTS_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("UNITS_COMMENTS_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("UNITS_COMMENTS_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("UNITS_COMMENTS_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
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
    console.log('ionViewDidLoadCommentsinfoPage');
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
    this.unit_id = localStorage.getItem("unitId");
    console.log("NUD" + localStorage.getItem("unitdetails"));

    this.unitDetailData.unit_id = localStorage.getItem("unitId");
     this.unitDetailData.unitname = localStorage.getItem("unitunitname");
     this.unitDetailData.location = localStorage.getItem("unitlocation");
     this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
     this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
     this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
     console.log("Add Comment Color Code:" + this.unitDetailData.colorcodeindications);
     this.unitDetailData.lat = localStorage.getItem("unitlat");
     this.unitDetailData.lng = localStorage.getItem("unitlng");
     this.unitDetailData.rh=localStorage.getItem("runninghr");
     this.unitDetailData.nextServiceDate=localStorage.getItem("nsd");
    this.reportData.startindex = 0;
    this.reportData.sort = "comment_id";
    this.doService();
    //this.unit_id = this.NP.get("record").unit_id;

    // Atmentioned Tag Storage
  }
 
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
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
      this.doService();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  doService() {
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "comapny";
    }
    let editItem = this.NP.get("record");


    let iframeunitid = localStorage.getItem("iframeunitId");
    console.log("iframeunitid:" + iframeunitid);
    if (iframeunitid == 'undefined') {
      iframeunitid = '0';
    }
    if (iframeunitid == undefined) {
      iframeunitid = '0';
    }

    if (iframeunitid != undefined && iframeunitid != 'undefined') {
      this.unit_id = iframeunitid;
    } else {
      this.unit_id = editItem.service_unitid;
    }

     let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/comments?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.comments.length);
        console.log("2" + res.comments);
        if (res.comments.length > 0) {
          this.reportAllLists = res.comments;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCount);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    
  }
  notification() {
    this.nav.push(NotificationPage);
  }
  previous() {

    this.nav.push(UnitdetailsPage, {
      record: this.NP.get("record")
    });
  }

  doAdd() {
    this.service_subject = '';
    this.comments = '';
    this.addedImgLists = [];
    localStorage.setItem("microtime", "");
    this.nav.setRoot(AddcommentsinfoPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }




  doEdit(item, act, type) {
    if (type.toLowerCase() == 'c') {
      console.log("comment")
      localStorage.setItem("microtime", "");
      this.nav.setRoot(AddcommentsinfoPage, {
        record: item,
        act: 'Edit'
      });
    }
    if (type.toLowerCase() == 's') {
      console.log("service")
      localStorage.setItem("microtime", "");
      this.nav.push(AddserviceinfoPage, {
        record: item,
        act: 'Edit',from:'comment'
      });
    }
     if (type.toLowerCase() == 'a') {
      console.log("Alarm")
     // localStorage.setItem("microtime", "");
      if (item.alarm_assigned_to == '') {
      this.nav.setRoot(AddalarmlistPage, {
          record: item,
          act: act,
          from:'comment'
        });
      }
       else {
      this.conf.sendNotification("Already Assigned");
    }
  }
   if (type.toLowerCase() == 'r') {
     this.conf.sendNotification("Not Applicable!!!");
   }


  }
  details(item, act, type) {
    if (type.toLowerCase() == 'c') {
      localStorage.setItem("microtime", "");
      this.nav.push(CommentdetailsPage, {
        record: item,
        act: 'Edit'
      });
    }
    if (type.toLowerCase() == 's') {
      localStorage.setItem("microtime", "");
      this.nav.push(ServicedetailsPage, {
        record: item,
        act: 'Edit',
        from:'comment'
      });
    }
    if (type.toLowerCase() == 'r') {
      localStorage.setItem("microtime", "");
      this.nav.push(ServicedetailsPage, {
        record: item,
        act: 'Edit',
        from:'comment'
      });
    }
    if(type.toLowerCase()=='a')
    {
      this.nav.push(AlarmlistdetailPage, {
        record: item,
        act: act,
        from:'comment'

       
      });
    }
  }

  doConfirm(item, ty) {
   
   if(ty.toLowerCase()=='c'){
    console.log("Deleted Id" + item.comment_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this comment?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.comment_id,item.event_type);
          for (let q: number = 0; q < this.reportAllLists.length; q++) {
            if (this.reportAllLists[q] == item) {
              this.reportAllLists.splice(q, 1);
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
     if(ty.toLowerCase()=='s'){
        console.log("Deleted Id" + item.service_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this Service?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.service_id,item.event_type);
          for (let q: number = 0; q < this.reportAllLists.length; q++) {
            if (this.reportAllLists[q] == item) {
              this.reportAllLists.splice(q, 1);
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
      if(ty.toLowerCase()=='r'){
        console.log("Deleted Id" + item.service_id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this Service?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(item.service_id,item.event_type);
          for (let q: number = 0; q < this.reportAllLists.length; q++) {
            if (this.reportAllLists[q] == item) {
              this.reportAllLists.splice(q, 1);
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
  }
  deleteEntry(recordID,types) {
    if(types.toLowerCase()=='c'){
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/comments/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Comments was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    }
    if(types.toLowerCase()=='s'){
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

          this.conf.sendNotification(`Service was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    }
       if(types.toLowerCase()=='r'){
       let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/" + recordID + "/1/delete";
      console.log("DURL"+url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Service was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    }
    
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
   onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
  }
}
