import { TestBed } from '@angular/core/testing';

import { UnitConversionService } from './unit-conversion.service';
import {MatDialogModule} from '@angular/material/dialog';

describe('UnitConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatDialogModule
    ]
  }));

  it('should be created', () => {
    const service: UnitConversionService = TestBed.get(UnitConversionService);
    expect(service).toBeTruthy();
  });
});
