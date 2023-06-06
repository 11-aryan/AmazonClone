import { Component } from '@angular/core';
import { Seller } from '../Models/seller';
import { SellerService } from '../Services/seller.service';

@Component({
  selector: 'app-banner-for-sellers',
  templateUrl: './banner-for-sellers.component.html',
  styleUrls: ['./banner-for-sellers.component.scss']
})
export class BannerForSellersComponent {

  userLoggedIn = false;
  sellerId: string = "";
  currentSeller = new Seller("", "", "", "", "", new Date(), "", "", [], []); 

  constructor(
    private sellerService: SellerService,
  
  ){

    let tempId = localStorage.getItem('sellerId');
    if(tempId!=null) {
      this.userLoggedIn = true;
      this.sellerId = tempId;
    }
  }

  ngOnInit() {
      this.sellerService.getSellerById(this.sellerId).subscribe(data => {
        this.currentSeller = data;
      })
  }

}
