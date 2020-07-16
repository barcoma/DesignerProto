import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-barcodes',
  templateUrl: './barcodes.page.html',
  styleUrls: ['./barcodes.page.scss'],
})
export class BarcodesPage implements OnInit {
  barcodes = [
    {
      name: 'Creme',
      descr: 'Gift for mum',
      img : '../../assets/img/nivea.png'
    },
    {
      name: 'Creme',
      descr: 'Gift for sis',
      img: '../../assets/img/nivea.png'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.route.queryParams){
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let descr = this.router.getCurrentNavigation().extras.state.desc;
        let name = this.router.getCurrentNavigation().extras.state.name;
        let img = this.router.getCurrentNavigation().extras.state.img;
        console.log(this.router.getCurrentNavigation());
        this.createBarcode(name, descr, img);
      }
    });
  }
}

  ngOnInit() {
  }

  createBarcode(n, d, i){
    console.log(n, d, i);
    this.barcodes.push({name: n, descr: d, img: i});
  }

}
