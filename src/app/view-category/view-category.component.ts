import { Component } from '@angular/core';
import { ProductService } from '../Services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent {


  constructor(private productService: ProductService, private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(prms => {
      console.log("Category received: ", prms['category']);
      
    })
  }
}
