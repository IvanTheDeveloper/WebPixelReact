import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedGameComponent } from './published-game.component';

describe('PublishedGameComponent', () => {
  let component: PublishedGameComponent;
  let fixture: ComponentFixture<PublishedGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishedGameComponent]
    });
    fixture = TestBed.createComponent(PublishedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
