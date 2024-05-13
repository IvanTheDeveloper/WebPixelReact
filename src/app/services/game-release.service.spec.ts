import { TestBed } from '@angular/core/testing';

import { GameReleaseService } from './game-release.service';

describe('GameReleaseService', () => {
  let service: GameReleaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameReleaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
