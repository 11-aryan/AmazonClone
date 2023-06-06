import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from '../Models/address';
import { Customer } from '../Models/customer';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../Services/customer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  addressForm: FormGroup; 
  submitted = false;
  customer: Customer = new Customer("", "", "", "", "", new Date(), "", "", [], [], [], [], []);
  subscriptions: Subscription[] = [];

  constructor(
      private formBuilder: FormBuilder, 
      private activatedRoute: ActivatedRoute,
      private customerService: CustomerService
  ) {

    this.addressForm = formBuilder.group({
      country: ['', Validators.required], 
      fullName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      pincode: ['', Validators.required],
      line1: ['', Validators.required],
      line2: ['', Validators.required],
      landmark: ['', Validators.required], 
      city: ['', Validators.required], 
      state: ['', Validators.required], 
    })
  }


  ngOnInit() {
     let activatedRouteSubs = this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log("params received: ", params);
      console.log("type: ", typeof params);
      
      var customerId = params.get('customerId');
      if(customerId==null) {
        Error("Invalid customer Id received");
        return;
      }

      console.log("Geting customer: ", customerId);
      

      let customerUpdateSubs = this.customerService.getCustomerById(customerId).subscribe(data => {
        console.log(data);
        this.customer = data;
      })

      this.subscriptions.push(customerUpdateSubs);

    });

    this.subscriptions.push(activatedRouteSubs);
  }


  get f() { return this.addressForm.controls; }


  onSubmit(value: string) {
    if(this.addressForm.invalid) {
      alert("Invalid form data");
      return;
    }

    const addressToBeAdded:Address = this.getAddressDataFromForm();
    
    if(this.customer.addresses==null) {
      this.customer.addresses = [addressToBeAdded];
    } else {
      this.customer.addresses.push(addressToBeAdded);
    }

    let customerUpdateSubs = this.customerService.updateCustomer(this.customer).subscribe(data => {
      console.log("Updating customer address: ", data);
    })

    this.subscriptions.push(customerUpdateSubs);

    alert("Address Added Successfully");
  }

  
  getAddressDataFromForm():Address {
    const formValue = this.addressForm.value;
    let address = new Address("", "", "", "", "", "", "", "", "");
    
    address.country = formValue.country;
    address.fullName = formValue.fullName;
    address.mobileNumber = formValue.mobileNumber;
    address.pincode = formValue.pincode;
    address.line1 = formValue.line1;
    address.line2 = formValue.line2;
    address.landmark = formValue.landmark;
    address.city = formValue.city;
    address.state = formValue.state;

    console.log("Address: ", address)

    return address;
  }


  ngOnDestroy() {
    this.unsubscribeAll();
  }

  unsubscribeAll() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


}
