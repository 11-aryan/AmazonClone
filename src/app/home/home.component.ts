import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {


  constructor(
    private router: Router
  ) {

  }


  viewProducts(category: string) {
    this.router.navigate(['viewProducts'], {
      queryParams: {
        productCategory: category, 
        sortVal: "1", 
        minPrice: "0", 
        maxPrice: "100000000"
      }
    })
  }
}
