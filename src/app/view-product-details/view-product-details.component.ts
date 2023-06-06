import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../Models/product';
import { Cart } from '../Models/cart';
import { CartService } from '../Services/cart.service';
import { CartItem } from '../Models/cartItem';
import { Review } from '../Models/review';
import { ReviewService } from '../Services/review.service';
import { SellerService } from '../Services/seller.service';
import { Seller } from '../Models/seller';
import { CustomerService } from '../Services/customer.service';
import { Customer } from '../Models/customer';

@Component({
  selector: 'app-view-product-details',
  templateUrl: './view-product-details.component.html',
  styleUrls: ['./view-product-details.component.scss']
})
export class ViewProductDetailsComponent {
  productIdObtained = '';
  product: Product = new Product("", "", "", "", "", [], 0, 0, 0, 1, 0, [], [], []);
  seller: Seller = new Seller("", "", "", "", "", new Date(), "", "", [], []);
  productReviews: Review[] = [];
  cart: Cart = new Cart("", []); 
  quantitySelected: string = "1";
  selectedProductImage = "";
  discount: number = 0; 
  emailSearchTerm: string = "";
  displaySearchSuggestions: boolean = true;
  friendSearchResults: Customer[] = [];
  currentCustomerId: string = "";
  currentCustomer: Customer;
  userId = localStorage.getItem("customerId");
  hoveringOnSuggestions: boolean = false;
  friendSelected: Customer;

  constructor(
      private productService: ProductService, 
      private activatedRoute: ActivatedRoute, 
      private cartService: CartService, 
      private reviewService: ReviewService, 
      private serllerSerivce: SellerService, 
      private customerService: CustomerService,
    ) {

    this.activatedRoute.params.subscribe(prms => {
      this.productIdObtained = prms['id'];
      this.initializeProductValues();
      if(this.userId!=null) {
        this.cartService.getCartById(this.userId).subscribe(data => {
          this.cart = data;
          console.log("Current cart: ", this.cart);
          
        });
      }
    });

  }


  ngOnInit() {
    const tempCustomerId = localStorage.getItem("customerId");
    if(tempCustomerId) {
      this.currentCustomerId = tempCustomerId;
    } else {
      console.log("customerId not found in localstorage");
    }

    this.customerService.getCustomerById(this.currentCustomerId).subscribe(data => {
      this.currentCustomer = data;
    })
  }



  initializeProductValues() {
    this.productService.getProductById(this.productIdObtained).subscribe(data => {
      this.product = data; 
      this.selectedProductImage = this.product.productImages[0];
      this.discount = (this.product.maxRetailPrice - this.product.sellingPrice)/this.product.maxRetailPrice * 100;
      this.discount = Math.ceil(this.discount);
      console.log("product: ", this.product);

      this.reviewService.getReviewsByProductId(this.product._id).subscribe(data => {
        console.log("Reviews by product id: ", data);
        this.productReviews = data;
      })

      this.serllerSerivce.getSellerById(this.product.sellerId).subscribe(data => {
        this.seller = data;
        console.log("Seller received: ", this.seller);
        
      })
    });
  }


  addProductToCart(pid: string) {
    console.log("Quantity selected: ", this.quantitySelected);

    if(this.userId==null) {
      alert("Sign in to access your cart");
      return;
    }

    var cartItems: CartItem[] = this.cart.cartItems;


    var productExists = false;

    if(cartItems != null) {      
      for(let i=0; i<cartItems.length; i++) {
        if(cartItems[i].productId == this.product._id) {
          console.log("found product in cart");
          productExists = true;
          this.cart.cartItems[i].quantityInCart = parseInt(this.quantitySelected);
          console.log("Updated existing items: ", this.cart.cartItems[i]);
          break;
        }
      }
    }

    if(!productExists) {
      const newCartItem = new CartItem(this.product._id, this.cart._id, 0, true);
      newCartItem.quantityInCart = parseInt(this.quantitySelected);
      console.log("Adding new items to cart: ", newCartItem);
      this.cart.cartItems.push(newCartItem);
    } 
    
    console.log("Cart after adding item: ", this.cart);

    this.cartService.updateCart(this.cart).subscribe(data => {
      console.log("Updating cart: ", this.cart);
    })

    window.location.reload();
  }


  changeSelectedImage(selectedImageStr: string) {
    this.selectedProductImage = selectedImageStr;
  }

  mouseEnter(selectedImageStr: string) {
    console.log("Mouse entered: ", selectedImageStr);
    
  }


  getStars(rating: number) {
    let stars = []; 
    for(let i=0; i<rating; i++) {
      stars.push(i);
    }
    return stars;
  }

  getProductQuantityArray(product: Product) {
    let arrQuantity = [];
    for(let i=1; i<=product.quantity; i++) {
      arrQuantity.push(i);
    }
    return arrQuantity;
  }

  searchUsers(searchString: string) {    
    this.customerService.getCustomerByEmail(searchString).subscribe(data => {      
      this.friendSearchResults = data;
    })
  }

  onSearchBoxBlur() {
    this.displaySearchSuggestions = false;
  }

  onSearchBoxFocus() {
    this.displaySearchSuggestions = true;
  }

  isFriend(customerId: string) {
    if(this.currentCustomer.friends.indexOf(customerId)==-1) {
      return false;
    }
    return true;
  }


  recommendProductToFriend(friendId: string) {
    this.customerService.getCustomerById(friendId).subscribe(data => {
        this.friendSelected = data;
        
        if(this.friendSelected.friendProductRecommendations.indexOf(this.product._id)==-1) {
          this.friendSelected.friendProductRecommendations.push(this.product._id);
        }
    
        this.customerService.updateCustomer(this.friendSelected).subscribe(data => {
          console.log("Updated friend: ", this.friendSelected);
        });
    });

    alert("Recommendation sent!")
  }

}
