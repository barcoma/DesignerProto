import { TestBed } from '@angular/core/testing';

import { ScalingService } from './scaling.service';

describe('ScalingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScalingService = TestBed.get(ScalingService);
    expect(service).toBeTruthy();
  });
});
