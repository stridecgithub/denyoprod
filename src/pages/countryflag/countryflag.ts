import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
/**
 * Generated class for the CountryflagPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-countryflag',
  templateUrl: 'countryflag.html'
})
export class CountryflagPage {

  countries: string[];
  errorMessage: string;

  constructor(public navCtrl: NavController, public rest: RestProvider) {

  }

  ionViewDidLoad() {
    this.getCountries();
  }
  getCountry(countryCode) {
    console.log(countryCode);
  }
  getCountries() {
    this.rest.getCountries()
      .subscribe(
      countries => this.countries = countries,
      error => this.errorMessage = <any>error);
  }

}
