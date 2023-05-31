
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { UsersService } from '../Services/users.service';
import { Customer } from '../Models/customer';
import { CustomerService } from '../Services/customer.service';
import { CartService } from '../Services/cart.service';
import { Cart } from '../Models/cart';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  signInForm: FormGroup;
  submitted = false
  existingCarts: Cart[] = [];
  arrCustomers: Customer[] = [];

  constructor(
      fb: FormBuilder, 
      private customerService: CustomerService, 
      private router: Router, 
      private userService: UsersService,
      private cartService: CartService
    ) {

    // this.usersService.getUsers()
    this.signInForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    
  }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.arrCustomers = data
      console.log("arr customers: ", data);
    })

    this.cartService.getCarts().subscribe(data => {
      this.existingCarts = data;
      console.log("Exising carts: ", data);
      
    })
  }

  get f() { return this.signInForm.controls; }

  onSubmit() {
    this.submitted = true
    if (this.signInForm.invalid) {
      return;
    }

    var email = this.signInForm.value.email;
    var password = this.signInForm.value.password;
    var signinFailed = true

    console.log("Signin data: ", this.signInForm.value);
    
    this.arrCustomers.forEach(element => {
      console.log(element);
      
      if (element.email == email && element.password == password) {
        signinFailed = false;
        localStorage.setItem("role", element.role)
        localStorage.setItem("customerId", element._id.toString())
        localStorage.setItem("userId", element._id.toString())
        alert("Loggged in successfully")

        if(this.checkIfCartExists(element._id)==false) {
          console.log("Adding a new cart: ");
          this.addNewCart(element._id);
        }
        
        this.router.navigate(['/'])
      }
    })

    if (signinFailed) {
      this.router.navigate(['/signin'])
      alert("Login attempt failed, invalid password")
    } 
  }


  checkIfCartExists(cartId: string) {
    if(this.existingCarts==null) {
      return false;
    }
    for(let i=0; i<this.existingCarts.length; i++) {
      if(this.existingCarts[i]._id.toString() == cartId) {
        return true;
      }
    }
    return false;
  }

  addNewCart(cartId: string) {
    const newCart = new Cart(cartId, []);
    this.cartService.addCarts(newCart).subscribe(data => {
      console.log("Added new cart: ", newCart);
    })
  }


}
