import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,Platform } from 'ionic-angular';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';

/**
 * Generated class for the ViewunitsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-viewunits',
  templateUrl: 'viewunits.html'
  ,
   providers:[Config]
})
export class ViewunitsPage {

  public pageTitle: string;
  public loginas: any;

  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public totalCount;
  pet: string = "ALL";
  public userId: any;
  public sortby = 2;
  public ulist: any;
  public detailvalue: any;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  public str: any;
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
    public alertCtrl: AlertController, public navParams: NavParams) {
    this.pageTitle = 'Units';
    this.str = '';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    this.ulist = localStorage.getItem("viewlist");
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
    this.doUnit();
    if (this.navParams.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.navParams.get("record")));
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewunitsPage');
  }
  exit() {
    this.nav.push(UnitdetailsPage, {
      record: this.navParams.get("record")
    });
  }

  doEdit(item, act, unitId) {
    localStorage.setItem("unitId", unitId);
    localStorage.setItem("iframeunitId", unitId);
    localStorage.setItem("unitunitname", item.unitname);
    localStorage.setItem("unitlocation", item.location);
    localStorage.setItem("unitprojectname", item.projectname);
    localStorage.setItem("unitcolorcode", item.colorcodeindications);
    localStorage.setItem("unitlat", item.lat);
    localStorage.setItem("unitlng", item.lng);
    localStorage.setItem("runninghr", item.runninghr);
    console.log("RHR" + item.runninghr);
    localStorage.setItem("nsd", item.nextservicedate);
    this.nav.push(UnitdetailsPage, {
      record: item
    });
    return false;
  }

  doUnit() {
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
    this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/unitlistaction?action=view&unitid=" + this.ulist + "&is_mobile=1&loginid=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.unitdetails.length);
        console.log("2" + res.unitdetails);
        if (res.unitdetails.length > 0) {
          for (let unit in res.unitdetails) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.unitdetails[unit].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.unitdetails[unit].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            this.reportAllLists.push({
              unit_id: res.unitdetails[unit].unit_id,
              unitname: res.unitdetails[unit].unitname,
              location: res.unitdetails[unit].location,
              projectname: res.unitdetails[unit].projectname,
              colorcode: res.unitdetails[unit].colorcode,
              contacts: res.unitdetails[unit].contacts,
              nextservicedate: res.unitdetails[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.unitdetails[unit].controllerid,
              neaplateno: res.unitdetails[unit].neaplateno,
              companys_id: res.unitdetails[unit].companys_id,
              unitgroups_id: res.unitdetails[unit].unitgroups_id,
              models_id: res.unitdetails[unit].models_id,
              alarmnotificationto: res.unitdetails[unit].alarmnotificationto,
              lat: res.unitdetails[unit].lat,
              lng: res.unitdetails[unit].lng,
              genstatus: res.unitdetails[unit].genstatus,
              favoriteindication: favorite
            });
          }
          //this.reportAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:" + this.totalCount);

      }, error => {
        this.conf.presentLoading(0);
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    
  }
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUnit();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}
