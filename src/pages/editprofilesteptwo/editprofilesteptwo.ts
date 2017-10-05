import { Component, NgZone } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
//import { UserPage } from '../user/user';
//import { UserPage } from '../user/user';
import { EditprofilesteponePage } from '../editprofilestepone/editprofilestepone';
import 'rxjs/add/operator/map';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-editprofilesteptwo',
  templateUrl: 'editprofilesteptwo.html',
  providers: [FileChooser, Transfer, File,Config]
})
export class EditprofilesteptwoPage {
  // Define FormBuilder /model properties
  public userInfo = [];
  public loginas: any;
  public userdata = [];
  public first_name: any;
  public last_name: any;
  public email: any;
  public userId: any;
  public country: any;
  public responseResultCountry: any;
  public contact: any;
  public createdby: any;
  public isSubmitted: boolean = false;
  public photo: any;
  public username: any;
  public password: any;
  public re_password: any;
  public job_position: any;
  public company_group: any;
  public report_to: any;
  public hashtag: any;
  public role: any;
  public form: FormGroup;
  public companygroup_name: any;
  public address: any;
  public responseResultCompanyGroup: any;
  public responseResultReportTo: any;
  progress: number;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network,public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    private transfer: Transfer, private ngZone: NgZone) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "hashtag": ["", Validators.required],
      "country": ["", Validators.required]
    });

    this.userId = localStorage.getItem("userInfoId");
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
    console.log('ionViewDidLoad EditprofilesteptwoPage');
    this.pageLoad();
  }

  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
   this.pageLoad();
  }
   pageLoad()
   {
      this.resetFields();
    this.getJsonCountryListData();
    if (this.NP.get("record")) {
      console.log("User Org Chart:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit User';
      this.readOnly = false;
      this.hideActionButton = true;
      let editItem = this.NP.get("record");
      this.job_position = editItem.job_position;
      this.company_group = editItem.company_id;
      this.report_to = editItem.report_to;
    }
    else {
      this.isEdited = false;
      this.pageTitle = 'Edit User';
    }

    if (this.NP.get("accountInfo")) {
      let info = this.NP.get("accountInfo");

      //var objects = JSON.parse(info);
      console.log("JSON.stringify:" + JSON.stringify(info));
      console.log("Length:" + info.length); console.log("info.first_name" + info.first_name);
      console.log("info.first_name array" + info['first_name']);
      console.log("info.first_name array 0" + info[0]['first_name']);
      let keyindex = info.length - 1;
      this.first_name = info[keyindex]['first_name'];
      this.last_name = info[keyindex]['last_name'];
      this.email = info[keyindex]['email'];
      this.country = info[keyindex]['country'];
      this.contact = info[keyindex]['contact'];
      this.photo = info[keyindex]['photo'];
      this.createdby = info[keyindex]['createdby'];
      this.username = info[keyindex]['username'];
      this.password = info[keyindex]['password'];
      this.hashtag = info[keyindex]['hashtag'];
      this.role = info[keyindex]['role'];
    }
   }


  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    /*this.job_position = item.job_position;
    this.company_group = item.company_id;
    this.report_to = item.report_to;
    this.recordID = item.staff_id;*/
    console.log("Select Entty" + JSON.stringify(item));
  }







  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data

  updateEntry(country, hashtag, userid) {
    this.isSubmitted = true;

   
    let userPhotoFile = localStorage.getItem("userPhotoFile");
    if (userPhotoFile) {
      console.log("Upload Device Image File:" + userPhotoFile);
      this.fileTrans(userPhotoFile);
    }
    this.contact = this.contact.replace("+", "%2B");
    let body: string = "is_mobile=1&loggedin_id=" + userid +
      "&firstname=" + this.first_name +
      "&lastname=" + this.last_name +
      "&photo=" + this.photo +
      "&email=" + this.email +
      "&country_id=" + country +
      "&contact_number=" + this.contact +
      "&createdby=" + this.createdby +
      "&updatedby=" + this.createdby +
      "&username=" + this.username +
      "&password=" + this.password +
      "&personalhashtag=" + hashtag,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/settings/profileupdate";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          if (!userPhotoFile) {
            localStorage.setItem("userPhotoFile", "");
            this.conf.sendNotification(`User profile successfully updated`);
            this.nav.push(MyaccountPage);
          }
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
  }







  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {

     let isNet = localStorage.getItem("isNet");
    if (isNet == 'offline') {
      this.networkType = this.conf.networkErrMsg();
    } else {
    let country: string = this.form.controls["country"].value,
      hashtag: string = this.form.controls["hashtag"].value;


    this.updateEntry(country, hashtag, this.userId);
    }

  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.companygroup_name = "";
    this.address = "";
    this.country = "";
    this.contact = "";
  }




  fileTrans(path) {
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    const fileTransfer: TransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    this.photo = currentName;
    console.log("File Name is:" + currentName);


    /*var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";*/

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }

    //  http://127.0.0.1/ionic/upload_attach.php
    //http://amahr.stridecdev.com/getgpsvalue.php?key=create&lat=34&long=45
    // this.conf.sendNotification(`profile photo uploaded few minutes redirect to my account page. please wait`);
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/upload.php', options)
      .then((data) => {
        console.log(JSON.stringify(data));
        localStorage.setItem("userPhotoFile", "");
        console.log("UPLOAD SUCCESS:" + data.response);
        let successData = JSON.parse(data.response);
        this.userInfo.push({
          photo: successData
        });
        //this.conf.sendNotification("User photo uploaded successfully");
        this.progress += 5;
        this.isProgress = false;
        // this.isUploadedProcessing = false;
        // return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL

        this.conf.sendNotification(`User profile successfully updated`);
        this.nav.push(MyaccountPage);

      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:");
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

  getJsonCountryListData() {

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/api/countries.php";
    let res;

    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        this.responseResultCountry = res;
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });

  }
  



  previous() {
    this.nav.push(EditprofilesteponePage);
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

