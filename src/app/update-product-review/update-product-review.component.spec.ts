import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductReviewComponent } from './update-product-review.component';

describe('UpdateProductReviewComponent', () => {
  let component: UpdateProductReviewComponent;
  let fixture: ComponentFixture<UpdateProductReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
