import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  template: '<ion-app><router-outlet></router-outlet></ion-app>',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
