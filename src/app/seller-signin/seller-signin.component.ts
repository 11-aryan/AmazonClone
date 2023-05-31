import { Component } from '@angular/core';
import { Seller } from '../Models/seller';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../Services/seller.service';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seller-signin',
  templateUrl: './seller-signin.component.html',
  styleUrls: ['./seller-signin.component.scss']
})
export class SellerSigninComponent {
  signInForm: FormGroup; 
  submitted = false;
  subscriptions:Subscription[] = [];

  arrSellers: Seller[] = []

  constructor(fb: FormBuilder, private sellerService: SellerService, private router: Router) {
    this.signInForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let getSellersSubs = this.sellerService.getSellers().subscribe(data => {
      this.arrSellers = data;
      console.log("arr sellers: ", data);
    })

    this.subscriptions.push(getSellersSubs);
  }

  get f() { return this.signInForm.controls; }

  onSubmit() {
    this.submitted = true
    if (this.signInForm.invalid) {
      return;
    }

    var email = this.signInForm.value.email;
    var password = this.signInForm.value.password;
    var flag = false

    console.log("Signin data: ", this.signInForm.value);
    
    this.arrSellers.forEach(element => {
      if (element.email == email && element.password == password) {
        flag = true;
        localStorage.setItem("role", element.role)
        alert("Loggged in successfully")
        localStorage.setItem('sellerId', element._id);

        this.router.navigate(['/sellerHome'])
      }
    })

    if (flag == false) {
      this.router.navigate(['/sellerSignin'])
      alert("Login attempt failed, invalid password")
    } 
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
