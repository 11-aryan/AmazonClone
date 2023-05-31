import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { SellerSignupComponent } from './seller-signup/seller-signup.component';
import { SellerSigninComponent } from './seller-signin/seller-signin.component';
import { SellerHomeComponent } from './seller-home/seller-home.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
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

const routes: Routes = [
  {path:"", component:HomeComponent}, 
  {path:"signup", component:SignupComponent},
  {path:"signin", component:SigninComponent},
  {path:"sellerSignup", component:SellerSignupComponent},
  {path:"sellerSignin", component:SellerSigninComponent},
  {path:"sellerHome", component:SellerHomeComponent}, 
  {path:"addProducts", component:AddProductsComponent}, 
  {path:"sellerDashboard", component: SellerDashboardComponent},
  {path:"viewCategory/:category", component:ViewCategoryComponent}, 
  {path:"viewProductDetails/:id", component:ViewProductDetailsComponent},
  {path:"viewCart", component:ViewCartComponent},
  {path:"checkout", component:CheckoutComponent},
  {path:"addAddress", component:AddAddressComponent}, 
  {path:"orders", component:OrdersComponent}, 
  {path:"addProductReview", component:AddProductReviewComponent}, 
  {path:"updateProductReview", component:UpdateProductReviewComponent}, 
  {path:"viewProductReview", component:ViewProductReviewComponent},
  {path:"updateProduct", component:UpdateProductComponent},
  {path:"viewProducts", component:ViewProductsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
