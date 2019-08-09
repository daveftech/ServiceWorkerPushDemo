import { TestBed } from '@angular/core/testing';

import { NotificationMiddlewareService } from './notification-middleware.service';

describe('NotificationMiddlewareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationMiddlewareService = TestBed.get(NotificationMiddlewareService);
    expect(service).toBeTruthy();
  });
});
