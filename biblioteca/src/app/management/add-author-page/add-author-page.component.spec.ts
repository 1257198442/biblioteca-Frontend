import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAuthorPageComponent } from './add-author-page.component';

describe('AddAuthorPageComponent', () => {
  let component: AddAuthorPageComponent;
  let fixture: ComponentFixture<AddAuthorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAuthorPageComponent]
    });
    fixture = TestBed.createComponent(AddAuthorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
