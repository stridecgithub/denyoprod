import { Component, ViewChild, NgZone } from '@angular/core';
import { ActionSheetController, AlertController, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
//import { UserPage } from '../user/user';
import { DashboardPage } from '../dashboard/dashboard';
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
import { Keyboard } from '@ionic-native/keyboard';
import { OrgchartPage } from '../orgchart/orgchart';
import { AtMentionedPopoverPage } from '../atmentionedpopover/atmentionedpopover';
import { PopoverController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Config } from '../../config/config';
/**
 * Generated class for the AddserviceinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
  providers: [Camera, FileChooser, Transfer, File, DatePicker, Keyboard, Config]
})
export class EmailPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  public photoInfo = [];
  public actionId = [];
  public uploadResultBase64Data;
  public inboxLists = [];
  public sendLists = [];
  public loginas: any;
  public hashtag;
  public photo: any;
  public mdate: any;
  public act: any;
  public sendact: any;
  public inboxact: any;
  public priority_lowclass: any;
  public priority_highclass: any;
  public addedImgListsArray = [];
  public addedImgLists = [];
  public attachedFileLists = [];
  private apiServiceURL: string = "";
  private permissionMessage: string = "";
  private popoverThemeJSIonic: any;
  public networkType: string;
  public composemessagecontent: any;
  progress: number;
  public personalhashtag;
  public personalhashtagreplaceat;
  public receiver_id;
  public receiver_idreplaceat;
  public pageTitle: any;
  pet: string = "";
  choice: string = "inbox";
  public recordID: any;
  public userId: any;
  public companyId: any;
  public str: any;
  public strsend: any;
  public strinbox: any;
  public service_id: any;
  public serviced_by: any;
  public messageid: any;
  public serviced_datetime: any;
  public isSubmitted: boolean = false;
  public messages_subject: any;
  public messages_body: any;
  public next_service_date: any;
  public message_priority: any;
  public isReply: any;
  copytome: any;
  public serviced_by_name: any;
  public service_resources: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  public selectedAction = [];
  public message_readstatus: any;
  public replyforward: any;
  item: any;
  public senderid: any;

  // Authority for message send
  public MESSAGESENTVIEWACCESS;
  public MESSAGESENTCREATEACCESS;
  public MESSAGESENTEDITACCESS;
  public MESSAGESENTDELETEACCESS;
  // Authority for message send
  // Authority for message inbox
  public MESSAGEINBOXVIEWACCESS;
  public MESSAGEINBOXCREATEACCESS;
  public MESSAGEINBOXEDITACCESS;
  public MESSAGEINBOXDELETEACCESS;
  // Authority for message inbox

  public msgcount: any;
  public
  public notcount: any;
  public to: any;
  public subject: any;
  public isEdited: boolean = false;
  form: FormGroup;
  public addedAttachList;
  public totalCount;
  public totalCountSend;
  valueforngif = true;
  public inboxData: any =
  {
    status: '',
    sort: 'messages_id',
    sortascdesc: 'desc',
    startindex: 0,
    results: 50
  }
  public sendData: any =
  {
    status: '',
    sort: 'messages_id',
    sortascdesc: 'desc',
    startindex: 0,
    results: 50
  }
  public hideActionButton = true;
  constructor(private conf: Config, public platform: Platform, private network: Network, public actionSheetCtrl: ActionSheetController, public popoverCtrl: PopoverController, public keyboard: Keyboard, private file: File, public http: Http, public alertCtrl: AlertController, public NP: NavParams, public nav: NavController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, private filechooser: FileChooser,
    private transfer: Transfer,
    private ngZone: NgZone) {
    this.replyforward = 0;
    this.priority_highclass = '';
    this.priority_lowclass = '';
    // Authority for message send
    this.MESSAGESENTVIEWACCESS = localStorage.getItem("MESSAGE_SENT_VIEW");
    this.MESSAGESENTCREATEACCESS = localStorage.getItem("MESSAGE_SENT_CREATE");
    this.MESSAGESENTEDITACCESS = localStorage.getItem("MESSAGE_SENT_EDIT");
    this.MESSAGESENTDELETEACCESS = localStorage.getItem("MESSAGE_SENT_DELETE");
    // Authority for message send
    // Authority for message inbox
    this.MESSAGEINBOXVIEWACCESS = localStorage.getItem("MESSAGE_INBOX_VIEW");
    this.MESSAGEINBOXCREATEACCESS = localStorage.getItem("MESSAGE_INBOX_CREATE");
    this.MESSAGEINBOXEDITACCESS = localStorage.getItem("MESSAGE_INBOX_EDIT");
    this.MESSAGEINBOXDELETEACCESS = localStorage.getItem("MESSAGE_INBOX_DELETE");
    // Authority for message inbox

    this.priority_highclass = '';
    this.priority_lowclass = '';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.str = '';
    this.form = formBuilder.group({
      subject: ['', Validators.required],
      composemessagecontent: ['', Validators.required],
      to: ['', Validators.required],
      copytome: ['']

    });
    this.message_priority = 0;
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
    this.networkType = '';
    this.permissionMessage = conf.rolePermissionMsg();
    this.apiServiceURL = conf.apiBaseURL();
    this.popoverThemeJSIonic = conf.popoverThemeJSIonic();
    this.networkType = '';
    this.platform.ready().then(() => {
      this.network.onConnect().subscribe(data => {
        console.log("email.ts Platform ready-onConnent:" + data.type);
        localStorage.setItem("isNet", 'online');
        this.networkType = '';
      }, error => console.error(error));
      this.network.onDisconnect().subscribe(data => {
        console.log("email.ts Platform ready-onDisconnect:" + data.type);
        localStorage.setItem("isNet", 'offline');
        this.networkType = this.conf.networkErrMsg();
      }, error => console.error(error));

      let isNet;
      if (isNet == 'offline') {
        this.networkType = this.conf.networkErrMsg();
      } else {
        this.networkType = '';
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddserviceinfoPage');

  }


  presentPopover(myEvent) {
    console.log("myEvent" + myEvent.target.value);
    let charsplit = myEvent.target.value.split(" ");
    let lastchar = charsplit[charsplit.length - 1];
    let lastword = charsplit.pop();
    console.log("Last Word is :" + lastword);
    if (lastchar == '@') {

      // API Call Here
      let //body: string = "loginid=" + this.userId,
        type: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers: any = new Headers({ 'Content-Type': type }),
        options: any = new RequestOptions({ headers: headers }),
        url: any = this.apiServiceURL + "/api/atmentionedionic.php?method=atmention&id=1&tem=&act=message&companyId=" + this.companyId + "&userId=" + this.userId;
      console.log(url);
      // console.log(body);
      let popover;
      this.http.get(url, options)
        .subscribe((data) => {
          console.log("At Mentioned Response Success:" + JSON.stringify(data.json()));
          popover = this.popoverCtrl.create(AtMentionedPopoverPage, { data: data.json() });
          popover.present({
            ev: myEvent,
          });

          popover.onWillDismiss(data => {
            console.log(JSON.stringify(data));
            console.log("A");
            if (data == null) {
              data = '';
            }
            if (data == 'null') {
              data = '';
            }
            if (data != '') {
              console.log("B");
              this.to = this.to + "" + data;
            } else {
              console.log("C");
              this.to = this.to + "" + data;
            }
          });

        });
      // API Call Here

    }
  }

  ionViewDidEnter() {

    this.pageTitle = 'Message';
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
    this.keyboard.onKeyboardShow().subscribe(() => { this.valueforngif = false })
    this.keyboard.onKeyboardHide().subscribe(() => { this.valueforngif = true })
  }

  /*******************/
  /* Pull to Refresh */
  /*******************/
  doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.inboxData.startindex = 0;
    this.inboxLists = [];
    this.doInbox();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  doSendRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.sendData.startindex = 0;
    this.sendLists = [];
    this.doSend();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  /**********************/
  /* Infinite scrolling */
  /**********************/
  doInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCount)
    if (this.inboxData.startindex < this.totalCount && this.inboxData.startindex > 0) {
      console.log('B');
      this.doInbox();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }


  doSendInfinite(infiniteScroll) {
    console.log('InfinitScroll function calling...');
    console.log('A');
    console.log("Total Count:" + this.totalCountSend)
    if (this.sendData.startindex < this.totalCountSend && this.sendData.startindex > 0) {
      console.log('B');
      this.doSend();
    }
    console.log('C');
    setTimeout(() => {
      console.log('D');
      infiniteScroll.complete();
    }, 500);
    console.log('E');
  }


  /****************************/
  /*@doCompanyGroup calling on report */
  /****************************/
  doInbox() {
    //this.conf.presentLoading(1);
    if (this.inboxData.status == '') {
      this.inboxData.status = "messages_id";
    }
    if (this.inboxData.sort == '') {
      this.inboxData.sort = "messages_id";
    }

    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages?is_mobile=1&startindex=" + this.inboxData.startindex + "&results=" + this.inboxData.results + "&sort=" + this.inboxData.sort + "&dir=" + this.inboxData.sortascdesc + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.messages.length);
        console.log("2" + res.messages);
        if (res.messages.length > 0) {
          this.inboxLists = res.messages;
          this.totalCount = res.totalCount;
          this.inboxData.startindex += this.inboxData.results;
          //this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCount = 0;
          //this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCount);

      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    // this.conf.presentLoading(0);
  }


  doSend() {
    //this.conf.presentLoading(1);
    if (this.sendData.status == '') {
      this.sendData.status = "messages_id";
    }
    if (this.sendData.sort == '') {
      this.sendData.sort = "messages_id";
    } let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/sentitems?is_mobile=1&startindex=" + this.sendData.startindex + "&results=" + this.sendData.results + "&sort=" + this.sendData.sort + "&dir=" + this.sendData.sortascdesc + "&loginid=" + this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.messages.length);
        console.log("2" + res.messages);
        if (res.messages.length > 0) {
          this.sendLists = res.messages;
          this.totalCountSend = res.totalCount;
          this.sendData.startindex += this.sendData.results;
          //this.loadingMoreDataContent = 'Loading More Data';
        } else {
          this.totalCountSend = 0;
          //this.loadingMoreDataContent = 'No More Data';
        }
        console.log("Total Record:" + this.totalCountSend);

      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
    //this.conf.presentLoading(0);
  }


  onSendSegmentChanged(val) {
    if (val != '') {
      if (this.sendData.status == '') {
        this.sendData.status = "messages_id";
      }
      if (this.sendData.sort == '') {
        this.sendData.sort = "messages_id";
      }

      console.log('Send Item segment calling....');
      let splitdata = val.split(",");
      this.sendData.sort = splitdata[0];
      this.sendData.sortascdesc = splitdata[1];
      this.sendData.startindex = 0;
      this.doSend();
    }
  }


  onSegmentChanged(val) {
    if (val != '') {
      if (this.inboxData.status == '') {
        this.inboxData.status = "messages_id";
      }
      if (this.inboxData.sort == '') {
        this.inboxData.sort = "messages_id";
      }
      console.log('Inobox segment calling....');
      let splitdata = val.split(",");
      this.inboxData.sort = splitdata[0];
      this.inboxData.sortascdesc = splitdata[1];
      this.inboxData.startindex = 0;
      this.doInbox();
    }
  }

  ionViewWillEnter() {
    this.pageTitle = 'Messsage';
    this.getPrority(0);
    this.copytome = 0;
    console.log(JSON.stringify(this.NP.get("record")));
    this.choice = 'inbox';
    // if (this.NP.get("recordemail") != '') {
    //   this.choice = 'compose';
    //   this.to = this.NP.get("recordemail");
    // }

    if (this.NP.get("record")) {
      if (this.NP.get("act") != 'Push') {
        this.selectEntry(this.NP.get("record"));
        this.service_id = this.NP.get("record").service_id;
        if (this.NP.get("act") == 'Add') {
          this.isEdited = false;
          this.pageTitle = 'Message';

        } else {

          this.pageTitle = 'Message';
          this.isEdited = true;
        }
        console.log("Service Id:" + this.service_id);
      } else {

        let bodymessage: string = "messageid=" + this.NP.get("record"),
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/getmessagedetails";
        console.log(url1 + '?' + bodymessage);
        this.http.post(url1, bodymessage, options1)
          //this.http.get(url1, options1)
          .subscribe((data) => {
            this.doDetails(data.json().messages[0], 'inbox')
            this.act = 'inbox'
            console.log("Message Response Success:" + JSON.stringify(data.json()));
            console.log("Message Details:" + data.json().messages[0]);
            this.selectEntry(data.json().messages[0]);
          }, error => {
            this.networkType = this.conf.serverErrMsg();// + "\n" + error;
          });
      }

    }



    this.inboxData.startindex = 0;
    this.inboxData.sort = "messages_id";
    this.inboxData.sortascdesc = "desc"
    this.sendData.startindex = 0;
    this.sendData.sort = "messages_id";
    this.inboxData.sortascdesc = "desc"
    if (this.networkType == '') {
      this.doInbox();
      this.doSend();
    }


  }




  fileChooser(micro_timestamp) {


    let actionSheet = this.actionSheetCtrl.create({
      title: 'Attachment',
      buttons: [
        {
          text: 'From File',
          role: 'fromfile',
          handler: () => {
            console.log('From File clicked');

            this.isUploadedProcessing = true;
            this.filechooser.open()
              .then(
              uri => {
                console.log(uri);
                this.fileTrans(uri, micro_timestamp);
                this.addedAttachList = uri;
              }

              )
              .catch(e => console.log(e));
          }
        }, {
          text: 'From Camera',
          handler: () => {
            console.log('Camera clicked');

            /*const options: CameraOptions = {
              quality: 75,
              destinationType: this.camera.DestinationType.FILE_URI,
              targetWidth: 200,
              targetHeight: 200,
              sourceType: 1
            }*/

            const options: CameraOptions = {
              quality: 25,
              destinationType: this.camera.DestinationType.FILE_URI,
              sourceType: 1,
              // allowEdit: true,
              targetWidth: 200,
              targetHeight: 200,
              saveToPhotoAlbum: true
              //encodingType: this.camera.EncodingType.JPEG,
              //saveToPhotoAlbum: true

            };

            this.camera.getPicture(options).then((uri) => {
              /* console.log(imageData);
               localStorage.setItem("userPhotoFile", imageData);
               //this.fileTrans(imageData);
 
               this.uploadResultBase64Data = imageData;
               this.addedImgLists = imageData;
               this.isUploadedProcessing = false;
               return false;*/

              console.log(uri);
              this.fileTrans(uri, micro_timestamp);
              this.addedAttachList = uri;
            }, (err) => {
              // Handle error
              this.conf.sendNotification(err);
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }




  fileTrans(path, micro_timestamp) {
    let fileName = path.substr(path.lastIndexOf('/') + 1);
    const fileTransfer: TransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    console.log("File Name is:" + currentName);

    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_123_" + n + currentName;



    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }
    fileTransfer.onProgress(this.onProgress);
    // fileTransfer.upload(path, this.baseURI + '/api/upload_attach.php', options)
    fileTransfer.upload(path, this.apiServiceURL + '/api/upload_attach.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {
        console.log("UPLOAD SUCCESS:" + data.response);
        let successData = JSON.parse(data.response);
        this.conf.sendNotification("File attached successfully");
        console.log('http:' + '//' + successData.baseURL + '/' + successData.target_dir + '/' + successData.fileName);
        let imgSrc;
        if (successData.ext == 'jpg') {

          imgSrc = 'img/img.png';
          /* this.addedImgLists.push({
               imgSrc: imgSrc,
               file: successData.fileName
           });*/
          this.addedImgLists.push({
            imgSrc: imgSrc,
            imgDateTime: new Date(),
            fileName: newFileName
          });
        } else {
          if (successData.ext == 'pdf') {
            imgSrc = 'img/pdf.png';
            // imgSrc = '<ion-icon name="document"></ion-icon>';
          }
          if (successData.ext == 'doc' || successData.ext == 'docx') {
            imgSrc = 'img/doc.png';
            //imgSrc = '<ion-icon name="document"></ion-icon>';
          }
          if (successData.ext == 'xls' || successData.ext == 'xlsx') {
            imgSrc = 'img/xls.png';
            //imgSrc = '<ion-icon name="document"></ion-icon>';
          }
          if (successData.ext == 'ppt' || successData.ext == 'pptx') {
            imgSrc = 'img/ppt.png';
            //imgSrc = '<ion-icon name="document"></ion-icon>';
          }
          this.addedImgLists.push({
            imgSrc: imgSrc,
            file: fileName
          });
        }
        localStorage.setItem('fileAttach', JSON.stringify(this.addedImgLists));
        if (this.addedImgLists.length > 9) {
          this.isUploaded = false;
        }
        this.progress += 5;
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;
      }, (err) => {
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

    console.log(this.form.controls);
    if (this.isUploadedProcessing == false) {
      /* let name: string = this.form.controls["lat"].value,
         description: string = this.form.controls["long"].value,
         photos: object = this.addedImgLists;*/


      let to: string = this.form.controls["to"].value,
        copytome: string = this.form.controls["copytome"].value,
        composemessagecontent: string = this.form.controls["composemessagecontent"].value,
        subject: string = this.form.controls["subject"].value;
      console.log("serviced_datetime:" + to);
      console.log("copytome:" + copytome);
      console.log("messages_subject:" + subject);

      console.log("Attached image for file for reply and forward" + JSON.stringify(this.attachedFileLists));
      console.log("Image Data" + JSON.stringify(this.addedImgLists));
      //let d = new Date();
      //let micro_timestamp = d.getFullYear() + "" + d.getMonth() + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
      /*
            let tolocalstorage = localStorage.getItem('mentionedSelection');
            console.log("Local Storage To:"+tolocalstorage)
            if (tolocalstorage != '') {
              to = localStorage.getItem('mentionedSelection');
            }*/
      console.log("To Final:" + to);

      this.createEntry(this.micro_timestamp, to, copytome, composemessagecontent, subject);

    }
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(micro_timestamp, to, copytome, composemessagecontent, subject) {
    this.isSubmitted = true;
    if (copytome == true) {
      copytome = '1';
    }
    if (localStorage.getItem("atMentionResult") != '') {
      to = localStorage.getItem("atMentionResult");
    }
    console.log("atMentionResult" + to);
    let param;
    let urlstring;
    console.log("is reply forward and this.messageid" + this.replyforward + " " + this.messageid);
    console.log("Is reply?" + this.isReply);
    if (this.replyforward > 0) {

      let isrepfor;
      if (this.isReply > 0) {
        isrepfor = 'Reply';
      } else {
        isrepfor = 'forward';
      }

      param = "is_mobile=1" +
        "&important=" + this.message_priority +
        "&microtime=" + micro_timestamp +
        "&loginid=" + this.userId +
        "&to=" + to +
        "&composemessagecontent=" + composemessagecontent +
        "&copytome=" + copytome +
        "&submit=" + isrepfor +
        "&forwardmsgid=" + this.messageid +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/replyforward";
    } else {
      param = "is_mobile=1" +
        "&important=" + this.message_priority +
        "&microtime=" + micro_timestamp +
        "&loginid=" + this.userId +
        "&to=" + to +
        "&composemessagecontent=" + composemessagecontent +
        "&copytome=" + copytome +
        "&subject=" + subject;
      urlstring = this.apiServiceURL + "/messages/store";
    }
    let body: string = param,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstring;
    console.log("Message sending API" + url + "?" + body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.replyforward = 0;
          localStorage.setItem("microtime", "");
          this.conf.sendNotification(`Message sending successfully`);
          localStorage.setItem("atMentionResult", '');
          this.inboxData.startindex = 0;
          this.inboxLists = [];
          this.sendData.startindex = 0;
          this.sendLists = [];
          this.addedImgLists = [];
          this.to = '';
          this.copytome = 0;
          this.getPrority(0);
          this.subject = '';
          this.choice = 'send';
          this.doSend();
          this.doInbox();
          this.composemessagecontent = "";
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      });
  }



  inb() {
    this.inboxData.startindex = 0;
    this.doInbox();
  }

  snd() {
    this.sendData.startindex = 0;
    this.doSend();
  }



  getPrority(val) {
    console.log(val);
    this.priority_highclass = '';
    this.priority_lowclass = '';
    if (val == "2") {
      this.priority_highclass = "border_high";
    }
    if (val == "1") {
      this.priority_lowclass = "border_low";
    }


    this.message_priority = val
  }

  addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

  address1get(hashtag) {
    console.log(hashtag);
    this.hashtag = hashtag;
  }



  previous() {
    console.log("A" + this.act); // inbox
    console.log("B" + this.choice); // details
    if (this.act == 'send' && this.choice == 'details') {
      this.choice = 'send';
      console.log("C" + this.choice);
    } else if (this.act == 'inbox' && this.choice == 'details') {
      console.log("D" + this.choice);
      this.choice = 'inbox';
    } else if (this.act == 'inbox' && this.choice == 'inbox') {
      console.log("E" + this.choice);
      this.nav.push(DashboardPage);
    } else if (this.choice == 'send' && this.act == 'send') {
      console.log("F" + this.choice);
      this.nav.push(DashboardPage);
    } else {
      console.log("G" + this.choice);
      this.nav.push(DashboardPage);
    }
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
  selectEntry(item) {
    console.log(JSON.stringify(item));
    this.serviced_by = item.serviced_by;
    this.serviced_datetime = item.serviced_datetime;
    this.messages_subject = item.messages_subject;
    this.messages_body = item.message_body;
    this.messageid = item.message_id;
    this.personalhashtag = item.personalhashtag;
    this.personalhashtagreplaceat = item.personalhashtag.replace("@", "");
    this.photo = item.senderphoto;
    this.mdate = item.message_date + "(" + item.time_ago + ")";
    //this.message_readstatus=item.message_readstatus;
    this.receiver_id = item.receiver_id;
    this.receiver_idreplaceat = item.receiver_id.replace("@", "");
    this.senderid = item.sender_id;


    //this.next_service_date = item.next_service_date;
    this.message_priority = item.message_priority;


    /*
        if (this.message_priority == "1") {
          this.priority_lowclass = "border_low";
    
        } else if (this.message_priority == "0") {
          this.priority_lowclass = "border_low";
    
        } else if (this.message_priority == "2") {
          this.priority_highclass = "border_high";
        }
    */

    if (this.message_priority == "1") {
      this.priority_lowclass = "border_low";

    } else if (this.message_priority == "2") {

      this.priority_highclass = "border_high";
    }



    this.serviced_by_name = item.serviced_by_name;
    this.service_resources = item.service_resources;

    this.service_resources = item.attachments;

    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      let hashhypenhash = this.service_resources.split("#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i];
        console.log("1" + imgDataArr);
        console.log("2" + JSON.stringify(imgDataArr));
        let filepath;
        filepath = this.apiServiceURL + "/attachments" + '/' + imgDataArr;
        let ext = imgDataArr.split('.').pop();

        let imgSrc;
        if (ext == 'jpg') {
          imgSrc = 'img/img.png';
        }
        if (ext == 'png') {
          imgSrc = 'img/img.png';
        }
        if (ext == 'pdf') {
          imgSrc = 'img/pdf.png';
          // imgSrc = '<ion-icon name="document"></ion-icon>';
        }
        if (ext == 'doc' || ext == 'docx') {
          imgSrc = 'img/doc.png';
          //imgSrc = '<ion-icon name="document"></ion-icon>';
        }
        if (ext == 'xls' || ext == 'xlsx') {
          imgSrc = 'img/xls.png';
          //imgSrc = '<ion-icon name="document"></ion-icon>';
        }
        if (ext == 'ppt' || ext == 'pptx') {
          imgSrc = 'img/ppt.png';
          //imgSrc = '<ion-icon name="document"></ion-icon>';
        }


        //<ion-icon (click)="fileChooser(micro_timestamp)" *ngIf="isUploaded" name="attach" style="color: black;position: relative;top: 5px;left: 10px;font-size:20px"></ion-icon>'+'<a href="#" (click)=download('+filepath+')'
        this.attachedFileLists.push({
          imgSrc: imgSrc,
          file: imgDataArr,
          filepath: filepath
        });

        console.log(JSON.stringify(this.attachedFileLists));
      }

      if (this.addedImgLists.length > 9) {
        this.isUploaded = false;
      }
    }
  }





  doConfirm(id, item, type) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this message?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id, type);
          if (type == 'inbox') {
            for (let q: number = 0; q < this.inboxLists.length; q++) {
              if (this.inboxLists[q] == item) {
                this.inboxLists.splice(q, 1);
              }
            }
          } else {
            for (let q: number = 0; q < this.sendLists.length; q++) {
              if (this.sendLists[q] == item) {
                this.sendLists.splice(q, 1);
              }
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
  deleteEntry(recordID, typestr) {
    let urlstr;
    if (typestr == 'inbox') {
      urlstr = this.apiServiceURL + "/messages/" + recordID + "/inbox/delete?is_mobile=1&ses_login_id=" + this.userId;
    } else {
      urlstr = this.apiServiceURL + "/messages/" + recordID + "/senditems/delete?is_mobile=1&ses_login_id=" + this.userId;
    }
    let
      // /messages/43/inbox/delete?is_mobile=1&ses_login_id=9
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = urlstr;
    console.log("Delete Message URL:" + url);
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {

          this.conf.sendNotification(`Messages was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });
  }
  doDetails(item, act) {
    this.attachedFileLists = []
    this.isSubmitted = false;
    this.act = act;
    console.log("Do Details act is:" + this.act);
    this.choice = 'details';
    this.selectEntry(item);
    let body: string = "is_mobile=1&ses_login_id=" + this.userId +
      "&message_id=" + item.message_id + "&frompage=inbox",
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/changereadunread";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          //this.conf.sendNotification(`Comment count successfully removed`);

        }
        // Otherwise let 'em know anyway
        else {
          // this.conf.sendNotification('Something went wrong!');
        }
      });

  }

  reply(messages_body) {
    this.isSubmitted = false;
    this.replyforward = 1;
    this.isReply = 1;
    if (this.senderid == this.userId) {
      this.to = this.receiver_id;
      this.addedImgLists = [];
      console.log("Attached image for file" + JSON.stringify(this.attachedFileLists));
      this.copytome = 0;
      this.getPrority(0);
      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;
      this.choice = 'compose';
    }
    else {
      this.isReply = 0;
      this.to = this.personalhashtag;
      this.addedImgLists = [];
      this.copytome = 0;
      this.getPrority(0);
      this.subject = this.messages_subject;
      //this.composemessagecontent = "-----Reply Message-----" + "\n" + messages_body;
      this.composemessagecontent = messages_body;
      this.choice = 'compose';
    }
  }

  forward(messages_body) {
    this.isSubmitted = false;
    this.replyforward = 1;
    this.to = '';
    this.addedImgLists = [];
    this.copytome = 0;
    this.getPrority(0);
    this.subject = this.messages_subject;
    this.composemessagecontent = "-----Forward Message-----" + "\n" + messages_body;
    this.choice = 'compose';
  }

  download(file) {
    console.log("Download calling..." + file);
    const fileTransfer: TransferObject = this.transfer.create();
    const url = this.apiServiceURL + '/api/uploads/' + file;
    fileTransfer.download(url, this.file.dataDirectory + file).then((entry) => {
      console.log('download complete: ' + entry.toURL());
    }, (error) => {
      // handle error
      console.log('download error: ' + error);
    });

  }
  favorite(messageid) {
    let body: string = "loginid=" + this.userId + "&is_mobile=1&messageid=" + messageid,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/messages/setfavorite";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          this.inboxData.startindex = 0;
          this.doInbox();
        }
        // Otherwise let 'em know anyway
        else {
          this.conf.sendNotification('Something went wrong!');
        }
      }, error => {
        this.networkType = this.conf.serverErrMsg();// + "\n" + error;
      });


  }
  com() {
    this.isSubmitted = false;
    this.to = "";
    this.subject = "";
    this.composemessagecontent = "";
  }

  onActionInbox(actpet, inboxData) {
    if (actpet == '') {
      //this.strinbox = '';
      this.conf.sendNotification("Please select Atleast One Action");
      return false;
    }
    if (this.strinbox == 'undefined') {
      this.strinbox = '';
    }
    if (this.strinbox == undefined) {
      this.strinbox = '';
    }
    if (this.strinbox == '') {
      this.conf.sendNotification("Please select Atleast One Message")
    }
    else {
      console.log("Send Checkbox Selection:" + JSON.stringify(this.strinbox));
      console.log("Act:" + actpet);
      console.log("Inbox Data Array :" + JSON.stringify(inboxData));
      let urlstr;
      let actionItems = this.strinbox.split(",");
      for (let ac = 0; ac < actionItems.length; ac++) {
        if (actionItems[ac] != 'undefined') {
          this.actionId.push({
            "id": actionItems[ac]
          })
        }
      }
      console.log(JSON.stringify(this.actionId));
      if (actpet == 'inboxunread') {
        urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Unread&messageids=" + JSON.stringify(this.actionId);
      }
      if (actpet == 'inboxdelete') {
        urlstr = this.apiServiceURL + "/messages/actions?frompage=inbox&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + JSON.stringify(this.actionId);
      }

      let bodymessage: string = "",
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 });
      // url1: any = this.apiServiceURL + "/getmessagedetails";
      console.log(urlstr + '?' + bodymessage);
      let res;
      this.http.post(urlstr, bodymessage, options1)
        .subscribe((data) => {
          res = data.json();
          console.log("Unread action:" + JSON.stringify(data.json()));
          console.log("Res Result" + res.msg[0]['result']);
          console.log("data.status" + data.status);
          console.log("Error" + res.msg[0]['Error'])
          if (data.status === 200) {
            console.log('Enter');
            if (res.msg[0]['Error'] == 0) {
              this.conf.sendNotification(res.msg[0]['result']);
            }
            // this.conf.sendNotification(data.json().msg.result);
            console.log('Exit 1');
            // this.strinbox = '';
            //this.inboxact='';
            this.inboxData.startindex = 0;
            this.doInbox();
            console.log('Exit 2');
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

  onActionSend(actpet, sendData) {
    if (actpet == '') {
     // this.strsend = '';
      this.conf.sendNotification("Please select Atleast One Action");
      return false;
    }
    if (this.strsend == 'undefined') {
      this.strsend = '';
    }
    if (this.strsend == undefined) {
      this.strsend = '';
    }
    if (this.strsend == '') {
      this.conf.sendNotification("Please select Atleast One Message")
    }
    else {
      console.log("Send Checkbox Selection:" + JSON.stringify(this.strsend));
      console.log("Act:" + actpet);
      console.log("Inbox Data Array :" + JSON.stringify(sendData));
      let urlstr;
      let actionItems = this.strsend.split(",");
      for (let ac = 0; ac < actionItems.length; ac++) {
        if (actionItems[ac] != 'undefined') {
          this.actionId.push({
            "id": actionItems[ac]
          })
        }
      }
      console.log(JSON.stringify(this.actionId));

      if (actpet == 'senddelete') {
        urlstr = this.apiServiceURL + "/messages/actions?frompage=send&is_mobile=1&ses_login_id=" + this.userId + "&actions=Delete&messageids=" + JSON.stringify(this.actionId);
      }
      let bodymessage: string = "",
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 });
      // url1: any = this.apiServiceURL + "/getmessagedetails";
      console.log(urlstr + '?' + bodymessage);
      let res;
      this.http.post(urlstr, bodymessage, options1)
        .subscribe((data) => {
          res = data.json();
          console.log("Unread action:" + JSON.stringify(data.json()));
          console.log("Res Result" + res.msg[0]['result']);
          console.log("data.status" + data.status);
          console.log("Error" + res.msg[0]['Error'])
          if (data.status === 200) {
            // this.strsend = '';
            // this.sendact='';
            console.log('Enter');
            if (res.msg[0]['Error'] == 0) {
              this.conf.sendNotification(res.msg[0]['result']);
            }
            // this.conf.sendNotification(data.json().msg.result);
            console.log('Exit 1');
            this.sendData.startindex = 0;
            this.doSend();
            console.log('Exit 2');
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
  getCheckBoxValueSend(item, val) {
    if (val == undefined) {
      val = '';
    }
    if (val == 'undefined') {
      val = '';
    }
    if (val != '') {
      if (this.strsend == '') {
        this.strsend = val;
      } else {
        this.strsend = this.strsend + "," + val;
      }
    }
    console.log("Send checkbox data:" + JSON.stringify(item));
    console.log(val);
  }

  getCheckBoxValueInbox(item, val) {
    if (val == undefined) {
      val = '';
    }
    if (val == 'undefined') {
      val = '';
    }
    if (val != '') {
      if (this.strinbox == '') {
        this.strinbox = val;
      } else {
        this.strinbox = this.strinbox + "," + val;
      }
    }
    console.log("Inbox checkbox data:" + JSON.stringify(item));
    console.log(val);

  }

}
