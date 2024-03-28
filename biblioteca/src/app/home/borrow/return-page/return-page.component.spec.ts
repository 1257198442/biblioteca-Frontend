import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPageComponent } from './return-page.component';

describe('ReturnPageComponent', () => {
  let component: ReturnPageComponent;
  let fixture: ComponentFixture<ReturnPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnPageComponent]
    });
    fixture = TestBed.createComponent(ReturnPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
