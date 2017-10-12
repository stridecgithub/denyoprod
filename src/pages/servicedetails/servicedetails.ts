import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController ,Platform} from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
//import { UserPage } from '../user/user';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
//import { MyaccountPage } from '../myaccount/myaccount';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
import { UnitsPage } from '../units/units';
//import { RolePage } from '../role/role';
//import { CompanygroupPage } from '../companygroup/companygroup';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { OrgchartPage} from '../orgchart/orgchart';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
//import { AlarmPage } from '../alarm/alarm';
import { MapsPage } from '../maps/maps';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
//import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the ServicedetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-servicedetails',
  templateUrl: 'servicedetails.html',
  providers: [Camera,Config]
})
export class ServicedetailsPage {
  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsDetailsArray = [];
  public addedImgListsDetails = [];
  progress: number;
  public colorListArr = [];
  public msgcount: any;
  public notcount: any;
  public recordID: any;
  public requestbutton: any;
  public service_unitid: any;
  public service_id: any;
  public serviced_by: any;
  public serviced_datetime: any;
  public service_subject: any;
  public service_remark: any;
  public next_service_date: any;
  public service_priority: any;
  public photo: any;
  public sdate: any;

  is_request: boolean
  public serviced_by_name: any;
  public service_resources: any;
  public service_priority_class1: any;
  public service_priority_class2: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  item: any;
  public isEdited: boolean = false;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  form: FormGroup;
  public addedAttachList;
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgListsDetails1: '',
    addedImgListsDetails2: ''
  }
  public hideActionButton = true;
  constructor(private conf: Config, public platform: Platform, private network: Network,public http: Http, public alertCtrl: AlertController, public NP: NavParams, public nav: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {
    this.service_priority_class1 = "-outline";
    this.service_priority_class2 = "-outline";
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");


    this.service_priority = 0;
    // Watch the form for changes, and



    let already = localStorage.getItem("microtime");
    if (already != undefined && already != 'undefined' && already != '') {
      this.micro_timestamp = already;
    } else {
      let dateStr = new Date();
      let yearstr = dateStr.getFullYear();
      let monthstr = dateStr.getMonth();
      let datestr = dateStr.getDate();
      let hrstr = dateStr.getHours();
      let mnstr = dateStr.getMinutes();
      let secstr = dateStr.getSeconds();
      this.micro_timestamp = yearstr + "" + monthstr + "" + datestr + "" + hrstr + "" + mnstr + "" + secstr;

    }
    localStorage.setItem("microtime", this.micro_timestamp);
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
    console.log('ionViewDidLoad ServicedetailsPage');
     localStorage.setItem("fromModule", "ServicedetailsPage");
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
     this.unitDetailData.ns=localStorage.getItem("nsd");
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
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
    this.getPrority(1);
    this.is_request = false;
    console.log(JSON.stringify(this.NP.get("record")));
    //let editItem = this.NP.get("record");
    /* this.unitDetailData.unit_id = editItem.unit_id;
     this.unitDetailData.unitname = editItem.unitname;
     this.unitDetailData.location = editItem.location;
     this.unitDetailData.projectname = editItem.projectname;
     this.unitDetailData.runninghr = editItem.runninghr;
     this.unitDetailData.gen_status = editItem.gen_status;
     this.unitDetailData.nextservicedate = editItem.nextservicedate;*/


    // Get Unit Details from API
    if (this.NP.get("record")) {
      if (this.NP.get("act") != 'Push') {
        //this.selectEntry(this.NP.get("record"));
        this.service_id = this.NP.get("record").service_id;
        if (this.NP.get("act") == 'Add') {

        } else {
          this.service_unitid = this.NP.get("record").service_unitid;
          this.unitDetailData.pageTitle = 'Servicing Info Edit';
          this.isEdited = true;
        }
        console.log("Service Id:" + this.service_id);
        console.log("Service Unit Id:" + this.service_unitid);

        console.log('Not Push');
        let body: string = "serviceid=" + this.service_id,
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/servicebyid";
        console.log(url1);
        this.http.post(url1, body, options1)
          .subscribe((data) => {
            console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
            console.log("Service Details:" + data.json().servicedetail[0]);
            this.selectEntry(data.json().servicedetail[0]);
          }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

      } else {
        console.log('Push');
        console.log("Serviced by id check for push"+this.NP.get("record"));
        let body: string = "serviceid=" + this.NP.get("record"),
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/servicebyid";
        console.log(url1+"?"+body);
        this.http.post(url1, body, options1)
         
          .subscribe((data) => {
            console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
            console.log("Service Details:" + data.json().servicedetail[0]);
            this.selectEntry(data.json().servicedetail[0]);
          }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
      }
       localStorage.setItem("iframeunitId", this.service_unitid);
    }
    console.log('Push');
    

  }
  getPrority(val) {
    this.service_priority = val
  }
  selectEntry(item) {
    this.serviced_by_name = item.serviced_by_name;
    this.serviced_datetime = item.serviced_datetime;
    this.service_subject = item.service_subject;
    this.service_remark = item.service_remark;
    this.photo = item.user_photo;
    this.sdate = item.current_datetime + "(" + item.time_ago + ")";
    // this.requestbutton=1;
    this.next_service_date = item.next_service_date;
    this.service_priority = item.service_priority;
    console.log("X" + this.service_priority);
    if (this.service_priority == "1") {
      this.service_priority_class1 = '';
      console.log("Y");
    } else if (this.service_priority == "2") {
      this.service_priority_class2 = '';
      console.log("Z");
    }
    if (item.is_request > 0) {
      this.is_request = true;
    }
    this.serviced_by_name = item.serviced_by_name;
    this.service_resources = item.service_resources;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.service_resources = item.service_resources;
    this.service_priority = item.service_priority;
    this.requestbutton = item.is_denyo_support;
    console.log("RS"+item.is_request);


    // Unit Details from Push
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

    let index = this.colorListArr.indexOf(item.colorcode); // 1
    console.log("Color Index:" + index);
    let colorvalincrmentone = index + 1;
    let colorcode;
    colorcode = "button" + colorvalincrmentone;
    console.log("Color is" + colorcode);

     this.unitDetailData.unit_id = item.service_unitid;
     localStorage.setItem("unitId", this.unitDetailData.unit_id)
    // this.unitDetailData.unitname = item.unitname;
    // this.unitDetailData.location = item.location;
    // this.unitDetailData.projectname = item.projectname;
    // this.unitDetailData.runninghr = item.runninghr;
    // this.unitDetailData.gen_status = item.gen_status;
    // this.unitDetailData.nextservicedate = item.nextservicedate;
    // this.unitDetailData.lat = item.latitude;
    // this.unitDetailData.lng = item.longtitude;
    // this.unitDetailData.colorcodeindications = colorcode;
    // // Unit Details from Push

    console.log("RQ" + this.is_request);

    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      let hashhypenhash = this.service_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
        this.addedImgListsDetails.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }

      if (this.addedImgListsDetails.length > 9) {
        this.isUploaded = false;
      }
    }

  }
  previous() {

  
    if(this.NP.get("from")=='service')
    {

    this.nav.push(ServicinginfoPage, {
      record: this.NP.get("record")
    });
  }
  else
  {
 this.nav.push(CommentsinfoPage, {
      record: this.NP.get("record")
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
}
