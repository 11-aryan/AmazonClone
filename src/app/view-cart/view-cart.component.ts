import { Component } from '@angular/core';
import { Cart } from '../Models/cart';
import { CartService } from '../Services/cart.service';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from '../Models/cartItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.scss']
})
export class ViewCartComponent {
  userId = localStorage.getItem("customerId");
  numProductsInCart = 0;
  userLoggedIn = false; 
  cart: Cart = new Cart("", []);
  updatedCart: Cart = new Cart("", []);
  productsInCart:Product[] = []
  allProducts:Product[] = [];
  cartItems: CartItem[] = [];
  productForm: FormGroup;
  productsSelectedForBuying: Product[] = []
  subTotal = 0;

  idInCart: Map<string, boolean> = new Map();
  productSelected: Map<string, boolean> = new Map(); 
  productPrice: Map<string, number> = new Map();
  


  constructor(
      private cartService: CartService,
      private productService: ProductService, 
      private formBuilder: FormBuilder, 
      private router: Router
    ) {
      this.productForm = this.formBuilder.group({
        quantity: ['1', Validators.required]
      })      
  }



  ngOnInit() {
    if(this.userId!=null) {
      this.userLoggedIn = true;

      this.cartService.getCartById(this.userId).subscribe(data => {
        this.cart = data;
        
        this.numProductsInCart = this.cart.cartItems.length;
        this.cartItems = this.cart.cartItems;
        for(let cartItem of this.cart.cartItems) {
          this.idInCart.set(cartItem.productId.toString(), true); 
          
          if(cartItem.selectedForBuying) {
            this.productSelected.set(cartItem.productId.toString(), true);
          }

          if(cartItem.quantityInCart==0) {
            cartItem.quantityInCart = 1;
          }
        }       
        
        this.productService.getProducts().subscribe(data => {
          this.allProducts = data; 
          this.initProductsInCart();
        });
        
      });
    }
  }
  

  initProductsInCart() {    
    for(let product of this.allProducts) {
      if(this.idInCart.get(product._id)==true) {
        this.productsInCart.push(product);
      }
      if(this.productSelected.get(product._id)==true) {
        this.productsSelectedForBuying.push(product);
        this.subTotal += product.sellingPrice 
        this.productPrice.set(product._id, product.sellingPrice);
      }
    }
    console.log("Products in Cart: ", this.productsInCart);
    console.log("products to Buy: ", this.productsSelectedForBuying);
    
  }



  updateQuantity(cartItem: CartItem) {
    for(let it of this.cartItems) {
      if(it.productId == cartItem.productId) {
        it.quantityInCart = cartItem.quantityInCart;
      }
    }
    this.cartService.updateCart(this.cart).subscribe(data => {})
  }



  updateSelectedForBuying(cartItem: CartItem) {
    console.log("cartiem: ", cartItem);
    
    for(let it of this.cartItems) {
      if(it.productId == cartItem.productId) {
        it.selectedForBuying = cartItem.selectedForBuying; 
        
        let price = this.productPrice.get(cartItem.productId); 
        if(price) {
          if(cartItem.selectedForBuying) {
            this.subTotal += price;
          } else {
            this.subTotal -= price;
          }
        }
      }
    }
    this.cartService.updateCart(this.cart).subscribe(data => {});
    // window.location.reload();
  }



  removeFromCart(cartItem: CartItem) {
    console.log("removing item: ", cartItem);
    
    let cartItems = Object.assign([], this.cart.cartItems); 
    let pos = cartItems.indexOf(cartItem);

    console.log("CartItems: ", this.cart.cartItems);
    console.log("copy of CartItems: ", cartItems);
    console.log("Pos: ", pos);
    
  
    let removed = cartItems.splice(pos, 1);

    console.log("Removed item: ", this.productSelected[removed[0]]);
    console.log("CartItems after splice:", cartItems);
    
    this.updatedCart._id = cartItem.customerId;
    this.updatedCart.cartItems = cartItems;
    
    // this.cartService.updateCart(this.updatedCart).subscribe(data => {

    // })

    // window.location.reload()
  }


  checkout() {
    const cartId = this.cart._id;
    this.router.navigate(['/checkout'], { queryParams: { ids: cartId } });
  }

  
}
