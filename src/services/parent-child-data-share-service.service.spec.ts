import { TestBed } from '@angular/core/testing';

import { ParentChildDataShareServiceService } from './parent-child-data-share-service.service';

describe('ParentChildDataShareServiceService', () => {
  let service: ParentChildDataShareServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentChildDataShareServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
