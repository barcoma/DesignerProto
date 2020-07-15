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

  this.MockProducts = [
    {
      name: 'shampoo',
      img: '../../assets/img/shampoobottle.jpg',
      descr: 'blassasdasdad'
    },
    {
      name: 'Tasse',
      img: '../../assets/img/tasse.jpg',
      descr: 'blassasdasdad'
    },
    {
      name: 'Pinsel',
      img: '../../assets/img/lov.png',
      descr: 'blassasdasdad'
    },
    {
      name: 'shampoo',
      img: '../../assets/img/shampoobottle.jpg',
      descr: 'blassasdasdad'
    },
  ];
  }

  @ViewChild('slides', { read: IonSlides }) slides: IonSlides;

  todos: Array<any>;
  products: Array<any>;
  loggedIn: boolean;
  MockProducts: any;

  onAuthEvent(payload) {
    console.log(payload.event);
    switch (payload.event){
      case 'signIn':
        this.loggedIn = true;
        break;
      case 'signOut':
        this.loggedIn = false;
        break;
    }
  }

  async ionViewWillEnter() {
    await this.isUserLoggedIn();

    this.apiService.ListTodos().then((evt) => {
      this.todos = evt.items;
    });
    this.apiService.OnCreateTodoListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateTodo;
      this.todos = [...this.todos, data];
    });

    this.apiService.ListProducts().then((evt) => {
      this.products = evt.items;
    });
    this.apiService.OnCreateProductListener.subscribe((evt) => {
      const data = (evt as any).value.data.onCreateProduct;
      this.products = [...this.products, data];
    });
  }

  createProduct(){
    this.apiService.DeleteProduct({id: this.products[0].id});
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
        img: this.MockProducts[id].img,
        desc: this.MockProducts[id].descr
      }
    };
    this.router.navigate(['designer'], navigationExtras);
  }

async testUserLoggedIn(){
  console.log('Is User Logged In? ', this.loggedIn);
}
  // TODO ->
isUserLoggedIn(){
    Auth.currentAuthenticatedUser()
    .then((resolve) => {
      this.loggedIn = true;
    },
          (reject) => {this.loggedIn =  false; }
    );
  }
  // END TODO

  // logOut(){
  //   Auth.signOut();

  //   this.loggedIn = false;
  // }

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
            this.loggedIn = false;
          }
        }
      ]
    });

    await alert.present();
  }

}
