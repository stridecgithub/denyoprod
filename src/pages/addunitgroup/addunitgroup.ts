import { Component } from '@angular/core';
import { App, ViewController , NavController, NavParams, Platform} from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UserPage } from '../user/user';
import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
import 'rxjs/add/operator/map';
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
 * Generated class for the AddunitgroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addunitgroup',
  templateUrl: 'addunitgroup.html',
  providers: [Config]
})
export class AddunitgroupPage {
  public loginas: any;
  public companyid: any;
  public form: FormGroup;
  public cname: any;
  public isSubmitted: boolean = false;
  public remark: any;
  public ccode: any;
  public nccode: any;
  public userId: any;
  public responseResultCountry: any;

  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // public isUploadedProcessing: boolean = false;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;

  constructor(public viewCtrl: ViewController, public appCtrl: App, private conf: Config, public platform: Platform, private network: Network, public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      //"cname": ["", Validators.required],
      "cname": ["", Validators.compose([Validators.maxLength(100), Validators.required])],
      "remark": ["", Validators.required]
    });

    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
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
    console.log('ionViewDidLoad AddunitgroupPage');
     localStorage.setItem("fromModule", "AddunitgroupPage");
  }
  ionViewWillEnter() {
    this.resetFields();

    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Unit Group';
      this.readOnly = false;
      this.hideActionButton = true;
      console.log(this.NP.get("record"));
      let colorcde;
      console.log("record:----->" + this.NP.get("record").colorcode);
      if (this.NP.get("record").colorcode == 'undefined') {
        colorcde = '';
      }

      if (this.NP.get("record").colorcode == undefined) {
        colorcde = '';
      }

      if (colorcde == '') {
        document.getElementById("FBE983").classList.add("border-need1");
      }
    }
    else {
      // document.getElementById("FBE983").classList.add("border-need");
      //this.ccode = "FBE983";

      document.getElementById("FBE983").classList.add("border-need1");
      this.ccode = "FBE983";
      this.isEdited = false;
      this.pageTitle = 'Add Unit Group';
    }
  }
  selectEntry(item) {
    this.cname = item.unitgroup_name;
    this.remark = item.remark;
    this.ccode = item.colorcode;
    this.nccode = this.ccode;
    if (this.ccode == "DAADFE") {
      document.getElementById("DAADFE").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "DAADFE";
    }
    if (this.ccode == "FBE983") {
      document.getElementById("FBE983").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "FBE983";
    }
    if (this.ccode == "5584EE") {
      document.getElementById("5584EE").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "5584EE";
    }
    if (this.ccode == "A4BDFD") {
      document.getElementById("A4BDFD").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "A4BDFD";
    }
    if (this.ccode == "47D6DC") {
      document.getElementById("47D6DC").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "47D6DC";
    }
    if (this.ccode == "7AE7BE") {
      document.getElementById("7AE7BE").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "7AE7BE";
    }
    if (this.ccode == "FBD75C") {
      document.getElementById("FBD75C").classList.add("border-need");
      this.ccode = "FBD75C";
      // console.log("Hi");
    }
    if (this.ccode == "FFB878") {
      document.getElementById("FFB878").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "FFB878";
    }
    if (this.ccode == "FF877C") {
      document.getElementById("FF877C").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "FF877C";
    }
    if (this.ccode == "DC2128") {
      document.getElementById("DC2128").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "DC2128";
    }
    if (this.ccode == "E1E1E1") {
      document.getElementById("E1E1E1").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "E1E1E1";
    }
    if (this.ccode == "51B749") {
      document.getElementById("51B749").classList.add("border-need");
      // console.log("Hi");
      this.ccode = "51B749";
    }
    this.recordID = item.unitgroup_id;
  }
  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      let cname: string = this.form.controls["cname"].value,
        remark: string = this.form.controls["remark"].value;
      console.log(cname, remark);
      if (cname.toLowerCase() == 'denyo' || cname.toLowerCase() == 'dum' || cname.toLowerCase() == 'dsg' || cname.toLowerCase() == 'denyo singapore') {
        this.conf.sendNotification("Given Unit Group Name Not Acceptable....");
      }
      else {

        if (this.isEdited) {

          this.updateEntry(cname, this.ccode, remark, this.userId, this.companyid);
        }
        else {
          this.createEntry(cname, this.ccode, remark, this.userId, this.companyid);
        }
      }
    }
  }
  updateEntry(cname, ccode, remark, userid, companyid) {
    console.log(cname, ccode, remark, userid, companyid);
    this.isSubmitted = true;
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + this.ccode + "&remark=" + remark + "&createdby=" + userid + "&updatedby=" + userid + "&company_id=" + companyid + "&unitgroup_id=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/update";
    console.log(url);
    this.http.post(url, body, options)
      .subscribe(data => {
        let res = data.json();
        console.log(data.json());
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
          } else {
            this.conf.sendNotification(res.msg[0].result);
            // this.nav.setRoot(UnitgroupPage);
            this.viewCtrl.dismiss();
            this.appCtrl.getRootNav().push(UnitgroupPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  createEntry(cname, ccode, remark, createdby, companyid) {
    this.isSubmitted = true;
    // this.isUploadedProcessing = true;
    let updatedby = createdby;
    console.log(cname, ccode, remark, companyid);
    let body: string = "is_mobile=1&unitgroup_name=" + cname + "&colorcode=" + ccode + "&remark=" + remark + "&createdby=" + createdby + "&updatedby=" + updatedby + "&company_id=" + companyid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitgroup/store";
    this.http.post(url, body, options)
      .subscribe((data) => {
        let res = data.json();
        console.log(JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          console.log("Msg Results:-" + res.msg[0].result);
          this.hideForm = true;
          if (res.msg[0].result > 0) {
            this.conf.sendNotification(res.msg[0].result);
          } else {
            this.conf.sendNotification(res.msg[0].result);
            //this.nav.setRoot(UnitgroupPage);
            this.viewCtrl.dismiss();
            this.appCtrl.getRootNav().push(UnitgroupPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.cname = "";
    this.remark = "";

  }
  getColor(colorCodeValue) {
    document.getElementById(colorCodeValue).classList.add("border-need");
    if (this.ccode != colorCodeValue) {
      document.getElementById(this.ccode).classList.remove("border-need");
    }



    console.log(colorCodeValue);
    this.ccode = colorCodeValue;
  }




  previous() {
    this.nav.push(UnitgroupPage);
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
