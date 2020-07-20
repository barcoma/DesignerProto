import { Component, ViewChild, OnInit } from '@angular/core';
import { APIService } from '../API.service';
import { Auth } from 'aws-amplify';
import { Router, NavigationExtras } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Hub } from 'aws-amplify';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoggedIn = false;

  constructor(
    private apiService: APIService,
    public router: Router,
    public alertController: AlertController
  ) {
    this.updateUser();
    Hub.listen('auth', (data) => {
      const { payload } = data;
      this.onAuthEvent(payload);
    });
   }

  ngOnInit() {

  }

async updateUser(){
  try {
    let user = await Auth.currentAuthenticatedUser();
    this.setUserLoggedIn(user);
  } catch {
    this.setUserLoggedIn(null);
  }
}

setUserLoggedIn(user){
  if (user != null){
    this.router.navigate(['/home']);
  }
  console.log('not logged in');
}

onAuthEvent(payload) {
  console.log(payload.event);
  switch (payload.event){
    case 'signIn':
      this.router.navigate(['/home']);
      break;
    case 'signOut':
      break;
  }
}
}
