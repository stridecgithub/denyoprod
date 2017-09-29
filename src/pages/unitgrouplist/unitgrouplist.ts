import { Component } from '@angular/core';
import { NavController, AlertController, NavParams,Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddunitsonePage } from '../addunitsone/addunitsone';
import { ViewcompanygroupPage } from '../viewcompanygroup/viewcompanygroup';
import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { CompanygroupPage } from '../companygroup/companygroup';
//import { RolePage } from '../role/role';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { NotificationPage } from '../notification/notification';
//import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { MapsPage } from '../maps/maps';
import { OrgchartPage} from '../orgchart/orgchart';
import { UnitsPage } from '../units/units';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';

/**
 * Generated class for the Unitgrouplist page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-unitgrouplist',
  templateUrl: 'unitgrouplist.html',
   providers:[Config]
})
export class Unitgrouplist {

 public loginas: any;
  public pageTitle: string;
 private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  public totalCount;
  pet: string = "ALL";
  public fav: any;
  public userId: any;
  public sortby = 2;
  public detailvalue: any;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  public str: any;
  public msgcount: any;
  public notcount: any;
  //Authorization Declaration

  //Authorization Declaration
  public reportData: any =
  {
    status: '',
    sort: 'unit_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 50
  }
  public reportAllLists = [];
  constructor(private conf: Config, public platform: Platform, private network: Network,public http: Http, public nav: NavController,
    public alertCtrl: AlertController, public navParams: NavParams) {
    this.pageTitle = 'Units';
    this.str = '';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    //Authorization Get Value
   
    //Authorization Get Value
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
    console.log('ionViewDidLoad Unitgrouplist');
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


  /****************************/
  /*@doUnit calling on report */
  /****************************/
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
      url: any = this.apiServiceURL + "/unitgroupdetails?startindex=" + this.reportData.startindex + "&results=" + this.reportData.results + "&sort=" + this.reportData.sort + "&dir=" + this.reportData.sortascdesc + "&unitgroupid=" + localStorage.getItem("uid") + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
         this.conf.presentLoading(0);
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.units.length);
        console.log("2" + res.units);
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
              localStorage.setItem("unitfav", favorite);
            }
            else {
              this.fav = favorite;
              favorite = "unfavorite";
              localStorage.setItem("unitfav", favorite);

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
              models_id: res.units[unit].models_id,
              alarmnotificationto: res.units[unit].alarmnotificationto,
              genstatus: res.units[unit].genstatus,
              lat: res.units[unit].lat,
              lng: res.units[unit].lng,
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

  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.reportData.startindex < this.totalCount && this.reportData.startindex > 0) {
      console.log('B');
      this.doUnit();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }
  ionViewWillEnter() {
    this.detailvalue = "";
    localStorage.setItem("viewlist", "");
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
  
      this.doUnit();
    
  }

  doAdd() {
    this.nav.push(AddunitsonePage);
  }
  getCheckBoxValue(item, val) {
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
    this.detailvalue = item;


    // localStorage.setItem("unitunitname", item.unitname);
    // localStorage.setItem("unitlocation", item.location);
    // localStorage.setItem("unitprojectname", item.projectname);
    // localStorage.setItem("unitcolorcode", item.colorcodeindications);
    // localStorage.setItem("unitlat", item.lat);
    // localStorage.setItem("unitlng", item.lng);
    // console.log(this.str + "//" + JSON.stringify(this.detailvalue));
    // localStorage.setItem("viewlist", this.str);
  }

  onAction(actpet) {
    console.log('Your act pet is:' + actpet);
    console.log(JSON.stringify(this.str));
    let urlstr;
    if (actpet == 'delete') {
      if (this.str == '') {
        this.conf.sendNotification("Please select Atleast One Unit")
      }
      else {
        urlstr = "/unitlistaction/" + this.str + "/1/delete";
      }
    }
    if (actpet == 'viewdashboard') {
      if (this.str == '') {
        this.conf.sendNotification("Please select Atleast One Unit")
      }
      else {
        urlstr = "/unitlistaction/" + this.str + "/1/dashboard?ses_login_id=" + this.userId;
      }
    }
    if (actpet == 'view') {
      if (this.str == '') {
        this.conf.sendNotification("Please select Atleast One Unit")
      }
      else {
        this.nav.push(UnitdetailsPage, {
          record: this.detailvalue
        });
        return false;
      }
    }
    if (urlstr != undefined) {
     
      let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + urlstr;
      console.log(url);

      this.http.get(url, options)
        .subscribe((data) => {
          console.log("Count Response Success:" + JSON.stringify(data.json()));
          // If the request was successful notify the user
          if (data.status === 200) {
            if (actpet == 'delete') {
              this.conf.sendNotification(`Successfully Deleted`);
            } else {
              this.conf.sendNotification(`Successfully Added`);
            }
            this.reportData.startindex = 0;
            this.reportData.sort = "unit_id";
            /// this.doUnit();
            this.nav.push(this.nav.getActive().component);
          }
          // Otherwise let 'em know anyway
          else {
            // this.conf.sendNotification('Something went wrong!');
          }
        }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    }
  }
  doEdit(item, act, unitId) {
    if (act == 'edit') {
      this.nav.push(AddunitsonePage, {
        record: item,
        act: act
      });
      return false;
    } else if (act == 'detail') {

      localStorage.setItem("unitId", unitId);
      localStorage.setItem("iframeunitId", unitId);
      localStorage.setItem("unitunitname", item.unitname);
      localStorage.setItem("unitlocation", item.location);
      localStorage.setItem("unitprojectname", item.projectname);
      localStorage.setItem("unitcolorcode", item.colorcodeindications);
      localStorage.setItem("unitlat", item.lat);
      localStorage.setItem("unitlng", item.lng);


      this.nav.push(UnitdetailsPage, {
        record: item
      });
      return false;
    } else {
      this.nav.push(ViewcompanygroupPage, {
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
      message: 'Are you sure you want to delete this unit?',
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

  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/units/" + recordID + "/1/delete";

    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Congratulations the units was successfully deleted`);
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
    this.doUnit();
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
    this.doUnit();
    console.log('6');
  }

  previous() {
    this.nav.push(UnitgroupPage);
  }
  favorite(unit_id) {
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    let body: string = "unitid=" + unit_id + "&is_mobile=1" + "&loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/setunitfavorite";
    console.log(url);
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
              favoriteindication: favorite
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
    this.doUnit();
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
