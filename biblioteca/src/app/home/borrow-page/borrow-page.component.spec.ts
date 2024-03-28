import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowPageComponent } from './borrow-page.component';

describe('BorrowPageComponent', () => {
  let component: BorrowPageComponent;
  let fixture: ComponentFixture<BorrowPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BorrowPageComponent]
    });
    fixture = TestBed.createComponent(BorrowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
