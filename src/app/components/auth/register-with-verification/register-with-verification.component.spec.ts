import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWithVerificationComponent } from './register-with-verification.component';

describe('RegisterWithVerificationComponent', () => {
  let component: RegisterWithVerificationComponent;
  let fixture: ComponentFixture<RegisterWithVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterWithVerificationComponent]
    });
    fixture = TestBed.createComponent(RegisterWithVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
