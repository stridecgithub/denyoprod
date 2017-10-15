import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { CompanygroupPage } from '../companygroup/companygroup';
import { UserPage } from '../user/user';
import { MyaccountPage } from '../myaccount/myaccount';
import { AddserviceinfoPage } from '../addserviceinfo/addserviceinfo';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { UnitsPage } from '../units/units';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { ServicedetailsPage } from '../servicedetails/servicedetails';
import { RolePage } from '../role/role';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddrequestsupportPage } from '../addrequestsupport/addrequestsupport';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the ServicinginfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-servicinginfo',
  templateUrl: 'servicinginfo.html',
  providers: [Config]
})
export class ServicinginfoPage {
  public pageTitle: string;
  public unit_id: any;
  public atMentionedInfo = [];
  public service_subject: any;
  public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public photo: any;

  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public reportData: any =
  {
    status: '',
    sort: 'service_id',
    sortascdesc: 'desc',
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
  public addedServiceImgLists = [];
  public addedImgLists = [];
  public loginas: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http,
    public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public nav: NavController) {
    this.pageTitle = 'Servicing Info';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.VIEWACCESS = localStorage.getItem("UNITS_SERVICINGINFO_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("UNITS_SERVICINGINFO_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS);
    this.DELETEACCESS = localStorage.getItem("UNITS_SERVICINGINFO_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicinginfoPage');
    localStorage.setItem("fromModule", "ServicinginfoPage");
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

    if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
      let editItem = this.NP.get("record");
      let favorite;
      //this.unitDetailData.unit_id = editItem.unit_id;
      //this.unitDetailData.unitname = editItem.unitname;
      //this.unitDetailData.location = editItem.location;
      //this.unitDetailData.projectname = editItem.projectname;
      this.unitDetailData.runninghr = editItem.runninghr;
      this.unitDetailData.gen_status = editItem.gen_status;
      this.unitDetailData.nextservicedate = editItem.nextservicedate;
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
    this.reportData.startindex = 0;
    this.reportData.sort = "service_id";
    this.doService();


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

    if (this.NP.get("record").unit_id != undefined && this.NP.get("record").unit_id != 'undefined') {
      this.unit_id = editItem.unit_id;
    } else {
      this.unit_id = editItem.service_unitid;
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitid=" + localStorage.getItem("unitId");
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.services.length);
        console.log("2" + res.services);
        if (res.services.length > 0) {
          this.reportAllLists = res.services;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
          this.loadingMoreDataContent = 'Loading More Data';
          for (var i = 0; i < res.services.length; i++) {
            this.photo = res.services[i].user_photo;
            console.log("PHOTO" + this.photo);
          }

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
  redirectToUser() {
    this.nav.push(UserPage);
  }

  redirectToUnitGroup() {
    this.nav.push(UnitgroupPage);
  }
  redirectToCompanyGroup() {
    this.nav.push(CompanygroupPage);
  }
  redirectToUnits() {
    this.nav.push(UnitsPage);
  }
  redirectToMyAccount() {
    this.nav.push(MyaccountPage);
  }

  redirectToRole() {
    this.nav.push(RolePage);
  }
  doAdd() {
    this.service_subject = '';
    this.service_remark = '';
    this.addedServiceImgLists = [];
    localStorage.setItem("microtime", "");
    this.nav.setRoot(AddserviceinfoPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }


  doRequest() {
    this.service_subject = '';
    this.service_remark = '';
    this.addedImgLists = [];
    localStorage.setItem("microtime", "");
    this.nav.push(AddrequestsupportPage, {
      record: this.NP.get("record"),
      act: 'Add',
      unit_id: this.unit_id
    });
  }



  doEdit(item, act) {
    if (item.event_type.toLowerCase() == 's') {
      localStorage.setItem("microtime", "");
      this.nav.setRoot(AddserviceinfoPage, {
        record: item,
        act: 'Edit',
        from: 'service'
      });
    }
    else {
      this.conf.sendNotification("Not Applicable!!!")
    }
  }
  servicedetails(item, act) {
    localStorage.setItem("microtime", "");
    this.nav.push(ServicedetailsPage, {
      record: item,
      act: 'Edit',
      from: 'service'
    });
  }

  doConfirm(id, item) {

    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this service info?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
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

  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doService();
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
