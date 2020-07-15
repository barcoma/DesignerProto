import {Injectable} from '@angular/core';
import {SharedService} from 'src/app/services/shared.service';
import {ProjectCanvasService} from './project-canvas.service';

@Injectable({
    providedIn: 'root',
})
export class UnitConversionService {
    dotsPerMilimeter = 500;

    constructor(private sharedService: SharedService, private projectService: ProjectCanvasService) {
    }

    getFactorByMillimeter(millimeter: number = 1, object: paper.Item): number {
        const laserSpaceInMillimeter = this.sharedService.settings.usedLaserSpace / this.dotsPerMilimeter;
        const pixelPerMillimeter = this.projectService.canvas.view.bounds.height / laserSpaceInMillimeter;
        const objectSizeInMillimeter = object.bounds.height / pixelPerMillimeter;

        return millimeter / objectSizeInMillimeter;
    }

    getFactorByMillimeterNegative(millimeter: number = 1, object: paper.Item): number {
        const factor = this.getFactorByMillimeter(millimeter, object);
        if (factor < 0 || factor > 1) {
            return 0;
        }
        return factor;
    }

    paperToMillimeter(paperPoints: number): number {
        const spaceInMillimeter = this.sharedService.settings.usedLaserSpace / this.dotsPerMilimeter;
        const paperConstant: number = this.projectService.canvasScaling / spaceInMillimeter;
        return paperPoints / paperConstant;
    }

    millimeterToPaper(millimeter: number): number {
        const pixelPerMillimeter = this.projectService.canvasScaling / (this.sharedService.settings.usedLaserSpace / this.dotsPerMilimeter);
        return pixelPerMillimeter * millimeter;
    }
}
