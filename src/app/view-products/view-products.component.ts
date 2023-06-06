import { Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router, defaultUrlMatcher } from '@angular/router';
import { Product } from '../Models/product';
import { ProductService } from '../Services/product.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { CategoryService} from '../Services/category.service';
import { Category } from '../Models/category';
import { pairwise } from 'rxjs';
import { SellerService } from '../Services/seller.service';
import { Seller } from '../Models/seller';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent {

  productCategories:string[] = [];
  products: Product[] = [];
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  currentDay = new Date().getDay().toString();
  currentMonth = this.monthNames[(new Date().getMonth() + 1)];
  categoryDetails: Category; 
  productPropertiesMap: { [key: string]: any[] };
  productProperties: string[] = [];
  propertyValuesToFilter: string[] = [];

  defaultCategoryDetails: Category = new Category("", "Default", [], [], ["0-500", "500-1000", "1000-5000", "5000-9000", "9000-inf"], [], {});

  categoryReceived: string = "";
  sellerIdMap: Map<string, Seller> = new Map();

  sortTypeSelected: number = 0;
  minPriceSelected: number = 0;
  maxPriceSelected: number = 1e8;

  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  isLoading: boolean = false;
  isAllFetched: boolean = false;
  noProductsFound: boolean = false;


  constructor(
    private activatedRoute: ActivatedRoute, 
    private productService: ProductService,
    private router: Router, 
    private elementRef: ElementRef, 
    private httpClient: HttpClient, 
    private categoryService: CategoryService,
    private sellerService: SellerService,
    ) {

  }


  ngOnInit(){
    this.initializeParamValues();
    this.getPaginatedProducts();
    this.initializeSellerInformation();
    this.initializeDefaultCategoryValues();
    console.log("Categories: ", this.productCategories);
  }

  

  @HostListener('window:scroll', ['$event'])
  onScroll() {    
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
    
    this.initializeCategoryInformation();

    this.isLoading = true;
    
    this.productService.getPaginatedProducts(
      this.pageNumber, 
      this.pageSize, 
      this.productCategories, 
      this.sortTypeSelected, 
      this.minPriceSelected, 
      this.maxPriceSelected, 
      this.propertyValuesToFilter,
    ).subscribe(
        (response) => {
          const { data, totalCount } = response;
          this.products = this.products.concat(data);
          this.totalCount = totalCount;          

          console.log("Received data from PageNo: ", this.pageNumber, " ", data);

          if(data==null) {
            this.noProductsFound = true; 
            this.pageNumber = 1;
            return;
          }
          
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
    this.sortTypeSelected = parseInt(sortVal);
    console.log("Sorting: ", sortVal);
    
    // this.resetProductsAndPageValues();
    // this.getPaginatedProducts();

    this.router.navigate(['viewProducts'], {queryParams: {productCategory: this.categoryReceived, sortVal: sortVal.toString()}});
  }


  getProductsByPriceRange(minPriceStr: string, maxPriceStr: string) {
    let minPrice = parseInt(minPriceStr);
    let maxPrice = parseInt(maxPriceStr); 

    this.minPriceSelected = minPrice;
    this.maxPriceSelected = maxPrice;

    this.resetProductsAndPageValues();
    this.getPaginatedProducts();
  }

  getProductsByPriceRangeString(priceRange: string) {
    let splitRanges = priceRange.split('-');
    let minPriceString = splitRanges[0];
    let maxPriceString = splitRanges[1];

    if(maxPriceString=="inf") {
      maxPriceString = "100000000";
    }
    console.log("Split Price Range: ", minPriceString, " ", maxPriceString);
    
    this.getProductsByPriceRange(minPriceString, maxPriceString)
  }


  getCustomPriceRangeFilteredProducts() {
    this.getProductsByPriceRange(this.minPriceSelected.toString(), this.maxPriceSelected.toString());
  }


  viewProductDetails(productId: string) {
    this.router.navigate(['viewProductDetails/' + productId])
  }


  initializeCategoryInformation() {
    this.categoryService.getCategoriesByCategoryName(this.categoryReceived).subscribe(data => {
      console.log("Category data: ", data);

      if(data) {
        this.categoryDetails = data[0];
        this.productPropertiesMap = this.categoryDetails.properties;
        this.productProperties = [];
        for(const key in this.productPropertiesMap) {
            this.productProperties.push(key);
        }
      } else {
        this.categoryDetails = this.defaultCategoryDetails;
      }      

    });
  }


  initializeSellerInformation() {
    this.sellerService.getSellers().subscribe(data => {
      for(let seller of data) {
        this.sellerIdMap.set(seller._id, seller);
      }
    });
  }



  initializeParamValues() {
    this.activatedRoute.queryParamMap.subscribe((params) => {       
      
      let category = params.get("productCategory"); 
      let sortVal = params.get("sortVal");
      let minPrice = params.get("minPrice");
      let maxPrice = params.get("maxPrice");      
      
      if(category) {
        if(this.productCategories.indexOf(category, 0)==-1) { 
          this.productCategories = [];
          this.productCategories.push(category); 
        }
        this.categoryReceived = category;
      } else {
        console.log("Invalid product category! Please retry"); 
      }

      if(sortVal) {
        this.sortTypeSelected =  parseInt(sortVal);
      } else {
        console.log("invalid sort value received");
      }

      if(minPrice) {
        this.minPriceSelected = parseInt(minPrice);
      } else {
        console.log("Invalid minPrice value recieved");
      }

      if(maxPrice) {
        this.maxPriceSelected = parseInt(maxPrice);
      } else {
        console.log("Invalid maxPrice value recieved");
      }

      this.resetProductsAndPageValues();
      this.getPaginatedProducts();

    });
  }


  initializeDefaultCategoryValues() {
    this.defaultCategoryDetails.brands = [
      "Apple", 
      "Samsung", 
      "Cadbury", 
      "LG", 
      "MTR", 
      "Adidas", 
      "Nike", 
      "Puma", 
      "Titan", 
    ]
  }


  toggleProductPropertyFilter(evt: any) {
    let property: string = evt.target.value; 
    property = property.toLowerCase().trim();
    
    const index = this.propertyValuesToFilter.indexOf(property, 0);
    if (index > -1) {
      this.propertyValuesToFilter.splice(index, 1);
    } else {
      this.propertyValuesToFilter.push(property);
    }

    console.log("Filter chnaged: ", this.propertyValuesToFilter);

    this.resetProductsAndPageValues();
    this.getPaginatedProducts();
  }


  resetProductsAndPageValues() {
    this.products = [];
    this.noProductsFound = false;
    this.pageNumber = 1; 
    this.isAllFetched = false;
    this.isLoading = false;
  }


  // toggleproductPropertyFilter(evt: any) {
  //   let property: string = evt.target.value; 
    
  //   const index = this.productCategories.indexOf(property, 0);
  //   if (index > -1) {
  //     this.productCategories.splice(index, 1);
  //   } else {
  //     this.productCategories.push(property);
  //   }

  //   console.log("Additional Property checked: ", this.productCategories);

  //   this.router.navigate(['viewProducts'], {
  //     queryParams: {
  //       productCategory: this.productCategories, 
  //       sortVal: this.sortTypeSelected.toString(), 
  //       minPrice: this.minPriceSelected, 
  //       maxPrice: this.maxPriceSelected,
  //     }
  //   });
  // }


  getStars(count: number) {
    let stars = [];
    for(let i=0; i<count; i++) {
      stars.push(i+1);
    }
    if(stars.length==0) {
      for(let i=0; i<3; i++) {
        stars.push(i+1);
      }
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
