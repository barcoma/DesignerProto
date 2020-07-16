import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

/*  Amplify imports */
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { File } from '@ionic-native/file/ngx';
import { EditTextDialogComponent } from './dialogs/editText.dialog';
import { MaterialModule } from './material.module';
import { AddImageModalComponent } from './modals/add-image/add-image.modal';
import { SettingsModalComponent } from './modals/settings/settings.modal';

import { PipesModule } from './pipes/pipes.module';


Amplify.configure(awsconfig);

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    press: { time: 1500 },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AddImageModalComponent,
    SettingsModalComponent,
    EditTextDialogComponent
  ],
  entryComponents: [
    AddImageModalComponent,
    SettingsModalComponent,
    EditTextDialogComponent
  ],
  imports: [
    AmplifyUIAngularModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    PipesModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
