import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent {
  products:Product[] = []
  sellerId = "";

  constructor(
    private productsService: ProductService,
    private router: Router,
  
  ) {

    

  }


  ngOnInit() {
    let sellerId = localStorage.getItem("sellerId");
    if(sellerId!=null) {
      this.sellerId = sellerId;
    } else {
      alert("Login to continue");
      return;
    }

    this.productsService.getProductsBySellerId(sellerId).subscribe(data => {
      console.log("Seller products: ", data); 
      this.products = data;
    })

  }


  updateProductDetails(productId: string) {
    this.router.navigate(['updateProduct'], {queryParams:{productId: productId}});
  }

  
  deleteProduct(productId: string) {
    this.productsService.deleteProduct(productId).subscribe(data => {
      console.log("Deleting product: ", data);
    })
    window.location.reload();
  }

}
