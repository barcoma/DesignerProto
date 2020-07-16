import { ActivatedRoute, Router } from '@angular/router';
import * as paper from 'paper';
import { MatSelectChange } from '@angular/material';
import { Color, PaperScope, Project } from 'paper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, PopoverController} from '@ionic/angular';
import * as hash from 'object-hash';
import { AddImageModalComponent } from 'src/app/modals/add-image/add-image.modal';
import { GeometricsService } from 'src/app/services/geometrics.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';
import { ProjectCanvasService } from '../services/project-canvas.service';
import { ToastService } from '../services/toast.service';
import { UnitConversionService } from '../services/unit-conversion.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.page.html',
  styleUrls: ['./designer.page.scss'],
})
export class DesignerPage{
  @ViewChild('canvas') canvasEl: ElementRef;
  @ViewChild('ProductImage') imgEl: ElementRef;
  @ViewChild('ImageWrapper') wrapperEl: ElementRef;

  scope: paper.PaperScope;
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
  shapeSelectionOpen = false;
  openRotationHandle = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    public modalController: ModalController,
    public sharedService: SharedService,
    public navCtrl: NavController,
    public projectService: ProjectCanvasService,
    private geometrics: GeometricsService,
    private toastService: ToastService,
    public storageService: StorageService,
    private loadingController: LoadingController,
    private ngZone: NgZone,
    public unitService: UnitConversionService,
    private unitConversion: UnitConversionService,
    private popoverCtrl: PopoverController,
    ) {
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
    this.descr = 'Shampoo';
    this.zoneX = 50;
    this.zoneY = 100;
    this.zoneXScale = .8;
    this.zoneYScale = .5;
  }

  ionViewDidEnter(){
    console.log('view loaded');
    this._CANVAS = this.canvasEl.nativeElement;

    setTimeout(() => {
      this.scope = new PaperScope();
      this.scope.settings.handleSize = 0;
      this.scope.install(this._CANVAS);
      this.sharedService.scope = this.scope;
      this.projectService.canvas = new Project(this._CANVAS);
      this.projectService.canvas.activeLayer.view.update();
      this.projectService.canvas.view.onClick = (e: paper.MouseEvent) => {
        this.ngZone.run(() => this.onCanvasClicked(e));
      };
      this.sharedService.canvas.height = this._CANVAS.height;
      this.sharedService.canvas.width = this._CANVAS.height;
    }, 0);

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

addShape(type: string) {
  switch (type) {
    case 'triangle':
      this.geometrics.triangle(this.projectService.canvas.view.center.x, this.projectService.canvas.view.center.y);
      this.shapeSelectionOpen = false;
      break;
    case 'rectangle':
      this.geometrics.rectangle(150, 150, this.projectService.canvas.view.center.x - 75, this.projectService.canvas.view.center.y - 75);
      this.shapeSelectionOpen = false;
      break;
    case 'circle':
      this.geometrics.circle(this.projectService.canvas.view.center.x, this.projectService.canvas.view.center.y, 50);
      this.shapeSelectionOpen = false;
      break;
    case 'line':
      this.geometrics.line(250, 500);
      this.shapeSelectionOpen = false;
      break;
  }
}

rotateItem(){
  this.openRotationHandle = !this.openRotationHandle
}

toggleshapeSelectionOpen(){
  this.shapeSelectionOpen = !this.shapeSelectionOpen;
}

@HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let preventDefault = true;
    if (this.sharedService.modalStackCount > 0 || document.activeElement.tagName === 'INPUT') {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
        this.moveMethod('up');
        break;
      case 'ArrowDown':
        this.moveMethod('down');
        break;
      case 'ArrowRight':
        this.moveMethod('right');
        break;
      case 'ArrowLeft':
        this.moveMethod('left');
        break;
      case '+':
        this.pictureMethod('increeseSize');
        break;
      case '-':
        this.pictureMethod('decreeseSize');
        break;
      case '*':
        this.projectService.rotateSelectedItems(5);
        break;
      case '/':
        this.projectService.rotateSelectedItems(-5);
        break;
      case 'Delete':
        this.projectService.removeSelectedItems();
        break;
      case 'Escape':
        this.projectService.deselectAll();
        break;
      case 'Delete':
        this.projectService.removeSelectedItems();
        break;
      case 'Enter':
        if (this.projectService.selectedTopLevelItems().length === 1) {
          if (
            this.projectService.selectedTopLevelItems()[0].data.type === 'text' &&
            !this.projectService.selectedTopLevelItems()[0].data.isAutomaticLaserCounter
          ) {
            // Need to deselect the item else you open another dialog with enter on text-input
            const selectedItem = this.projectService.selectedTopLevelItems()[0];
            this.projectService.openEditTextDialog(selectedItem);
          }
        }
        break;
      default:
        preventDefault = false;
        break;
    }
    if (preventDefault) {
      // FIXME Breaks behaviour of input fields
      event.preventDefault();
    }
  }



  onSubmit(id: string) {
    document.getElementById(id).blur();
  }

  onCanvasClicked(event: paper.MouseEvent) {
    const hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5,
    };
    if (!this.projectService.canvas.hitTest(event.point, hitOptions)) {
      this.projectService.deselectAll();
    }
  }

  onLayerItemClicked(item: paper.Item, event: MouseEvent) {
    if (event.shiftKey && item.selected) {
      item.selected = false;
    } else {
      this.projectService.selectItem(item, event.shiftKey);
    }
    event.stopPropagation();
  }

  groupItems() {
    this.projectService.groupSelectedItems();
  }

  ungroupItems() {
    this.projectService.ungroupSelectedItems();
  }

  pictureMethod(func: string, factor?: number) {
    const scalingFactor = this.sharedService.settings.scalingFactor;
    if (this.projectService.itemFocus) {
      if (!factor) {
        factor = 1;
      }
      switch (func) {
        case 'decreeseSize':
          if (this.projectService.itemFocus.data.type !== 'text') {
            this.projectService.scaleSelectedItems(
              'down',
              factor - this.unitConversion.getFactorByMillimeterNegative(scalingFactor, this.projectService.itemFocus)
            );
          } else {
            this.projectService.scaleSelectedItems('down', factor);
          }
          break;
        case 'increeseSize':
          if (this.projectService.itemFocus.data.type !== 'text') {
            this.projectService.scaleSelectedItems(
              'up',
              factor + this.unitConversion.getFactorByMillimeter(scalingFactor, this.projectService.itemFocus)
            );
          } else {
            this.projectService.scaleSelectedItems('up', factor);
          }
          break;
        case 'mirrorX':
          this.projectService.scaleSelectedItems('flip', -1, 1);
          break;
        case 'mirrorY':
          this.projectService.scaleSelectedItems('flip', 1, -1);
          break;
        case 'copy':
          this.projectService.copySelectedItems();
          break;
        case 'delete':
          this.projectService.removeSelectedItems();
      }
    }
  }

  moveMethod(direction: 'right' | 'left' | 'down' | 'up') {
    let dx = 0;
    let dy = 0;
    const stepSize = this.sharedService.settings.stepsize;

    switch (direction) {
      case 'right':
        dx = stepSize;
        break;
      case 'left':
        dx = -stepSize;
        break;
      case 'down':
        dy = stepSize;
        break;
      case 'up':
        dy = -stepSize;
        break;
      default:
        throw new Error(`Unknown direction '${direction}'`);
    }
    this.projectService.translateSelectedItems(dx, dy);
  }

  async openAddImageModal() {
    const modal = await this.modalController.create({
      component: AddImageModalComponent,
    });
    modal.present();
  }

  private getItemsWithoutGroups(items?: paper.Item[]): paper.Item[] {
    if (items === undefined) {
      items = this.projectService.canvas.activeLayer.children;
    }

    const result: paper.Item[] = [];
    for (const item of items) {
      if (item.data.type === 'group') {
        result.push(...this.getItemsWithoutGroups(item.children));
      } else {
        result.push(item);
      }
    }
    return result;
  }

  onLayerListItemDrop(event: CdkDragDrop<string[]>) {
    const children = this.projectService.canvas.activeLayer.children;
    // Get elements from straight array
    const prevEl = children[event.previousIndex];
    const newEl = children[event.currentIndex];
    // Get index from elements of reversed array
    const prevElIndex = children
      .slice()
      .reverse()
      .findIndex((el) => el.id === prevEl.id);
    const newElIndex = children
      .slice()
      .reverse()
      .findIndex((el) => el.id === newEl.id);

    moveItemInArray(children, prevElIndex, newElIndex);
  }

  changeTextFontFamily(event) {
    const item = this.projectService.itemFocus;
    const text = item.lastChild as paper.PointText;
    let newFont = this.sharedService.defaultFonts.find((el) => el.fontFamilyMerged === event.detail.value + ' ' + text.data.fontSubfamily);
    if (!newFont) {
      newFont = this.sharedService.defaultFonts.find((el) => el.fontFamilyMerged === event.detail.value + ' Regular');
      text.fontWeight = 'normal';
    }
    console.log(newFont);
    text.fontFamily = newFont.fontFamilyMerged;
    text.data.fontFamily = newFont.fontFamily;
    text.data.fontSubfamily = newFont.fontSubfamily;
    text.data.fontFamilyMerged = newFont.fontFamilyMerged;
    this.projectService.updateTextSelectionHelper(item);
  }

  changeTextFontSubfamily() {
    const item = this.projectService.itemFocus;
    const text = item.lastChild as paper.PointText;
    const subfamilyIsPresent = this.sharedService.fonts.some(
      (font) => font.fontFamily === text.data.fontFamily && font.fontSubfamily === text.data.fontSubfamily
    );
    if (!subfamilyIsPresent) {
      text.data.fontSubfamily = 'Regular';
    }
    switch (text.data.fontSubfamily) {
      case 'Regular':
        text.fontWeight = 'normal';
        break;
      case 'Bold':
        text.fontWeight = 'bold';
        break;
      case 'Italic':
        text.fontWeight = 'italic';
        break;
      case 'Bold Italic':
        text.fontWeight = 'bold italic';
        break;
    }
    text.data.fontFamilyMerged = text.data.fontFamily + ' ' + text.data.fontSubfamily;
    text.fontFamily = text.data.fontFamilyMerged;
    this.projectService.updateTextSelectionHelper(item);    
  }

  lockRatio() {
    const itemFocus = this.projectService.itemFocus;
    if (itemFocus.data['locked_ratio']) {
      itemFocus.data['locked_ratio'] = false;
    } else {
      itemFocus.data['locked_ratio'] = true;
    }
  }

  updateRatio(axis: string, event) {
    if (event < 1 || event === null) {
      event = 1;
    }
    const itemFocus = this.projectService.itemFocus;
    const center = itemFocus.bounds.center;
    if (itemFocus.data['locked_ratio']) {
      itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation), itemFocus.data.center);
      const ratio: number = itemFocus.bounds.height / itemFocus.bounds.width;
      let changeRate: number;
      switch (axis) {
        case 'width':
          changeRate = event - itemFocus.bounds.width;
          itemFocus.bounds.height = itemFocus.bounds.height + changeRate * ratio;
          itemFocus.data.height = itemFocus.bounds.height.toFixed(0);
          itemFocus.bounds.center = itemFocus.data.center;
          itemFocus.rotate(itemFocus.data.prevRotation, itemFocus.data.center);
          break;
        case 'height':
          changeRate = event - itemFocus.bounds.height;
          itemFocus.bounds.width = itemFocus.bounds.width + (changeRate * 1) / ratio;
          itemFocus.data.width = itemFocus.bounds.width.toFixed(0);
          itemFocus.bounds.center = itemFocus.data.center;
          itemFocus.rotate(itemFocus.data.prevRotation, center);
          break;
      }
    }
    switch (axis) {
      case 'width':
        itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation));
        itemFocus.bounds.width = event;
        itemFocus.data.width = event.toFixed(0);
        itemFocus.bounds.center = itemFocus.data.center;
        itemFocus.rotate(itemFocus.data.prevRotation, center);
        break;
      case 'height':
        itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation));
        itemFocus.bounds.height = event;
        itemFocus.data.height = event.toFixed(0);
        itemFocus.bounds.center = itemFocus.data.center;
        itemFocus.rotate(itemFocus.data.prevRotation, center);
        break;
      case 'radius':
        itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation), itemFocus.data.center);
        itemFocus.bounds.height = event * 2;
        itemFocus.bounds.width = event * 2;
        itemFocus.data.radius = event;
        itemFocus.bounds.center = itemFocus.data.center;
        itemFocus.rotate(itemFocus.data.prevRotation, itemFocus.data.center);
        break;
      case 'trianglesize':
        itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation), this.projectService.triangleCentroid(itemFocus.children[1]));
        const ratioH = itemFocus.bounds.height / itemFocus.data.radius;
        const ratioW = itemFocus.bounds.width / itemFocus.data.radius;
        itemFocus.bounds.height = event * ratioH;
        itemFocus.bounds.width = event * ratioW;
        itemFocus.data.radius = event;
        itemFocus.bounds.center = itemFocus.data.center;
        itemFocus.rotate(itemFocus.data.prevRotation, this.projectService.triangleCentroid(itemFocus.children[1]));
        break;
      case 'length':
        itemFocus.rotate(-Math.abs(itemFocus.data.prevRotation), itemFocus.data.center);
        itemFocus.bounds.height = event;
        itemFocus.bounds.width = event;
        itemFocus.data.size = event;
        itemFocus.bounds.center = itemFocus.data.center;
        itemFocus.rotate(itemFocus.data.prevRotation, itemFocus.data.center);
        break;
    }
  }


  genText() {
    const text = new paper.PointText(this.projectService.canvas.view.center);
    text.justification = 'left';
    text.fillColor = null;
    text.content = 'Your Text...';
    text.fontFamily = 'Arial Regular';
    text.data.fontFamily = 'Arial';
    text.data.fontSubfamily = 'Regular';
    text.data.fontFamilyMerged = 'Arial Regular';
    text.fontSize = '14px';

    text.strokeWidth = 1;
    text.strokeCap = 'butt';
    text.strokeColor = new Color('black');
    text.position = this.projectService.canvas.view.center;

    const textGroup = new paper.Group(text);
    const selectionHelper = this.projectService.createSelectionHelper(textGroup.bounds);
    selectionHelper.strokeColor = null;
    textGroup.insertChild(0, selectionHelper);
    textGroup.data.type = 'text';
    textGroup.data.description = text.content;
    this.projectService.addMouseEventHandlers(textGroup);
    this.projectService.selectItem(textGroup);
  }

  private recursiveEventDeletion(children: any[]) {
    let child: paper.Item;
    for (child of children) {
      this.recursiveCallOfChildren(child);
    }
  }

  private recursiveCallOfChildren(child: paper.Item) {
    if (child.children && child.children.length > 0) {
      this.recursiveEventDeletion(child.children);
    }
  }

  setItemRotation(event: MatSelectChange) {
    this.projectService.rotateSelectedItems(event);
    event.source.value = undefined;
  }

  updatePositionInMillimeter($event, axis: string) {
    const item: paper.Item = this.projectService.selectedTopLevelItems()[0];
    const paperPosition = this.unitService.millimeterToPaper($event);
    if (axis === 'x') {
      item.bounds.x = paperPosition;
    } else {
      item.bounds.y = paperPosition;
    }
  }

}
