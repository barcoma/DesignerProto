import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScalingService {

  constructor() { }

  rescaleCanvas(canvas: paper.Project, presentScaling: number) {
    const scalingPreviousCanvas: number = Number(canvas.activeLayer.data.scaling);
    const factor: number = presentScaling / scalingPreviousCanvas ;
    const groups: paper.Item[] = canvas.activeLayer.children;
    groups.forEach(group => {
      group.bounds.x = group.bounds.x * factor;
      group.bounds.y = group.bounds.y * factor;
      group.bounds.height = group.bounds.height * factor;
      group.bounds.width = group.bounds.width * factor;
    });
  }
}
