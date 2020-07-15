import { Injectable } from '@angular/core';
import { Color, Group, Path, Point, Size } from 'paper';
import { ProjectCanvasService } from './project-canvas.service';

@Injectable({
  providedIn: 'root',
})
export class GeometricsService {
  readonly black = '#000000';
  readonly white = '#FFFFFF';

  constructor(private project: ProjectCanvasService) {}

  rectangle(width: number, height: number, posX: number, posY: number) {
    const rectangle = new Path.Rectangle(new Point(posX, posY), new Size(width, height));
    rectangle.strokeColor = new Color(this.black);
    const rectangleLayer = new Group([this.createSelectionHelper(rectangle), rectangle]);
    rectangleLayer.data['description'] = 'Rectangle';
    rectangleLayer.data['type'] = 'rect';
    rectangleLayer.data['width'] = width;
    rectangleLayer.data['height'] = height;
    rectangleLayer.data['locked_ratio'] = false;
    rectangleLayer.data['center'] = rectangleLayer.bounds.center;
    // gives the ration of the rectangle. Format is always 1:ratio
    rectangleLayer.data['ratio'] = 1;
    this.project.importGroup(rectangleLayer);
    this.project.selectItem(rectangleLayer);
  }

  circle(cx: number, cy: number, r: number) {
    const circle = new Path.Circle(new Point(cx, cy), r);
    circle.strokeColor = new Color(this.black);
    const circleLayer = new Group([this.createSelectionHelper(circle), circle]);
    circleLayer.data['description'] = 'Circle';
    circleLayer.data['type'] = 'circle';
    circleLayer.data['radius'] = r;
    circleLayer.data['center'] = circleLayer.bounds.center;
    this.project.importGroup(circleLayer);
    this.project.selectItem(circleLayer);
  }

  triangle(posX: number, posY: number) {
    const triangle = new Path.RegularPolygon(new Point(posX, posY), 3, 50);
    triangle.strokeColor = new Color(this.black);
    const triangleLayer = new Group([this.createSelectionHelper(triangle), triangle]);
    triangleLayer.data['description'] = 'Triangle';
    triangleLayer.data['type'] = 'triangle';
    triangleLayer.data['radius'] = 50;
    triangleLayer.data['center'] = triangleLayer.bounds.center;
    this.project.importGroup(triangleLayer);
    this.project.selectItem(triangleLayer);
  }

  line(from: number, to: number) {
    const line = new Path.Line(new Point(from, from), new Point(to, to));
    line.strokeColor = new Color(this.black);
    const lineLayer = new Group([this.createSelectionHelperLine(line), line]);
    lineLayer.rotate(-45);
    lineLayer.data.description = 'Line';
    lineLayer.data.type = 'line';
    lineLayer.data['size'] = to - from;
    lineLayer.data['center'] = lineLayer.bounds.center;
    this.project.importGroup(lineLayer);
    this.project.selectItem(lineLayer);
  }

  rectangleRatio($event: CustomEvent) {
    if ($event.target['value'] !== undefined && $event.target['value'] !== '' && $event.target['value'] !== 0) {
      const changeRate = Number($event.target['value']) / this.project.itemFocus.data.ratio;
      this.project.itemFocus.scale(1, changeRate);
      this.project.itemFocus.data.ratio = Number($event.target['value']);
    }
  }

  private createSelectionHelper(path: paper.Path): paper.Item {
    const selectionHelper = path.clone();
    selectionHelper.strokeColor = null;
    selectionHelper.strokeWidth = 0;
    selectionHelper.fillColor = new Color('rgba(255, 255, 255, 0.001)');
    selectionHelper.data['selectionHelper'] = true;
    return selectionHelper;
  }

  private createSelectionHelperLine(path: paper.Path): paper.Item {
    const selectionHelper = path.clone();
    selectionHelper.strokeWidth = 18;
    selectionHelper.strokeColor = new Color('rgba(255, 255, 255, 0.001)');
    selectionHelper.fillColor = new Color('rgba(255, 255, 255, 0.001)');
    selectionHelper.data['selectionHelper'] = true;
    return selectionHelper;
  }
}
