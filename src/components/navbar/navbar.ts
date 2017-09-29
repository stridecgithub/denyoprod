import { Component } from '@angular/core';

/**
 * Generated class for the NavbarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'navbar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent {

  text: string;

  constructor() {
    console.log('Hello NavbarComponent Component');
    this.text = 'Hello World';
  }

}
