import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { SellerSigninComponent } from './seller-signin/seller-signin.component';
import { BannerForSellersComponent } from './banner-for-sellers/banner-for-sellers.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { ViewProductDetailsComponent } from './view-product-details/view-product-details.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { OrdersComponent } from './orders/orders.component';
import { AddProductReviewComponent } from './add-product-review/add-product-review.component';
import { UpdateReviewComponent } from './update-review/update-review.component';
import { UpdateProductReviewComponent } from './update-product-review/update-product-review.component';
import { ViewProductReviewComponent } from './view-product-review/view-product-review.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { ViewProductsComponent } from './view-products/view-products.component';


@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    HomeComponent,
    SigninComponent,
    SignupComponent,
    SellerSignupComponent,
    SellerSigninComponent,
    BannerForSellersComponent,
    SellerHomeComponent,
    AddProductsComponent,
    SellerDashboardComponent,
    ViewCategoryComponent,
    SearchFilterPipe,
    ViewProductDetailsComponent,
    ViewCartComponent,
    CheckoutComponent,
    AddAddressComponent,
    OrdersComponent,
    AddProductReviewComponent,
    UpdateReviewComponent,
    UpdateProductReviewComponent,
    ViewProductReviewComponent,
    UpdateProductComponent,
    ViewProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
