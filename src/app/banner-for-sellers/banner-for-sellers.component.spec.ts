import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerForSellersComponent } from './banner-for-sellers.component';

describe('BannerForSellersComponent', () => {
  let component: BannerForSellersComponent;
  let fixture: ComponentFixture<BannerForSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerForSellersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerForSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
