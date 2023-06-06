import { Component } from '@angular/core';
import { Product } from '../Models/product';
import { ProductService } from '../Services/product.service';
import { Customer } from '../Models/customer';
import { CustomerService } from '../Services/customer.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-view-friend-product-recommendations',
  templateUrl: './view-friend-product-recommendations.component.html',
  styleUrls: ['./view-friend-product-recommendations.component.scss']
})
export class ViewFriendProductRecommendationsComponent {
  allProducts: Product[] = [];
  allProductsIdMap: Map<string, Product> = new Map();
  currentCustomerId: string = "";
  currentCustomer: Customer;

  constructor(
    private productService: ProductService, 
    private customerService: CustomerService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.allProducts = data;
      for(let product of data) {
        this.allProductsIdMap.set(product._id, product);
      }
    })

    let tempCustomerId = localStorage.getItem("customerId");
    if(tempCustomerId) {
      this.currentCustomerId = tempCustomerId;
    }


    this.customerService.getCustomerById(this.currentCustomerId).subscribe(data=> {
      this.currentCustomer = data;
    })

  }


  getProductFromId(productId: string) {
    const product = this.allProductsIdMap.get(productId);
    if(product) {
      return product;
    } else {
      return new Product('', '', '', '', '', [], 0, 0, 0, 0, 0, [], [], []);
    }
  }


  removeRecommendation(productId: string) {
    const pos = this.currentCustomer.friendProductRecommendations.indexOf(productId);
    if(pos!=-1) {
      this.currentCustomer.friendProductRecommendations.splice(pos, 1);
    }
    this.customerService.updateCustomer(this.currentCustomer).subscribe(data => {

    })
  }


  viewProduct(productId: string) {
    this.router.navigate(["/viewProductDetails/" + productId]);
  }

}
