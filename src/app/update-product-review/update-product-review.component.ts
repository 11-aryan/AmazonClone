import { Component } from '@angular/core';
import { Product } from '../Models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../Services/review.service';
import { Review } from '../Models/review';

@Component({
  selector: 'app-update-product-review',
  templateUrl: './update-product-review.component.html',
  styleUrls: ['./update-product-review.component.scss']
})
export class UpdateProductReviewComponent {

  product: Product = new Product("", "", "", "", "", [], 0, 0, 0, 0, 0, [], []);
  reviewForm: FormGroup;  
  submitted = false;
  customerId = "";
  productId = ""
  reviewId = "";
  customeReivewExists = false;
  
  constructor(
    private formBuilder: FormBuilder, 
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute, 
    private reviewService: ReviewService,
    private router: Router,

  ) {
    this.reviewForm = formBuilder.group({
      rating: ['', Validators.required], 
      headline: ['', Validators.required],
      description: ['', Validators.required],
      // reviewImages: ['', Validators.required]
    })
  }


  get f() { return this.reviewForm.controls; }

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
        //     this.customeReivewExists = true;            
        //     this.reviewForm.get("headline")?.setValue(review.headline);
        //     this.reviewForm.get("description")?.setValue(review.description);
        //     break;
        //   }
        // }

        this.reviewService.getReviewByProductAndCustomerId(this.productId, this.customerId).subscribe(data => {
          if(data) {
            this.customeReivewExists = true;
            this.reviewId = data._id;
            this.reviewForm.get("headline")?.setValue(data.headline);
            this.reviewForm.get("description")?.setValue(data.description);
          }
        })


      });
      
    });
  }

  
  onSubmit() {
    console.log("Form errors: ", this.reviewForm.errors);
    
    if(this.reviewForm.invalid) {
      alert("Form data invalid2");
      return;
    }

    this.submitted = true;

    let review = this.getReviewInitializedFromForm();    
    console.log("Update received: ", review);
    
    this.reviewService.updateReview(review).subscribe(data => {
      console.log("Updating review: ", data);
    }) 

    alert("Reivew updated successfully");
    // this.router.navigate(['/orders'])
  }


  getReviewInitializedFromForm() {
    let rating = parseFloat(this.reviewForm.value.rating);
    let headline = this.reviewForm.value.headline;
    let description = this.reviewForm.value.description; 
    let review: Review = new Review(this.reviewId, this.customerId, this.productId, rating, headline, description, 0, []);
    return review;
  }

}
