import { TestBed, async, inject } from '@angular/core/testing';

import { GraphGuard } from './graph.guard';

describe('GraphGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphGuard]
    });
  });

  it('should ...', inject([GraphGuard], (guard: GraphGuard) => {
    expect(guard).toBeTruthy();
  }));
});
