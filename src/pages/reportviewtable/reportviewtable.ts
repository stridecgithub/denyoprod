import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { RolePage } from '../role/role';
//import { HomePage } from '../home/home';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
//import { DatePicker } from '@ionic-native/date-picker';
import { ReportsPage } from '../reports/reports';
import { OrgchartPage } from '../orgchart/orgchart';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
@Component({
  selector: 'page-reportviewtable',
  templateUrl: 'reportviewtable.html',
  providers: [FileOpener, FileTransfer, File, DocumentViewer, Config]
})
export class ReportviewtablePage {
  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;
  public loginas: any;
  iframeContent: any;
  public form: FormGroup;
  public success: any;
  public userid: any;
  public companyid: any;
  public graphview: any;
  public pdfdownloadview: any;
  public pdfDownloadLink: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public from: any;
  public requestsuccess: any;
  requestsuccessview: any;
  public to: any;
  public noentrymsg: any;
  public responseTemplate: any;
  public responseUnit: any;
  public companyId: any;
  public reportAllLists = [];
  public responseResultTimeFrame = [];
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public DATEANDTIME: boolean;
  public RUNNINGHR: boolean;
  public FUELLEVEL: boolean;
  public VOLT1: boolean;
  public VOLT2: boolean;
  public VOLT3: boolean;
  LOADPOWERFACTOR: boolean;
  CURRENT1: boolean;
  CURRENT2: boolean;
  CURRENT3: boolean;
  FREQ: boolean;
  ENGINESTATE: boolean;
  COLLANTTEMP: boolean;
  BATTERYVOLTAGE: boolean;
  OILPRESSURE: boolean;
  ENGSPEED: boolean;
  constructor(private conf: Config, public platform: Platform, private network: Network, private document: DocumentViewer, private sanitizer: DomSanitizer, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener, public NP: NavParams,
    public fb: FormBuilder, public http: Http, public navCtrl: NavController, public nav: NavController) {
    this.pageTitle = 'Reports Preview & Download';
    this.graphview = 0;
    this.requestsuccess = '';
    this.pdfdownloadview = 0;
    this.requestsuccessview = 0;
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    // Create form builder validation rules
    this.form = fb.group({
      "selunit": [""],
      "seltemplate": [""],
      "seltimeframe": [""],
    });
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
  ionViewWillEnter() {
    this.success = 0;
    this.requestsuccess = '';
    this.requestsuccessview = 0;
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;
    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  ionViewDidLoad() {
    this.requestsuccess = '';
    this.success = 0;
    this.requestsuccessview = 0;
    let seltypeBtn = localStorage.getItem("buttonRpt");
    console.log("Select Type Button Submit" + seltypeBtn);
    let action;
    let seltype;
    if (seltypeBtn == '1') {
      action = 'request';
      seltype = '0'; // Request
    }
    if (seltypeBtn == '2') {
      action = 'view';
      seltype = '0'; // Generate
    }
    if (seltypeBtn == '3') {
      action = 'view';
      seltype = '1'; // PDF
    }

    if (this.NP.get("exportto") == 'graph') {
      this.graphview = 1;
    }


    if (seltypeBtn != '3' && this.graphview == 0) {
      console.log("Block A");
      let info = this.NP.get("selunit");
      console.log(JSON.stringify(info));
      let /*body: string = "is_mobile=1" +
        "&selunit=" + this.NP.get("selunit") +
        "&seltimeframe=" + this.NP.get("seltimeframe") +
        "&seltemplate=" + this.NP.get("seltemplate") +
        "&from=" + this.NP.get("from") +
        "&to=" + this.NP.get("to") +
        "&exportto=" + this.NP.get("exportto") +
        "&seltype=" + seltype +
        "&action=" + action +
        "&loginid=" + this.userid +
        "&companyid=" + this.companyid,*/
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid;

      console.log("Report submit url is:-" + url);
      let res;
      this.conf.presentLoading(1);
      this.http.get(url, options)
        .subscribe((data) => {

          // If the request was successful notify the user
          res = data.json();
          res.has
          console.log("Report Preview Success Response:-" + JSON.stringify(res));
          if (seltypeBtn == '1') {
            this.success = 1;
          }
          if (res.reportdata.length > 0) {
            this.reportAllLists = res.reportdata;
            if (res.reportdata[0].DATEANDTIME) {
              this.DATEANDTIME = true;
            } else {
              this.DATEANDTIME = false;

            }

            if (res.reportdata[0].RUNNINGHR) {

              this.RUNNINGHR = true;
            } else {

              this.RUNNINGHR = false;
            }

            if (res.reportdata[0].FUELLEVEL) {

              this.FUELLEVEL = true;
            } else {
              this.FUELLEVEL = false;

            }

            if (res.reportdata[0].VOLT1) {
              this.VOLT1 = true;

            } else {
              this.VOLT1 = false;

            }

            if (res.reportdata[0].VOLT2) {
              this.VOLT2 = true;
            } else {
              this.VOLT2 = false;

            }

            if (res.reportdata[0].VOLT3) {

              this.VOLT3 = true;
            } else {

              this.VOLT3 = false;
            }

            if (res.reportdata[0].LOADPOWERFACTOR) {

              this.LOADPOWERFACTOR = true;
            } else {

              this.LOADPOWERFACTOR = false;
            }
            if (res.reportdata[0].CURRENT1) {

              this.CURRENT1 = true;
            } else {

              this.CURRENT1 = false;
            }

            if (res.reportdata[0].CURRENT2) {

              this.CURRENT2 = true;
            } else {

              this.CURRENT2 = false;
            }

            if (res.reportdata[0].CURRENT3) {

              this.CURRENT3 = true;
            } else {

              this.CURRENT3 = false;
            }

            if (res.reportdata[0].FREQ) {

              this.FREQ = true;
            } else {

              this.FREQ = false;
            }

            if (res.reportdata[0].ENGINESTATE) {

              this.ENGINESTATE = true;
            } else {

              this.ENGINESTATE = false;
            }

            if (res.reportdata[0].COLLANTTEMP) {

              this.COLLANTTEMP = true;
            } else {

              this.COLLANTTEMP = false;
            }
            if (res.reportdata[0].BATTERYVOLTAGE) {

              this.BATTERYVOLTAGE = true;
            } else {

              this.BATTERYVOLTAGE = false;
            }

            if (res.reportdata[0].OILPRESSURE) {

              this.OILPRESSURE = true;
            } else {

              this.OILPRESSURE = false;
            }
            if (res.reportdata[0].ENGSPEED) {

              this.ENGSPEED = true;
            } else {

              this.ENGSPEED = false;
            }


          }

          if (data.status === 200) {

          }
          // Otherwise let 'em know anyway
          else {

          }

          this.noentrymsg = 'No report entries found';
        }, error => {
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });


    } else if (seltypeBtn == '3' && this.graphview == 0) {
      console.log("Block B");
      // PDF Viewer Calling      
      let/* body: string = "is_mobile=1" +
        "&selunit=" + this.NP.get("selunit") +
        "&seltimeframe=" + this.NP.get("seltimeframe") +
        "&seltemplate=" + this.NP.get("seltemplate") +
        "&from=" + this.NP.get("from") +
        "&to=" + this.NP.get("to") +
        "&exportto=" + this.NP.get("exportto") +
        "&seltype=" + seltype +
        "&action=" + action +
        "&loginid=" + this.userid +
        "&companyid=" + this.companyid,*/
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid;

      console.log("Report submit url is:-" + url);
      let res;
      this.conf.presentLoading(1);

      this.http.get(url, options)

        .subscribe((data) => {
          this.conf.presentLoading(0);
          // If the request was successful notify the user
          res = data.json();
          console.log("Uploaded and generated success file is:" + res.pdf);
          this.pdfdownloadview = 1;
          let pdfFile = res.pdf;
          let pdfPathURL = this.apiServiceURL;
          console.log("PDF Path URL:-" + pdfPathURL + pdfFile);
          this.pdfDownloadLink = res.pdf;
          const url = res.pdf;
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer.download(url, this.file.dataDirectory + pdfFile).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            const options: DocumentViewerOptions = {
              title: res.pdf
            }
            this.document.viewDocument(entry.toURL(), 'application/pdf', options)
          }, (error) => {
            // handle error
          });


          if (data.status === 200) {

          }
          // Otherwise let 'em know anyway
          else {

          }


        }, error => {
          this.conf.presentLoading(0);
          this.networkType = this.conf.serverErrMsg();// + "\n" + error;
        });
      //  {"msg":{"result":"success"},"pdf":"reports_generator_1.pdf"}


    } else if (this.graphview > 0) {
      console.log("Block C");

      if (seltypeBtn == '1') {
        this.graphview = 0;
        this.requestsuccessview = 1;
        this.requestsuccess = 'Request successfully sent';
        console.log(this.requestsuccess);
      } else {
        this.iframeContent = "<iframe  src=" + this.apiServiceURL + "/reports/viewreport?is_mobile=1" +
          "&selunit=" + this.NP.get("selunit") +
          "&seltimeframe=" + this.NP.get("seltimeframe") +
          "&seltemplate=" + this.NP.get("seltemplate") +
          "&from=" + this.NP.get("from") +
          "&to=" + this.NP.get("to") +
          "&exportto=" + this.NP.get("exportto") +
          "&seltype=" + seltype +
          "&action=" + action +
          "&loginid=" + this.userid +
          "&companyid=" + this.companyid +
          "&datacodes='' height=350 width=100% frameborder=0></iframe>";
      }
    }


    let data = { "123": "test1", "2365": "test2", "1233": "test3", "112365": "test4" };

    let result = "";
    for (let key in data) {
      result += "key:  " + key + "  value: " + data[key] + "  ";
    };

    console.log(result);

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
    this.navCtrl.push(ReportsPage);
  }
}




