import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductReviewComponent } from './view-product-review.component';

describe('ViewProductReviewComponent', () => {
  let component: ViewProductReviewComponent;
  let fixture: ComponentFixture<ViewProductReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProductReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
