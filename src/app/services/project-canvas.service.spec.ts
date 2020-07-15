import { TestBed } from '@angular/core/testing';

import { ProjectCanvasService } from './project-canvas.service';
import {HttpClientModule} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';

describe('ProjectCanvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatDialogModule,
      HttpClientModule,
    ]
  }));

  it('should be created', () => {
    const service: ProjectCanvasService = TestBed.get(ProjectCanvasService);
    expect(service).toBeTruthy();
  });
});
