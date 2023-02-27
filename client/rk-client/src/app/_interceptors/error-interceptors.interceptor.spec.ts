import { TestBed } from '@angular/core/testing';

import { ErrorInterceptorsInterceptor } from './error-interceptors.interceptor';

describe('ErrorInterceptorsInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorInterceptorsInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorInterceptorsInterceptor = TestBed.inject(ErrorInterceptorsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
