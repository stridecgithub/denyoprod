
import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddunitsonePage } from '../addunitsone/addunitsone';
import { ViewcompanygroupPage } from '../viewcompanygroup/viewcompanygroup';
import { OrgchartPage } from '../orgchart/orgchart';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { RolePage } from '../role/role';
//import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
//declare var google;
import { DomSanitizer } from '@angular/platform-browser';
//import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
///import { MapsactionPage } from '../mapsaction/mapsaction';

import { MapsActionPage } from '../mapsaction/mapsaction';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
//import { Observable } from 'rxjs/Rx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps';
//import { Geolocation } from '@ionic-native/geolocation'
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
  providers: [Config]
})
export class MapsPage {
  map: GoogleMap;
  mapElement: HTMLElement;



  //@ViewChild('mapContainer') mapContainer: ElementRef;
  //map: any;

  // then start it
  public loginas: any;
  public userid: any;
  public companyid: any;
  public addressData = [];
  public detailvalue: any;
  public pageTitle: string;
  public networkType: string;
  public subscription;
  public timeri = 0;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public totalCount;
  pet: string = "ALL";
  public sortby = 2;
  public str: any;
  public str1: any;
  public msgcount: any;
  public notcount: any;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  iframeContent: any;
  public VIEWACCESS: any;
  public HIDEACCESS: any;
  public reportData: any =
  {
    status: '',
    sort: 'unit_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  constructor(private conf: Config, public platform: Platform, private network: Network, private googleMaps: GoogleMaps, public http: Http, public navCtrl: NavController,
    private sanitizer: DomSanitizer, public alertCtrl: AlertController, public navParams: NavParams) {
    /* Role Authority Start */
    this.VIEWACCESS = localStorage.getItem("DASHBOARD_MAP_VIEW");
    this.HIDEACCESS = localStorage.getItem("DASHBOARD_MAP_HIDE");
    console.log("Role Authority for Map View" + this.VIEWACCESS);

    console.log("Role Authority for Map Hide" + this.HIDEACCESS);
    /* Role Authority End */

    this.pageTitle = 'Maps';
    this.str = '';
    this.str1 = '';
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.loginas = localStorage.getItem("userInfoName");
    this.userid = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
    this.networkType = '';
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
        this.loadMap(0);
      }
    });


  }
  ngOnInit() {
    //this.loadMap(0);
  }
  ionViewDidLoad() {
     localStorage.setItem("fromModule","MapsPage");
    console.log('ionViewDidLoad MapsPage');
    //this.pageLoad();
    //this.loadMap(0);
    let isNet;
    isNet = localStorage.getItem("isNet");
    console.log("Is Status for Network Map Page:" + isNet);
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
      return false;
    } else {
      this.pageLoad();
    }

  }
  ionViewWillEnter() {

    console.log('ionViewWillEnter MapsPage');
  }

  doRefresh(refresher) {
    console.log('doRefresh function calling...');

    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUser();
    setTimeout(() => {
      refresher.complete();
    }, 2000);

  }


  /****************************/
  /*@doUser calling on report */
  /****************************/
  doUser() {
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
    //this.conf.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&loginid=" + this.userid + "&company_id=" + this.companyid;
    let res;
    console.log(url);
    console.log("doUser map.ts:" + url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();

        /* if (res.msg[0].Error > 0) {
           res.units = [];
         }*/



        if (res.totalCount > 0) {
          for (let unit in res.units) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.units[unit].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.units[unit].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            this.reportAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              contacts: res.units[unit].contacts,
              nextservicedate: res.units[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              runninghr: res.units[unit].runninghr,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              viewonid: res.units[unit].viewonid,
              genstatus: res.units[unit].genstatus,
              favoriteindication: favorite,
              latitude: res.units[unit].latitude,
              longtitude: res.units[unit].longtitude
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
        this.networkType = this.conf.serverErrMsg();//+ "\n" + error;
      });
    // this.conf.presentLoading(0);
  }

  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doUser();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  mapunitdetail(item) {

    localStorage.setItem("unitId", item.unit_id);
    localStorage.setItem("iframeunitId", item.unit_id);
    localStorage.setItem("unitunitname", item.unitname);
    localStorage.setItem("unitlocation", item.location);
    localStorage.setItem("unitprojectname", item.projectname);
    localStorage.setItem("unitcolorcode", item.colorcode);
    localStorage.setItem("unitlat", item.latitude);
    localStorage.setItem("unitlng", item.longtitude);
    localStorage.setItem("runninghr", item.runninghr);
    console.log("RHR" + item.runninghr);
    localStorage.setItem("nsd", item.nextservicedate);

    this.navCtrl.push(UnitdetailsPage, {
      record: item
    });

  }

  pageLoad() {



    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userid;
    console.log(url);
    console.log("pageLad map.ts:" + url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    if (this.VIEWACCESS > 0) {
      this.reportData.startindex = 0;
      this.reportData.sort = "unit_id";
      this.doUser();
    }
    // console.log(this.apiServiceURL + "/api/webview/map.php?is_mobile=1&loginid=1&startindex=0&results=8&sort=unit_id&dir=desc");
    this.loadMap(0);
  }
  loadMap(val) {
    // Now you can use all methods safely.
    console.log("A" + JSON.stringify(val));
    console.log("B" + val.length);
    if (JSON.stringify(val).length > 0) {
      this.reportData.startindex = 0;
      this.reportData.results = 8;
    }
    let typestr: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headersstr: any = new Headers({ 'Content-Type': typestr }),
      optionsstr: any = new RequestOptions({ headers: headersstr }),
      urlstr: any = this.apiServiceURL + "/dashboard?is_mobile=1&startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&loginid=" + this.userid + "&company_id=" + this.companyid;
    console.log("Map Marker api url:" + urlstr);
    let res;
    // let latLng;

    this.mapElement = document.getElementById('map');




    // Creating a new map

    if (val == 0) {
      console.log("Block A");
      console.log("Default Loading  Map Defined...");

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: 1.3249773,
            lng: 103.70307100000002,
            passive: true
          },
          zoom: 9,
          tilt: 30,
        }
      };
      this.map = this.googleMaps.create(this.mapElement, mapOptions);
    }
    else if (val == 'undefined') {
      console.log("Block B");
      console.log("Undefined calling");
      console.log("Selected Unit Map Defined..." + "val.latitude:" + val.latitude + "val.longtitude" + val.longtitude);

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: val.latitude,
            lng: val.longtitude,
            passive: true
          },
          zoom: 16,
          tilt: 30,
        }
      };
      this.map = this.googleMaps.create(this.mapElement, mapOptions);
    } else {
      console.log("Block C");
      console.log("Selected Unit Map Defined..." + "val.latitude:" + val.latitude + "val.longtitude" + val.longtitude);

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: val.latitude,
            lng: val.longtitude
          },
          zoom: 16,
          tilt: 30,
        }
      };
      this.map = this.googleMaps.create(this.mapElement, mapOptions);
    }
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.http.get(urlstr, optionsstr)
          .subscribe(data => {
            // Wait the MAP_READY before using any methods.

            res = data.json();

            if (res.totalCount > 0) {
              for (var unit in res.units) {
                if (val == 0) {
                  console.log("Block D");
                  //Google Map Start

                  //Google Map Start
                  console.log("Default Unit..." + "val.latitude:" + res.units[unit].latitude + "val.longtitude" + res.units[unit].longtitude);
                  let labeldata = '<div class="info_content">' +
                    '<h3>' + res.units[unit].unitname + '</h3>' +
                    '<h4>' + res.units[unit].projectname + '</h4>' +
                    '<p>Running Hours:' + res.units[unit].runninghr + ' Hours</p>' + '</div>';
                  this.addMarkerList(labeldata, res.units[unit].latitude, res.units[unit].longtitude, res.units[unit]);
                  // Google Map End


                  // Google Map End
                } else if (val == 'undefined') {
                  //Google Map Start
                  console.log("Block E");
                  console.log("Selected Unit..." + "val.latitude:" + val.latitude + "val.longtitude" + val.longtitude);
                  this.map.one(GoogleMapsEvent.MAP_READY)
                    .then(() => {
                      //Google Map Start
                      let labeldata = '<div class="info_content">' +
                        '<h3>' + val.unitname + '</h3>\n' +
                        '<h4>' + val.projectname + '</h4>\n' +
                        '<p>Running Hours:' + val.runninghr + ' Hours</p>' + '</div>';

                      this.addMarkerList(labeldata, val.latitude, val.longtitude, val);

                      // Google Map End
                    });
                  // Google Map End
                } else {
                  //Google Map Start
                  console.log("Block F");
                  console.log("Selected Unit..." + "val.latitude:" + val.latitude + "val.longtitude" + val.longtitude);
                  this.map.one(GoogleMapsEvent.MAP_READY)
                    .then(() => {
                      //Google Map Start
                      let labeldata = '<div class="info_content">' +
                        '<h3>' + val.unitname + '</h3>\n' +
                        '<h4>' + val.projectname + '</h4>\n' +
                        '<p>Running Hours:' + val.runninghr + ' Hours</p>' + '</div>';

                      this.addMarkerList(labeldata, val.latitude, val.longtitude, val);

                      // Google Map End
                    });
                  // Google Map End
                }
              }
            }
          }, error => {
            this.networkType = this.conf.serverErrMsg();// + "\n" + error;
          });
      });
  }


  addMarkerList(title, lat, lng, dataunit) {
    console.log("Calling.... Marker Display Function");
    console.log("Title:" + title);
    console.log("Latitude:" + lat);
    console.log("Longtitude:" + lng);
    console.log("Unit Data:" + dataunit);
    let labeldata = 'Unit Name:' + dataunit.unitname + '\n' +
      'Project Name:' + dataunit.projectname + '\n' +
      'Running Hours:' + dataunit.runninghr + ' Hour';
    this.map.addMarker({
      title: labeldata,
      //title: title,
      icon: "img/completed.png",
      //icon: 'blue',
      animation: 'DROP',
      position: {
        lat: lat,
        lng: lng
      },
      'styles': {
        'text-align': 'center',
        'font-weight': 'bold',
        'color': 'blue'
      },
      'flat': true,
      'draggable': true
    })
      .then(marker => {
        marker.on(GoogleMapsEvent.MARKER_CLICK)
          .subscribe(() => {
            //this.mapunitdetail(data);
          });

        marker.on(GoogleMapsEvent.INFO_CLICK)
          .subscribe((data) => {
            console.log(JSON.stringify(data));
            this.mapunitdetail(dataunit);
          });

      });
  }
  doAdd() {
    this.navCtrl.push(AddunitsonePage);
  }
  doEdit(item, act) {
    if (act == 'edit') {
      this.navCtrl.push(AddunitsonePage, {
        record: item,
        act: act
      });
      return false;
    } else if (act == 'detail') {
      this.navCtrl.push(UnitdetailsPage, {
        record: item
      });
      return false;
    } else {
      this.navCtrl.push(ViewcompanygroupPage, {
        record: item,
        act: act
      });
      return false;
    }
  }
  /******************************************/
  /* @doConfirm called for alert dialog box **/
  /******************************************/
  doConfirm(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this user?',
      buttons: [{
        text: 'Yes',
        handler: () => {

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




  onSegmentChanged(val) {
    let splitdata = val.split(",");
    this.reportData.sort = splitdata[0];
    this.reportData.sortascdesc = splitdata[1];
    //this.reportData.status = "ALL";
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUser();
  }

  /********************/
  /* Sorting function */
  /********************/
  doSort(val) {
    console.log('1');
    this.reportAllLists = [];
    this.reportData.startindex = 0;
    console.log('2');
    this.sortby = 1;
    if (this.vendorsort == "asc") {
      this.reportData.sortascdesc = "desc";
      this.vendorsort = "desc";
      this.ascending = false;
      console.log('3');
    }
    else {
      console.log('4');
      this.reportData.sortascdesc = "asc";
      this.vendorsort = "asc";
      this.ascending = true;
    }
    console.log('5');
    this.reportData.sort = val;
    this.doUser();
    console.log('6');
  }

  previous() {
    this.navCtrl.setRoot(DashboardPage);
  }
  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";
    console.log(url);
    console.log("favorites map.ts:" + url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        let res = data.json();
        console.log(res.msg[0].Error);
        console.log(res.msg[0].result);
        if (res.msg[0] == 0) {
          console.log("Favorite");
        } else {
          console.log("Un Favorite");
        }

        if (res.units.length > 0) {
          for (let unit in res.units) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.units[unit].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.units[unit].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            this.reportAllLists.push({
              unit_id: res.units[unit].unit_id,
              unitname: res.units[unit].unitname,
              location: res.units[unit].location,
              contacts: res.units[unit].contacts,
              projectname: res.units[unit].projectname,
              colorcode: res.units[unit].colorcode,
              nextservicedate: res.units[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.units[unit].controllerid,
              neaplateno: res.units[unit].neaplateno,
              companys_id: res.units[unit].companys_id,
              unitgroups_id: res.units[unit].unitgroups_id,
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              viewonid: res.units[unit].viewonid,
              favoriteindication: favorite,
              latitude: res.units[unit].latitude,
              longtitude: res.units[unit].longtitude
            });
          }
          //this.reportAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }

        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(res.msg[0].result);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    this.doUser();
  }
  getCheckBoxValue(item, val, val1) {
    /*console.log("Available data" + val);
    this.getCheckboxData.push({
      availabledata: val
    })*/


    /*console.log("Available data" + name);
  this.selectedAction.push({
  availabledata: name
  })
  console.log(JSON.stringify(this.selectedAction));*/
    if (val != '') {
      if (this.str == '') {
        this.str = val;
      } else {
        this.str = this.str + "," + val;
      }
    }
    if (val1 != '') {
      if (this.str1 == '') {
        this.str1 = val1;
      } else {
        this.str1 = this.str1 + "," + val1;
      }
    }
    console.log(this.str + "//" + this.str1);
    this.detailvalue = item;
    localStorage.setItem("unitunitname", item.unitname);
    localStorage.setItem("unitlocation", item.location);
    localStorage.setItem("unitprojectname", item.projectname);
    localStorage.setItem("unitcolorcode", item.colorcodeindications);
    localStorage.setItem("unitlat", item.lat);
    localStorage.setItem("unitlng", item.lng);
    localStorage.setItem("runninghr", item.runninghr);
    localStorage.setItem("nsd", item.nextservicedate);
    console.log(this.str + "//" + JSON.stringify(this.detailvalue));
    localStorage.setItem("viewlist", this.str);

  }
  onAction(act) {
    let urlstr;
    if (act == 'view') {
      if (this.str == '') {
        this.conf.sendNotification("Please select Atleast One Unit")
      }
      else {
        let item;
        item = this.detailvalue;
        localStorage.setItem("unitId", item.unit_id);
        localStorage.setItem("iframeunitId", item.unit_id);
        localStorage.setItem("unitunitname", item.unitname);
        localStorage.setItem("unitlocation", item.location);
        localStorage.setItem("unitprojectname", item.projectname);
        localStorage.setItem("unitcolorcode", item.colorcodeindications);
        localStorage.setItem("unitlat", item.lat);
        localStorage.setItem("unitlng", item.lng);
        localStorage.setItem("runninghr", item.runninghr);
        localStorage.setItem("nsd", item.nextservicedate);
        this.navCtrl.push(UnitdetailsPage, {
          record: this.detailvalue
        });
        return false;
      }
    }
    if (act == 'hide') {
      if (this.str == '') {
        this.conf.sendNotification("Please select Atleast One Unit")
      }
      else {
        urlstr = "/dashboardaction?id=" + this.str1 + "&action=hide&is_mobile=1&loginid=" + this.userid;
      }

    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + urlstr;
    console.log("onAction map.ts:" + url + "urlstr map.ts" + urlstr);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        if (act == 'hide') {
          this.conf.sendNotification(`Dashboard hide action successfully updated`);
        }
        // If the request was successful notify the user
        if (data.status === 200) {
          /* this.loadMap(0);
           this.reportData.startindex = 0;
           this.reportData.sort = "unit_id";
           //this.doUser();
           this.pageLoad();
           this.navCtrl.push(this.navCtrl.getActive().component);*/

          this.navCtrl.push(MapsActionPage);
        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });


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
  goAboutPage() {
    this.navCtrl.setRoot(EmailPage);
  }

  zoomOut(item) {
    this.map.animateCamera({
      target: {
        lat: item.latitude,
        lng: item.longtitude
      },
      'zoom': 18,
      'tilt': 30
    })
  }
}


