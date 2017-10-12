import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddcompanygroupPage } from '../addcompanygroup/addcompanygroup';
//import { ViewcompanygroupPage } from '../viewcompanygroup/viewcompanygroup';
//import { HomePage } from '../home/home';
//import { UserPage } from '../user/user';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { CompanygroupPage } from '../companygroup/companygroup';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';

/**
 * Generated class for the Companydetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-companydetail',
  templateUrl: 'companydetail.html',
  providers: [Config]
})
export class CompanydetailPage {
  public pageTitle: string;
  public loginas: any;
  public Role;
  public totalunit;
  private permissionMessage: string = "Permission denied for access this page. Please contact your administrator";
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public loadingMoreDataContent: string;
  private apiServiceURL: string = "";
  public networkType: string;
  public totalCount;
  public companyId: any;
  pet: string = "ALL";
  public sortby = 2;
  public vendorsort = "asc";
  public ascending = true;
  public msgcount: any;
  public notcount: any;
  public name: any;
  public contact: any;
  public address: any;
  public totaluser: any;
  public reportData: any =
  {
    status: '',
    sort: 'companygroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  public reportAllLists1 = [];


  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, public nav: NavController, public NP: NavParams,
    public alertCtrl: AlertController, public navParams: NavParams) {

    this.loadingMoreDataContent = 'Loading More Data';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.Role = localStorage.getItem("userInfoRoleId");
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
    console.log('ionViewDidLoad CompanydetailPage');
    localStorage.setItem("fromModule", "CompanydetailPage");
  }
  ionViewWillEnter() {
    let comid = this.NP.get("record");
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companydetails/" + comid.companygroup_id;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.companydetails.length);
        console.log("2" + res.companydetails);
        if (res.companydetails.length > 0) {
          this.name = res.companydetails[0].companygroup_name;
          console.log("2" + this.name);
          this.address = res.companydetails[0].address;
          this.contact = res.companydetails[0].contact;

          this.totaluser = res.companydetails[0].totaluser;
          this.totalunit = res.companydetails[0].totalunit;

          this.reportAllLists = res.users;
          this.reportAllLists1 = res.unitdetail;





        }
        // [{ "userid": "1", "userdetailsid": "1", "username": "denyov2", "password": "e3b81d385ca4c26109dfbda28c563e2b", "firstname": "Super Admin", "lastname": "Denyo", "email": "balamurugan@webneo.in", "contact_number": "9597645985", "country_id": "99", "photo": "1496647262537.jpg", "job_position": "Country Manager", "report_to": "0", "company_id": "1", "companygroup_name": "Denyo" }]



      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  edit() {
    let comid = this.NP.get("record");
    this.nav.push(AddcompanygroupPage, {
      record: comid

    });
  }
  delete() {
    let comid = this.NP.get("record");
    if (comid.totalunits == 0 || comid.totalusers == 0) {
      let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this company group?',
        buttons: [{
          text: 'Yes',
          handler: () => {
            this.deleteEntry(comid.companygroup_id);

          }
        },
        {
          text: 'No',
          handler: () => { }
        }]
      });


      confirm.present();
    }
    else {
      {
        let confirm = this.alertCtrl.create({
          message: 'There are some user and units under this Company Group.If delete Company Group,all users and units will be deleted.Are you sure you want to delete?',
          buttons: [{
            text: 'Yes',
            handler: () => {
              this.deleteEntry(comid.companygroup_id);

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
  }
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/companygroup/" + recordID + "/1/delete";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {


          this.conf.sendNotification(`Congratulations the company group name was successfully deleted`);
          this.nav.push(CompanygroupPage);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  previous() {
    this.nav.push(CompanygroupPage);
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
