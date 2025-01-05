import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { billEditResolver } from './bill-edit.resolver';
import { Bill } from '../../entities/Bill';

describe('billEditResolver', () => {
  const executeResolver: ResolveFn<Bill> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => billEditResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
