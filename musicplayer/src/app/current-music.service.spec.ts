import { TestBed } from '@angular/core/testing';

import { CurrentMusicService } from './current-music.service';

describe('CurrentMusicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentMusicService = TestBed.get(CurrentMusicService);
    expect(service).toBeTruthy();
  });
});
