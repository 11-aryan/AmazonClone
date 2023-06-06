import { Component } from '@angular/core';
import { CustomerService } from '../Services/customer.service';
import { Customer } from '../Models/customer';

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent {
  searchTerm: string = "";
  customerSearchResults: Customer[] = [];
  customerSelected: Customer;
  displaySearchSuggestions: boolean = false;
  hoveringOnSuggestions: boolean = false;
  currentCustomerId: string = "";
  currentCustomer: Customer;
  allCustomers: Customer[] = [];
  allCustomerIdMap: Map<string, Customer> = new Map();

  constructor(
    private customerService: CustomerService,
  ) {

  }

  ngOnInit() {
    let tempCustomerId = localStorage.getItem("customerId");
    if(tempCustomerId!=null) {
      this.currentCustomerId  = tempCustomerId;
      this.customerService.getCustomerById(this.currentCustomerId).subscribe(data => {
        this.currentCustomer = data;
      })
    } else {
      console.log("No customer id found in localstorage");
    }

    this.customerService.getCustomers().subscribe(data => {
      this.allCustomers = data;
      for(let customer of this.allCustomers) {
        this.allCustomerIdMap.set(customer._id, customer);
      }
    })
  }

  searchUsers(searchString: string) {    
    this.customerService.getCustomerByEmail(searchString).subscribe(data => {      
      this.customerSearchResults = data;
    })
  }


  sendFriendRequest() {
    if(this.customerSelected.friendRequests.indexOf(this.currentCustomerId)==-1) {
      this.customerSelected.friendRequests.push(this.currentCustomerId);
    } 
    this.customerService.updateCustomer(this.customerSelected).subscribe(data => {

    })
    alert("Friend Request sent!");
  }


  acceptFriendRequest(friendRequestId: string) {
    this.currentCustomer.friends.push(friendRequestId);

    const requestPos = this.currentCustomer.friendRequests.indexOf(friendRequestId);
    this.currentCustomer.friendRequests.splice(requestPos, 1);
    this.customerService.updateCustomer(this.currentCustomer).subscribe(data => {

    });
  }

  rejectFriendRequest(friendRequestId: string) {
    const requestPos = this.currentCustomer.friendRequests.indexOf(friendRequestId);
    this.currentCustomer.friendRequests.splice(requestPos, 1);
    this.customerService.updateCustomer(this.currentCustomer).subscribe(data => {

    });
  }

  removeFriend(friendId: string) {
    const friendIdPos = this.currentCustomer.friends.indexOf(friendId);
    if(friendIdPos!=-1) {
    this.currentCustomer.friends.splice(friendIdPos, 1);
    this.customerService.updateCustomer(this.currentCustomer).subscribe(data => {

    });
    }
  }


  onCustomerSelect(customerId: string) {
    this.customerService.getCustomerById(customerId).subscribe(data => {
      this.customerSelected = data;
      console.log("Customer selected: ", data);
      
    })
  }

  onSearchBoxBlur() {
    this.displaySearchSuggestions = false;
  }

  onSearchBoxFocus() {
    this.displaySearchSuggestions = true;
  }



}
