import { Component } from '@angular/core';
import { Product } from '../Models/product';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../Services/product.service';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { Cart } from '../Models/cart';
import { CartService } from '../Services/cart.service';
import { CustomerService } from '../Services/customer.service';
import { Customer } from '../Models/customer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent {
  filteredProducts: Product[] = [];
  allProducts: Product[] = []; 
  searchTerm = '';
  validSearchTerm = true
  numProductsInCart = 0;
  userLoggedIn = false;
  userId = localStorage.getItem("customerId");
  currentCustomer: Customer = new Customer("", "", "", "", "", new Date(), "", "", [], [], [], [], []);
  cart: Cart = new Cart("", []);
  subscriptions:Subscription[] = [];

  constructor(
      private productService: ProductService, 
      private router: Router,
      private cartService: CartService, 
      private customerService: CustomerService
    ) {
    if(localStorage.getItem('customerId')!=null) {
      this.userLoggedIn = true;
    }
  }

  ngOnInit() {
    if(this.userId!=null) {
      this.userLoggedIn = true; 
      
      let getCartSubs = this.cartService.getCartById(this.userId).subscribe(data => {
        this.cart = data; 
        this.numProductsInCart = this.cart.cartItems.length;
      })

      this.subscriptions.push(getCartSubs);

      let getCustomerSubs = this.customerService.getCustomerById(this.userId).subscribe(data => {
        this.currentCustomer = data;
        console.log("Id: ", this.userId);
        console.log("user: ", this.currentCustomer);
        
      })

      this.subscriptions.push(getCustomerSubs);

    }

    // let getProductsSubs = this.productService.getProducts().subscribe(data => {
    //   this.allProducts = data; 
    //   console.log("All products: ", data);
    // })
    // this.subscriptions.push(getProductsSubs);
  }

  search(searchText: string): void {
    if(searchText=='') {
      this.filteredProducts = [];
      return;
    }

    // this.filteredProducts = this.allProducts.filter((val) =>
    //   val.productName.toLowerCase().includes(value)
    // );

    this.productService.getProductsByProductName(searchText).subscribe(data => {
      this.filteredProducts = data;
      console.log("filtered products: ", this.filteredProducts);
    })

  }


  viewProductDetails(pid: string) {
    console.log("Product id: ", pid);
    this.router.navigate(['viewProductDetails/' + pid]);
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  viewProducts(category: string) {
    this.router.navigate(['viewProducts'], {
      queryParams: {
        productCategory: category, 
        sortVal: "1", 
        minPrice: "0", 
        maxPrice: "100000000"
      }
    })
  }

  logout() {
    localStorage.removeItem("customerId");
    window.location.reload();
  }

}


 