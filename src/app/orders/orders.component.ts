import { Component } from '@angular/core';
import { OrderService } from '../Services/order.service';
import { Order } from '../Models/order';
import { ProductService } from '../Services/product.service';
import { Subscription, pipe } from 'rxjs';
import { Product } from '../Models/product';
import { Review } from '../Models/review';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders:Order[] = [];
  customerId = localStorage.getItem("customerId");
  subscriptions:Subscription[] = [];
  paymentMethodUsed: string = "";

  productMap: Map<string, Product> = new Map();

  constructor(
    private orderService: OrderService, 
    private productService: ProductService, 
    private router: Router
  ) {

  }

  ngOnInit() {
    if(this.customerId == null) {
      alert("Login to view orders");
      return;
    }

    let getOrdersSubs = this.orderService.getOrdersByCustomerId(this.customerId).subscribe(data => {
      this.orders = data;
      console.log("Orders: ", this.orders);

      for(let order of this.orders) {
        this.productService.getProductById(order.productId).subscribe(data => {
          this.productMap.set(data._id, data);
        })
      }
      
    })

    this.subscriptions.push(getOrdersSubs);
  }

  getProductFromCache(productId: string) {
    return this.productMap.get(productId);
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  addProductReview(productId: string) {
    console.log("add product review for : ", productId);
    this.router.navigate(['/addProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  }

  viewReview(productId: string) {
    this.router.navigate(['/viewProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  }

  viewProductDetails(productId: string) {
    this.router.navigate(['viewProductDetails/' + productId]);
  }

  // updateProductReview(productId: string) {
  //   this.router.navigate(['/updateProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  // }
  
  reviewExists(productId: string, customerId: string) {
    let curProduct = this.getProductFromCache(productId);
    if(curProduct) {
      for(let review of curProduct.reviews) {
        if(review.customerId == customerId) {
          return true;
        }
      }
    }
    return false;
  }

  checkDeliveryDate(deliveryDate: Date | undefined) {
    console.log("check date: ", deliveryDate);
    
    if( deliveryDate==null || deliveryDate==undefined) return false;
    let date = deliveryDate.toString();
    if(date=="") return false;
    return true;
  }

}
