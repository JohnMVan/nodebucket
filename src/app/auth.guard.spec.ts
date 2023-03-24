//Title:  auth.guard.spec.ts
//Original Author: Richard Krasso
//Appended by:  John Vanhessche
//Date 22 March 2023
//Description:  TypeScript file for the auth guard component.

import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
