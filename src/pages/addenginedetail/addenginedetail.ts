import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EnginedetailPage } from '../enginedetail/enginedetail';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AddenginedetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addenginedetail',
  templateUrl: 'addenginedetail.html',
  providers: [Config]
})
export class AddenginedetailPage {
  public pageTitle: string;
  public loginas: any;

  public totalCount;
  public recordID: any = null;
  pet: string = "ALL";
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public msgcount: any;
  public notcount: any;
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  public reportData: any =
  {
    status: '',
    sort: 'unitgroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;

  public enginemodel: any;
  public rawhtml: any;
  public companyId;
  public form: FormGroup;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network, public navCtrl: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.form = fb.group({
      //"enginemodel": ["", Validators.required],
       "enginemodel": ["", Validators.compose([Validators.maxLength(100), Validators.required])],
      "rawhtml": ["", Validators.required]

    });
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
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
    console.log('ionViewDidLoad AddenginedetailPage');
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
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));

      // this.pageTitle = 'Edit Company Group';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {


    }
  }
  selectEntry(item) {
    this.enginemodel = item.model;
    this.rawhtml = item.rawhtml;
    this.recordID = item.model_id;
    console.log("ID" + this.recordID);
  }
  saveEntry() {

     let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      if (this.isEdited) {
        let body: string = "is_mobile=1&model=" + this.enginemodel +
          "&rawhtml=" + this.rawhtml + "&model_id=" + this.recordID,


          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/enginemodel/update";
        console.log(url);
        console.log(body);

        this.http.post(url, body, options)
          .subscribe((data) => {
            //console.log("Response Success:" + JSON.stringify(data.json()));
            // If the request was successful notify the user
            if (data.status === 200) {
              this.hideForm = true;
              this.conf.sendNotification(`successfully Updated`);
              localStorage.setItem("userPhotoFile", "");
              this.navCtrl.push(EnginedetailPage);
            }
            // Otherwise let 'em know anyway
            else {
              this.conf.sendNotification('Something went wrong!');
            }
          }, error => {
            this.networkType = this.conf.serverErrMsg();// + "\n" + error;
          });
      }
      else {
        let body: string = "is_mobile=1&model=" + this.enginemodel +
          "&rawhtml=" + this.rawhtml,


          type: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiServiceURL + "/enginemodel";
        console.log(url);
        console.log(body);

        this.http.post(url, body, options)
          .subscribe((data) => {
            //console.log("Response Success:" + JSON.stringify(data.json()));
            // If the request was successful notify the user
            if (data.status === 200) {
              this.hideForm = true;
              this.conf.sendNotification(`successfully Added`);
              localStorage.setItem("userPhotoFile", "");
              this.navCtrl.push(EnginedetailPage);
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
  }

  previous() {
    this.navCtrl.push(EnginedetailPage);
  }

  notification() {
    this.navCtrl.push(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.push(UnitsPage);
  }
  redirectToMessage() {
    this.navCtrl.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.push(CalendarPage);
  }
  redirectToMaps() {
    this.navCtrl.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.navCtrl.push(OrgchartPage);
  }

}
