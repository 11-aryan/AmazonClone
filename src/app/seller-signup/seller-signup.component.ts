import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../Services/seller.service';
import { Seller } from '../Models/seller';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-signup',
  templateUrl: './seller-signup.component.html',
  styleUrls: ['./seller-signup.component.scss']
})
export class SellerSignupComponent {
  signupForm: FormGroup;
  submitted = false; 
  existingSellers: Seller[] = []

  constructor(private fb: FormBuilder, private sellerService: SellerService, private router: Router) {
    this.signupForm = fb.group({
      firstName: ['', Validators.required], 
      lastName: ['', Validators.required], 
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required], 
      password: ['', Validators.required], 
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required], 
    })
  }

  ngOnInit() {
    this.sellerService.getSellers().subscribe(data => {
      this.existingSellers = data;
    })
  }

  get f() { return this.signupForm.controls; }

  onSubmit(value: string) {
    this.submitted = true;
    if(this.signupForm.invalid) {
      alert("Form Data Invalid");
      return;
    }

    const sellerToBeAdded: Seller = this.getSellerDataFromForm();
    console.log("SellerToBeAdded: ", sellerToBeAdded);

    for(let i=0; i<this.existingSellers.length; i++) {
      if(this.existingSellers[i].email==sellerToBeAdded.email || this.existingSellers[i].mobileNumber==sellerToBeAdded.mobileNumber) {
        alert("Email or mobile number already exists, Login To your account");
        this.router.navigate(['/signin'])
        return;
      }
    }

    // if(!this.isSellerAgeValid(sellerToBeAdded)) {
    //   alert("You must be atleast 18 years of age, to sign up as a seller");
    //   return;
    // }

    this.sellerService.addSeller(sellerToBeAdded).subscribe(data => {
      console.log("Added seller: ", data);
    })

    console.log("Adding seller: ", sellerToBeAdded);
    alert('Signup Successful');
  }


  private getSellerDataFromForm():Seller {
    const formValue = this.signupForm.value;
    const seller = new Seller("", "", "", "", "", new Date(), "", "", [], []);
    
    seller._id = "";
    seller.firstName = formValue.firstName;
    seller.lastName = formValue.lastName;
    seller.email = formValue.email;
    seller.password = formValue.password;
    seller.mobileNumber = formValue.mobileNumber;
    seller.role = "seller";
    seller.dateOfBirth = formValue.dateOfBirth;

    return seller;
  }


  private isSellerAgeValid(sellerToBeAdded: Seller): Boolean {
    const curDate = new Date();
    const dob = new Date(sellerToBeAdded.dateOfBirth);
    const age = curDate.getFullYear() - dob.getFullYear(); 
    if(age<18) {
      return false;
    }
    return true;
  }

}
