import { Injectable, NgZone } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Color, Group, Layer, Path, Point, Shape, Size, CompoundPath } from 'paper';
import { SharedService } from 'src/app/services/shared.service';
import { EditTextDialogComponent } from '../dialogs/editText.dialog';
import {  OutlineSettings } from '../types/laserSettings';
import { ToastService } from './toast.service';
import * as hash from 'object-hash';
import * as paper from 'paper';
import { ProjectState } from '../types/project';
import { environment } from 'src/environments/environment';
import { textChangeRangeIsUnchanged } from 'typescript';
import { stat } from 'fs';
import { SaveProjectDialogComponent } from '../dialogs/save-project.dialog';

@Injectable({
  providedIn: 'root',
})
export class ProjectCanvasService {
  itemFocus: paper.Item;
  canvas: paper.Project;
  // Pixels of the Home Canvas Element on the use device
  canvasScaling: number;
  projectName: string;
  rotation;

  readonly itemMinSize = 25;
  dirty = false;

  private readonly stateStack: ProjectState[] = [];
  private stateStackIndex = -1;

  constructor(
    private sharedService: SharedService,
    private toastService: ToastService,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {}

  get focusItemOutlineSettings(): OutlineSettings {
    if (!this.itemFocus) {
      return {} as OutlineSettings;
    }
    return this.itemFocus.data.outlineSettings;
  }

  deselectAll() {
    this.canvas.deselectAll();
    this.itemFocus = undefined;
  }

  importSvg(svg: string, type: string = 'image'): paper.Group {
    const importedElement = this.canvas.importSVG(svg, { expandShapes: true, insert: false });
    let group: paper.Group;
    if (importedElement instanceof Group) {
      group = importedElement;
    } else {
      group = new Group(importedElement);
    }
    group.getItems({ class: Shape }).forEach((i) => i.remove());
    group.data['type'] = type;
    group.insertChild(0, this.createSelectionHelper(group.bounds));
    return this.importGroup(group);
  }

  /**
   * Creates an invisible, but clickable rectangle with the given size that is marked as selection helper.
   * @param bounds The size of the resulting rectangle
   */
  createSelectionHelper(bounds: paper.Rectangle): paper.Path.Rectangle {
    const rect = new Path.Rectangle(bounds);
    rect.fillColor = new Color('rgba(255, 255, 255, 0.001)');
    rect.strokeWidth = 1;
    rect.strokeColor = new Color('rgba(0, 0, 0, 0.3)');
    rect.data['selectionHelper'] = true;
    return rect;
  }

  importText(svg: string): paper.Group {
    const group: paper.Group = new Group(this.canvas.importSVG(svg, { expandShapes: true, insert: false }));
    const bounds = group.bounds;
    const rectangle = new Shape.Rectangle(new Point(bounds.x, bounds.y), new Size(bounds.width, bounds.height));
    group.insertChild(0, rectangle);
    group.data['type'] = 'text';
    group.data['description'] = 'Text';
    this.addMouseEventHandlers(group);
    this.toastService.createToast('addedText');
    return group;
  }

  importGroup(group: paper.Group): paper.Group {
    this.addMouseEventHandlers(group);
    this.addItem(group);
    return group;
  }

  private addItem(item: paper.Item) {
    const minDimension = Math.min(item.bounds.width, item.bounds.height);
    if (minDimension < this.itemMinSize && item.data.type !== 'line') {
      const scale = this.itemMinSize / minDimension;
      item.scale(scale);
    }
    this.canvas.activeLayer.addChild(item);
  }

  selectedTopLevelItems(): paper.Item[] {
    if (this.canvas) {
      return this.canvas.activeLayer.children.filter((i) => i.selected);
    } else {
      return [];
    }
  }

  openEditTextDialog(item, content?: string): void {
    item.lastChild['content'] = content;
    item.data.description = content;
    this.updateTextSelectionHelper(item);
    // this.ngZone.run(() => {
    //   const dialogRef = this.dialog.open(EditTextDialogComponent, {
    //     width: '250px',
    //     data: { text: item.lastChild['content'] },
    //     disableClose: false,
    //   });

    //   dialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       if (result.text !== '') {
    //         item.lastChild['content'] = result.text;
    //         item.data.description = result.text;
    //         this.updateTextSelectionHelper(item);
    //       } else {
    //         this.openEditTextDialog(item);
    //       }
    //     }
    //  });
    //});
  }

  /**
   * Updates the selection helpers bounds of the given text group.
   */
  updateTextSelectionHelper(item: paper.Item) {
    // The only item that is truly rotated is the text
    const rotation = item.lastChild.rotation;
    item.rotate(-rotation);
    item.firstChild.bounds = item.lastChild.bounds;
    item.rotate(rotation);
  }

  addMouseEventHandlers(item: paper.Item) {
    item.onDoubleClick = (event: paper.MouseEvent) => {
      const target = event.currentTarget;
      // if (target.data.type === 'text' && !target.data.isAutomaticLaserCounter) {
      //   this.openEditTextDialog(item);
      // }
      event.stopPropagation();
    };

    item.onClick = (event: paper.MouseEvent) => {
      const target = event.currentTarget;
      if (target.data.isDragged) {
        delete target.data.isDragged;
        return false;
      }

      if (event.modifiers.shift && target.selected) {
        target.selected = false;
      } else {
        this.selectItem(target, event.modifiers.shift);
      }
    };

    item.onMouseDrag = (event: paper.MouseEvent) => {
      const target = event.target;
      if (!target.selected) {
        // Run in angular context, so that the UI controls are updated correctly
        this.ngZone.run(() => this.selectItem(event.target));
      }
      for (const selectedItem of this.selectedTopLevelItems()) {
        selectedItem.position.x += event.delta.x;
        selectedItem.position.y += event.delta.y;
      }
      event.stopPropagation();

      target.data.center = target.bounds.center;

      target.data['isDragged'] = true;
    };
  }

  selectItem(item: paper.Item, additive: boolean = false) {
    if (!additive) {
      this.canvas.deselectAll();
    }
    while (item.parent && !(item.parent instanceof Layer)) {
      item = item.parent;
    }
    item.selected = true;
    this.itemFocus = item;
    this.rotation = item.data.prevRotation;
    if (this.selectedTopLevelItems().length > 1) {
      this.rotation = 0;
    }
  }

  setFocus(group: paper.Group) {
    this.itemFocus = group;
    this.itemFocus.selected = true;
  }

  groupSelectedItems() {
    const selectedItems = this.selectedTopLevelItems();
    if (selectedItems.length <= 1) {
      return;
    }

    const group = new Group([...selectedItems]);
    for (const child of group.children) {
      if (child.data.type === 'group') {
        const groupIndicator = child.children.find((c) => c.data.groupIndicator);
        groupIndicator.remove();
      }
    }
    group.insertChild(0, this.createGroupIndicator(group.bounds));

    group.data.type = 'group';
    group.data.description = 'Group';

    for (const child of group.children) {
      child.selected = true;
    }
    this.addMouseEventHandlers(group);
    this.itemFocus = group;
  }

  ungroupSelectedItems() {
    const selectedGroups = this.selectedTopLevelItems().filter((i) => i.data.type === 'group');
    for (const group of selectedGroups) {
      const children = group.removeChildren().filter((i) => !i.data.groupIndicator);
      group.remove();
      for (const child of children) {
        this.canvas.activeLayer.addChild(child);
        if (child.data.type === 'group') {
          child.insertChild(0, this.createGroupIndicator(child.bounds));
        }
      }
    }
    this.deselectAll();
  }

  private createGroupIndicator(bounds: paper.Rectangle): paper.Path.Rectangle {
    const groupIndicator = this.createSelectionHelper(bounds);
    groupIndicator.style.dashArray = [10, 5];
    groupIndicator.data['groupIndicator'] = true;
    return groupIndicator;
  }

  triangleCentroid(triangle) {
    const s = triangle.segments;
    const vertex = s[0].point;
    const opposite = s[1].point.subtract(s[1].point.subtract(s[2].point).divide(2));
    const c = vertex.add(opposite.subtract(s[0].point).multiply(2).divide(3));
    return c;
  }

  rotateSelectedItems(value: CustomEvent<{ value: number }> | MatSelectChange | number) {
    console.log(typeof value);
    if (!this.noItemsSelected() && !this.multiSelect()) {
      for (const item of this.selectedTopLevelItems()) {
        const prevRotation = item.data.prevRotation || 0;
        let degree = 0;
        if (typeof value === 'number') {
          degree = value;
          item.data.prevRotation = value + prevRotation;
        } else {
          let eventValue = value instanceof MatSelectChange ? value.value : value.detail.value;
          if (eventValue === undefined || Number.isNaN(eventValue)) {
            // This can happen if the rotation input field is cleared
            eventValue = 0;
          }
          degree = eventValue - prevRotation;
          item.data.prevRotation = eventValue;
        }
        item.data.prevRotation = item.data.prevRotation % 360;
        if (item.data.type === 'group') {
          for (const child of item.children) {
            child.data.prevRotation = (child.data.prevRotation + degree) % 360;
          }
        }

        // Performing actual rotation by steps of (-)1 degree to prevent jumping triangles
        const step = Math.sign(degree);
        for (let i = 0; i < Math.abs(degree); i++) {
          if (item.data.type === 'triangle') {
            item.rotate(step, this.triangleCentroid(item.children[0]));
          } else {
            item.rotate(step);
          }
        }
      }

      this.rotation = this.itemFocus.data.prevRotation;
    }
  }

  scaleSelectedItems(direction: string, horizontalScale: number, verticalScale?: number, center?: paper.Point) {
    verticalScale = verticalScale || horizontalScale;
    for (const item of this.selectedTopLevelItems()) {
      if (item.data.type === 'text') {
        const text = item.lastChild as paper.PointText;
        if (direction === 'up' || direction === 'down') {
          let fontSize = Number((text.fontSize as string).slice(0, -2));
          fontSize += direction === 'up' ? horizontalScale : -horizontalScale;
          text.fontSize = fontSize + 'px';
          item.firstChild.bounds = text.bounds;
        } else if (direction === 'flip') {
          item.scale(horizontalScale, verticalScale);
        } else {
          throw new Error(`Unknown scale direction '${direction}'`);
        }
      } else {
        item.scale(horizontalScale, verticalScale, center);
      }
    }
  }

  copySelectedItems() {
    for (const item of this.selectedTopLevelItems()) {
      const copyItem = item.clone();
      this.addMouseEventHandlers(copyItem);
      this.addItem(copyItem);
    }
    this.canvas.deselectAll();
   // this.toastService.createToast(this.translateService.instant('copyMessage'));
  }

  translateSelectedItems(deltaX: number, deltaY: number) {
    for (const item of this.selectedTopLevelItems()) {
      item.translate(new Point(deltaX, deltaY));
    }
  }

  alignSelectedItems(axis: 'X' | 'Y') {
    const selectedItems = this.selectedTopLevelItems();

    let newPosition: number;
    if (selectedItems.length >= 2) {
      newPosition = selectedItems.map((c) => c.bounds['center' + axis]).reduce((m, p) => (m += p / selectedItems.length), 0);
    } else {
      newPosition = this.canvas.view.bounds['center' + axis];
    }
    for (const child of selectedItems) {
      child.position[axis.toLowerCase()] = newPosition;
      child.data.center = newPosition;
    }
  }

  clearCanvas() {
    this.canvas.activeLayer.remove();
    this.canvas.addLayer(new Layer()).activate();
    this.itemFocus = undefined;
  }

  clearName() {
    this.projectName = '';
  }

  activeLayer(): paper.Layer | undefined {
    if (this.canvas) {
      return this.canvas.activeLayer;
    }
    return undefined;
  }

  isProjectEmpty(): boolean {
    return this.canvas.activeLayer.children.length !== 0;
  }

  removeSelectedItems() {
    for (const element of this.selectedTopLevelItems()) {
      element.remove();
    }
    this.itemFocus = undefined;
  }

  multiSelect(): boolean {
    return this.selectedTopLevelItems().length > 1;
  }

  noItemsSelected(): boolean {
    return this.canvas ? this.canvas.selectedItems.length === 0 : true;
  }

  canvasIntizialised() {
    return this.canvas;
  }

  canvasCenter() {
    return this.canvas.view.center;
  }

  canvasBounds() {
    return this.canvas.view.bounds;
  }

  noLayer(): boolean {
    return this.canvas && !this.canvas.activeLayer;
  }

  oneLayer(): boolean {
    return this.canvas && this.canvas.activeLayer ? true : false;
  }

  totalTopLevelItems(): number {
    return this.canvas.activeLayer.children.length;
  }

  topLevelItems() {
    return this.canvas.activeLayer.children;
  }

  onlyOneTopLevelSelected(): boolean {
    return this.selectedTopLevelItems().length === 1;
  }

}
