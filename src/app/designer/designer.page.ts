import { Component,
         ElementRef,
         ViewChild
  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as paper from 'paper';
import { Color, PaperScope, Project } from 'paper';


@Component({
  selector: 'app-designer',
  templateUrl: './designer.page.html',
  styleUrls: ['./designer.page.scss'],
})
export class DesignerPage{
  @ViewChild('canvas') canvasEl: ElementRef;
  @ViewChild('ProductImage') imgEl: ElementRef;
  @ViewChild('ImageWrapper') wrapperEl: ElementRef;
  private _CANVAS: any;
  private _CONTEXT: any;

  img: any;
  descr: any;
  sub: any;
  // Relative Breite der Zone zum Bild
  zoneXScale: any;
  // Relative Höhe der Zone zum Bild
  zoneYScale: any;
  // Zonenstartpunkte - oberes linkes Eck der Zone verschoben um x und y vom oberen linken Eck des Bilds
  zoneX: any;
  zoneY: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.img = this.router.getCurrentNavigation().extras.state.img;
        this.descr = this.router.getCurrentNavigation().extras.state.descr;
        this.zoneX = this.router.getCurrentNavigation().extras.state.zoneX;
        this.zoneY = this.router.getCurrentNavigation().extras.state.zoneY;
        this.zoneXScale = this.router.getCurrentNavigation().extras.state.zoneXScale;
        this.zoneYScale = this.router.getCurrentNavigation().extras.state.zoneYScale;
      }
    });
    this.img = '../../assets/img/shampoobottle.png';
    this.zoneX = 50;
    this.zoneY = 100;
    this.zoneXScale = .8;
    this.zoneYScale = .5;
  }

  ionViewDidEnter(){
    console.log('view loaded');
    this._CANVAS = this.canvasEl.nativeElement;
    this._CANVAS.width = 150;
    this._CANVAS.height = 150;

    this.initialiseCanvas();
    this.drawCircle();
  }

  initialiseCanvas(){
    if (this._CANVAS.getContext)
    {
        this.setupCanvas();
    }
  }

setupCanvas(){
   const img = this.imgEl.nativeElement;
   const wrapper = this.wrapperEl.nativeElement;
   let wrapperHeight = wrapper.getBoundingClientRect().height;
   let imgHeight = img.getBoundingClientRect().height;
   let imgWidth = img.getBoundingClientRect().width;
   this._CONTEXT = this._CANVAS.getContext('2d');
   this._CANVAS.style.position = 'absolute';
   this._CANVAS.style.backgroundColor = 'rgba(255,255,255,.5)';
   this._CANVAS.style.top = wrapperHeight - imgHeight / 2;
   this._CANVAS.height = imgHeight;
   this._CANVAS.width = imgWidth;
   this.scaleCanvas();
}

scaleCanvas(){
  console.log(this.zoneXScale, this.zoneYScale);
  this._CANVAS.height *= this.zoneYScale;
  this._CANVAS.width *= this.zoneXScale;
  this._CANVAS.style.top = this.zoneY;
  this._CANVAS.style.left = this.zoneX;
  console.log(this._CANVAS);
}

clearCanvas(){
   this._CONTEXT.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
   this.setupCanvas();
}

drawCircle(){
   this.clearCanvas();
   this._CONTEXT.beginPath();
   // x, y, radius, startAngle, endAngle
   const radius = this._CANVAS.height > this._CANVAS.width ? (this._CANVAS.width / 2) : this._CANVAS.height / 2;
   this._CONTEXT.arc(this._CANVAS.width / 2, this._CANVAS.height / 2, radius, 0, 2 * Math.PI);
   this._CONTEXT.lineWidth = 1;
   this._CONTEXT.strokeStyle = '#000';
   this._CONTEXT.stroke();
}
}
