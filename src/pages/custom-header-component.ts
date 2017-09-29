import { Component,Input } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
@Component({
  selector: 'custom-header',
  templateUrl: 'custom-header.html'
})
export class CustomHeaderComponent {
  header_data: any;
  constructor(public navCtrl: NavController) {}
  @Input()
  set header(header_data: any) {
    this.header_data=header_data;
  }
  get header() {
    return this.header_data;
  }
  homeClick() {
    this.navCtrl.push(DashboardPage);
  }
}