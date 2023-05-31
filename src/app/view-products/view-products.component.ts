import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../Models/product';
import { ProductService } from '../Services/product.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent {

  productCategories:string[] = [];
  products: Product[] = []
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDay = new Date().getDay().toString();
  currentMonth = this.monthNames[(new Date().getMonth() + 1)];
  categoryReceived: string = "";

  sortTypeSelected: number = 0;

  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  isLoading: boolean = false;
  isAllFetched: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute, 
    private productService: ProductService,
    private router: Router, 
    private elementRef: ElementRef, 
    private httpClient: HttpClient
  
    ) {

  }

  ngOnInit(){
    this.activatedRoute.queryParamMap.subscribe((params) => {
      let category = params.get("productCategory"); 
      let sortVal = params.get("sortVal");

      console.log("Sort Value params: ", sortVal);
      
      
      if(category) {
        this.productCategories.push(category); 
        this.categoryReceived = category;
      } else {
        console.log("Invalid product category! Please retry"); 
      }

      if(sortVal) {
        this.sortTypeSelected =  parseInt(sortVal);
      } else {
        console.log("invalid sort value received");
      }

    })

    this.getPaginatedProducts();
    // this.productService.getProducts().subscribe(data => {
    //   console.log("Products: ", data);
    //   this.products = data;
    // })

    console.log("Categories: ", this.productCategories);
  }

  

  @HostListener('window:scroll', ['$event'])
  onScroll() {

    console.log("sort type: ", this.sortTypeSelected);
    

    const element = document.documentElement;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      console.log("Scorlled");
      this.getPaginatedProducts();
    }
  }


  getPaginatedProducts() {
    if (this.isLoading || this.isAllFetched) {
      if(this.isAllFetched) {
        console.log("All products fetched");
      }
      return;
    }

    this.isLoading = true;

    console.log("Sorting ###: ", this.sortTypeSelected);
    

    this.productService.getPaginatedProducts(this.pageNumber, this.pageSize, this.productCategories, this.sortTypeSelected).subscribe(
        (response) => {
          const { data, totalCount } = response;
          this.products = this.products.concat(data);
          this.totalCount = totalCount;

          console.log("Received data from PageNo: ", this.pageNumber, " ", data);
          
          if (data.length < this.pageSize) {
            this.isAllFetched = true;
          } else {
            this.pageNumber++;
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error retrieving products:', error);
          this.isLoading = false;
        }
      );
  }


  setSortType(event: any) {
    let sortVal = event.target.value;
    console.log("Sorting: ", sortVal);
    this.router.navigate(['viewProducts'], {queryParams: {productCategory: this.categoryReceived, sortVal: sortVal.toString()}});
    // window.location.reload();
  }


  viewProductDetails(productId: string) {
    this.router.navigate(['viewProductDetails/' + productId])
  }


  getStars(count: number) {
    let stars = [];
    for(let i=0; i<count; i++) {
      stars.push(i+1);
    }
    if(stars.length==0) {
      for(let i=0; i<3; i++) {
        stars.push(i+1);
      }
      // for(let i=0; i<this.randomIntFromInterval(2, 5); i++) {
      //   stars.push(i+1);
      // }
    }
    return stars;
  }

  getDiscount(sp: number, cp: number) {
    let discount = Math.ceil((cp - sp)/sp * 100); 
    return discount;
  }


  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

}
