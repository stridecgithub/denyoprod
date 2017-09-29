import { Component } from '@angular/core';
import { NavController, NavParams ,Platform} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { RolePage } from '../role/role';
//import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { DatePicker } from '@ionic-native/date-picker';
import { ReportviewtablePage } from '../reportviewtable/reportviewtable';
import { OrgchartPage } from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  providers: [DatePicker ,Config]
})
export class ReportsPage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public loginas: any;
  public form: FormGroup;
  public userid: any;
  public companyid: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public from: any;
  public to: any;
  public isSubmitted: boolean = false;
  public responseTemplate: any;
  public responseUnit: any;
  public companyId: any;
  public userInfo: any;
  public exportto: any;
  public action: any;
  public seltype: any;
  public button1: any;
  public button2: any;
  public datevalidaton: any;
  public start_date = 'Start Date';
  public end_date = 'End Date';

  /* public start_date = '2017-08-02';
  public end_date = '2017-08-02';
*/
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network,private datePicker: DatePicker, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController) {
    this.pageTitle = 'Reports';
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "selunit": ["", Validators.required],
      "seltemplate": ["", Validators.required],
      "seltimeframe": ["", Validators.required]
    });
    this.responseResultTimeFrame = [];

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
  ionViewWillEnter() {
    this.responseResultTimeFrame = [];
    this.datevalidaton = 0;
    this.getFormat('table');
    this.getDropDownDataTemplate();
    this.getDropDownDataUnits();
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;
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

    this.responseResultTimeFrame.push({
      id: '1time',
      time_name: '1 Time/Day',
    }, {
        id: 'continues',
        time_name: 'Continues'
      });
  }

  getNextDate(val) {
    //let date;
    this.datePicker.show({
      date: new Date(), mode: 'date',
      doneButtonColor: '#F2F3F4',
      cancelButtonColor: '#000000',
      allowFutureDates: true,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {
        let monthstr = date.getMonth() + parseInt("1");
        if (val == '1') {
          this.from = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
          console.log('From date: ', this.from);
          this.start_date = this.from;
        }
        if (val == '2') {
          this.to = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
          console.log('To date: ', this.to);
          this.end_date = this.to;
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );

    /*if (val == '1') {
      this.from = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
      console.log("From date from choosen calendar:" + this.from);
    }

    if (val == '2') {
      this.to = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
      console.log("From date from choosen calendar:" + this.to);
    }*/
  }


  saveEntry() {
    console.log("Button 1:" + this.button1);
    console.log("Button 2:" + this.button2);
    let selunit: string = this.form.controls["selunit"].value,
      seltemplate: string = this.form.controls["seltemplate"].value,
      seltimeframe: string = this.form.controls["seltimeframe"].value;
    // this.createEntry(selunit, seltemplate, seltimeframe);
    //this.from = "2017-08-09";
    //this.to = "2017-08-09";

    //this.exportto = 'table';
    //this.seltype = 0; // 0 for TABLE 1 for PDF


    // Statically
    /*selunit = '1';
    seltimeframe = 'continues';
    seltemplate = '1';
    this.from = "2017-08-12";
    this.to = "2017-08-12";
    this.action = 'view';
    this.exportto = 'table';
    this.seltype = 0;*/
    // Statically
    if (this.from == undefined) {
      this.from = '';
    }
    if (this.from == 'undefined') {
      this.from = '';
    }
    if (this.from == '') {
      this.from = '';
    }

    if (this.to == undefined) {
      this.to = '';
    }
    if (this.to == 'undefined') {
      this.to = '';
    }
    if (this.to == '') {
      this.to = '';
    }
    if (this.from == '' && this.to == '') {
      this.datevalidaton = 1;
      return false;
    } else {
      this.datevalidaton = 0;
    }


    this.nav.push(ReportviewtablePage, {
      selunit: selunit,
      seltemplate: seltemplate,
      seltimeframe: seltimeframe,
      from: this.from,
      to: this.to,
      exportto: this.exportto,
    });



  }





   getTemplate(templateId) {
    console.log(templateId);
  }

  getFormat(format) {
    console.log(format);
    this.isSubmitted = false;
    if (format == 'graph') {
      this.isSubmitted = true;
    }
    this.exportto = format;
  }

  getDropDownDataUnits() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/reports?is_mobile=1&companyid=" + this.companyid + "&loginid=" + this.userid;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseUnit = res.units;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  getDropDownDataTemplate() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      //url: any = this.apiServiceURL + "/units?is_mobile=1&startindex=0&results=300&sort=unit_id&dir=asc&company_id=" + this.companyId + "&loginid=" + this.userId;
      url: any = this.apiServiceURL + "/reports?is_mobile=1&companyid=" + this.companyid + "&loginid=" + this.userid;
    let res;
    console.log("URL" + url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseTemplate = res.templates;

      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
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
  previous() {
    this.navCtrl.push(DashboardPage);
  }
}



