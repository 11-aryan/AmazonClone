import { Component, ResolvedReflectiveFactory } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../Models/product';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Review } from '../Models/review';
import { ReviewService } from '../Services/review.service';


@Component({
  selector: 'app-view-product-review',
  templateUrl: './view-product-review.component.html',
  styleUrls: ['./view-product-review.component.scss']
})
export class ViewProductReviewComponent {

  productId: string = "";
  customerId: string = "";
  product: Product = new Product("", "", "", "", "", [], 0, 0, 0, 0, 0, [], [], []);
  reviewExists = false;
  review: Review = new Review("", "", "", 0, "", "", 0, []);
  numberOfStars = 0;


  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute, 
    private reviewService: ReviewService,
    private router: Router,

  ) {
    
  }


  ngOnInit() {
    let activatedRouteSubs = this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log("params received: ", params);
      console.log("type: ", typeof params);
      
      let productId = params.get('productId');
      let customerId = params.get('customerId'); 

      if(productId==null) {
        alert("Invalid productId");
        return;
      }

      if(customerId!=null) {
        this.customerId = customerId;
      }

      this.productId = productId;
      
      this.productService.getProductById(productId).subscribe(data => {
        this.product = data;

        // for(let review of this.product.reviews) {
        //   if(review.customerId == this.customerId) {
        //     this.review = review;
        //     this.reviewExists = true;
        //     this.numberOfStars = Math.ceil(review.rating);
        //     // this.router.navigate(['updateProductReview'], { queryParams: { productId: productId, customerId: this.customerId } });
        //   }
        // }
      });

      console.log("ProductId: ", this.productId);
      console.log("CustomerId: ", this.customerId);
      
      
      this.reviewService.getReviewByProductAndCustomerId(this.productId, this.customerId).subscribe(data => {
        console.log("review by product and customer id: ", data);;
        this.review = data;
        this.numberOfStars = Math.ceil(this.review.rating);
        if(data) {
          this.reviewExists = true;
        }
      })
      
    });
  }


  addProductReview(productId: string) {
    console.log("add product review for : ", productId);
    this.router.navigate(['/addProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  }


  viewReview(productId: string) {
    this.router.navigate(['/viewProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  }


  updateProductReview(productId: string) {
    this.router.navigate(['/updateProductReview'], { queryParams: { productId: productId, customerId: this.customerId } })
  }


  deleteProductReview(reviewId: string) {
    this.reviewService.deleteReview(reviewId).subscribe(data => {
      console.log("Deleting review: ", data);
    }) 
    window.location.reload();
  }

  getStarsArray(count: number) {
    let arr = [];
    for(let i=0; i<count; i++) {
      arr.push(1);
    }
    return arr;
  }

}
