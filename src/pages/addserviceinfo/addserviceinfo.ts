import { Component, ViewChild, NgZone } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
//import { UserPage } from '../user/user';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
//import { UnitgroupPage } from '../unitgroup/unitgroup';
//import { RolePage } from '../role/role';
import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
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
 * Generated class for the AddserviceinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addserviceinfo',
  templateUrl: 'addserviceinfo.html',
  providers: [Camera, Transfer, File, DatePicker, Config]
})
export class AddserviceinfoPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
  public addedServiceImgLists = [];
  progress: number;
  public priority_lowclass: any;
  public priority_highclass: any;
  public isSubmitted: boolean = false;
  public recordID: any;
  public service_unitid: any;
  public service_id: any;
  public dd: any;
  public mm: any;
  public serviced_by: any;
  //public serviced_datetime: any;
  serviced_datetime: String = new Date().toISOString();
  public servicemindate: any;
  public servicemaxdate: any;
  public service_subject: any;
  public isFuture: any;
  public minyr;
  public minmn;
  public mindt;

  public service_remark: any;
  public msgcount: any;
  public notcount: any;
  public next_service_date: any;
  public service_priority: any;
  is_request: boolean
  public serviced_by_name: any;
  public service_resources: any;
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
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  constructor(private conf: Config, public platform: Platform, private network: Network, public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public nav: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera
    , private transfer: Transfer, private ngZone: NgZone) {


    this.isFuture = 0;


    if (this.unitDetailData.nextServiceDate == '') {
      this.isSubmitted = true;
    }

    this.servicemindate = this.minDateStr();
    this.servicemaxdate = this.maxDateStr();


    console.log("Max:" + this.servicemaxdate);

    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");

    this.form = formBuilder.group({
      profilePic: [''],
      serviced_datetime: [''],
      service_subject: ['', Validators.required],
      service_remark: ['', Validators.required],
      serviced_by: ['', Validators.required],
      next_service_date: [''],
      is_request: ['']
    });
    this.service_priority = 0;
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });


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

    //let dateStr1 = new Date();
    //let yearstr1 = dateStr1.getFullYear();
    //let monthstr1 = dateStr1.getMonth() + 1;
    //let datestr1 = dateStr1.getDate();
    //this.serviced_datetime = yearstr1 + "/" + monthstr1 + "/" + datestr1;
    // this.serviced_datetime="2017-09-14";
    //console.log("Default date is"+this.serviced_datetime);
    var date = new Date();
    this.serviced_datetime = date.toISOString();
    this.serviced_datetime = new Date().toJSON().split('T')[0];
    console.log("Default date is" + this.serviced_datetime);

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

  maxDateStr() {

    let today = new Date();
    this.dd = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (this.dd < 10) {
      this.dd = '0' + this.dd
    }

    if (this.mm < 10) {
      this.mm = '0' + this.mm
    }

    this.servicemaxdate = yyyy + '-' + this.mm + '-' + this.dd;

    // this.servicemindate = this.minyr + '-' + this.minmn + '-' + this.mindt
    console.log("Max:" + this.servicemaxdate);
    return this.servicemaxdate;

  }

  minDateStr() {

    let oneWeekAgo = new Date();
    let prevfivedays = oneWeekAgo.setDate(oneWeekAgo.getDate() - 5);
    console.log("Previous five days:" + prevfivedays);

    let dateFormat = new Date(prevfivedays);
    this.servicemindate = dateFormat.getFullYear() + '-' + (dateFormat.getMonth() + 1) + '-' + dateFormat.getDate();
    this.minyr = dateFormat.getFullYear();
    this.minmn = (dateFormat.getMonth() + 1);
    this.mindt = dateFormat.getDate();

    if (this.mindt < 10) {
      this.mindt = '0' + this.mindt;
    }

    if (this.minmn < 10) {
      this.minmn = '0' + this.minmn;
    }
    this.servicemindate = this.minyr + '-' + this.minmn + '-' + this.mindt
    console.log("Min:" + this.servicemindate);
    return this.servicemindate;
  }
  ionViewDidLoad() {
    this.addedServiceImgLists = [];
    console.log('ionViewDidLoad AddserviceinfoPage');
    localStorage.setItem("fromModule", "AddserviceinfoPage");
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

  } v
  ionViewWillEnter() {
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
    // this.getPrority(1);
    //let users = localStorage.getItem("atMentionedStorage");
    this.is_request = false;
    console.log(JSON.stringify(this.NP.get("record")));
    let editItem = this.NP.get("record");
    //this.unitDetailData.unit_id = editItem.unit_id;
    //this.unitDetailData.unitname = editItem.unitname;
    //this.unitDetailData.location = editItem.location;
    //this.unitDetailData.projectname = editItem.projectname;
    this.unitDetailData.runninghr = editItem.runninghr;
    this.unitDetailData.gen_status = editItem.gen_status;
    this.unitDetailData.nextservicedate = editItem.nextservicedate;
    let favorite;
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

    if (this.NP.get("record")) {
      this.selectEntry(this.NP.get("record"));
      this.service_id = this.NP.get("record").service_id;
      if (this.NP.get("act") == 'Add') {
        //this.serviced_datetime = "";
        this.getPrority(0);
        this.service_remark = "";
        this.service_subject = "";
        this.next_service_date = "";
        this.isEdited = false;
        this.unitDetailData.pageTitle = 'Servicing Info Add';
        this.service_unitid = this.NP.get("unit_id");
      } else {
        this.service_unitid = this.NP.get("record").service_unitid;
        this.unitDetailData.pageTitle = 'Servicing Info Edit';
        this.isEdited = true;
         this.isSubmitted = false;
      }


      console.log("Service Id:" + this.service_id);
      console.log("Service Unit Id:" + this.service_unitid);
    }




  }



  takePictureURL(micro_timestamp) {
    this.isUploadedProcessing = true;
    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      this.fileTrans(imageData, micro_timestamp);
      this.addedAttachList = imageData;
    }, (err) => {
      // Handle error
      this.conf.sendNotification(err);
    });
  }

  fileTrans(path, micro_timestamp) {
    const fileTransfer: TransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    console.log("File Name is:" + currentName);

    //YmdHis_123_filename
    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_123_" + n + ".jpg";

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }




    //  http://127.0.0.1/ionic/upload_attach.php
    //http://amahr.stridecdev.com/getgpsvalue.php?key=create&lat=34&long=45
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/fileupload.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {

        // Upload Response is{"bytesSent":1872562,"responseCode":200,"response":"{\"error\":false,\"id\":51}","objectId":""}


        console.log("Upload Response is" + JSON.stringify(data))
        let res = JSON.parse(data.response);
        console.log(res.id);
        console.log(JSON.stringify(res));

        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + newFileName;
        this.addedServiceImgLists.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: newFileName,
          resouce_id: res.id
        });

        //loading.dismiss();
        if (this.addedServiceImgLists.length > 9) {
          this.isUploaded = false;
        }
        this.progress += 5;
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:" + JSON.stringify(err));
        this.conf.sendNotification("Upload Error:" + JSON.stringify(err));
      })
  }

  onProgress = (progressEvent: ProgressEvent): void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 95);
        this.isProgress = true;
        this.progress = progress;
      }
    });
  }

  saveEntry() {
    let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
      console.log(this.form.controls);
      if (this.isUploadedProcessing == false) {
        /* let name: string = this.form.controls["lat"].value,
           description: string = this.form.controls["long"].value,
           photos: object = this.addedImgLists;*/


        let serviced_datetime: string = this.form.controls["serviced_datetime"].value,
          service_remark: string = this.form.controls["service_remark"].value,
          next_service_date: string = this.form.controls["next_service_date"].value,
          serviced_by: string = this.form.controls["serviced_by"].value,
          is_request: string = this.form.controls["is_request"].value,
          service_subject: string = this.form.controls["service_subject"].value;
        console.log("serviced_datetime:" + serviced_datetime);
        console.log("service_remark:" + service_remark);
        console.log("serviced_by:" + serviced_by);
        console.log("is_request:" + is_request);
        console.log("service_subject:" + service_subject);
        console.log("nextServiceDate:" + this.unitDetailData.nextServiceDate);

        //let d = new Date();
        //let micro_timestamp = d.getFullYear() + "" + d.getMonth() + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
        if (this.isEdited) {
          this.updateEntry(serviced_datetime, service_remark, next_service_date, serviced_by, this.is_request, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
        }
        else {
          this.createEntry(serviced_datetime, service_remark, next_service_date, serviced_by, this.is_request, service_subject, this.addedServiceImgLists, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
        }
      }
    }
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(serviced_datetime, service_remark, next_service_date, serviced_by, is_request, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;
    service_remark = localStorage.getItem("atMentionResult");


    if (this.service_priority == undefined) {
      this.service_priority = '0';
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = '0';
    }

    if (nextServiceDate == 'undefined') {
      nextServiceDate = '';
    }
    if (nextServiceDate == undefined) {
      nextServiceDate = '';
    }
    if (serviced_datetime == 'undefined') {

      this.serviced_datetime = new Date().toJSON().split('T')[0];
      console.log("service datetime for form entry is 1" + this.serviced_datetime);
      serviced_datetime = this.serviced_datetime
    }
    if (serviced_datetime == undefined) {
      this.serviced_datetime = new Date().toJSON().split('T')[0];
      console.log("service datetime for form entry is 2" + this.serviced_datetime);
      serviced_datetime = this.serviced_datetime
    }

    let body: string = "is_mobile=1" +
      "&service_priority=" + this.service_priority +
      "&service_unitid=" + this.service_unitid +
      "&serviced_datetime=" + serviced_datetime +
      "&service_remark=" + service_remark +
      "&next_service_date=" + nextServiceDate +
      "&is_denyo_support=0" +
      "&serviced_by=" + this.unitDetailData.userId +
      "&is_request=" + is_request +
      "&service_subject=" + service_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      //"&nextServiceDate=" + nextServiceDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/store";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.service_subject = '';
          this.service_remark = '';
          this.addedServiceImgLists = [];
          localStorage.setItem("microtime", "");
          this.addedServiceImgLists = [];
          this.conf.sendNotification(`Servicing info was successfully added`);
          localStorage.setItem("atMentionResult", '');
          this.nav.push(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(serviced_datetime, service_remark, next_service_date, serviced_by, is_request, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;
    if (localStorage.getItem("atMentionResult") != '') {
      service_remark = localStorage.getItem("atMentionResult");
    }
    if (this.service_priority == undefined) {
      this.service_priority = 0;
    }
    if (this.service_priority == 'undefined') {
      this.service_priority = 0;
    }
    if (nextServiceDate == 'undefined') {
      nextServiceDate = '';
    }
    if (nextServiceDate == undefined) {
      nextServiceDate = '';
    }
    let body: string = "is_mobile=1&service_id=" + this.service_id +
      "&serviced_datetime=" + serviced_datetime +
      "&service_priority=" + this.service_priority +
      "&service_unitid=" + this.service_unitid +
      "&service_remark=" + service_remark +
      "&next_service_date=" + nextServiceDate +
      "&is_denyo_support=0" +
      "&serviced_by=" + this.unitDetailData.userId +
      "&is_request=" + is_request +
      "&service_subject=" + service_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedServiceImgLists),

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/update";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          localStorage.setItem("microtime", "");
          this.addedServiceImgLists = [];
          this.service_subject = '';
          this.service_remark = '';
          this.addedServiceImgLists = [];
          this.conf.sendNotification(`Servicing info  was successfully updated`);
          localStorage.setItem("atMentionResult", '');
          this.nav.push(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }

  getNextDate(val, field) {
    console.log('1' + val);
    let date;
    if (val > 0) {
      date = this.addDays(val);
    } else {
      this.showDatePicker();
    }
    if (field == '1') {
      this.serviced_datetime = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    } else {
      this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getDate();
    }
    if (this.unitDetailData.nextServiceDate != '') {
      this.isSubmitted = false;
    } else {
      this.isSubmitted = true;
    }
  }

  getPrority(val) {
    this.priority_highclass = '';
    this.priority_lowclass = '';
    if (val == "2") {
      this.priority_highclass = "border_high";
    }
    if (val == "1") {
      this.priority_lowclass = "border_low";
    }
    this.service_priority = val
  }

  addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  subDays(days) {
    let result = new Date();
    result.setDate(result.getDate() - days);
    console.log("SubDays Function Result is:" + result);
    return result;
  }
  showDatePicker() {
    this.isSubmitted = false;
    console.log("showDatePicker:" + this.servicemaxdate);
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      maxDate: new Date(),
      allowOldDates: false,
      doneButtonColor: '#F2F3F4',
      cancelButtonColor: '#000000',
      allowFutureDates: true,
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => {

        let monthstr = date.getMonth() + parseInt("1");

        console.log('Got date: ', date);
        console.log(new Date().getTime() + "<" + date.getTime());
        if (new Date().getTime() < date.getTime()) {
          this.isFuture = 0;
          this.isSubmitted = false;
          console.log("Future Dates");
          this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + monthstr + "-" + date.getDate();
        } else {
          this.isFuture = 1;
          this.isSubmitted = true;
          console.log("Old Dates");
          this.unitDetailData.nextServiceDate = '';
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  address1get(hashtag) {
    console.log(hashtag);
    this.unitDetailData.hashtag = hashtag;
  }



  previous() {
    this.addedServiceImgLists = [];
    if (this.NP.get("from") == 'service') {
      this.nav.push(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
    else if (this.NP.get("from") == 'comment') {
      this.nav.push(CommentsinfoPage);
    }
    else {
      this.nav.push(ServicinginfoPage, {
        record: this.NP.get("record")
      });
    }
  }






  selectEntry(item) {   
    this.serviced_by = item.serviced_by;
    this.serviced_datetime = item.serviced_datetime;
    console.log("Service Date Time:" + this.serviced_datetime);
    if (this.serviced_datetime == "0000-00-00") {
      this.serviced_datetime = '';
    }
    this.service_subject = item.service_subject;
    this.service_remark = item.service_remark;
    //this.next_service_date = item.next_service_date;
    this.service_priority = item.service_priority;
    console.log("X" + this.service_priority);
    if (this.service_priority == "1") {
      this.priority_lowclass = "border_low";

    } else if (this.service_priority == "2") {

      this.priority_highclass = "border_high";
    }
    if (item.is_request > 0) {
      this.is_request = true;
    }
    this.serviced_by_name = item.serviced_by_name;
    this.service_resources = item.service_resources;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.service_resources = item.service_resources;

    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      let hashhypenhash = this.service_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
        this.addedServiceImgLists.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }




      if (this.addedServiceImgLists.length > 9) {
        this.isUploaded = false;
      }
    }

    if (this.NP.get("act") == 'Add') {
      console.log("Fresh Clear add service info.ts start...");
      this.addedServiceImgLists = [];
      this.addedServiceImgLists.length = 0;
      this.unitDetailData.nextServiceDate = '';
      this.is_request = false;
      this.service_remark = '';
      this.service_subject = '';
      localStorage.setItem("microtime", "");
    }
  }
  doRemoveResouce(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          if (id != undefined) {
            this.deleteEntry(id);
          }
          for (let q: number = 0; q < this.addedServiceImgLists.length; q++) {
            if (this.addedServiceImgLists[q] == item) {
              this.addedServiceImgLists.splice(q, 1);
            }
          }

          console.log("After Deleted" + JSON.stringify(this.addedServiceImgLists));
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
      url: any = this.apiServiceURL + "/" + recordID + "/removeresource";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.conf.sendNotification(`Congratulations file was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
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


  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Attention',

      message: 'Be requesting for Denyo Service Support',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.is_request = true;
            console.log('Confirm clicked');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.is_request = false;
            console.log('Cancel clicked');
          }
        }
      ],
      cssClass: 'alertDanger'
    });
    confirm.present();
  }

}
