import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-designer',
  templateUrl: './designer.page.html',
  styleUrls: ['./designer.page.scss'],
})
export class DesignerPage{
  img: any;
  descr: any;
  sub: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.img = this.router.getCurrentNavigation().extras.state.img;
        this.descr = this.router.getCurrentNavigation().extras.state.descr;
      }
    });
    this.img = '../../assets/img/lov.png';
    this.descr = 'Shampoo Bottle';
  }
}
