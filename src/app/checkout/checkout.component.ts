import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../Services/cart.service';
import { OrderService } from '../Services/order.service';
import { Cart } from '../Models/cart';
import { Customer } from '../Models/customer';
import { CustomerService } from '../Services/customer.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Address } from '../Models/address';
import { Payment } from '../Models/payment';
import { Order } from '../Models/order';
import { ProductService } from '../Services/product.service';
import { Product } from '../Models/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  cart: Cart = new Cart("", []);
  customer: Customer = new Customer("", "", "", "", "", new Date(), "", "", [], []);
  addresses: Address[] = [];
  addressSelected: Address = new Address("", "", "", "", "", "", "", "", "");
  paymentMethodSelected: string = "";
  subscriptions:Subscription[] = [];
  
  paymentForm:FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private cartService: CartService, 
    private orderService: OrderService, 
    private customerService: CustomerService, 
    private productService: ProductService,
    private router: Router, 
    private fb: FormBuilder
    
  ) {
    this.paymentForm = fb.group({
      cardNumber: ['', Validators.required], 
      nameOnCard: ['', Validators.required],
      cardExpiryMonth: ['', Validators.required], 
      cardExpiryYear: ['', Validators.required], 
      upiId: ['', Validators.required],
    });
  }

  ngOnInit() {
    let activatedRouteSubs = this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log("params received: ", params);
      console.log("type: ", typeof params);
      
      var cartId = params.get('ids');

      if(cartId==null) {
        reportError("Invalid cartId recieved");
        return;
      }

      this.cartService.getCartById(cartId).subscribe(data => {
        this.cart = data;
        console.log("Cart: ", this.cart);
      });


      this.customerService.getCustomerById(cartId).subscribe(data => {
        this.customer = data; 
        this.addresses = this.customer.addresses;
        console.log("addresses: ", data);
        
      });
      
    });

    this.subscriptions.push(activatedRouteSubs);
  }


  addAddress() {
    const customerId = this.customer._id;
    this.router.navigate(['/addAddress'], { queryParams: { customerId: customerId } });
  }


  onAddressSelect(address: Address) {
    this.addressSelected = address;
    console.log("address selected: ", address);
    
  }

  getMonths() {
    let days = [];
    for(let i=1; i<=12; i++) {
      days.push(i.toString());
    }
    return days;
  }

  getYears() {
    let years = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    for(let i=currentYear; i<=currentYear+50; i++) {
      years.push(i.toString());
    } 
    return years;
  }

  onSelectPayment(paymentMethod: string) {
    this.paymentMethodSelected = paymentMethod;
    console.log("payment method: ", paymentMethod);
  }


  onSubmitPaymentForm() {
    if(!this.isAddressValid(this.addressSelected)) {
      alert("Please Select Valid Address");
      return;
    }


    console.log("payment: ", this.paymentForm.value);
    console.log("Cart items: ", this.cart);

    for(let cartItem of this.cart.cartItems) {
      let productId = cartItem.productId;
      if(!cartItem.selectedForBuying) continue; 

      let getProductSubs = this.productService.getProductById(productId).subscribe(data => {
        this.createNewOrder(data);
      })

      this.subscriptions.push(getProductSubs);
      
    }

    
    alert("Order placed successfully");

  }


  createNewOrder(newProduct: Product) {

    let paymentDetails: Payment = new Payment("", this.paymentMethodSelected, 0, "", "", "", "", "");
    let newOrder:Order = new Order("", "", "", new Date(), undefined, "", this.addressSelected, paymentDetails, 0); 

    newOrder.customerId = this.cart._id;
    newOrder.productId = newProduct._id;
    newOrder.status = "order_placed";
    newOrder.totalAmount = newProduct.sellingPrice;
    
    if(this.paymentMethodSelected=="cardPayment") {
      paymentDetails.cardNumber = this.paymentForm.value.cardNumber;
      paymentDetails.nameOnCard = this.paymentForm.value.nameOnCard;
      paymentDetails.cardExpiryDate = this.paymentForm.value.cardExpiryMonth + "/" + this.paymentForm.value.cardExpiryYear
      
    } else if(this.paymentMethodSelected=="upiPayment") {
      paymentDetails.upiId = this.paymentForm.value.upiId;
    }
    
    let addOrderSubs = this.orderService.addOrder(newOrder).subscribe(data => {
      
    });

    this.subscriptions.push(addOrderSubs);
    
    console.log("Adding order: ", newOrder);
  }


  isAddressValid(address: Address) {
    if( address.line1=="" && 
        address.mobileNumber=="" && 
        address.country=="" && 
        address.pincode=="" && 
        address.state=="" && 
        address.city==""
      ) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}



