import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EditprofilesteptwoPage } from '../editprofilesteptwo/editprofilesteptwo';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-editprofilestepone',
  templateUrl: 'editprofilestepone.html',
  providers: [Camera,Config]
})
export class EditprofilesteponePage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public first_name: any;
  public last_name: any;
  public email: any;
  public username: any;
  public borderbottomredvalidation: any;
  public password: any;
  public re_password: any;
  public photo: any;
  public country: any;
  public primary: any;
  public contact: any;
  public userId: any;
  public userid: any;
  public hashtag: any;

  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public addedImgLists: any;
  public job_position: any;
  public userInfo = [];
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  public isUploadedProcessing: boolean = false;
  public uploadResultBase64Data;
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  public networkType: string;
  constructor(private conf: Config, public platform: Platform, private network: Network,public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder, private camera: Camera) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      //"first_name": ["", Validators.required],
      //"last_name": ["", Validators.required],
      "first_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "last_name": ["", Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      "username": ["", Validators.required],
      "password": ["", Validators.required],
      "contact": ["", Validators.required],
      "primary": ["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(5)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])]
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
    console.log('ionViewDidLoad EditprofilesteponePage');
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
    this.pageTitle = 'Edit Profile';

    let userInf = localStorage.getItem("userInfo");
    console.log("User Information Storage:" + JSON.stringify(userInf));
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/settings/profile?is_mobile=1&loggedin_id=" + this.userId;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.settings.length);
        console.log("2" + res.settings);
        this.first_name = res.settings[0].firstname;
        this.last_name = res.settings[0].lastname;
        console.log(res.settings[0].firstname);
        this.username = res.settings[0].username;
        this.contact = res.settings[0].contact_number;
        if (this.contact != undefined) {
          let contactSplitSpace = this.contact.split(" ");
          this.primary = contactSplitSpace[0];
          this.contact = contactSplitSpace[1];
        }

        this.email = res.settings[0].email;
        this.email = res.settings[0].email;
        this.password = res.settings[0].password;
        this.re_password = res.settings[0].password;
        this.hashtag = "@" + this.username;
        this.country = res.settings[0].country_id;
        console.log(res.settings[0].country_name);
        if (res.settings[0].photo_filename != '' && res.settings[0].photo_filename != 'undefined' && res.settings[0].photo_filename != undefined) {
          this.addedImgLists = this.apiServiceURL + "/staffphotos/" + res.settings[0].photo_filename;
          this.photo = res.settings[0].photo_filename;
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
}

 getPrimaryContact(ev) {
    console.log(ev.target.value);
    let char = ev.target.value.toString();
    if (char.length > 5) {
      console.log('Reached five characters above');
      this.borderbottomredvalidation = 'border-bottom-validtion';
    } else {
      console.log('Reached five characters below');
      this.borderbottomredvalidation = '';
    }
  }
  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  //first_name, last_name, email, username,password, contact, this.userId
  updateEntry(first_name, last_name, email, username, password, contact, createdby) {
    this.userInfo.push({
      photo: this.photo,
      first_name: first_name,
      last_name: last_name,
      email: email,
      username: username,
      password: password,
      contact: contact,
      createdby: createdby,
      hashtag: this.hashtag,
      country: this.country
    });
    this.nav.push(EditprofilesteptwoPage, {
      accountInfo: this.userInfo,
      record: this.NP.get("record")
    });
  }



  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry() {
    let first_name: string = this.form.controls["first_name"].value,
      body: string = "key=delete&recordID=" + this.recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/api/companygroup.php";

    this.http.post(url, body, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.conf.sendNotification(`Congratulations the company group: ${first_name} was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
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
    let first_name: string = this.form.controls["first_name"].value,
      last_name: string = this.form.controls["last_name"].value,
      username: string = this.form.controls["username"].value,
      password: string = this.form.controls["password"].value,
      email: string = this.form.controls["email"].value,
      contact: string = this.form.controls["contact"].value,
      primary: string = this.form.controls["primary"].value;
    contact = primary + " " + contact;
    console.log("Contact Concatenate" + contact);
    console.log(this.form.controls);
    if (this.isUploadedProcessing == false) {
      this.updateEntry(first_name, last_name, email, username, password, contact, this.userId);
    }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.first_name = "";
    this.last_name = "";
    this.email = "";
    this.country = "";
    this.contact = "";
  }



  doUploadPhoto() {
    this.isUploadedProcessing = true;
    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      localStorage.setItem("userPhotoFile", imageData);
      this.uploadResultBase64Data = imageData;
      this.addedImgLists = imageData;
      this.isUploadedProcessing = false;
      return false;
    }, (err) => {
      // Handle error
      this.conf.sendNotification(err);
    });
  }



  previous() {
    this.nav.push(MyaccountPage);
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

