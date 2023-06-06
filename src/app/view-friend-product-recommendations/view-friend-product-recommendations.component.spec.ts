import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFriendProductRecommendationsComponent } from './view-friend-product-recommendations.component';

describe('ViewFriendProductRecommendationsComponent', () => {
  let component: ViewFriendProductRecommendationsComponent;
  let fixture: ComponentFixture<ViewFriendProductRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFriendProductRecommendationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFriendProductRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
