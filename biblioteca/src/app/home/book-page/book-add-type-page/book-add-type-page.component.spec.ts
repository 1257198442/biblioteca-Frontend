import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddTypePageComponent } from './book-add-type-page.component';

describe('BookAddTypePageComponent', () => {
  let component: BookAddTypePageComponent;
  let fixture: ComponentFixture<BookAddTypePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookAddTypePageComponent]
    });
    fixture = TestBed.createComponent(BookAddTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
