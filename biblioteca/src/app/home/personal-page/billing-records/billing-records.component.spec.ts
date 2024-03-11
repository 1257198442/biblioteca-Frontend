import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingRecordsComponent } from './billing-records.component';

describe('BillingRecordsComponent', () => {
  let component: BillingRecordsComponent;
  let fixture: ComponentFixture<BillingRecordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillingRecordsComponent]
    });
    fixture = TestBed.createComponent(BillingRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
