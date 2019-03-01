import { TestBed } from '@angular/core/testing';

import { MusicAuthService } from './music-auth.service';

describe('MusicAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MusicAuthService = TestBed.get(MusicAuthService);
    expect(service).toBeTruthy();
  });
});
