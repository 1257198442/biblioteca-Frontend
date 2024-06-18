import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddAuthorPageComponent } from './book-add-author-page.component';

describe('BookAddAuthorPageComponent', () => {
  let component: BookAddAuthorPageComponent;
  let fixture: ComponentFixture<BookAddAuthorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookAddAuthorPageComponent]
    });
    fixture = TestBed.createComponent(BookAddAuthorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
