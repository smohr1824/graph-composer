import { TestBed } from '@angular/core/testing';

import { AspectService } from './aspect.service';

describe('AspectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AspectService = TestBed.get(AspectService);
    expect(service).toBeTruthy();
  });
});
