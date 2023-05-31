import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../Models/user';
import { passwordMatchValidator } from '../Shared/passwordMatchValidator.validator';
import { passwordStrengthValidator } from '../Shared/passwordStrengthValidator.validator';
import { Router } from '@angular/router';
import { Customer } from '../Models/customer';
import { CustomerService } from '../Services/customer.service';
import { CartService } from '../Services/cart.service';
import { Cart } from '../Models/cart';
import { Address } from '../Models/address';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  
  signupForm: FormGroup;
  submitted = false;
  existingCustomers: Customer[] = [];

  constructor(
      private fb: FormBuilder, 
      private customerSerivce: CustomerService,
      private router: Router, 
      private cartService: CartService
    ) {
    this.signupForm = fb.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required],
      email: ['', Validators.required], 
      mobileNumber: ['', Validators.required], 
      password: ['', Validators.required], 
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required], 
    }, 
    {validator: [passwordMatchValidator, passwordStrengthValidator]}
    )
  }

  ngOnInit() {
    this.customerSerivce.getCustomers().subscribe(data => {
      this.existingCustomers = data;
    })
  }

  get f() { return this.signupForm.controls; }

  onSubmit(value: string) {
    this.submitted = true;
    if(this.signupForm.invalid) {
      alert("Form Data Invalid");
      return;
    }

    const customerToBeAdded: Customer = this.getCustomerDataFromForm();
    console.log("userToBeAdded: ", customerToBeAdded);
    
    if(this.existingCustomers!=null) {
      for(let i=0; i<this.existingCustomers.length; i++) {
        if(this.existingCustomers[i].email==customerToBeAdded.email || this.existingCustomers[i].mobileNumber==customerToBeAdded.mobileNumber) {
          alert("Email or mobile number already exists, Login To your account");
          this.router.navigate(['/signin'])
          return;
        }
      }
    }

    this.customerSerivce.addCustomers(customerToBeAdded).subscribe(data => {
      console.log("Added user: ", data);
    })
    
    alert('Signup Successful');
  }


  private getCustomerDataFromForm():Customer {
    const formValue = this.signupForm.value;
    const user = new Customer("", "", "", "", "", new Date(), "", "", [], []);
    
    user._id = "";
    user.firstName = formValue.firstName;
    user.lastName = formValue.lastName;
    user.email = formValue.email;
    user.password = formValue.password;
    user.mobileNumber = formValue.mobileNumber;
    user.dateOfBirth = formValue.dateOfBirth;
    user.role = "customer";
    // user.addresses = [new Address("", "", "", "", "", "", "", "", "")];

    return user;
  }
}
