import { Component, ViewChild } from '@angular/core';
import { APIService } from '../API.service';
import { Auth } from 'aws-amplify';
import { Router, NavigationExtras } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { Hub } from 'aws-amplify';
import { AlertController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private apiService: APIService,
    public router: Router,
    public alertController: AlertController
    )
  {

  Hub.listen('auth', (data) => {
    const { payload } = data;
    this.onAuthEvent(payload);
  });

  }

  @ViewChild('slides', { read: IonSlides }) slides: IonSlides;

  todos: Array<any>;
  products: Array<any>;
  MockProducts: any;

  onAuthEvent(payload) {
    console.log(payload.event);
    switch (payload.event){
      case 'signIn':
        break;
      case 'signOut':
        this.router.navigate(['/login']);
        break;
    }
  }

  async ionViewWillEnter() {
    this.apiService.ListProducts().then((evt) => {
      this.products = evt.items;
      console.log(this.products);
    });
    this.apiService.OnCreateProductListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateProduct;
      this.products = [...this.products, data];
    });
  }

  logImg(){
    this.slides.getActiveIndex().then((res) => {
      this.openDesigner(res);
    });
  }

  moveSlides(direction){
    switch (direction){
      case 'l':
        this.slides.slidePrev();
        break;
      case 'r':
        this.slides.slideNext();
    }
  }

  openDesigner(id){
    const navigationExtras: NavigationExtras = {
      state: {
        img: this.products[id].img,
        name: this.products[id].name,
        zoneX: this.products[id].zoneX,
        zoneY: this.products[id].zoneY,
        zoneXScale: this.products[id].zoneXScale,
        zoneYScale: this.products[id].zoneYScale
      }
    };
    this.router.navigate(['designer'], navigationExtras);
  }

  async logOut() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Sign Out?',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Sign out',
          handler: () => {
            Auth.signOut();
          }
        }
      ]
    });

    await alert.present();
  }

}
