
import { Hub, Auth } from 'aws-amplify';
import { APIService } from './API.service';

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import * as PluginsLibrary from '@jeepq/capacitor';
import { ProjectCanvasService } from './services/project-canvas.service';
import { SharedService } from './services/shared.service';
import { StorageService } from './services/storage.service';
import { ToastService } from './services/toast.service';

const { CapacitorDataStorageSqlite, Device } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit {
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
    private storageService: StorageService,
    public sharedService: SharedService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalController: ModalController,
    private menu: MenuController,
    private loadingController: LoadingController,
    private toastService: ToastService
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

  async ngAfterViewInit(){
    const info = await Device.getInfo();

    if (info.platform === 'ios' || info.platform === 'android') {
      this.storageService.storage = CapacitorDataStorageSqlite;
    } else {
      this.storageService.storage = PluginsLibrary.CapacitorDataStorageSqlite;
    }

    // Init Database
    await this.storageService.storage.openStore({ database: 'designjuDB' });


    await this.storageService.getKeysValuesByTable('fonts');
    this.sharedService.fonts = await this.sharedService.getFontsFromDb();

    const loadedFonts = this.sharedService.fonts.length;

    // Get missing fonts to upload
    const fontsToUpload = this.sharedService.defaultFonts.filter((defaultFont) => {
      if (
        this.sharedService.fonts.filter(
          (font) => font.fontFamily === defaultFont.fontFamily && font.fontSubfamily === defaultFont.fontSubfamily
        ).length === 0
      ) {
        return true;
      }
    });

    // Load default fonts to database
    for (const [i, font] of fontsToUpload.entries()) {
      let lastElement;
      if (i === fontsToUpload.length - 1) {
        lastElement = true;
      }
      await this.storageService.uploadDefaultFont(font, lastElement).then(async (res) => {
        if (res) {
          await this.storageService.getKeysValuesByTable('fonts');
          // await this.textService.loadFontsCSS();
          this.sharedService.fonts = await this.sharedService.getFontsFromDb();
        }
      });
    }

    if (fontsToUpload.length === 0 && loadedFonts !== this.sharedService.fonts.length) {
      await this.storageService.getKeysValuesByTable('fonts');
      // await this.textService.loadFontsCSS();
      this.sharedService.fonts = await this.sharedService.getFontsFromDb();
    }
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
