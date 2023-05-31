import { Component, ResolvedReflectiveFactory } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../Models/product';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute, Router } from '@angular/router'; 
import { Review } from '../Models/review';
import { ReviewService } from '../Services/review.service';

@Component({
  selector: 'app-add-product-review',
  templateUrl: './add-product-review.component.html',
  styleUrls: ['./add-product-review.component.scss']
})
export class AddProductReviewComponent {

  product: Product = new Product("", "", "", "", "", [], 0, 0, 0, 0, 0, [], []);
  reviewForm: FormGroup;  
  submitted = false;
  customerId = "";
  productId = ""
  newReviewId = "";
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
      });
      
    });
  }

  
  onSubmit() {
    if(this.reviewForm.invalid) {
      alert("Form data invalid");
      return;
    }

    this.submitted = true;
    console.log("Reivew submitted: ", this.reviewForm.value);
    console.log("reviewing product: ", this.product );

    let review = this.getReviewInitializedFromForm();    
    this.reviewService.addReviews(review).subscribe(data => {
      console.log("Adding review: ", data);
    }) 
    this.addReviewToProduct(review);

    this.reviewService.getReviews().subscribe(data => {
      console.log("Reviews: ", data);
    })

    alert("Review added successfully");
    this.router.navigate(['/orders']);
  }


  addReviewToProduct(review: Review) {
    this.product.reviews.push(review);
    console.log("current product: ", this.product);
    console.log("Review Id generated: ", this.newReviewId);
    this.productService.updateProduct(this.product).subscribe(data => {

    });
  }


  getReviewInitializedFromForm() {
    let rating = parseFloat(this.reviewForm.value.rating);
    let headline = this.reviewForm.value.headline;
    let description = this.reviewForm.value.description; 
    let review: Review = new Review("", this.customerId, this.productId, rating, headline, description, 0, []);
    return review;
  }


}
