import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController } from 'ionic-angular';
//import { EmailPage } from '../email/email';
//import { Http, Headers, RequestOptions } from '@angular/http';
/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-atmentionedpopover',
  templateUrl: 'atmentionedpopover.html',
})
export class AtMentionedPopoverPage {
  public items = [];
  data: any;
  constructor( public viewCtrl: ViewController, public NP: NavParams, public nav: NavController) {
    this.data = this.NP.get("data");
    this.initializeItems();
  }

  initializeItems() {

    /*
        this.items = [
          'Amsterdam',
          'Bogota'
        ]
      */


    if (this.data.length > 0) {
      this.items = [];
      for (let unitgroup in this.data) {
        this.items.push(
          this.data[unitgroup].username
        )
      }
    }


    console.log("Initialize Items" + JSON.stringify(this.NP.get("data")));
    //this.items = this.NP.get("data");
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }
  selectone(itemData) {
    this.viewCtrl.dismiss(itemData);
  }
}
