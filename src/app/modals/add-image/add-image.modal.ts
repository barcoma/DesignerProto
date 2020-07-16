import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Path, Color, CompoundPath, Shape } from 'paper';
import { StorageService } from 'src/app/services/storage.service';
import { ProjectCanvasService } from './../../services/project-canvas.service';
import {SharedService} from '../../services/shared.service';


@Component({
  selector: 'add-image-modal',
  templateUrl: './add-image.modal.html',
  styleUrls: ['./add-image.modal.scss']
})

export class AddImageModalComponent implements OnInit {
  deleteImagesFlag = false;
  imageAllreadyAdded = false;
  selectedImages = [];

  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  constructor(
    public storageService: StorageService,
    private projectService: ProjectCanvasService,
    private modalCtrl: ModalController,
    public sharedService: SharedService
  ) {}


  async ngOnInit() {
    await this.storageService.getKeysValuesByTable('images');
  }

  async useImage(file) {
    if (this.deleteImagesFlag) {
      // await this.deleteImage(file);
    } else {
      await this.storageService.storage.setTable({table: 'images'});
      const svg = await this.storageService.storage.get({key: file.key});
      const base64str = svg.value.replace('data:image/svg+xml;base64,', '');
      if (!this.imageAllreadyAdded) {
      await this.addImage(base64str, file);
      }
    }
  }

  ionViewDidEnter() {
    this.sharedService.increaseModelStackCounter();
  }

  ionViewDidLeave() {
    this.sharedService.decreaseModelStackCounter();
  }

  public selectImage(img, event: CustomEvent) {
    if (event.detail.checked) {
      this.selectedImages.push(img.key);
    } else {
      const index = this.selectedImages.findIndex(el => el === img.key);
      this.selectedImages.splice(index, 1);
    }
  }

  private addImage(base64str, file) {
    this.imageAllreadyAdded = true;
    const group = this.projectService.importSvg(atob(base64str));
    group.position = this.projectService.canvas.view.center;
    group.fitBounds(this.projectService.canvas.view.bounds);
    group.getItems({
      recursive: true,
      match: (i: paper.Item) => !i.data.selectionHelper && (i instanceof Path || i instanceof CompoundPath)
    }).forEach((item: paper.Item) => {
      item.strokeColor = new Color(0);
      item.strokeWidth = 1;
      item.fillColor = new Color(0, 0, 0);
    });

    group.data.description = file.key;
    this.projectService.selectItem(group);
    this.modalCtrl.dismiss();
  }

  public async deleteImages() {
    await this.storageService.storage.setTable({table: 'images'});
    for (const img of this.selectedImages) {
      await this.storageService.storage.remove({key: img});
    }
    await this.storageService.getKeysValuesByTable('images');
  }

  async cacheFile(event, tableName) {
    await this.storageService.cacheFile(event, tableName);
    this.fileInput.nativeElement.value = null;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
