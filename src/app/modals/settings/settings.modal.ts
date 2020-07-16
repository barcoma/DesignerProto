import {AfterViewInit, Component} from '@angular/core';
import {MatSelectChange} from '@angular/material';
import {AlertController, ModalController} from '@ionic/angular';
import {SharedService} from 'src/app/services/shared.service';
import {StorageService} from 'src/app/services/storage.service';
import {environment} from 'src/environments/environment';
import {LoggingService} from '../../services/logging.service';
import {ProjectCanvasService} from '../../services/project-canvas.service';
import {UnitConversionService} from '../../services/unit-conversion.service';

const FileSaver = require('file-saver');

@Component({
    selector: 'settings-modal',
    templateUrl: './settings.modal.html',
    styleUrls: ['./settings.modal.scss'],
})
export class SettingsModalComponent implements AfterViewInit {
    logs: any[] = [];
    logLimit = 0;
    isCalibrationPilotActive = false;
    laserSpaceWarningThreshold = 48110;
    constructor(
        public sharedService: SharedService,
        private storageService: StorageService,
        private modalCtrl: ModalController,
        public projectCanvasService: ProjectCanvasService,
        private loggingService: LoggingService,
        private unitConversionService: UnitConversionService,
        private alertCtrl: AlertController
    ) {
    }

    get minLaserSpace(): number {
        return 10000;
    }

    get maxLaserSpace(): number {
        return 65535;
    }

    ngAfterViewInit() {
    }

    ionViewDidEnter() {
        this.sharedService.increaseModelStackCounter();
    }

    ionViewDidLeave() {
        this.sharedService.decreaseModelStackCounter();
    }

    laserSpaceToMM(value: number): number {
        return Math.floor(value / this.unitConversionService.dotsPerMilimeter);
    }

    async updateSettings(event: any, field: string) {
        let value: number | string;
        const target = event.target as HTMLInputElement;
        value = Number(target.value);
        console.log(field, target.value);
        if (field === 'scalingFactor'){
            value = value.toString();
        }
        await this.storageService.storage.setTable({table: 'settings'});
        await this.storageService.storage.set({key: field, value: JSON.stringify(value)});
    }

    dismissModal() {
        this.modalCtrl.dismiss();
    }

    async loadLogs() {
        const logs = await this.loggingService.getLogs();
        const blob = new Blob([JSON.stringify(logs, null, 2)], {type: 'application/json'});
        FileSaver.saveAs(blob, 'log.json');
    }

    onSubmit(id: string) {
        const elem = document.getElementById(id);
        elem.blur();
    }

    minMaxEnforce(field: string) {
        switch (field) {
            case 'stepSizeSet':
                if (this.sharedService.settings.stepsize < 1) {
                    this.sharedService.settings.stepsize = 1;
                }
                break;
            case 'scalingFactorSet':
                if (this.sharedService.settings.scalingFactor < 0.01) {
                    this.sharedService.settings.scalingFactor = 0.01;
                }
                break;
        }
    }


    deleteLogs() {
        this.storageService.deleteLogs();
    }

    produceError() {
        throw new Error();
    }
}
