import { TestBed } from '@angular/core/testing';

import { GeometricsService } from './geometrics.service';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialogModule} from '@angular/material/dialog';

describe('GeometricsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatDialogModule,
      TranslateModule.forRoot()
    ]
  }));

  it('should be created', () => {
    const service: GeometricsService = TestBed.get(GeometricsService);
    expect(service).toBeTruthy();
  });
});
