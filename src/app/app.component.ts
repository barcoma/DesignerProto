import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Hub, Auth } from 'aws-amplify';

import { APIService } from './API.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  currentPageTitle = 'Dashboard';
  userName: any;
  appPages = [
    {
      title: 'Your Profile',
      url: '',
      icon: 'person-circle-outline'
    },
    {
      title: 'Your Designs',
      url: '/timeline',
      icon: 'qr-code-outline'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }
  ];  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.getName();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getName(){
    Auth.currentAuthenticatedUser()
    .then((resolve) => {
      console.log(this.userName = resolve.attributes.email);
    },
          (reject) => {}
    );
  }


}
